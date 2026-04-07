# Talks

Technical talks for the community.

| Talk | Event | Date | Status |
|------|-------|------|--------|
| [PWA en Rails](pwa_en_rails/) | [RubySur](https://www.youtube.com/@rubysur) | 2026-04-13 | [Video](https://www.youtube.com/watch?v=ppxalpIKpGg) |

## Marp Tips

Slides are built with [Marp](https://github.com/marp-team/marp-cli).

**Run slides locally (with live reload):**

```bash
PORT=3010 marp -p --server .
```

**Export to PDF:**

```bash
marp --allow-local-files --pdf --pdf-notes index.md
```

**Export to PPTX:**

```bash
marp --allow-local-files index.md -o index.pptx
```

The `--allow-local-files` flag is required for local images to render correctly.
