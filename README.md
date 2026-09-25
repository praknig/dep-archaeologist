# 🦴 Dependency Archaeologist

**Find out *why* every dependency is actually in your project — not just how big it is.**

Bundle analyzers tell you a package is 42 KB. Dependency Archaeologist tells you it's 42 KB *because you imported `debounce` from it in one file, called it twice, and could inline it in ten lines.*

```bash
npx dep-archaeologist scan
```

```
📦 lodash (71.2 KB minified, 24.8 KB in your bundle)
   ├─ imported in 3 files
   ├─ symbols used: debounce, throttle, isEqual
   ├─ call sites: 4
   └─ verdict: ⚠️  Heavy package for light usage — consider `just-debounce` (2 KB)
               or inlining `isEqual` (used once, in src/utils/compare.ts:12)

📦 date-fns (12.1 KB in your bundle)
   ├─ imported in 18 files
   ├─ symbols used: format, parseISO, addDays, ...(9 more)
   └─ verdict: ✅ Well-utilized, keep

📦 left-pad (0.4 KB)
   ├─ imported in 0 files
   └─ verdict: 🗑️  Unused — safe to remove
```

---

## Why this exists

Every JS/TS project accumulates dependencies nobody fully understands anymore. Existing tools stop at *how big* a package is (Bundlephobia, `size-limit`) or *whether* it's used at all (`depcheck`). None of them answer the question a code reviewer actually asks:

> "Do we really need this whole library for the one thing we're using it for?"

Dependency Archaeologist statically traces every import back to real call sites in your source, measures the *actual* bytes it contributes via a real `esbuild` build (not the package's advertised size), and gives you a plain verdict per dependency.

- 🔍 **Traces usage, not just presence** — which files, which symbols, how many call sites
- 📏 **Real bundle cost** — built from your actual entry points and tree-shaking config, not the npm registry's isolated size
- 🧠 **Actionable verdicts** — "keep," "inline," or "remove," with the exact line numbers to look at
- 🔌 **Zero config, zero API keys, fully offline** — reads your lockfile and source tree, nothing else
- 🤖 **CI-friendly** — GitHub Action posts a PR comment showing the dependency delta on every change
- 🧩 **Optional AI narration** — pipe the structured JSON through the Claude API for plain-English write-ups (`--ai` flag, fully optional)

## Installation

```bash
npm install -D dep-archaeologist
# or run without installing
npx dep-archaeologist scan
```

## Usage

```bash
# Scan the current project
dep-archaeologist scan

# JSON output for tooling/CI
dep-archaeologist scan --format json > report.json

# Only show dependencies flagged for review
dep-archaeologist scan --filter warnings

# Include an AI-written summary (requires ANTHROPIC_API_KEY)
dep-archaeologist scan --ai
```

### GitHub Action

```yaml
- uses: dep-archaeologist/action@v1
  with:
    fail-on: unused   # optional: fail the check on unused deps
```

Posts a comment on every PR showing which dependencies changed size or usage, styled like `size-limit`'s bot.

## How it works

1. **Parse** every source file with `@swc/core` to extract import/require statements
2. **Resolve** each specifier to a package, handling subpath imports, tsconfig path aliases, and barrel re-exports via the TypeScript Compiler API
3. **Attribute** call sites and symbol usage per package
4. **Build** your real entry points with `esbuild` (`metafile: true`) to get actual per-module byte contributions
5. **Score** each dependency against usage sparsity, trivial-symbol heuristics, and measured size
6. **Report** as a CLI table, JSON, or PR comment

No dependency data is sent anywhere. Registry lookups (for suggesting lighter alternatives) are opt-in and cached locally.

## Supported ecosystems

| Package manager | Status |
|---|---|
| npm | ✅ |
| pnpm | ✅ |
| yarn (classic + berry) | ✅ |
| Monorepos / workspaces | 🚧 planned |
| Python (pip/poetry) | 🚧 planned |

## Roadmap

- [ ] Monorepo / workspace support
- [ ] HTML report with visual dependency graph
- [ ] VS Code extension (inline gutter warnings on import lines)
- [ ] Python and Go support
- [ ] Historical tracking — dependency health over time, not just a snapshot

## Contributing

Contributions are welcome — especially fixtures for tricky import-resolution edge cases (barrel files, circular re-exports, monorepo aliasing). See [`CONTRIBUTING.md`](./CONTRIBUTING.md) to get started.

```bash
git clone https://github.com/your-org/dep-archaeologist
cd dep-archaeologist
npm install
npm test
```

## License

[MIT](./LICENSE)

---

<sub>Built out of frustration with `import _ from 'lodash'` showing up in a bundle report as one mysterious number.</sub>