# AI Agent Rule Maintenance

`PROJECT_RULES.md` is the single source of truth for AI-assisted work in this
repository.

## Supported agent adapters

- `AGENTS.md` — Codex and agents supporting the AGENTS convention.
- `CLAUDE.md` — Claude Code.
- `.cursor/rules/project-rules.mdc` — Cursor, always applied.
- `.github/copilot-instructions.md` — GitHub Copilot repository instructions.

Adapters intentionally contain only the mandatory loading instruction and a
small non-overridable safety summary. Architecture, code style, testing, and
workflow rules MUST be edited only in `PROJECT_RULES.md`.

When the canonical rules change, verify that every adapter still points to
`docs/ai/PROJECT_RULES.md`. Do not duplicate the full canonical document into an
adapter because duplicated rules will drift.

