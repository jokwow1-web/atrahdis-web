#!/bin/bash
# Sync Brand Voice docs between Astro repo and Obsidian Vault
# Run: bash docs/sync-brand-voice.sh
# Direction: repo → Obsidian (one-way, repo is source of truth)

REPO_DOCS="/Users/nicx/atrahdis-web/docs"
OBSIDIAN_BV="/Users/nicx/Yandex.Disk.localized/Downloads/Obsidian Vault/03_Sales/KB_Marketing/Brand-Voice"

FILES=(
  "nicx-personal-voice.md"
  "tweet-samples.md"
  "tweet-samples-manual.md"
  "content-frontmatter-guide.md"
)

PROMPT_FILE="prompts/twitter-content-generator.md"

echo "=== Syncing Brand Voice docs: repo → Obsidian ==="

for f in "${FILES[@]}"; do
  if [ -f "$REPO_DOCS/$f" ]; then
    cp "$REPO_DOCS/$f" "$OBSIDIAN_BV/$f"
    echo "✓ $f"
  else
    echo "✗ $f not found in repo"
  fi
done

if [ -f "$REPO_DOCS/$PROMPT_FILE" ]; then
  cp "$REPO_DOCS/$PROMPT_FILE" "$OBSIDIAN_BV/$PROMPT_FILE"
  echo "✓ $PROMPT_FILE"
else
  echo "✗ $PROMPT_FILE not found in repo"
fi

echo "=== Done ==="