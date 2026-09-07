#!/usr/bin/env bash
# Blocks Claude from writing or editing a `verification:` block in a content entry.
#
# `decisions/verification-and-authorship.md`, Decision 4: the verification block is
# the one thing in this tree that means a human opened the standard and confirmed
# the number. It means nothing the moment an agent can produce it.
#
# The schema in src/content.config.ts already fails the build on a *published* entry
# with no block. That stops an unverified number shipping. It does not stop an agent
# filling the block in and going green — which is what this hook is for.
#
# Deletions are allowed on purpose: clearing a stale block is required when a cited
# edition is superseded or a calc core changes, and that must not need a human.
set -uo pipefail

payload=$(cat)

tool=$(jq -r '.tool_name // ""' <<<"$payload")
case "$tool" in
  Write|Edit|MultiEdit) ;;
  *) exit 0 ;;
esac

path=$(jq -r '.tool_input.file_path // ""' <<<"$payload")
[[ "$path" == *"/src/content/"* || "$path" == src/content/* ]] || exit 0

# Only the incoming text matters. Whatever the block said before is irrelevant:
# a new_string carrying `verification:` is the agent asserting a human check.
incoming=$(jq -r '
  [ .tool_input.content?,
    .tool_input.new_string?,
    (.tool_input.edits? // [])[].new_string?
  ] | map(select(. != null)) | join("\n")
' <<<"$payload")

if grep -qE '^[[:space:]]*verification:' <<<"$incoming"; then
  jq -n --arg p "$path" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: (
        "Blocked: this edit writes a `verification:` block into " + $p + ".\n\n" +
        "That block is a human signature — it asserts that a person opened the standard " +
        "and confirmed the calculation principle and the result. You must not produce it. " +
        "See decisions/verification-and-authorship.md, Decision 4.\n\n" +
        "Instead: leave the entry `draft: true` with no verification block, and run /verify " +
        "to hand over the packet the human needs — the formula as implemented, the standard, " +
        "clause and edition it claims, the input set, the computed result, and where the " +
        "confirming example should be.\n\n" +
        "(Removing or clearing a verification block is allowed and is not blocked.)"
      )
    }
  }'
  exit 0
fi
exit 0
