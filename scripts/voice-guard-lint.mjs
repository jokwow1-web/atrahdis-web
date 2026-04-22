#!/usr/bin/env node
// Voice guard CLI — scans src/content/ for brand voice violations
// Usage: node scripts/voice-guard-lint.mjs
// Intended as pre-commit hook or CI step

import { readFileSync, readdirSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = join(__dirname, '..')

// === Inline voice guard rules (mirrors src/lib/voice-guard.ts) ===
const BANNED = /terpercaya|terdepan|pasti lolos|akses eksklusif LPJK|98%/gi
const CORPORATE_PRONOUN = /\b(gue|lo|elo|gw|loe)\b/gi
const DEPRECATED_SBU = /\b(K1|K2|M1|M2|B1|B2)\b/g
const BANNED_BUZZWORD = /\b(pada intinya|pada dasarnya|the bottom line is|utilize|leverage|ecosystem|synergy|stakeholder alignment|game-changer|disruptive|thought leader)\b/gi
const YOU_WORDS = /\b(Anda|Bapak|Ibu|Perusahaan Anda|Tim Anda)\b/gi
const WE_WORDS = /\b(kami|Atrahdis|kita)\b/gi

const CONTENT_DIR = join(PROJECT_ROOT, 'src/content')
const EXTENSIONS = ['.md', '.mdx']

let violations = []
let totalFiles = 0

function walkDir(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDir(fullPath)
    } else if (EXTENSIONS.includes(extname(entry.name))) {
      totalFiles++
      const content = readFileSync(fullPath, 'utf-8')

      // Parse frontmatter for channel and voice_mode
      let voice_mode = 'corporate'
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (fmMatch) {
        const vmMatch = fmMatch[1].match(/voice_mode:\s*(\S+)/)
        if (vmMatch) voice_mode = vmMatch[1]
      }

      // Universal checks
      const banned = [...content.matchAll(BANNED)].map((m) => m[0])
      const deprecatedSBU = [...content.matchAll(DEPRECATED_SBU)].map((m) => m[0])
      const buzzwords = [...content.matchAll(BANNED_BUZZWORD)].map((m) => m[0])

      // Corporate-only checks
      let pronouns = []
      let youRatioInfo = null
      let ratioFailed = false

      if (voice_mode === 'corporate') {
        pronouns = [...content.matchAll(CORPORATE_PRONOUN)].map((m) => m[0])
        const youCount = [...content.matchAll(YOU_WORDS)].length
        const weCount = [...content.matchAll(WE_WORDS)].length
        if (weCount > 0) {
          const ratio = youCount / weCount
          youRatioInfo = { you: youCount, we: weCount, ratio: ratio.toFixed(1), pass: ratio >= 9 }
          if (!youRatioInfo.pass) ratioFailed = true
        }
      }

      const hasViolations = banned.length > 0 || deprecatedSBU.length > 0 || buzzwords.length > 0 || pronouns.length > 0 || ratioFailed

      if (hasViolations) {
        violations.push({ file: fullPath, banned, deprecatedSBU, buzzwords, pronouns, youRatioInfo, ratioFailed })
      }
    }
  }
}

try {
  walkDir(CONTENT_DIR)
} catch (e) {
  console.log('⚠ No content directory found — skipping voice guard.')
  process.exit(0)
}

if (violations.length > 0) {
  console.error('❌ Voice guard FAILED:\n')
  for (const v of violations) {
    console.error(`  ${v.file}:`)
    if (v.banned.length) console.error(`    - Banned words: ${v.banned.join(', ')}`)
    if (v.deprecatedSBU.length) console.error(`    - Deprecated SBU terms: ${v.deprecatedSBU.join(', ')}`)
    if (v.buzzwords.length) console.error(`    - Buzzwords: ${v.buzzwords.join(', ')}`)
    if (v.pronouns.length) console.error(`    - Corporate pronouns (banned): ${v.pronouns.join(', ')}`)
    if (v.ratioFailed) console.error(`    - YOU/YOU ratio ${v.youRatioInfo.ratio}:1 (need ≥9:1)`)
  }
  process.exit(1)
} else {
  console.log(`✅ Voice guard passed (${totalFiles} content files scanned)`)
}