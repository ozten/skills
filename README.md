# Claude Code Skills Collection

A growing collection of AI agent skills for software development workflows. Built for technical leads, TPMs, and developers who want Claude Code to help with planning, specification, and engineering tasks.

**Contributions welcome!** Found a way to improve a skill or have a new one to add? [Open a PR](#contributing).

## Available Skills

### TPM & Planning

Transform vision documents into traceable, testable specifications. See the [TPM Planning Guide](docs/tpm-planning/README.md) for the full methodology.

| Skill | Description | Triggers |
|-------|-------------|----------|
| [tpm-spec-trace-ids](skills/tpm-spec-trace-ids/) | Annotate vision docs with Feature IDs (F-nnn) | "annotate my vision doc," "add feature IDs," "create coverage index" |
| [tpm-roadmap-slice](skills/tpm-roadmap-slice/) | Extract features into Phase PRDs with requirements | "create phase PRD," "plan next quarter," "extract phase from vision" |
| [tpm-spec-verify](skills/tpm-spec-verify/) | Add QA requirements and acceptance criteria | "add QA plan," "add acceptance criteria," "enrich with test criteria" |

#### Documentation

- [TPM Planning Guide](docs/tpm-planning/README.md) — Full methodology for the planning pipeline

**Planning Pipeline:**
```
Vision PRD → [tpm-spec-trace-ids] → Annotated PRD + Coverage Index
                                            ↓
                                  [tpm-roadmap-slice] → Phase PRD (R-nnnn)
                                            ↓
                                    [tpm-spec-verify] → Phase PRD + Q-nnn + AC-nnnn
```

<!--
### DevOps & Infrastructure
Coming soon.

### Other Categories
Add new categories here as the collection grows.
-->

## Installation

### Option 1: CLI Install (Recommended)

Use [add-skill](https://github.com/vercel-labs/add-skill) to install skills directly:

```bash
# Install all skills
npx skills add https://github.com/ozten/skills

# Install specific skills
npx skills add https://github.com/ozten/skills --skill tpm-spec-trace-ids

# List available skills
npx skills add https://github.com/ozten/skills --list
```

### Option 2: Clone and Copy

Clone the repo and copy the skills you need:

```bash
git clone https://github.com/ozten/skills
cp -r skills/* ~/.claude/skills/
```

### Option 3: Direct Download

Download individual `SKILL.md` files and place them in `~/.claude/skills/skill-name/`.

### Option 4: Fork and Customize

1. Fork this repository
2. Customize skills for your team's workflows
3. Clone your fork into your projects

## Usage

Once installed, just ask Claude Code to help with planning tasks:

```
"Annotate this vision doc with feature IDs"
→ Uses tpm-spec-trace-ids skill

"Create a phase PRD for Q2"
→ Uses tpm-roadmap-slice skill

"Add acceptance criteria to this spec"
→ Uses tpm-spec-verify skill
```

Or reference skills directly when starting a task:

```
"Using tpm-roadmap-slice, extract features F-012 through F-018 into a phase PRD"
```

## Contributing

Found a way to improve a skill? Have a new skill to suggest? PRs and issues welcome!

**Ideas for contributions:**
- Improve existing skill instructions or workflows
- Add new skills for other domains (DevOps, security, testing)
- Fix typos or clarify confusing sections
- Add examples or templates

**How to contribute:**
1. Fork the repo
2. Create or edit skill files
3. Submit a PR with a clear description

### What are Skills?

Skills are markdown files that give AI agents specialized knowledge and workflows for specific tasks. When you add these to your project, Claude Code can recognize what you're working on and apply the right frameworks and best practices.

### Skill File Structure

Each skill is a directory containing a `SKILL.md` file:

```
skills/
  skill-name/
    SKILL.md
    assets/           # Optional templates
    references/       # Optional detailed docs
```

See [Claude Skills](https://code.claude.com/docs/en/skills) for details.

---

# Skill Name

[Full instructions for the AI agent]
```

## License

MIT — Use these however you want.