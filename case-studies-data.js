// Case study data — extracted verbatim from portfolio-app.js (the real site).
// Used by landing-redesign-prototype.html to render real case-study content
// in the white-background case-detail view.
const CASES = {
  'vyehealth': {
    company: 'Vye Health',
    headline: 'The provider side was in pilot. The patient experience wasn\'t close.',
    intro: 'Twelve disconnected vibecoded screens became five coherent patient areas &#8212; and a design system rigorous enough for an AI tool to build on.',
    metrics: [
      { value: '5',      label: 'patient experience areas designed end to end' },
      { value: '~60%',   label: 'prototype fidelity via a Claude Code skill, out of the gate' },
      { value: 'Jul 26', label: 'seed presentations — pilot-ready in time' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Founding Designer (Contract)</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Product design, information architecture, AI-assisted prototyping, design systems</div></div>
        <div><div class="cs-meta-label">Delivered</div><div class="cs-meta-val">Patient experience (5 areas), provider-side messages, tasks panel &amp; shop surface, design system, Claude Code skill</div></div>
        <div><div class="cs-meta-label">Tools</div><div class="cs-meta-val">Figma (MCP + Code Connect), Claude Code, mobile-native token architecture</div></div>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/healthtech-mob-home.png" class="cd-hero-img" alt="Patient experience mobile — Home and navigation menu" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">What I walked into</span></div>
        <p class="cd-body">Vye Health is building VyeOS &#8212; an AI operating system for private practices. The short version: take the actual chaos of health data across labs, devices, EHRs, and notes, make it structured and queryable, put AI reasoning on top. When I came on, the provider side was already in pilot. The patient side had a different problem.</p>
        <p class="cd-body">What I walked into was a patient experience that had been rapidly generated through AI-assisted prototyping to validate concepts. Smart use of the tool &#8212; it accelerated early exploration. But the resulting flows weren&#39;t ready for anything beyond that. Navigation shifted screen to screen. Components that should have been identical looked and behaved differently. Related features had been built as separate screens with no structural relationship to each other &#8212; the navigation reflected the order things were built, not the order patients needed them. Nothing tied it together.</p>
        <p class="cd-body">Vye was heading into seed fundraising in July 2026. The provider experience was in pilot. The patient experience needed to get there &#8212; demonstrating that the full system held together as a coherent product. Investors and design partners needed to see a patient journey that was legible, trustworthy, and clearly connected to the clinical intelligence underneath it. The vibecoded flows couldn&#39;t show that.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">Constraints</span></div>
        <p class="cd-body">A traditional design process wasn&#39;t on the table. Three things shaped how I worked:</p>
        <div class="finding-block">
          <div class="finding-row">
            <div class="finding-tag">Timeline</div>
            <div class="finding-body">A short-term contract at a pre-seed startup moving toward a seed raise &#8212; no room for extended discovery or long review cycles.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Live pilot</div>
            <div class="finding-body">The provider experience was already in pilot. The team was shipping and iterating in real time &#8212; design had to keep pace.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Sunk learning</div>
            <div class="finding-body">The vibecoded flows had months of real product thinking embedded in them. Throwing them out would have meant discarding decisions the team had already paid for.</div>
          </div>
        </div>
        <div class="cs-callout">
          <div class="cs-callout-label">The core design challenge</div>
          <p class="cd-body">How do you take a set of disconnected, inconsistently built patient flows and turn them into a coherent, pilot-ready experience &#8212; without slowing the team down, without throwing away what works, and without a traditional design process the timeline couldn&#39;t support?</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">Approach: prototype &#x2192; refine &#x2192; feedback &#x2192; codify</span></div>
        <p class="cd-body">The approach was a tight loop. I&#39;d prototype entire patient workflows in Claude Code &#8212; full flows, not individual screens &#8212; then bring them into Figma and refine against the design system. That refinement always surfaced something: a stakeholder reaction, an engineering constraint, or just the clarity that comes from seeing a flow in a more considered state. Whatever surfaced got codified back into the skill.</p>
        <div class="workflow-block">
          <div class="workflow-row">
            <div class="workflow-step">01 &nbsp;Prototype</div>
            <div class="workflow-body">Work at high velocity in Claude Code to build entire patient workflows end to end &#8212; not screens, full flows.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">02 &nbsp;Refine</div>
            <div class="workflow-body">Bring prototypes into Figma and refine against the design system&#39;s tokens and components. This is where decisions got made explicit.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">03 &nbsp;Feedback</div>
            <div class="workflow-body">Stakeholder reaction, engineering input, and the clarity that comes from seeing a flow in a more considered state.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">04 &nbsp;Codify</div>
            <div class="workflow-body">Feed every learning back into the design system skill, so the next cycle starts more correct than the last one.</div>
          </div>
        </div>
        <p class="cd-body">Each cycle made the next one faster. The more that got codified, the more correctness each new prototype inherited for free. The gap between a first pass and something 60%+ production-ready kept shrinking. Speed and coherence reinforced each other.</p>
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/healthtech-mob-booking.png" class="cd-screenshot" alt="Appointment booking — select time slot and enter details" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">04</span><span class="cs-section-title">The patient experience</span></div>
        <p class="cd-body">The first move was consolidation. ~12 screens covering what should have been 5 areas &#8212; collapsing that is what made the information architecture legible. Each area got a clear job. Several connected directly into the provider experience.</p>
        <div class="workflow-block">
          <div class="workflow-row">
            <div class="workflow-step">Home</div>
            <div class="workflow-body"><span style="font-family:var(--font-ui);font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.07em;color:rgba(255,255,255,.4);display:block;margin-bottom:8px">Shifts with the care moment.</span>The AI chatbot (V) responded to where the patient was in their care journey. Pre-appointment: patients were prompted to share questions and concerns, which fed into the provider&#39;s encounter notes and resurfaced during the appointment as talking-point reminders. Post-appointment: it led with a care plan summary and purchase links for recommended medications. The content tracked the moment.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Care Journal</div>
            <div class="workflow-body"><span style="font-family:var(--font-ui);font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.07em;color:rgba(255,255,255,.4);display:block;margin-bottom:8px">The system of record.</span>Appointments, medications, care notes, and care team messages. What a provider documented or ordered surfaced automatically in the patient&#39;s journal; what a patient raised surfaced in the provider&#39;s notes. Supplement and medication recommendations carried purchase links directly to the shop. Information moved in both directions without manual reconciliation.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Shop</div>
            <div class="workflow-body"><span style="font-family:var(--font-ui);font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.07em;color:rgba(255,255,255,.4);display:block;margin-bottom:8px">From recommendation to purchase, closed.</span>Purchase flows started from provider recommendations &#8212; a medication order or supplement suggestion became a direct path to purchase in the patient&#39;s context. A full browse-and-discover shopping experience is the future state; anchoring v1 to the care workflow meant shipping something purposeful and complete rather than an open storefront with no clinical grounding.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Profile</div>
            <div class="workflow-body"><span style="font-family:var(--font-ui);font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.07em;color:rgba(255,255,255,.4);display:block;margin-bottom:8px">Complete at your own pace.</span>Personal details, contacts, and health history &#8212; the baseline information the rest of the experience and the care team relied on. Designed to fill in progressively as patients use the product, so it never blocks access to care.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Integrations</div>
            <div class="workflow-body"><span style="font-family:var(--font-ui);font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.07em;color:rgba(255,255,255,.4);display:block;margin-bottom:8px">Never ask twice.</span>Wearables, health platforms, and EHRs. Data the patient had already provided elsewhere followed them in, so they were never asked to repeat it. Relevant device data surfaced on Home with guidance on what to ask the provider.</div>
          </div>
        </div>
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/healthtech-dt-home-postonboarding.png" class="cd-screenshot" alt="Home — pre-appointment: V asks the patient to share questions and concerns before the visit" />
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/healthtech-dt-home-apptday.png" class="cd-screenshot" alt="Home — appointment day: submitted concerns surface as talking points with 16 minutes to go, and a Join button" />
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/healthtech-dt-telehealth.png" class="cd-screenshot" alt="Telehealth call — the patient's Questions &amp; Concerns panel stays visible during the video appointment" />
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/healthtech-dt-home-postappt.png" class="cd-screenshot" alt="Home — post-appointment: V surfaces the care plan with purchase CTAs for recommended medications" />
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/healthtech-dt-carejournal.png" class="cd-screenshot" alt="Care Journal — full record of medication changes, labs ordered, next steps, and appointment notes" />
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/healthtech-mob-join.png" class="cd-screenshot" alt="Join the visit — mobile appointment reminder and video call" />
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/healthtech-mob-after.png" class="cd-screenshot" alt="After the visit — mobile care plan from V, medication changes, labs ordered" />
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/healthtech-mob-journal.png" class="cd-screenshot" alt="Care Journal — mobile view of appointments, care plans, and provider notes" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">05</span><span class="cs-section-title">Decisions worth explaining</span></div>
        <div style="display:flex;flex-direction:column;gap:1.5rem">

          <div>
            <p class="cd-body" style="margin-bottom:0.5rem"><strong>Consolidation over addition</strong></p>
            <p class="cd-body">The vibecoded flows had ~12 screens covering what should have been 5 areas. My first instinct was to redesign each screen. The right decision was to consolidate first &#8212; understand what belonged together before designing anything. That consolidation is what made the information architecture legible.</p>
            <div class="cs-callout" style="margin-top:0.75rem;margin-bottom:0"><div class="cs-callout-label">Tradeoff</div><p class="cd-body">Required convincing stakeholders to step back from specific screens they were attached to.</p></div>
          </div>

          <div>
            <p class="cd-body" style="margin-bottom:0.5rem"><strong>Home as a state-driven surface</strong></p>
            <p class="cd-body">The original home screen was a blank LLM interface &#8212; a text input with a row of suggested prompt buttons underneath. It put the burden on the patient to know what to ask. The insight was that the AI already had the context: the upcoming appointment, the care history, where the patient was in their journey. I redesigned Home around that &#8212; V&#39;s content and framing shift based on the care moment, so the patient gets what they need without having to ask for it.</p>
            <div class="cs-callout" style="margin-top:0.75rem;margin-bottom:0"><div class="cs-callout-label">Tradeoff</div><p class="cd-body">More complexity in the content logic, for a significantly clearer experience at any given moment.</p></div>
          </div>

          <div>
            <p class="cd-body" style="margin-bottom:0.5rem"><strong>Connecting patient and provider surfaces directly</strong></p>
            <p class="cd-body">The patient&#39;s questions and concerns panel didn&#39;t just need to exist &#8212; it needed to feed into the provider&#39;s encounter notes and resurface during the appointment. That required designing across both surfaces, not just the patient side.</p>
            <div class="cs-callout" style="margin-top:0.75rem;margin-bottom:0"><div class="cs-callout-label">Tradeoff</div><p class="cd-body">More coordination with the provider-side contractor &#8212; but information moved the right direction with no manual reconciliation.</p></div>
          </div>

          <div>
            <p class="cd-body" style="margin-bottom:0.5rem"><strong>Mobile-native over mobile-responsive</strong></p>
            <p class="cd-body">The product would primarily be used on mobile by patients. I decided to build mobile-native from day one rather than designing for desktop and adapting downward.</p>
            <div class="cs-callout" style="margin-top:0.75rem;margin-bottom:0"><div class="cs-callout-label">Tradeoff</div><p class="cd-body">More initial constraint, but components that felt right in the context patients actually use them.</p></div>
          </div>

          <div>
            <p class="cd-body" style="margin-bottom:0.5rem"><strong>Codifying into the system vs. one-off fixes</strong></p>
            <p class="cd-body">Every time I resolved an inconsistency, I had a choice: fix it in that screen, or codify it into the design system skill. The codify path was slower in the moment but made every subsequent prototype start from a more correct baseline.</p>
            <div class="cs-callout" style="margin-top:0.75rem;margin-bottom:0"><div class="cs-callout-label">Tradeoff</div><p class="cd-body">Counterintuitive on a short contract &#8212; but it multiplied my output instead of just adding to it.</p></div>
          </div>

        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">06</span><span class="cs-section-title">Where patient and provider converged</span></div>
        <p class="cd-body">The provider experience was a separate contractor&#39;s work. But the surfaces where the two sides had to connect &#8212; that was mine. That&#39;s where the real flow lives: encounter notes, orders, recommendations moving in the right direction without anyone stitching it together by hand.</p>
        <div class="finding-block">
          <div class="finding-row">
            <div class="finding-tag">Messages</div>
            <div class="finding-body">Patient&#8211;provider communication flowing both ways. What a patient raised in Care Journal surfaced in the provider&#39;s thread; provider responses flowed back into the patient&#39;s journal automatically.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Tasks panel</div>
            <div class="finding-body">Provider-side action items surfacing from patient interactions &#8212; documentation requests, follow-up reminders, lab orders. Designed so providers could act without switching context.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Shop (provider side)</div>
            <div class="finding-body">A medication, supplement, or device recommended in encounter notes generated a purchase opportunity in the patient&#39;s Shop automatically &#8212; clinical recommendation to patient action, closed.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">07</span><span class="cs-section-title">Outcome</span></div>
        <p class="cd-body">The outcome is a coherent patient experience with a real information hierarchy &#8212; five areas that hold together as one product. The prototype &#x2192; refine &#x2192; feedback &#x2192; codify cycle meant every workflow built made the next one easier. The provider&#8211;patient information flow works across messages, tasks, and shop without anyone manually stitching it together.</p>
        <p class="cd-body">This is pre-revenue work heading into seed. The measurable outcome is pilot-readiness and investor confidence &#8212; that&#39;s what the timeline called for. Post-seed metrics will follow when the platform has paying customers to measure.</p>
        <div class="cs-reflection">
          <div class="cs-reflection-title">Reflection</div>
          <p class="cd-body"><strong>Vibecoded flows show you exactly what the system is missing.</strong> The inherited flows were proof of what happens when speed outruns structure &#8212; fast, disconnected, and more expensive to untangle than to have built right. The tool moved fast. The problem was the absence of a system to move fast inside.</p>
          <p class="cd-body"><strong>The part that surprised me most wasn&#39;t the prototyping &#8212; it was the naming.</strong> Getting components and tokens to match by name, by meaning, and by semantic role is genuinely tedious work. But that&#39;s what determined whether the Claude Code skill produced fast, coherent output or fast drift. The tool is only as good as the system it&#39;s reading from. That&#39;s what turned the skill from a demo into something the team relied on.</p>
          <p class="cd-body"><strong>Every shortcut that bypassed the foundation created debt that cost more than the time it saved.</strong> That held every time we tested it. Speed and coherence reinforced each other on this project &#8212; but only because the system came first.</p>
          <p class="cd-body"><strong>On a platform like this, the real design work is in the handoffs.</strong> Designing a good screen is tractable. Designing what information moves from the patient&#39;s journal to the provider&#39;s notes, triggered by the right moment, in the right direction &#8212; that&#39;s where it either holds together or it doesn&#39;t. Getting those connections right is the difference between one coherent product and two separate apps.</p>
        </div>
      </div>
    `,
  },

  'vyehealth-ds': {
    company: 'Vye Health',
    headline: 'A design system built to be read by a machine as well as a human.',
    intro: 'The company\'s team wanted speed — the ability to put any idea in front of the room fast. Vibecoded prototyping made that possible in theory, but vibecoded output is only as good as the system underneath it. Without a rigorous, machine-readable design system, AI-generated interfaces would drift from the product\'s visual language immediately and couldn\'t be trusted for real decisions. My job was to build a system that made the vibecoding actually work.',
    metrics: [
      { value: '~60%',     label: 'prototype fidelity reached reliably out of the gate' },
      { value: '2',        label: 'component tracks — one for machines, one for designers' },
      { value: '1',        label: 'token foundation powering both' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Founding Designer (Contract)</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Design systems, AI-assisted prototyping, design engineering, mobile</div></div>
        <div><div class="cs-meta-label">Tools</div><div class="cs-meta-val">Figma (MCP + Code Connect), Claude Code, mobile-native token architecture</div></div>
      </div>

      <img src="assets/healthtech-ds-foundations.png" class="cd-hero-img" alt="Design system — color token scales, Geist type ramp, radius and shadow tokens" />

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">The situation</span></div>
        <p class="cd-body">I joined as founding designer at a moment when the company had a product vision but no real design system to support it. Components existed in scattered Figma files. Naming was inconsistent. There was no shared language between design and engineering, which meant every new feature started from a blank page instead of a foundation.</p>
        <p class="cd-body">The team wanted to lean into AI-assisted prototyping &#8212; letting anyone describe an idea and generate a working interface. But vibecoded output is only as good as the system underneath it. Without a rigorous, semantically consistent design system, AI-generated interfaces drift from the product&#39;s visual language immediately and can&#39;t be trusted for real decision-making.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">The approach</span></div>
        <p class="cd-body">I worked across Figma and Claude Code simultaneously, using the Figma MCP to keep design and code in constant sync. Rather than building the design system and the AI workflow as separate efforts, I treated them as one problem: every token and every component had to be built with machine-readability in mind from day one.</p>
        <div class="workflow-block">
          <div class="workflow-row">
            <div class="workflow-step">Token architecture</div>
            <div class="workflow-body">Audited and restructured color, spacing, and typography tokens so that decisions in Figma mapped one-to-one with the codebase &#8212; by name and by semantic meaning. A &#8220;primary-action&#8221; token in Figma needed to resolve to the exact same concept in code, not just a visually similar one.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Unified naming</div>
            <div class="workflow-body">Closed the translation gap between what a designer calls something and what an engineer calls it &#8212; the consistency that makes it possible for an AI system to reason about the design system at all.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Two component tracks</div>
            <div class="workflow-body">One track built for machine consumption: components exposed through Code Connect via the Figma MCP, structured so the vibecoding skill could map Figma components to production code without guesswork. A second track built for human consumption: components tailored to the company&#39;s growing design team, optimized for design velocity as the team scaled. Both drawing from the same token foundation.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Claude Code skill</div>
            <div class="workflow-body">A custom skill that could take a rough idea from anyone in the organization and generate a prototype at least 60% polished out of the gate &#8212; close enough to production quality to be genuinely useful for early decision-making, not just a proof of concept.</div>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Mobile-native foundation</div>
            <div class="workflow-body">Extended the design system&#39;s mobile approach so the same token and component logic powering the vibecoding skill also scaled correctly to mobile layouts and interactions &#8212; built mobile-native rather than web-first with mobile bolted on.</div>
          </div>
        </div>
        <img src="assets/healthtech-ds-codeconnect.png" class="cd-screenshot" alt="Code Connect pilot — button, badge, input, dialog, and card components with decision notes" />
        <p class="cd-body">Throughout, I partnered directly with engineering &#8212; validating the system in real code, not just Figma, through a continuous feedback loop, adjusting tokens and component structure based on what broke or drifted when engineers implemented against them.</p>
        <img src="assets/healthtech-ds-mobile.png" class="cd-screenshot" alt="Mobile-native patterns — booking flow, consent, confirmation, profile, care plan, and product screens" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">Outcome</span></div>
        <div class="finding-block">
          <div class="finding-row">
            <div class="finding-tag">~60% fidelity</div>
            <div class="finding-body">Reliably reached by the vibecoding skill out of the gate &#8212; polished enough that engineers, PMs, and non-designers could generate credible prototypes without waiting on a designer.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Shifted bottleneck</div>
            <div class="finding-body">Design&#39;s time moved toward refining and directing high-quality concepts instead of producing every single one from scratch.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Trustworthy tokens</div>
            <div class="finding-body">A shared naming convention that eliminated design-to-dev translation errors and gave the AI tooling something it could actually reason about.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Two tracks, one foundation</div>
            <div class="finding-body">A Code Connect-ready component layer for machine consumption and a separate, faster-moving set for the design team &#8212; velocity gains on one side never came at the expense of consistency on the other.</div>
          </div>
        </div>
        <img src="assets/healthtech-ds-patterns.png" class="cd-screenshot" alt="Shared patterns — alert variants, KPI metric cards, chart, and navigation components" />
        <div class="cs-reflection">
          <div class="cs-reflection-title">Reflection</div>
          <p class="cd-body">The most valuable part of this work wasn&#39;t the skill itself; it was the discipline of building a design system that was legible to a machine as well as a human. Getting components and tokens to match by name and by meaning is tedious, unglamorous work, but it&#39;s the actual precondition for AI-assisted design tools to be trustworthy rather than just fast. At this company, that discipline turned vibecoding from a novelty into a real part of the product development workflow.</p>
        </div>
      </div>
    `,
  },

  'teamshares-payroll': {
    company: 'Teamshares',
    headline: 'The ask was a data display. The problem was three hours of work nobody should have been doing.',
    intro: 'Industry leads were spending half their day on manual prep before they could have a single useful conversation with a network president. The brief said "one place to view payroll data." The real job was getting that prep time down to zero.',
    metrics: [
      { value: '1.5 hrs', label: 'end-to-end workflow, down from 3' },
      { value: '135 hrs', label: 'saved per cycle across six leads' },
      { value: '$3.1M',   label: 'annual efficiency gains' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Solo Design Lead</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Discovery, product design, integration architecture</div></div>
        <div><div class="cs-meta-label">Partners</div><div class="cs-meta-val">PM, finance leadership, data engineering, 2 engineers</div></div>
        <div><div class="cs-meta-label">Pilot users</div><div class="cs-meta-val">6 industry leads across 90+ network companies</div></div>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/teamshares%20payroll.png" class="cd-hero-img" alt="Teamshares Payroll Dashboard" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">What industry leads actually do</span></div>
        <p class="cd-body">Teamshares acquires small businesses, then hands the reins to new presidents &#8212; often first-time operators without an MBA or an ops background. Each president gets a company, and Teamshares expects industry leads to make sure the wiring underneath doesn&#39;t fail.</p>
        <p class="cd-body">The ask made sense on paper: give industry leads a place to view payroll data and generate reports. But the framing assumed the problem was display. It wasn&#39;t.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">What discovery actually found</span></div>
        <p class="cd-body">Before opening Figma, I spent time with the leads &#8212; shadowing their workflow, watching how they built payroll lists they already used, learning the vocabulary. What I found: three hours of manual prep before every conversation that mattered.</p>
        <div class="workflow-block">
          <div class="workflow-row">
            <div class="workflow-step">Export</div>
            <div class="workflow-body">Pull a CSV from the payroll system &#8212; Gusto, ADP, Paychex, BambooHR, depending on the company.</div>
            <span class="workflow-tag tag-gone">eliminated</span>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Import</div>
            <div class="workflow-body">Bring it into a spreadsheet. Map columns. Clean the format. Every system exports slightly differently.</div>
            <span class="workflow-tag tag-gone">eliminated</span>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Calculate</div>
            <div class="workflow-body">Run formulas. Build waterfall charts by hand. Period-over-period comparisons. Changes in overtime, PTO, headcount, bonuses.</div>
            <span class="workflow-tag tag-gone">eliminated</span>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">Import again</div>
            <div class="workflow-body">Pull into Metabase for visualization. Then analyze.</div>
            <span class="workflow-tag tag-gone">eliminated</span>
          </div>
          <div class="workflow-row">
            <div class="workflow-step">The conversation</div>
            <div class="workflow-body">Finally: sit down with the president and share the insight.</div>
            <span class="workflow-tag tag-kept">the actual job</span>
          </div>
        </div>
        <div class="cs-callout">
          <div class="cs-callout-label">The reframe that changed the brief</div>
          <p class="cd-body">&#34;How do we display payroll data&#34; became &#34;How do we get leads straight to analysis &#8212; and straight to the conversation?&#34; That&#39;s a fundamentally different product. The second one is a workflow that happens to display data. Every decision came from that distinction.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">What the leads actually needed to see</span></div>
        <p class="cd-body">I did a full walkthrough of how leads did analysis in their spreadsheets before the dashboard existed. Period-over-period comparisons. Changes in overtime, PTO, headcount &#8212; laid out so they could spot the story at a glance, without doing math first.</p>
        <p class="cd-body">The key insight: leads needed comparative data. Prior period vs. current. The delta mattered more than the number. A payroll run showing $180K in overtime means nothing in isolation. A payroll run showing overtime up 40% from the prior period is a conversation starter.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">Why this shaped every downstream decision</div>
          <p class="cd-body">Once I understood that the job was spotting change, the information hierarchy became clear. Deltas go at the top. Raw figures support them, not the other way around. That distinction flows all the way down to Metabase and the component design.</p>
        </div>
        <p class="cd-body">I found a charting library that could replicate the waterfall and period-over-period views leads were already building by hand. Meeting them in their existing mental model meant zero re-learning and faster adoption from a pilot group that didn&#39;t have time for a learning curve.</p>
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/teamshares-industry-lead-workflow.png" class="cd-screenshot" alt="Industry Lead workflow" />
      </div>

      <div class="cd-screenshot-wrap">
        <img src="assets/teamshares-payroll-home.png" class="cd-screenshot" alt="Payroll home dashboard" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">04</span><span class="cs-section-title">The integration scope problem</span></div>
        <p class="cd-body">Payroll data at Teamshares doesn&#39;t live in one place. Ninety-plus network companies running everything from Gusto to ADP to Paychex to BambooHR. Disparate systems, disparate export formats, a lot of manual process stitching it together.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">Option A</div>
            <div class="cs-tc-title">Manual import flow</div>
            <div class="cs-tc-body">Leads upload CSVs. The dashboard handles display and calculation. Faster to build, simpler integration surface. But leads still own the export-import loop, which was most of the three hours we were trying to eliminate.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">Option B &#8212; chosen <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Live integrations via Merge</div>
            <div class="cs-tc-body">Connect directly to each payroll system. Leads open the dashboard and the data is already there. More engineering investment up front, but it&#39;s the only version that actually eliminates the prep work instead of just organizing it.</div>
          </div>
        </div>
        <p class="cd-body">We used Merge for implementation &#8212; it let us move fast against a fragmented vendor landscape without building bespoke connectors for every payroll system. The tradeoff was a dependency on a third-party integration layer. The alternative was more internal engineering work for every new payroll system added to the network. Given that Teamshares was acquiring companies constantly, the Merge dependency was the right bet.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">05</span><span class="cs-section-title">Designing for the platform</span></div>
        <p class="cd-body">Once the integrations were in place, payroll data was live and structured inside Teamshares for the first time. I pushed hard to design the integration layer to serve the full platform beyond the industry leads workflow.</p>
        <div class="finding-block">
          <div class="finding-row">
            <div class="finding-tag">Roster sync</div>
            <div class="finding-body">Once connected, payroll became the source of truth for employee rosters. A hire in BambooHR would surface automatically in TeamsharesOS. A departure would trigger a deactivation flow.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Cap table updates</div>
            <div class="finding-body">Employee roster changes cascaded into cap table updates automatically. New hires entering the equity program, departures exiting it &#8212; all flowing from the payroll integration without manual reconciliation.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Platform foundation</div>
            <div class="finding-body">The payroll section established a new pattern in TeamsharesOS for how financial data surfaces platform-wide. Every subsequent financial data feature had a template to build from instead of starting from scratch.</div>
          </div>
        </div>
        <p class="cd-body">The argument I made internally: the integration work is the expensive part. Building it for one workflow and then rebuilding it for three more is three times the cost for the same outcome. Do it once, do it right, and let the whole platform inherit it.</p>
      </div>

      <div class="cd-screenshots-row">
        <div class="cd-screenshot-frame">
          <img src="assets/teamshares-system-effect.png" alt="System effect" />
          <span>Platform-wide cascade</span>
        </div>
        <div class="cd-screenshot-frame">
          <img src="assets/teamshares-integration.png" alt="Integration hub" />
          <span>Integration hub</span>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">06</span><span class="cs-section-title">The concession: anomaly detection vs. delta highlighting</span></div>
        <p class="cd-body">The vision I wanted to ship was anomaly detection &#8212; a dashboard that could flag unusual patterns automatically before a lead even opened the screen. The problem was data maturity. The integrations were brand new. There was no historical baseline to define what &#34;normal&#34; looked like for any given company.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">What I wanted</div>
            <div class="cs-tc-title">Anomaly detection</div>
            <div class="cs-tc-body">Automatic flagging of unusual patterns against historical baselines. Leads open the dashboard and the outliers are already surfaced. Requires sufficient historical data to establish what normal looks like.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">What we shipped <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Delta highlighting</div>
            <div class="cs-tc-body">Surface change clearly. Make movement visible between pay periods at a glance. A deliberate foothold that starts collecting the behavioral signal needed for smarter detection later.</div>
          </div>
        </div>
        <p class="cd-body">The delta highlighting was the right call given the constraint. But I made a mistake in how I reasoned about it: I let the ideal version crowd out a good-enough intermediate. A simple threshold-based alert &#8212; flag any payroll run that&#39;s 20% or more above the prior period &#8212; doesn&#39;t require historical patterns, just a rule. That was buildable from day one and I didn&#39;t push for it. The lesson I&#39;ve carried since: the right question isn&#39;t &#34;can we ship the full vision?&#34; It&#39;s &#34;what&#39;s the best version of this we can ship now, given what we actually have?&#34;</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">07</span><span class="cs-section-title">What the outcomes actually mean</span></div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">1.5 hrs</div>
          <div class="outcome-detail">
            <div class="cs-od-title">End-to-end workflow, down from 3</div>
            <div class="cs-od-body">The 1.5 hours that remained after the dashboard shipped was the actual job: analysis, drafting advice, having the conversation with the president. The prep was gone. The 50% number undersells it. The remaining 1.5 hours was the actual job — analysis and conversation. The prep was gone entirely. Measured through workflow observation with pilot leads before and after launch.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">135 hrs</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Saved per cycle across six leads</div>
            <div class="cs-od-body">Six leads, 1.5 hours saved per company per cycle, across 90+ companies. The math compounds fast when you&#39;re operating at network scale. This is capacity freed — nobody was cut. The leads used that time for more companies, deeper analysis, and higher-value conversations &#8212; which was the point.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">$3.1M</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Annual efficiency gains</div>
            <div class="cs-od-body">Finance leadership calculated this based on fully-loaded lead costs against hours recovered. I didn&#39;t generate this number &#8212; they did, using the workflow time data from the pilot. It&#39;s the clearest signal that the reframe from &#34;display problem&#34; to &#34;workflow problem&#34; was the right one. A better dashboard wouldn&#39;t have gotten there. Eliminating the prep did.</div>
          </div>
        </div>
      </div>

      <div class="cd-video-wrap">
        <iframe src="https://www.youtube.com/embed/g3VFUV3jO3c?si=waezLVp14mnNbrpc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">08</span><span class="cs-section-title">What I&#39;d do differently</span></div>
        <p class="cd-body">The threshold-based alert is the obvious one. Letting the full anomaly detection vision crowd out a simpler, shippable version was a failure of prioritization that I owned.</p>
        <p class="cd-body">The other thing: I&#39;d push earlier and harder for the platform scope. The argument that the integration layer should serve the full platform rather than just the leads workflow landed eventually, but it landed mid-build rather than at the start of scoping. Some architectural decisions had already been made with a narrower surface in mind. That conversation needed to happen before the first design review.</p>
        <div class="cs-reflection">
          <div class="cs-reflection-title">The thing this project was really testing</div>
          <p class="cd-body">Every Teamshares network company is a small business with real employees who took a bet on employee ownership. The industry lead&#39;s job is to make sure that bet pays off. If they&#39;re spending half their day doing spreadsheet prep, they&#39;re not doing their job &#8212; and the companies they&#39;re responsible for are getting less of what they need. The dashboard was bigger than productivity — it was a lever on a model that matters. Getting the framing right at the start was what made everything else possible.</p>
        </div>
      </div>

      <div class="cd-block cd-closer">
        <p class="cd-body">Teamshares is a private company. Screens shown are representative of shipped work.</p>
      </div>
    `,
  },

  'teamshares-ats': {
    company: 'Teamshares',
    headline: 'Twenty-plus companies were hiring off the same broken spreadsheet.',
    intro: 'Teamshares was acquiring small businesses faster than it could place leaders to run them. The tool holding the whole operation together was a spreadsheet. The real problem was system design — nobody had designed a pipeline, only a tracker.',
    metrics: [
      { value: '20+', label: 'leaders placed through the platform' },
      { value: '10+', label: 'qualified leaders benched for future placement' },
      { value: '1',   label: 'source of truth, replacing Lever and spreadsheets entirely' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Solo Design Lead</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Discovery, system design, product design</div></div>
        <div><div class="cs-meta-label">Partners</div><div class="cs-meta-val">PM, recruiting team, engineering</div></div>
        <div><div class="cs-meta-label">Constraint</div><div class="cs-meta-val">80+ acquired companies, growing fast</div></div>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/teamshares%20ats.png" class="cd-hero-img" alt="Teamshares ATS" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">Why this wasn&#39;t an ATS problem</span></div>
        <p class="cd-body">The brief was straightforward: build an applicant tracking system to replace the spreadsheet the recruiting team was running on. But a few conversations in, it was obvious that a better tracker wasn&#39;t going to solve what was actually broken.</p>
        <p class="cd-body">Teamshares&#39; business model is specific. They acquire small businesses, transition them to employee ownership, and install a President to run each one. That President placement is the unlock. Without the right person in place, the whole model stalls. And executive hiring takes 2 to 6 months on average &#8212; which meant every open President slot was a company sitting in limbo.</p>
        <p class="cd-body">They had 80+ companies acquired. Some Presidents were running two companies at once just to cover gaps. The spreadsheet wasn&#39;t failing because spreadsheets are bad. It was failing because nobody had designed for what recruiting at this volume and this stakes level actually required.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The reframe that changed the project</div>
          <p class="cd-body">The team was thinking: &#34;How do we track candidates better?&#34; The right question was: &#34;How do we build a talent pipeline that ensures Teamshares always has qualified leaders ready to place?&#34; A candidate tracker optimizes individual hires. A talent pipeline is infrastructure that compounds over time. I pushed for the second framing before a single screen was designed.</p>
        </div>
        <div class="cs-pull-quote">
          <p class="cs-pull-quote-text">"A knack for turning complex problems into clear, user-friendly solutions, always keeping the user's needs at the forefront."</p>
          <p class="cs-pull-quote-attr"><strong>Kevin Rikio Shiiba</strong> · Co-founder &amp; CTO, Teamshares</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">What discovery actually looked like</span></div>
        <p class="cd-body">Discovery here wasn&#39;t just recruiter interviews. It was mapping the entire operating model: how acquisitions flowed, how President slots opened, how candidates moved through the process, and what happened to the ones who didn&#39;t get placed. That last part mattered more than anyone had thought to document.</p>
        <div class="finding-block--padded">
          <div class="finding-row">
            <span class="finding-tag">No shared language</span>
            <span class="finding-body">Each recruiter tracked candidates differently. What one called &#34;phone screen&#34; another called &#34;intro call.&#34; There was no agreed-upon vocabulary for where someone stood &#8212; which made pipeline visibility across the team essentially impossible.</span>
          </div>
          <div class="finding-row">
            <span class="finding-tag">No bench</span>
            <span class="finding-body">Qualified candidates who didn&#39;t get placed would fall completely out of the system. Every new opening started from zero. The team was doing significant work to source and evaluate candidates, then throwing that work away when a hire didn&#39;t close.</span>
          </div>
          <div class="finding-row">
            <span class="finding-tag">No visibility</span>
            <span class="finding-body">Executives had no way to see pipeline health &#8212; how many Presidents-in-waiting were in the system, how close they were to placement-ready, or where bottlenecks were forming. Flying blind on a metric central to the business model.</span>
          </div>
          <div class="finding-row">
            <span class="finding-tag">Transaction mindset</span>
            <span class="finding-body">The team was treating each hire as a one-time event. Source, evaluate, place, done. What the business actually needed was a continuously warm talent pipeline. That&#39;s a fundamentally different operating model, and no amount of UI improvement would get there without first changing the underlying system.</span>
          </div>
        </div>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/ats-brads.jpg" class="cd-hero-img" alt="Teamshares candidates" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">The hardest design work happened before Figma opened</span></div>
        <p class="cd-body">Before I touched any UI, I mapped every state a candidate could be in across the full lifecycle &#8212; not just the happy path, but every edge case I could find. What happens when someone gets placed but the company folds six months later? What happens to a finalist who didn&#39;t get the offer? What happens when a placed President leaves?</p>
        <p class="cd-body">Those edge cases defined the data model. The data model defined the product. Getting that wrong in design would have meant building something that looked right but broke the moment it hit real operational load.</p>
        <div class="cs-callout cs-callout--problem">
          <div class="cs-callout-label">The stage vocabulary problem</div>
          <p class="cd-body">I spent significant time before designing any screens just getting the recruiting team aligned on a shared stage vocabulary. Recruiter by recruiter. What does &#34;screening&#34; mean? What moves someone from &#34;interested&#34; to &#34;qualified&#34;? When is someone on the bench vs. out of consideration? That alignment work was unglamorous and it was the most important design work on the project. Every workflow downstream depended on it being consistent.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">04</span><span class="cs-section-title">The core design decision: purpose-built vs. adapted</span></div>
        <p class="cd-body">Teamshares was already using Lever, a standard enterprise ATS. The obvious path was to configure Lever more intentionally and build tooling around it. I pushed back on that direction early.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">Option A</div>
            <div class="cs-tc-title">Extend Lever</div>
            <div class="cs-tc-body">Lean on the existing ATS. Add structure through custom fields, stages, and integrations. Less build, faster to ship, familiar to the team. The tradeoff: Lever was built for general hiring at volume. The Teamshares model didn&#39;t fit its assumptions.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">Option B &#8212; chosen <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Purpose-built internal tool</div>
            <div class="cs-tc-body">Design an ATS from scratch around the specific operating model. Slower to ship, more engineering investment. But it could model the bench, support placement-based workflows, give leadership pipeline visibility, and be built with a two-sided future in mind.</div>
          </div>
        </div>
        <p class="cd-body">Lever&#39;s data model treated every candidate as moving toward a single job opening. Teamshares needed candidates to exist independently of any specific opening and be matchable to future placements. That&#39;s a fundamentally different architecture — beyond what any configuration of Lever could support.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">05</span><span class="cs-section-title">Shipping incrementally, learning under real load</span></div>
        <p class="cd-body">The product shipped in sprints with the recruiting team using it in production throughout. That wasn&#39;t just a process choice &#8212; it was how I found the problems that don&#39;t show up in research.</p>
        <div class="sprint-block">
          <div class="sprint-row">
            <div class="sprint-label">Sprint 3</div>
            <div class="sprint-body">Candidate scoring rubric. Without a structured rubric, evaluation was left to individual recruiter judgment, which meant no consistent signal for who belonged on the bench vs. who was out. The rubric made &#34;qualified&#34; mean the same thing across the team.</div>
          </div>
          <div class="sprint-row">
            <div class="sprint-label">Post-pilot</div>
            <div class="sprint-body">Admin tools for assignment management. A gap that only surfaced once real volume hit. Recruiters needed to reassign candidates across openings without losing history. Didn&#39;t come up in research. Came up immediately in production.</div>
          </div>
          <div class="sprint-row">
            <div class="sprint-label">Later</div>
            <div class="sprint-body">Bulk actions. Volume grew faster than anyone projected. What worked fine at 20 candidates per recruiter was painful at 60. Bulk status updates and batch communication became necessary, not nice-to-have.</div>
          </div>
          <div class="sprint-row">
            <div class="sprint-label">Ongoing</div>
            <div class="sprint-body">Email hooks to cut the manual status-update loop. Recruiters were spending significant time on outbound communication that the system could handle. Automating status notifications freed up recruiting capacity for actual relationship work.</div>
          </div>
        </div>
        <div class="cd-screenshots-row">
          <div class="cd-screenshot-frame">
            <img src="assets/ats-candidate-detail.png" alt="Candidate detail" />
            <span>Candidate detail</span>
          </div>
          <div class="cd-screenshot-frame">
            <img src="assets/ats-scoring.png" alt="Scoring rubric" />
            <span>Scoring rubric</span>
          </div>
        </div>
        <div class="cd-screenshots-row">
          <div class="cd-screenshot-frame">
            <img src="assets/ats-archiving.png" alt="Archiving" />
            <span>Bench &amp; archiving</span>
          </div>
          <div class="cd-screenshot-frame">
            <img src="assets/ats-bulk-edits.png" alt="Bulk edits" />
            <span>Bulk actions</span>
          </div>
        </div>
      </div>

      <div class="cs-pull-quote">
        <p class="cs-pull-quote-text">"He's quick to step up and guide the team, especially in challenging situations."</p>
        <p class="cs-pull-quote-attr"><strong>Kevin Rikio Shiiba</strong> · Co-founder &amp; CTO, Teamshares</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">06</span><span class="cs-section-title">Candidate experience as a design constraint</span></div>
        <p class="cd-body">Most internal tools treat the candidate as a data object. The kind of person Teamshares was recruiting &#8212; experienced operators, often leaving stable roles &#8212; had real leverage. They could walk.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The design decision that came out of this</div>
          <p class="cd-body">Purpose-built candidate status messaging at each stage transition. Candidates knew what stage they were in, what came next, and roughly what the timeline looked like. This was a strategic retention mechanism for high-value candidates in a long process. Losing a finalist at week eight meant restarting a months-long process. The messaging investment paid for itself once.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">07</span><span class="cs-section-title">The future the data architecture was built for</span></div>
        <p class="cd-body">Late in the project I started talking to Network Presidents &#8212; candidates who&#39;d been through the process. What I heard shaped a direction nobody had formally proposed: a two-sided platform where candidates maintain profiles between application cycles, and Teamshares proactively matches upcoming openings to warm candidates already in the system.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">What we shipped</div>
            <div class="cs-tc-title">One-sided ATS</div>
            <div class="cs-tc-body">Recruiter-facing tool for managing the President placement pipeline. Candidates are tracked but passive. The system is operated entirely by Teamshares staff.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">What the architecture enables <span class="cs-chosen-badge">future state</span></div>
            <div class="cs-tc-title">Two-sided talent platform</div>
            <div class="cs-tc-body">Candidates maintain profiles, signal availability, and get matched to openings proactively. Teamshares stops starting from zero on every search. The bench becomes a living network.</div>
          </div>
        </div>
        <p class="cd-body">The resourcing wasn&#39;t there to build it at the time, and the company reorganized before it could be pursued. But identifying and architecting toward a future state &#8212; even one that doesn&#39;t ship on your watch &#8212; is part of the job at principal level. You&#39;re not just designing for the current sprint. You&#39;re making decisions that either open or close future possibilities.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">08</span><span class="cs-section-title">What the outcomes actually measured</span></div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">20+</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Leaders placed</div>
            <div class="cs-od-body">Presidents hired and placed into acquired companies through the platform. Executive placements at this level typically take 2 to 6 months each. 20+ placements through a purpose-built system, with a small recruiting team, represents serious throughput improvement over the spreadsheet baseline.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">10+</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Leaders benched</div>
            <div class="cs-od-body">Qualified candidates identified, evaluated, and retained in the system for future placement. Under the old model, these people would have fallen out of the system entirely. This number represents the bench strategy working: recruiting investment that compounds rather than evaporates. It&#39;s the number I&#39;m most proud of because it proves the pipeline model over the transaction model.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">1</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Source of truth</div>
            <div class="cs-od-body">All applicant management moved into the platform, replacing Lever and the spreadsheets entirely. With one system, leadership could see pipeline health for the first time. Recruiters stopped duplicating work across tools. Stage data became consistent enough to actually analyze. The product became core infrastructure &#8212; used daily until the team was dissolved in a company-wide reorganization.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">09</span><span class="cs-section-title">What I&#39;d do differently</span></div>
        <p class="cd-body">The stage vocabulary alignment work was the right call, but I&#39;d do it faster. I spent time working recruiter by recruiter to get buy-in on shared language when I could have run a structured workshop up front, documented the decisions, and moved on.</p>
        <p class="cd-body">On the candidate experience: I&#39;d push for it earlier. I raised it as a constraint mid-project, when it should have been in scope from the start. If I&#39;d framed candidate retention as a business risk in the initial scoping conversation, it would have been in scope from day one.</p>
        <div class="cs-reflection">
          <div class="cs-reflection-title">What this project was really about</div>
          <p class="cd-body">Getting the right President into an acquired small business isn&#39;t an HR milestone. It&#39;s the unlock for employee ownership to actually work. Every hire placed through this system represented a business moving from a retiring owner&#39;s legacy into something owned by the people who run it. The spreadsheet couldn&#39;t hold that weight. The platform could. Designing systems that hold serious weight &#8212; and that don&#39;t break when the business scales past what anyone originally planned for &#8212; is the job.</p>
        </div>
      </div>

      <div class="cd-block cd-closer">
        <p class="cd-body">Teamshares is a private company. Screens shown are representative of shipped work.</p>
      </div>
    `,
  },

  'marketo-sky': {
    company: 'Marketo / Adobe',
    headline: 'I pitched a structural fix before touching a single component.',
    intro: 'Marketo was mid-platform-redesign with a component library maintained by one person and no governance holding it together. The patterns were diverging. The instinct would have been to clean up the components. I went after the org model instead.',
    metrics: [
      { value: '50+',   label: 'components audited and standardized' },
      { value: '100%',  label: 'adoption across product teams' },
      { value: '2.5 yrs', label: 'pre and post-acquisition runway' },
      { value: '3',     label: 'alumni now leading at LinkedIn, TikTok, AWS' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Design Systems Lead</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Governance, system design, team building</div></div>
        <div><div class="cs-meta-label">Timeline</div><div class="cs-meta-val">2.5 years, pre and post-acquisition</div></div>
        <div><div class="cs-meta-label">Team</div><div class="cs-meta-val">2 junior designers, front-end tech lead, rotating PMs</div></div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">What was actually broken</span></div>
        <p class="cd-body">Marketo was in the middle of a significant platform redesign. The component library existed, but it was maintained by a single person with no governance process and no real authority over what entered it. Patterns were diverging across the product. Teams were making local decisions that made sense for their surface and created inconsistency everywhere else.</p>
        <p class="cd-body">The standard response to this situation is a design audit. Clean up the components, establish a style guide, ship an updated library. I didn't think that would work because it treated the symptom without touching the cause.</p>
        <div class="cs-callout cs-callout--problem">
          <div class="cs-callout-label">The actual diagnosis</div>
          <p class="cd-body">A design system maintained by one person with no governance will diverge. One person can't be everywhere. Without authority over what enters the system, every team becomes a de facto exception. The model that produced the components needed to change first. Fixing the model first was the only way to make sure the work didn't need to be redone in two years.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">Selling the structural fix before touching anything</span></div>
        <p class="cd-body">Before any design work started, I got buy-in from my director and the VP of Product on a different model entirely. Not "we need better components." The pitch was: we need democratized ownership, embedded accountability, and governance that gives the design org actual authority over what enters the system.</p>
        <p class="cd-body">That conversation happened before I had a single artifact to show. That was intentional. If you bring a governance proposal with a component library attached, people react to the components. If you bring the governance proposal alone, they react to the argument. The argument needed to land first.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tradeoff-label">Option A</div>
            <div class="cs-tradeoff-title">Centralized ownership</div>
            <div class="cs-tradeoff-body">One team owns the system. All contributions go through them. Consistency is high, velocity is a bottleneck. The model that was already failing — just with more people in the seat.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tradeoff-label">Option B — chosen <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tradeoff-title">Federated ownership with governance</div>
            <div class="cs-tradeoff-body">Every product team has a contributor with a stake in the system. Central governance sets standards and reviews contributions. Ownership is distributed, quality control is centralized. Adoption comes built in.</div>
          </div>
        </div>
        <p class="cd-body">The tradeoff with federated ownership: it's harder to manage. Contributors have other jobs. They're not full-time on the system, which means quality variance is a real risk. The governance layer was the answer to that — not as bureaucracy, but as a review process that gave contributors a clear bar and gave the central team real authority to hold it.</p>
        <p class="cd-body">The thing I argued most directly: if you want 100% adoption, you need 100% of teams to feel like the system belongs to them. You can't mandate that. You have to architect it.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">Building the team deliberately</span></div>
        <p class="cd-body">I was assigned two junior designers. I added a front-end tech lead and built a rotating PM model — product managers rotated in based on which component areas were in scope for their pods. That structure kept the work connected to real product needs instead of becoming a design-org-only exercise that shipped into a vacuum.</p>
        <div class="finding-block">
          <div class="finding-row">
            <div class="finding-tag">Junior designers</div>
            <div class="finding-body">The right call for execution work, and an opportunity to develop people through real systems-level work. I was responsible for vetting subsequent designers who joined. I looked for people who could think in patterns — a different skill than strong visual design.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Front-end tech lead</div>
            <div class="finding-body">Non-negotiable. A design system that engineering can't implement consistently is just a reference document. Having a technical lead embedded from the start meant components were designed with implementation in mind from day one, not retrofitted after.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Rotating PMs</div>
            <div class="finding-body">The part most people skip. Product managers rotated in based on which component areas were in scope for their pods. This kept the system tethered to actual product work. It also meant PMs had direct accountability for the components their teams would use — which made adoption a product goal too.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">04</span><span class="cs-section-title">Solving adoption before it was a problem</span></div>
        <p class="cd-body">Most design systems fight for adoption after they ship. Teams have already built things their own way. Migrating is work. The system becomes a political negotiation instead of a shared resource.</p>
        <p class="cd-body">I didn't want to have that fight. The federated model was partly a governance decision and partly an adoption strategy. When every team has a contributor with skin in the game, every team has a reason to use what comes out of it. The 100% adoption number was baked into the architecture from the start.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The specific mechanism that made it work</div>
          <p class="cd-body">Embedded evangelists. Each product pod had someone who had contributed to the system and understood it from the inside. When new components shipped, that person was an advocate who could answer questions, explain decisions, and reduce the friction of adoption at the team level. You can't document your way to that. You have to build it into the org model.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">05</span><span class="cs-section-title">The audit and the new color system</span></div>
        <p class="cd-body">Once the governance model was in place, the component work started. 50+ components audited, rationalized, and standardized. The audit surfaced the decisions that had never been made explicitly and were producing inconsistency across the product.</p>
        <p class="cd-body">Color was the clearest example. The existing palette had grown by accretion. Colors got added when someone needed them, without a system behind the choices. The audit produced a new color system built around a coherent semantic model — not just a palette, but rules for how colors were used, when, and why. That made it defensible in review and teachable to contributors who weren't color-system specialists.</p>

        <div class="cd-screenshot-wrap">
          <img src="assets/sky-brandcolor.jpeg" class="cd-screenshot" alt="App framework colors and brand color integration" />
        </div>

        <div class="cd-screenshot-wrap">
          <img src="assets/sky-primitivecolor.jpeg" class="cd-screenshot" alt="Semantic color system — red, orange, green, blue scales with usage definitions" />
        </div>

        <div class="cs-callout">
          <div class="cs-callout-label">Why the semantic layer mattered</div>
          <p class="cd-body">A color system tells you which color to use in which context and why. Without that layer, every new component becomes a judgment call, and judgment calls at scale produce drift. The semantic model gave contributors a framework to make consistent decisions without needing to escalate every choice to the central team. That's what made the governance scalable.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">06</span><span class="cs-section-title">Grounding in industry standards, which turned out to matter more than expected</span></div>
        <p class="cd-body">In building Sky, we drew heavily from the leading design systems of the time: Predix, Polaris, Lightning, Spectrum. Not because there was any awareness that an acquisition was coming — there wasn't — but because building to industry-standard patterns was the right call for a platform at Marketo's scale. Enterprise B2B software has established conventions for a reason. Working against them costs you in onboarding, in accessibility, and in credibility with technical stakeholders.</p>
        <p class="cd-body">That decision turned out to be a significant factor when Adobe acquired Marketo. The migration to Adobe's design language was less disruptive than it could have been precisely because Sky was already built on patterns that Adobe's Spectrum system recognized. That's a case where doing the right thing for the wrong-sounding reason — "just because it's good practice" — turned out to have real strategic value after the fact.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tradeoff-label">The path not taken</div>
            <div class="cs-tradeoff-title">Marketo-native patterns</div>
            <div class="cs-tradeoff-body">Build a system tailored entirely to Marketo's specific product context. Higher short-term coherence within the product, but disconnected from broader industry conventions and harder to migrate when the acquisition happened.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tradeoff-label">What we built <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tradeoff-title">Industry-grounded patterns</div>
            <div class="cs-tradeoff-body">Sky drew from Predix, Polaris, Lightning, and Spectrum. More onboarding investment up front to align contributors, but the system spoke a language the broader industry understood — including Adobe's design org.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">07</span><span class="cs-section-title">The acquisition: Sky's patterns going upstream into Spectrum</span></div>
        <p class="cd-body">Adobe acquired Marketo. The expectation would be that the acquired company's design system gets absorbed into the acquirer's. That's mostly what happened. But not entirely.</p>
        <p class="cd-body">Several Sky patterns — data visualization approaches, card treatments — found their way upstream into Spectrum, Adobe's own design language. An acquired company leaving fingerprints on the acquirer's system. That's not a common outcome, and it happened because Sky was built to a standard that Adobe's design org could recognize and evaluate on its merits, not dismiss as a legacy artifact from an acquired product.</p>

        <div class="cd-screenshot-wrap">
          <img src="assets/sky-colorpalette.jpeg" class="cd-screenshot" alt="Data visualization color system — Midnight and Twilight palettes" />
        </div>

        <div class="cd-screenshot-wrap">
          <img src="assets/sky-dataviz.jpeg" class="cd-screenshot" alt="Data visualization examples — trend reports and radar charts" />
        </div>

        <div class="cd-screenshot-wrap">
          <img src="assets/sky-dataviz2.jpeg" class="cd-screenshot" alt="Data visualization examples — cluster analysis and segmentation" />
        </div>

        <div class="cs-callout">
          <div class="cs-callout-label">What this means in practice</div>
          <p class="cd-body">The upstream contribution is evidence that the system was built with enough rigor that one of the largest design organizations in tech looked at it and said: this is better than what we have in this area. That happens with a system that has a real point of view, documented decisions, and patterns that generalize beyond the product they were built for.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">08</span><span class="cs-section-title">What the team became</span></div>
        <p class="cd-body">The designers I developed through this work went on to lead design systems and design functions at some of the most design-mature organizations in the industry. That's not incidental to the project — it's a result of it. Working on a real system, with real governance, real contributors, and real stakes is a different kind of development than working on a product feature.</p>
        <div class="alumni-row">
          <div class="alumni-card"><div class="alumni-co">LinkedIn</div><div class="alumni-role">Design systems lead</div></div>
          <div class="alumni-card"><div class="alumni-co">TikTok</div><div class="alumni-role">Design systems lead</div></div>
          <div class="alumni-card"><div class="alumni-co">AWS</div><div class="alumni-role">Design lead</div></div>
        </div>
        <p class="cd-body">I take that seriously as a measure of the work. A design system that produced three alumni at that level means the people who worked on it learned something real. That's only possible if the work itself had depth — if there were hard decisions to make, real tradeoffs to navigate, and a governance model that required people to think in systems rather than in screens.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">09</span><span class="cs-section-title">What the numbers actually mean</span></div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">100%</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">Adoption</div>
            <div class="cs-od-body">Every product team using Sky. The 100% adoption came from an architectural decision made before the system launched. When every team has a contributor with skin in the game, adoption is a natural outcome. It's the federated model working as intended.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">50+</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">Components audited and standardized</div>
            <div class="cs-od-body">The audit was the mechanism. What it actually produced: a shared vocabulary across the design org, a semantic color system, a governance process with real teeth, and a component library that contributors could extend without breaking. The 50+ number represents the scope of the problem that existed before the governance model was in place.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">2.5 yrs</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">Pre and post-acquisition runway</div>
            <div class="cs-od-body">Sky ran for 2.5 years spanning the Adobe acquisition. A design system that survives an acquisition without being immediately deprecated is a system that was built with enough rigor to be recognized on its merits. Most acquired systems don't make it. Sky not only survived but contributed patterns upstream. The 2.5 years matters because it includes the period when Adobe could have simply replaced it, and chose not to immediately.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">3</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">Alumni at LinkedIn, TikTok, AWS</div>
            <div class="cs-od-body">This is the outcome I didn't know to measure while the work was happening. You can't predict where the people you develop will go. But the fact that three of them ended up leading design systems and design functions at organizations that take design seriously tells you something about the quality of the work they did — and the environment that produced it.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">10</span><span class="cs-section-title">What I'd do differently</span></div>
        <p class="cd-body">The governance model worked, but it took longer to fully operationalize than it should have. The federated ownership concept was sound. The documentation of what that meant in practice — how contributions got reviewed, what the bar was, who had final authority on edge cases — lagged behind the system itself. That created ambiguity in the early months that I had to resolve one conversation at a time instead of by pointing to a process.</p>
        <p class="cd-body">I'd write the governance playbook first, before the first contributor joined. Not a long document — a one-pager that answered the three questions every contributor needed: what's my responsibility, how does my work get reviewed, and who has final say. That clarity would have shortened the ramp-up time considerably.</p>
        <p class="cd-body">On the upstream Spectrum contribution: I'd document the pattern decisions more rigorously in real time. Some of what we contributed worked its way into Spectrum through conversations and informal knowledge transfer rather than clean handoffs. The patterns landed, but the reasoning behind them was harder to transfer than it would have been if we'd been writing decision records as we made the decisions. That discipline would have made the contribution more durable.</p>
        <div class="cs-reflection">
          <div class="cs-reflection-title">What this was really about</div>
          <p class="cd-body">A design system is a bet on how a team will make decisions over time. The components are almost beside the point. What matters is whether the governance model produces consistent decisions at scale without requiring a central authority to weigh in on everything. Sky worked because the model worked — and the model worked because it was designed before the components were. That sequencing is the lesson. Get the org right, then build the thing.</p>
        </div>
      </div>

    `,
  },

  'meroxa': {
    company: 'Meroxa',
    headline: 'We built the right product for the wrong person.',
    intro: 'Growth stalled. The team\'s first instinct was better onboarding. My instinct was that the market assumption underneath the whole product was off.',
    metrics: [
      { value: '10x', label: 'addressable market expansion' },
      { value: '4x',  label: 'improvement in user engagement' },
      { value: '33%', label: 'reduction in time to resource creation' },
      { value: '3',   label: 'enterprise contracts tied directly to the pivot' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Principal Product Designer</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Research, strategy, IA, design system</div></div>
        <div><div class="cs-meta-label">Partners</div><div class="cs-meta-val">VP of Product, Engineering, Exec</div></div>
        <div><div class="cs-meta-label">Duration</div><div class="cs-meta-val">~9 months (pivot + rebuild)</div></div>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/meroxa-observability.png" class="cd-hero-img" alt="Meroxa observability platform" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">What was actually going on</span></div>
        <p class="cd-body">Meroxa had a working product. Visual pipeline builder: connect a source, connect a destination, watch data flow. Clean concept, demos well, early traction. Then the growth curve went flat.</p>
        <p class="cd-body">The instinct in the room was that something was wrong with the experience. Better onboarding. Cleaner UI. Smoother first run. I had a different read after the first few research sessions: we weren&#39;t talking to the person we thought we were building for, and that wasn&#39;t a UX problem.</p>
        <div class="cs-callout cs-callout--problem">
          <div class="cs-callout-label">The uncomfortable part</div>
          <p class="cd-body">We&#39;d built the product for Data Engineers. The people actually using it and bumping against its limits were Software Engineers on production teams. Those aren&#39;t the same role. They have different mental models, different tooling expectations, and completely different anxieties. We&#39;d accidentally found a different market. The question was whether we had the nerve to acknowledge it and go there on purpose.</p>
        </div>
      </div>

      <div class="cd-screenshots-row">
        <div class="cd-screenshot-frame">
          <img src="assets/meroxa-pipelines.png" alt="Meroxa original pipeline builder" />
          <span>Pipeline builder — the original product</span>
        </div>
        <div class="cd-screenshot-frame">
          <img src="assets/meroxa-og-builder.png" alt="Meroxa connector view" />
          <span>Connector view</span>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">How I ran the research</span></div>
        <p class="cd-body">The VP of Product had started picking up on this in customer calls. I took ownership of making it rigorous: 14 sessions across active users, churned users, and prospects we re-recruited specifically to stress-test the persona assumption. I wasn&#39;t looking for feature requests. I was looking for three things.</p>
        <p class="cd-body">Who is actually reaching for this product and why &#8212; not what they say in intake surveys, but what prompted them to show up. What workarounds they&#39;d built that the product couldn&#39;t support. And what a bad Tuesday looks like for them operationally, because that&#39;s where the real job-to-be-done lives.</p>
        <div class="cs-hypothesis-block">
          <div class="cs-hyp-row">
            <span class="cs-hyp-tag assumed">Assumed</span>
            <span class="cs-hyp-body">Data Engineers building pipelines. Their job is construction. They want a visual, no-code tool so they can move faster without writing infrastructure code from scratch.</span>
          </div>
          <div class="cs-hyp-row">
            <span class="cs-hyp-tag actual">Actual</span>
            <span class="cs-hyp-body">Software Engineers on production teams. Their job is reliability. They write code already, that&#39;s not the problem. What they don&#39;t have is visibility into what&#39;s happening inside their data streams when something breaks at 2am.</span>
          </div>
          <div class="cs-hyp-row">
            <span class="cs-hyp-tag implication">Implication</span>
            <span class="cs-hyp-body">This wasn&#39;t a demographic swap. The job-to-be-done was completely different: &#34;diagnose faster&#34; rather than &#34;build faster.&#34; That one distinction changed the interaction model, the IA, the vocabulary, and the onboarding. Everything.</span>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">Taking it to leadership</span></div>
        <p class="cd-body">Research findings are only worth something if they move decisions. The VP of Product and I didn&#39;t bring this to exec leadership as a design presentation. We brought it as a business case.</p>
        <p class="cd-body">The framing was deliberate. Don&#39;t lead with &#34;our users aren&#39;t who we thought.&#34; Lead with &#34;here&#39;s the market we&#39;re currently walking past.&#34; Production engineering teams are a 10x larger addressable market than the Data Engineer segment we&#39;d been targeting. We&#39;d accidentally landed in that market with a product that couldn&#39;t serve it. A focused pivot toward a code-first developer experience, real-time observability, and multi-environment support would turn a lucky accident into a real position.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">Why the framing mattered</div>
          <p class="cd-body">Leadership was already worried about growth. The hard part wasn&#39;t convincing them something was wrong. It was giving them a path forward that felt like opportunity rather than retreat. &#34;There&#39;s a 10x market one pivot away&#34; reframes the same facts into an opportunity. That reframe was intentional, and it&#39;s what got us a yes.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">04</span><span class="cs-section-title">The call that unlocked everything else: code-first vs. visual</span></div>
        <p class="cd-body">The original product was built around drag-and-drop. The new audience didn&#39;t want that. Software Engineers are skeptical of tools that abstract away what&#39;s actually happening. They want to write code, version control their infrastructure, and know exactly what&#39;s running where. The first big design decision was whether to evolve the visual paradigm for the new user or walk away from it entirely.</p>
        <p class="cd-body">We ran two weeks of concept testing. The answer wasn&#39;t close.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">Option A</div>
            <div class="cs-tc-title">Evolve the visual builder</div>
            <div class="cs-tc-body">Add code views alongside the GUI. Let engineers toggle between visual and code representations of the same pipeline. Keep the existing mental model alive for anyone still using it.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">Option B &#8212; chosen <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Code-first, visual as secondary</div>
            <div class="cs-tc-body">Lead with the Turbine SDK. Engineers write real code, push to environments, and use the UI for observability: seeing what&#39;s running, reading logs, managing access. The GUI serves monitoring.</div>
          </div>
        </div>
        <p class="cd-body">Option A felt safer. It preserved more of what we&#39;d built. But engineers in testing kept asking the same question: &#34;which one is the source of truth?&#34; A hybrid that doesn&#39;t fully commit to either mental model serves nobody well. The visual builder wasn&#39;t wrong &#8212; it was solving the wrong problem. Keeping it on life support would have diluted both experiences.</p>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/stream-to-dag.jpg" class="cd-hero-img" alt="Directed Acyclic Graph" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">05</span><span class="cs-section-title">Rethinking the IA from scratch</span></div>
        <p class="cd-body">The original IA was pipeline-centric. Pipelines were the top-level object and everything nested under them. That made sense when the UI was the construction tool. It made no sense when the UI was the observability layer.</p>
        <p class="cd-body">For production engineers, the primary objects are environments (where things run), apps (what&#39;s running), and logs (what&#39;s happening right now). Pipelines become an implementation detail inside an app.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The principle that shaped every IA decision</div>
          <p class="cd-body">Navigate by operational concern. &#34;What&#39;s running in production and is anything wrong?&#34; should be answerable from the home state with no drilling down required. That pushed environment health, app status, and recent log activity to the top level instead of burying them three screens deep inside a pipeline detail view.</p>
        </div>
        <p class="cd-body">The DAG view was the most debated call internally. The concern: DAGs are harder to scan at a glance than linear flows. My position: the complexity was already there. We were just hiding it. Surfacing the real topology honestly &#8212; with good visual hierarchy and progressive disclosure for the details &#8212; was better than a simplified metaphor that would break down the first time an engineer encountered a real production setup. Engineers don&#39;t want you to lie to them about how their system works.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">06</span><span class="cs-section-title">Observability: the feature that wasn&#39;t really a feature</span></div>
        <p class="cd-body">Early in research I asked every production engineer the same question: what do you do when something breaks in a data stream? Same answer every time. Open terminal, pull logs, grep for errors, cross-reference with another service, hope the relevant event is still in the window. Fragmented, slow, and often requiring escalated permissions just to see anything useful.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">What we almost built</div>
            <div class="cs-tc-title">Metrics-first observability</div>
            <div class="cs-tc-body">Aggregate charts showing throughput, latency, and error rates over time. Familiar to anyone who&#39;s used Datadog or Grafana. Would have looked complete on a roadmap slide.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">What we built instead <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Log-first observability</div>
            <div class="cs-tc-body">Real-time log streaming as the primary surface. Metrics exist but they&#39;re secondary. The job was diagnosis, and logs are where diagnosis actually happens.</div>
          </div>
        </div>
        <p class="cd-body">Charts tell you something broke. Logs tell you what broke and why. When you&#39;re in an incident, you don&#39;t pull up a graph to understand it &#8212; you go straight to the logs. Building metrics-first would have looked complete on a roadmap and been useless under pressure.</p>
        <div class="cd-screenshots-row">
          <div class="cd-screenshot-frame">
            <img src="assets/meroxa-iteration.png" alt="Meroxa Iteration" />
            <span>Observability dashboard, an iteration</span>
          </div>
          <div class="cd-screenshot-frame">
            <img src="assets/meroxa-log.png" alt="Meroxa log explorer" />
            <span>Log explorer</span>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">07</span><span class="cs-section-title">The enterprise problem nobody told us about</span></div>
        <p class="cd-body">The first enterprise deals surfaced a requirement we hadn&#39;t designed for: real organizational structure. Solo developers can share one environment. A team of 20 engineers with dev, staging, and production cannot. They need isolation, role-based access, and a way for team leads to see across all environments without drowning in noise.</p>
        <p class="cd-body">We&#39;d built assuming one environment per user. Enterprise reality was three to five environments per team with overlapping ownership. The hard design problem wasn&#39;t the technical model &#8212; engineering had that mostly figured out. It was the mental model question: how does a user know which environment they&#39;re in before they touch anything? A mis-deploy to production instead of staging isn&#39;t recoverable.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The specific call that mattered most</div>
          <p class="cd-body">Persistent environment context in the top nav. The modal approach was cleaner and kept less visual clutter in the main UI. But it put environment context one click away rather than always visible. For a mistake with that severity, one click away isn&#39;t good enough. The nav stays slightly noisier. The user always knows where they are. Right tradeoff.</p>
        </div>
        <div class="cd-screenshots-row">
          <div class="cd-screenshot-frame">
            <img src="assets/meroxa-environments.png" alt="Meroxa Environments" />
            <span>Environment selection</span>
          </div>
          <div class="cd-screenshot-frame">
            <img src="assets/meroxa-common-env.png" alt="Meroxa Common Environment" />
            <span>Common environment selected</span>
          </div>
        </div>
      </div>

      <div class="cd-hero-img-wrap">
        <img src="assets/meroxa-app-detail.png" class="cd-hero-img" alt="App Detail Screen" />
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">08</span><span class="cs-section-title">Design system as the thing that kept us from falling apart</span></div>
        <p class="cd-body">The pivot compressed everything. We were redesigning core IA, building new interaction patterns, and supporting a completely different user mental model &#8212; simultaneously, with a small team, on a startup timeline.</p>
        <p class="cd-body">The Yoshi design system work wasn&#39;t a separate track. It was what kept the pace from collapsing into chaos. Component patterns for log display, environment switching, and DAG visualization got built once and reused across every new surface. Without those building blocks, every screen would have required from-scratch decisions about density, type scale, and information hierarchy.</p>
        <p class="cd-body">The tradeoff I navigated: velocity vs. consistency. Under pressure the temptation is to one-off components &#8212; ship something that works for this screen right now and reconcile later. I pushed against that every time, because &#34;later&#34; almost never comes at an early-stage startup, and a fragmented component library accrues design debt faster than anything else. Slightly more time on each component upfront meant every subsequent screen moved faster. That math is always right.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">09</span><span class="cs-section-title">What the numbers actually mean</span></div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">10x</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Addressable market</div>
            <div class="cs-od-body">This was a pre-pivot projection, not a post-pivot measurement. We sized the production engineering segment against our original Data Engineer TAM using analyst data and our own customer data. The 10x figure shaped the business case. I include it because I helped generate it, and because there&#39;s a real difference between &#34;design produced good outcomes&#34; and &#34;design helped identify a strategic opportunity.&#34; This was the second thing.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">4x</div>
          <div class="outcome-detail">
            <div class="cs-od-title">User engagement</div>
            <div class="cs-od-body">Sessions per active user per week, 90 days post-pivot vs. 90 days pre-pivot. The hypothesis was that stronger product-market fit shows up as more frequent, longer sessions. It did. What I can&#39;t cleanly separate: how much came from the new user persona vs. the new feature set. Honest answer is both, and the data doesn&#39;t let me split them cleanly.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">33%</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Time to resource creation</div>
            <div class="cs-od-body">Task-based usability tests, consistent scenario (deploy an app, check its logs, add a collaborator), before and after the redesign, 12 participants. The prior flow required 4 screens. The redesign reduced it to 2. 33% faster on average. Controlled population, controlled scenario. This is the number that holds up.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">3</div>
          <div class="outcome-detail">
            <div class="cs-od-title">Enterprise contracts</div>
            <div class="cs-od-body">Three enterprise deals in the first two quarters post-pivot where the account team cited multi-environment support as a deciding factor. Sales attribution is always imprecise. I include it because it represents the specific intersection of the strategic repositioning and the organizational account model I designed. It closed deals. That counts.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">10</span><span class="cs-section-title">What I&#39;d do differently</span></div>
        <p class="cd-body">The pivot worked. We were slower to it than we should have been.</p>
        <p class="cd-body">The signal that the assumed market was wrong existed in early research. It was there in how users described their workflows and in the workarounds they&#39;d already built. We spent several months improving the existing product experience before stepping back to ask whether we were building for the right person at all. That&#39;s a question that should be in the research cadence from day one &#8212; not just &#34;are users happy&#34; but &#34;does the person using this match the person we designed for.&#34; Different question. Needs to be asked on purpose.</p>
        <p class="cd-body">On observability specifically: I made the right call going log-first, but I made it two weeks too late. The metrics-first direction got design work before we killed it. If I&#39;d done the job-level research before any scoping conversation started, I would have landed at log-first from the beginning. The lesson is simple and I&#39;ve carried it since: understand the job before you touch the scope. Not during. Before.</p>
        <div class="cs-reflection">
          <div class="cs-reflection-title">The real job</div>
          <p class="cd-body">This project wasn&#39;t about making the product more usable. It was about catching the moment when a research finding becomes a business decision and being ready to make that handoff clearly. That means being willing to say something uncomfortable and having enough strategic context to turn it into a path forward. The design that followed was only possible because that framing happened first. When research changes the direction of a company, that&#39;s the job at its highest level.</p>
        </div>
      </div>

    `,
  },
  'marketo-migration': {
    company: 'Marketo / Adobe',
    headline: 'Sky had been rebuilt for months. Almost nobody had opted in. Nobody had designed the transition.',
    intro: 'Sky had been in development for years. The platform was better. The investment was massive. And fewer than 600 users had opted in. The VP of Product and CPO assembled a task force. The product was ready. Nobody had designed the transition.',
    metrics: [
      { value: '733%', label: 'Increase in user adoption' },
      { value: '600 to 5K+', label: 'Opt-ins before and after' },
      { value: 'Q1 2020', label: 'Shipped on schedule' },
    ],
    content: `
      <div class="cs-meta-row">
        <div><div class="cs-meta-label">Role</div><div class="cs-meta-val">Lead Product Designer, Group Lead</div></div>
        <div><div class="cs-meta-label">Scope</div><div class="cs-meta-val">Research, strategy, migration design, workshop facilitation</div></div>
        <div><div class="cs-meta-label">Team</div><div class="cs-meta-val">2 designers, 2 PMs, 1 researcher</div></div>
        <div><div class="cs-meta-label">Timeline</div><div class="cs-meta-val">3 months</div></div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">01</span><span class="cs-section-title">Why a better product wasn&#39;t enough</span></div>
        <p class="cd-body">Sky had been in development for years &#8212; a full rewrite of Marketo&#39;s tech stack and user experience, built while the team grew from six to twelve people. The investment was enormous. And fewer than 600 users had opted in.</p>
        <p class="cd-body">Leadership&#39;s instinct was to push harder on awareness, maybe force the migration. My read after the first round of research was different: users weren&#39;t resistant to Sky. They were resistant to disruption of workflows running on five-plus years of business-critical data. That&#39;s rational, not stubborn &#8212; and it needed a different solution than better marketing.</p>
        <div class="cs-callout cs-callout--problem">
          <div class="cs-callout-label">The real risk on the table</div>
          <p class="cd-body">Low adoption wasn&#39;t just a UX metric. The ROI case for the entire Sky investment depended on users actually moving over. If adoption stayed under 600, years of engineering and design would depreciate against a user base that never showed up. That&#39;s why the CPO was in the room &#8212; this was a company-level problem wearing a product-design costume.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">02</span><span class="cs-section-title">What research actually surfaced</span></div>
        <p class="cd-body">We interviewed 13 users &#8212; a mix of power users (&#8220;Champions&#8221;) and typical users &#8212; and ran competitive analysis on how Salesforce, Asana, Pendo, and Amplitude had handled similar transitions.</p>
        <p class="cd-body">The finding wasn&#39;t a feature-parity gap, though that existed too. It was a trust problem.</p>
        <div class="finding-block">
          <div class="finding-row">
            <div class="finding-tag">Trust damage</div>
            <div class="finding-body">Early Sky testers who&#39;d hit bugs had gone back to Classic and stayed skeptical. They weren&#39;t neutral anymore &#8212; they were actively resistant. Rebuilding that trust required transparency and user control.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Workflow anxiety</div>
            <div class="finding-body">Campaign automation and lead management don&#39;t have room for mistakes during a learning curve. The anxiety wasn&#39;t about learning a new UI &#8212; it was about making errors with business-critical data.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Parity gaps</div>
            <div class="finding-body">Users couldn&#39;t commit fully to Sky without Classic as a fallback. Any migration strategy had to account for an incomplete product, not assume completion first.</div>
          </div>
          <div class="finding-row">
            <div class="finding-tag">Familiarity</div>
            <div class="finding-body">Preference for Classic navigation wasn&#39;t nostalgia &#8212; it was five years of muscle memory. Users acknowledged Sky&#39;s improvements and still reached for what they knew.</div>
          </div>
        </div>
        <div class="cs-callout">
          <div class="cs-callout-label">The competitive pattern that shaped the strategy</div>
          <p class="cd-body">Salesforce&#39;s forced Classic-to-Lightning migration is the canonical example of backlash that takes years to recover from. Pendo and Amplitude&#39;s phased, modular approaches produced steadier adoption with less resistance. User control over timing, paired with progressive enhancement, beat forced migration every time.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">03</span><span class="cs-section-title">Four options, one winner</span></div>
        <p class="cd-body">I led workshops to evaluate four distinct migration approaches before any design work started. The point was to genuinely stress-test each option against the research findings and force explicit tradeoffs into the open before we committed to a direction.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card rejected">
            <div class="cs-tc-label">Option 1 <span class="cs-reject-badge">rejected</span></div>
            <div class="cs-tc-title">Complete migration</div>
            <div class="cs-tc-body">Finish Sky entirely before transitioning any users. Clean from a product standpoint, but required full feature parity first. Timeline was unacceptable &#8212; adoption crisis couldn&#39;t wait for complete parity.</div>
          </div>
          <div class="cs-tradeoff-card rejected">
            <div class="cs-tc-label">Option 2 <span class="cs-partial-badge">partial</span></div>
            <div class="cs-tc-title">Functional-level switching</div>
            <div class="cs-tc-body">Allow switching between complete functional areas (email, campaigns, reporting). Viable in concept but required significant resource reallocation to reach functional completeness across enough areas.</div>
          </div>
          <div class="cs-tradeoff-card rejected">
            <div class="cs-tc-label">Option 3 <span class="cs-partial-badge">partial</span></div>
            <div class="cs-tc-title">Feature-level switching</div>
            <div class="cs-tc-body">Enable switching on individual ready features while keeping Classic access. More granular than Option 2. The risk: too granular creates a confusing, fragmented experience with no coherent narrative for users.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">Option 4 <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Merge and blend</div>
            <div class="cs-tc-body">Phased hybrid: keep Classic navigation while introducing ready Sky features into the main interface. Gradually align visuals, then transition navigation once parity is achieved. Users experience improvement without disruption.</div>
          </div>
        </div>
        <p class="cd-body">The reason merge and blend won wasn&#39;t that it was the most elegant solution &#8212; it wasn&#39;t. Running two systems in parallel is expensive to maintain and complex to communicate. It won because it was the only option that addressed the actual barrier: trust. Users needed to experience Sky improving their work before they&#39;d commit to it.</p>
        <p class="cd-body">The explicit tradeoff we accepted: engineering and design complexity. Maintaining Classic navigation while gradually introducing Sky meant more states to manage, more edge cases, and a longer period of dual-system support. I made the case that this complexity was the cost of addressing a trust problem correctly rather than a technical problem incorrectly.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">04</span><span class="cs-section-title">The four-phase rollout</span></div>
        <p class="cd-body">Merge and blend wasn&#39;t a single design decision &#8212; it was a sequenced strategy with distinct phases, each with a specific job to do. The sequencing mattered as much as the phases themselves.</p>
        <div class="sprint-block">
          <div class="sprint-row">
            <div class="sprint-label">Phase 1: Hybrid interface</div>
            <div class="sprint-body">Classic navigation stays. Ready Sky features surface in the main interface. Users get improvements without any navigation disruption. This is where trust starts to rebuild &#8212; Sky demonstrating value inside a familiar environment.</div>
          </div>
          <div class="sprint-row">
            <div class="sprint-label">Phase 2: Visual alignment</div>
            <div class="sprint-body">Sky&#39;s visual design gradually introduced to Classic navigation. Users start associating the new aesthetic with familiar patterns. Preparing for navigation change without triggering it yet.</div>
          </div>
          <div class="sprint-row">
            <div class="sprint-label">Phase 3: Nav transition</div>
            <div class="sprint-body">Classic navigation replaced with Sky navigation once feature parity is achieved. By this point users have been working with Sky features for weeks or months. The navigation change lands on a foundation of trust.</div>
          </div>
          <div class="sprint-row">
            <div class="sprint-label">Phase 4: Full Sky</div>
            <div class="sprint-body">Complete Sky experience delivered. Classic fully deprecated. The transition is complete, but users arrived here through choice and incremental familiarity, every step earned.</div>
          </div>
        </div>
        <div class="cs-callout">
          <div class="cs-callout-label">The sequencing principle that everything depended on</div>
          <p class="cd-body">Each phase had to earn the next one. Users needed to experience Sky as better before they&#39;d accept Sky as their navigation. Navigation as their anchor before they&#39;d accept full Sky as their home. The order wasn&#39;t arbitrary &#8212; it was designed to follow the order in which trust actually rebuilds.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">05</span><span class="cs-section-title">The key design decisions inside the strategy</span></div>
        <p class="cd-body">The strategy was the hard part. The implementation had its own tradeoffs worth documenting.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">Considered</div>
            <div class="cs-tc-title">Forced migration with rollback</div>
            <div class="cs-tc-body">Move all users to Sky by default, with Classic available as a rollback option. Faster path to full adoption on paper. In practice, users who&#39;d already lost trust in Sky would exercise the rollback immediately and never return.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">Chosen <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Opt-in with progressive defaults</div>
            <div class="cs-tc-body">Users choose when to try Sky features. Features become Sky-default as they reach readiness. Admin controls let organizations enable Sky preview for their teams. Control stays with users throughout.</div>
          </div>
        </div>
        <p class="cd-body">The opt-in model felt slower. It was. The alternative was faster in the short term and would have produced a trust collapse in the medium term. Users who feel forced into a platform they don&#39;t trust don&#39;t adapt &#8212; they escalate to their admins, file support tickets, and generate noise that slows adoption for everyone else.</p>
        <div class="cs-tradeoff-grid">
          <div class="cs-tradeoff-card">
            <div class="cs-tc-label">Considered</div>
            <div class="cs-tc-title">Single entry point to Sky</div>
            <div class="cs-tc-body">One clear path for users to discover and try Sky. Simpler to design and communicate. But puts all adoption eggs in one basket &#8212; if users miss or ignore that entry point, there&#39;s no recovery mechanism.</div>
          </div>
          <div class="cs-tradeoff-card chosen">
            <div class="cs-tc-label">Chosen <span class="cs-chosen-badge">selected</span></div>
            <div class="cs-tc-title">Multiple discovery pathways</div>
            <div class="cs-tc-body">Sky preview widget in My Marketo. Periodic gentle nudges for opted-out users. Admin-level enablement. Feature-specific entry points. Different users discover Sky through different paths &#8212; meeting them where they are rather than forcing them to find a single door.</div>
          </div>
        </div>
        <p class="cd-body">The multiple pathways decision came directly from the Champions interviews. Power users wanted feature-level discovery. Typical users wanted a simpler, guided path. Designing one entry point would have served one of those users and frustrated the other.</p>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">06</span><span class="cs-section-title">Validation before commit</span></div>
        <p class="cd-body">Before anything shipped, I ran validation sessions with 13 users &#8212; same split of Champions and typical users as the discovery phase. The specific thing I was testing wasn&#39;t &#34;do users like this&#34; &#8212; it was &#34;does the merge and blend approach actually reduce the anxiety that research identified as the primary barrier?&#34;</p>
        <p class="cd-body">Champions were unanimous in their preference for merge and blend in the forum session. The specific finding that shaped final decisions: users wanted experience toggles to remember their last state. A toggle that resets to default every session creates cognitive overhead every session. State persistence was a prerequisite for the opt-in model to feel like genuine control rather than a daily choice tax.</p>
        <div class="cs-callout">
          <div class="cs-callout-label">The validation finding I didn&#39;t expect</div>
          <p class="cd-body">Users consistently preferred Classic navigation during the transition even when they acknowledged Sky looked better. That confirmed the research finding about familiarity, but the strength of the preference surprised me. It recalibrated how aggressively to sequence Phase 2 and Phase 3. We slowed down the visual alignment phase specifically because of this &#8212; users needed more time in Phase 1 than the original timeline assumed.</p>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">07</span><span class="cs-section-title">What the outcomes actually mean</span></div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">733%</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">Adoption increase</div>
            <div class="cs-od-body">From fewer than 600 opt-ins to 5,000+ after launch. Worth contextualizing: this is opt-in adoption, not total user base. The 5,000+ represents users who actively chose to try Sky &#8212; which, given the trust problem we started with, is a more meaningful signal than forced migration numbers would have been.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">Q1 2020</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">On-schedule launch</div>
            <div class="cs-od-body">Three months from task force assembly to shipped switching experience. The merge and blend approach added engineering complexity. The reason it shipped on time: the option evaluation workshops happened early, the direction was committed to quickly, and the phased model meant we weren&#39;t trying to ship everything at once.</div>
          </div>
        </div>
        <div class="cs-outcome-row">
          <div class="cs-outcome-num">1</div>
          <div class="cs-outcome-detail">
            <div class="cs-od-title">Cross-functional process improvement</div>
            <div class="cs-od-body">The work prompted formalization of Product Requirement Documentation across the org &#8212; a process artifact that outlasted the project. The migration effort exposed communication gaps between design, product, and research that the PRD process was built to address.</div>
          </div>
        </div>
      </div>

      <div class="cs-section">
        <div class="cs-section-header"><span class="cs-section-num">08</span><span class="cs-section-title">What I&#39;d do differently</span></div>
        <p class="cd-body">The phased timeline was adjusted mid-project based on validation feedback &#8212; users needed more time in Phase 1 than originally planned. That was the right call, but it was reactive. If I&#39;d weighted the familiarity finding more heavily in the initial timeline, the adjustment would have been built in rather than bolted on.</p>
        <p class="cd-body">On the measurement side: we tracked opt-ins clearly, but we didn&#39;t instrument engagement depth within Sky post-adoption. Getting a user to opt in and getting a user to actually do meaningful work in Sky are different things. I&#39;d push for active usage instrumentation alongside opt-in tracking from day one.</p>
        <p class="cd-body">The process improvement &#8212; the PRD formalization &#8212; happened as a consequence of this project rather than as an intentional design. Looking back, the communication gaps we discovered were visible in the early workshops. I could have raised them explicitly to leadership during the project rather than letting the solution emerge organically afterward.</p>
        <div class="cs-reflection">
          <div class="cs-reflection-title">What this project was really testing</div>
          <p class="cd-body">Enterprise users don&#39;t resist change because they&#39;re stubborn. They resist it because their workflows carry real business risk and they&#39;ve learned &#8212; often through bad experiences &#8212; that platform transitions are where things break. The design challenge here wasn&#39;t making Sky better. Sky was already better. It was making the path to Sky feel safe enough that users would take it. Trust is a design problem. It responds to design solutions. That&#39;s what this project proved.</p>
        </div>
      </div>

    `,
  },
};
