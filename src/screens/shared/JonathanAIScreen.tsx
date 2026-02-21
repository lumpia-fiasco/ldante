import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { IconSend, IconSparkles, IconStar } from '@tabler/icons-react-native';
import { CrowndLogo } from '../../components/brand/CrowndLogo';

// ─── Types ─────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: 'jonathan' | 'user';
  text: string;
};

type Suggestion = {
  label: string;
  prompt: string;
};

// ─── Initial Greeting ──────────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'intro',
    role: 'jonathan',
    text: "Hi! I'm Jonathan, your personal style advisor. I can recommend services based on your preferences, help you find the perfect provider, and suggest new experiences you'll love.\n\nWhat are you looking to explore today?",
  },
];

const SUGGESTIONS: Suggestion[] = [
  { label: '✨ Style recommendations', prompt: 'What styles would look great on me?' },
  { label: '💇‍♀️ Hair services near me', prompt: 'Find me the best hair services nearby.' },
  { label: '💅 Nail ideas', prompt: 'What nail styles are trending right now?' },
  { label: '🧖‍♀️ Relaxation & wellness', prompt: 'Suggest some relaxation services for me.' },
];

// ─── Low-Rating Suggestions ────────────────────────────────────────────────────
// Jonathan proactively surfaces these when a user rates a service below 3 across the board.

const LOW_RATING_SUGGESTION: Message = {
  id: 'low-rating',
  role: 'jonathan',
  text: "I noticed your recent visit didn't quite meet expectations. I'm sorry about that! Based on your preferences, here are some highly-rated alternatives I think you'll love:\n\n💇‍♀️ **Carmela** — 4.9⭐ hair specialist in Costa Mesa\n💆 **Marcus Thompson** — 4.8⭐ massage therapist in Anaheim\n💅 **Nina Patel** — 4.7⭐ nail artist in Irvine\n\nWant me to tell you more about any of these?",
};

// ─── Mock Responses ────────────────────────────────────────────────────────────

function getMockResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes('hair') || msg.includes('style')) {
    return "Based on your style preferences, I'd recommend exploring **balayage** or **goddess braids** — both are trending and look stunning with your profile. Carmela in Costa Mesa is exceptional for both, with a 4.9 rating from 52 reviews. Want me to check her availability?";
  }
  if (msg.includes('nail') || msg.includes('nails')) {
    return "Nail art is having a moment! Given your aesthetic, I'd suggest **soft gel extensions** with a neutral-to-earth tone palette. Nina Patel in Irvine is a top pick — 4.7 stars, budget-friendly, and 2 of your friends are patrons. Shall I show you her services?";
  }
  if (msg.includes('relax') || msg.includes('wellness') || msg.includes('massage')) {
    return "You deserve a reset! Marcus Thompson in Anaheim is one of the best massage therapists in the area — deep tissue and Swedish, 4.8 stars. He has openings this week. Want to book a session?";
  }
  if (msg.includes('recommend') || msg.includes('suggest')) {
    return "Based on your history and preferences, I'd focus on:\n\n1. 💇‍♀️ **Hair health** — you've rated hair services highest\n2. 💅 **Nail art** — trending in your area among friends\n3. 🧖‍♀️ **Esthetics** — underrated for your skin type\n\nWant a deep dive into any of these?";
  }
  if (msg.includes('trend') || msg.includes('trending')) {
    return "Right now in your area, **textured hair styles** and **minimalist nail art** are huge. On the wellness side, **lymphatic drainage massage** is getting a lot of buzz. Your friends have been trying it — Sarah and Martina both loved it recently!";
  }

  return "Great question! Based on your preferences and booking history, I'd suggest exploring services you haven't tried yet — like brow shaping or a deep conditioning treatment. Your hair health scores are high, so let's build on that! What sounds most interesting?";
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export function JonathanAIScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: text.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate Jonathan "thinking"
    setTimeout(() => {
      const response = getMockResponse(text);
      const jonathanMsg: Message = {
        id: `j-${Date.now()}`,
        role: 'jonathan',
        text: response,
      };
      setMessages(prev => [...prev, jonathanMsg]);
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1000);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrap}>
            <CrowndLogo size={22} color={Colors.secondary} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Jonathan AI</Text>
            <Text style={styles.headerSub}>Your personal style advisor</Text>
          </View>
        </View>
        <View style={styles.betaBadge}>
          <IconSparkles size={12} color={Colors.secondary} strokeWidth={2} />
          <Text style={styles.betaText}>Beta</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <View style={[styles.bubble, styles.bubbleJonathan]}>
              <Text style={styles.typingDots}>●●●</Text>
            </View>
          )}

          {/* Quick suggestions (only shown when just the intro is visible) */}
          {messages.length === 1 && !isTyping && (
            <View style={styles.suggestions}>
              {SUGGESTIONS.map(s => (
                <TouchableOpacity
                  key={s.label}
                  style={styles.suggestionChip}
                  onPress={() => sendMessage(s.prompt)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.suggestionText}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={{ height: 16 }} />
        </ScrollView>

        {/* Input Row */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask Jonathan anything…"
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(input)}
            blurOnSubmit
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
            activeOpacity={0.8}
          >
            <IconSend size={18} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Message Bubble ─────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isJonathan = message.role === 'jonathan';
  return (
    <View style={[styles.bubbleRow, isJonathan ? styles.bubbleRowLeft : styles.bubbleRowRight]}>
      {isJonathan && (
        <View style={styles.jonathanAvatar}>
          <CrowndLogo size={16} color={Colors.secondary} />
        </View>
      )}
      <View style={[styles.bubble, isJonathan ? styles.bubbleJonathan : styles.bubbleUser]}>
        <Text style={[styles.bubbleText, isJonathan ? styles.bubbleTextJonathan : styles.bubbleTextUser]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  headerSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.textMuted,
  },
  betaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.secondary}18`,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: `${Colors.secondary}40`,
  },
  betaText: {
    fontSize: Typography.sizes.xs,
    color: Colors.secondary,
    fontWeight: Typography.weights.semibold,
  },

  messages: { flex: 1 },
  messagesContent: {
    padding: Spacing.base,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },

  bubbleRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubbleRowRight: { justifyContent: 'flex-end' },

  jonathanAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  bubble: {
    maxWidth: '78%',
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  bubbleJonathan: {
    backgroundColor: Colors.surfaceAlt,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: Typography.sizes.base, lineHeight: 22 },
  bubbleTextJonathan: { color: Colors.textPrimary },
  bubbleTextUser: { color: '#FFFFFF' },

  typingDots: {
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 4,
  },

  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  suggestionChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  suggestionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.weights.medium,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { opacity: 0.35 },
});
