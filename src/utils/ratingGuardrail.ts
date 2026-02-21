/**
 * ratingGuardrail.ts
 * ──────────────────
 * Scoring utility that detects potentially malicious or habitually-low raters
 * and downweights their ratings so they don't adversely affect provider scores.
 *
 * HOW IT WORKS
 * ─────────────
 * 1. For each rater we track their personal history: all ratings they have
 *    submitted across all providers.
 * 2. We compare their personal mean to the POPULATION mean (all raters).
 * 3. If a user's average is more than `THRESHOLD_SIGMA` standard deviations
 *    below the population mean AND they have submitted more than
 *    `MIN_RATINGS_TO_EVALUATE` ratings, they are flagged as a low-outlier.
 * 4. Flagged users have their ratings multiplied by a weight < 1.0 (floor:
 *    MIN_WEIGHT = 0.2) when computing provider displayed scores.
 * 5. The weight is derived from a scaled normal CDF so it degrades smoothly
 *    rather than a hard cutoff, making the system harder to game.
 *
 * PRIVACY & FAIRNESS NOTES
 * ─────────────────────────
 * - Users are never notified that their weight has been adjusted.
 * - The system cannot be triggered by a single bad rating; only consistent
 *   long-term patterns lead to flagging.
 * - A user whose rating history improves over time will naturally drift back
 *   toward full weight as their personal mean rises.
 * - This runs server-side only. The client receives final weighted scores.
 *
 * USAGE (server-side pseudocode)
 * ──────────────────────────────
 *   const raterProfile = getRaterProfile(userId);          // DB query
 *   const popStats     = getPopulationStats();             // cached aggregate
 *   const weight       = computeRaterWeight(raterProfile, popStats);
 *   const weightedScore = rawRating * weight;
 *   // Aggregate weighted scores for provider:
 *   providerScore = Σ(weightedScore) / Σ(weight)
 */

// ─── Configuration ─────────────────────────────────────────────────────────────

/** Minimum number of ratings a user must have submitted before any downweighting
 *  is applied. Protects new users and casual reviewers from early penalisation. */
export const MIN_RATINGS_TO_EVALUATE = 10;

/** How many standard deviations below the population mean a user's average
 *  must be before they are considered a low-outlier. 1.5σ ≈ bottom 7%.  */
export const THRESHOLD_SIGMA = 1.5;

/** The minimum weight a rater can ever receive. Even the most extreme outlier
 *  contributes a little (20%), so their feedback is not fully discarded. */
export const MIN_WEIGHT = 0.2;

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface RaterProfile {
  userId: string;
  ratings: number[];       // all ratings this user has ever submitted (1–5)
  personalMean: number;    // mean of `ratings` (cached for performance)
  ratingCount: number;     // = ratings.length
}

export interface PopulationStats {
  mean: number;            // population mean across all submitted ratings
  stdDev: number;          // population standard deviation
  totalRatingCount: number;
}

export interface GuardrailResult {
  weight: number;          // 0.2 – 1.0 to multiply this user's ratings by
  isFlagged: boolean;      // true if the user is an identified low-outlier
  zScore: number | null;   // how many σ below the mean (null if too few ratings)
  reason: string;          // human-readable explanation for audit logs
}

// ─── Core Algorithm ────────────────────────────────────────────────────────────

/**
 * Compute the weight to apply to a rater's future (and historical) ratings.
 *
 * @param rater  - Profile containing the user's rating history.
 * @param pop    - Current population-level statistics (updated periodically).
 * @returns      GuardrailResult with the weight factor and audit metadata.
 */
export function computeRaterWeight(
  rater: RaterProfile,
  pop: PopulationStats
): GuardrailResult {
  // ── Not enough data yet ──────────────────────────────────────────────────────
  if (rater.ratingCount < MIN_RATINGS_TO_EVALUATE) {
    return {
      weight: 1.0,
      isFlagged: false,
      zScore: null,
      reason: `Too few ratings (${rater.ratingCount}/${MIN_RATINGS_TO_EVALUATE}) — full weight applied.`,
    };
  }

  // ── Population std dev guard ────────────────────────────────────────────────
  if (pop.stdDev === 0) {
    return {
      weight: 1.0,
      isFlagged: false,
      zScore: null,
      reason: 'Population std dev is zero — full weight applied.',
    };
  }

  // ── z-score: how many σ below population mean ────────────────────────────────
  const zScore = (rater.personalMean - pop.mean) / pop.stdDev;

  // ── Within normal range: full weight ─────────────────────────────────────────
  if (zScore >= -THRESHOLD_SIGMA) {
    return {
      weight: 1.0,
      isFlagged: false,
      zScore,
      reason: `z-score ${zScore.toFixed(2)} is within normal range (≥ −${THRESHOLD_SIGMA}σ) — full weight.`,
    };
  }

  // ── Flagged as low-outlier: compute reduced weight ────────────────────────────
  // Map z-score to (0, 1] using a scaled normal CDF so the weight degrades
  // smoothly. A z-score of exactly −THRESHOLD_SIGMA gives weight ≈ 0.5;
  // extreme outliers approach MIN_WEIGHT.
  const rawWeight = normalCDF(zScore, -THRESHOLD_SIGMA, THRESHOLD_SIGMA);
  const weight = Math.max(MIN_WEIGHT, rawWeight);

  return {
    weight,
    isFlagged: true,
    zScore,
    reason:
      `z-score ${zScore.toFixed(2)} is ${Math.abs(zScore).toFixed(2)}σ below mean — ` +
      `weight reduced to ${(weight * 100).toFixed(0)}%.`,
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Approximate normal CDF using the Abramowitz & Stegun (1964) rational
 * polynomial. Accuracy to ±7.5e-8.
 *
 * Returns P(X ≤ x) for X ~ N(mu, sigma).
 * We repurpose it here to map z-scores to a 0–1 probability mass, which gives
 * us a smooth monotonic weight function.
 */
export function normalCDF(x: number, mu = 0, sigma = 1): number {
  const z = (x - mu) / (sigma * Math.SQRT2);
  return 0.5 * (1 + erf(z));
}

/** Approximate error function via Horner's method (Abramowitz & Stegun 7.1.26). */
function erf(x: number): number {
  const sign = x >= 0 ? 1 : -1;
  const a = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * a);
  const poly =
    t * (0.254829592 +
      t * (-0.284496736 +
        t * (1.421413741 +
          t * (-1.453152027 +
            t * 1.061405429))));
  return sign * (1 - poly * Math.exp(-a * a));
}

/**
 * Compute mean and sample standard deviation for an array of numbers.
 * Returns { mean: 0, stdDev: 0 } for empty arrays.
 */
export function computeStats(values: number[]): { mean: number; stdDev: number } {
  if (values.length === 0) return { mean: 0, stdDev: 0 };
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  if (values.length === 1) return { mean, stdDev: 0 };
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / (values.length - 1);
  return { mean, stdDev: Math.sqrt(variance) };
}

/**
 * Aggregate provider score from a list of raw ratings + per-rater weights.
 * This is what the server uses when returning a provider's displayed score.
 *
 * @param entries - Array of { rating, weight } pairs.
 * @returns Weighted mean, or 0 if no entries.
 */
export function weightedProviderScore(
  entries: { rating: number; weight: number }[]
): number {
  if (entries.length === 0) return 0;
  const sumWeights = entries.reduce((s, e) => s + e.weight, 0);
  const sumWeightedRatings = entries.reduce((s, e) => s + e.rating * e.weight, 0);
  return sumWeights === 0 ? 0 : sumWeightedRatings / sumWeights;
}

// ─── Example / Tests (illustrative — run in Jest) ─────────────────────────────
//
// const pop: PopulationStats = { mean: 4.3, stdDev: 0.7, totalRatingCount: 10000 };
//
// // Normal reviewer (mean = 4.1)
// const normal = computeRaterWeight(
//   { userId: 'u1', ratings: new Array(15).fill(4.1), personalMean: 4.1, ratingCount: 15 }, pop
// );
// console.assert(normal.weight === 1.0 && !normal.isFlagged);
//
// // Low-outlier reviewer (mean = 1.2, clearly malicious)
// const malicious = computeRaterWeight(
//   { userId: 'u2', ratings: new Array(20).fill(1.2), personalMean: 1.2, ratingCount: 20 }, pop
// );
// console.assert(malicious.isFlagged && malicious.weight >= MIN_WEIGHT && malicious.weight < 0.5);
//
// // New reviewer with only 5 ratings — no penalty yet
// const newUser = computeRaterWeight(
//   { userId: 'u3', ratings: [1, 1, 2, 1, 1], personalMean: 1.2, ratingCount: 5 }, pop
// );
// console.assert(newUser.weight === 1.0 && !newUser.isFlagged);
