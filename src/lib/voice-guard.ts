// Voice Guard — Channel-aware enforcement for PT Atrahdis content
// Reference: docs/nicx-personal-voice.md, Brand Voice Addendum v1.0

// === Universal banned words (applies to ALL channels) ===
const BANNED = /terpercaya|terdepan|pasti lolos|akses eksklusif LPJK|98%/gi;

// === Corporate-only: personal pronouns banned in blog/lp/ads/email ===
const CORPORATE_PRONOUN = /\b(gue|lo|elo|gw|loe)\b/i;

// === Deprecated SBU qualification format ===
const DEPRECATED_SBU = /\b(K1|K2|M1|M2|B1|B2)\b/g;

// === Banned buzzword phrases (Addendum 20.7) ===
const BANNED_BUZZWORD = /\b(pada intinya|pada dasarnya|the bottom line is|utilize|leverage|ecosystem|synergy|stakeholder alignment|game-changer|disruptive|thought leader)\b/gi;

// === YOU/YOUR ratio check words ===
const YOU_WORDS = /\b(Anda|Bapak|Ibu|Perusahaan Anda|Tim Anda)\b/gi;
const WE_WORDS = /\b(kami|Atrahdis|kita)\b/gi;

// === Channel & Voice Mode types ===
export type ChannelType = 'blog' | 'lp' | 'ads' | 'email';
export type VoiceMode = 'corporate' | 'personal';

export interface VoiceContext {
  channel: ChannelType;
  voice_mode: VoiceMode;
}

// === Original result type (backward compatible) ===
export interface VoiceCheckResult {
  banned: string[];
  pronouns: string[];
  clean: boolean;
}

// === Extended result type with context-aware checks ===
export interface VoiceCheckResultWithContext extends VoiceCheckResult {
  deprecatedSBU: string[];
  buzzwords: string[];
  youYourRatio: { you: number; we: number; ratio: string; pass: boolean } | null;
  voiceMode: VoiceMode;
}

// === Original universal check (backward compatible) ===
export function checkVoice(content: string): VoiceCheckResult {
  const banned = [...content.matchAll(BANNED)].map((m) => m[0]);
  const pronouns = [...content.matchAll(CORPORATE_PRONOUN)].map((m) => m[0]);
  return { banned, pronouns, clean: banned.length === 0 && pronouns.length === 0 };
}

// === Channel-aware check ===
export function checkVoiceWithContext(
  content: string,
  context: VoiceContext
): VoiceCheckResultWithContext {
  // Universal checks (always run)
  const banned = [...content.matchAll(BANNED)].map((m) => m[0]);
  const deprecatedSBU = [...content.matchAll(DEPRECATED_SBU)].map((m) => m[0]);
  const buzzwords = [...content.matchAll(BANNED_BUZZWORD)].map((m) => m[0]);

  // Corporate-only checks
  let pronouns: string[] = [];
  let youYourRatio: VoiceCheckResultWithContext['youYourRatio'] = null;

  if (context.voice_mode === 'corporate') {
    // Personal pronouns banned in corporate channel
    pronouns = [...content.matchAll(CORPORATE_PRONOUN)].map((m) => m[0]);

    // YOU/YOUR ratio (minimum 9:1)
    const youCount = [...content.matchAll(YOU_WORDS)].length;
    const weCount = [...content.matchAll(WE_WORDS)].length;

    if (youCount > 0 || weCount > 0) {
      const ratio = weCount === 0 ? Infinity : youCount / weCount;
      youYourRatio = {
        you: youCount,
        we: weCount,
        ratio: weCount === 0 ? '∞' : ratio.toFixed(1),
        pass: weCount === 0 ? youCount > 0 : ratio >= 9,
      };
    }
  }

  const clean =
    banned.length === 0 &&
    deprecatedSBU.length === 0 &&
    buzzwords.length === 0 &&
    pronouns.length === 0 &&
    (youYourRatio?.pass !== false);

  return {
    banned,
    pronouns,
    clean,
    deprecatedSBU,
    buzzwords,
    youYourRatio,
    voiceMode: context.voice_mode,
  };
}