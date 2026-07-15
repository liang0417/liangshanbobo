# Project Agent Guidelines

## OpenSpec usage

- Keep OpenSpec installed, but do not use it by default for routine work.
- Use OpenSpec only when the user explicitly requests it, when continuing an existing OpenSpec change, or when a change crosses multiple modules and needs durable requirements and acceptance criteria.
- Do not use OpenSpec for ordinary pages, components, styling, copy changes, small refactors, or bug fixes.
- Once a direction is approved, implement directly and verify the result instead of repeatedly returning to exploration.

## Product direction

- Build a polished personal website for articles, resume, projects, and future experiments.
- Use React, Vite, TypeScript, and React Router Framework Mode.
- Prefer static pre-rendering so content pages have strong SEO and can be hosted on mainland-China static infrastructure.
- Keep the visual language calm and futuristic: graphite surfaces, restrained cyan/violet accents, subtle grid/noise, and lightweight motion.
- Keep external runtime dependencies minimal. Self-host fonts and assets needed by production pages.

## Verification

- Run `npm run typecheck` and `npm run build` after meaningful code changes.
- Check responsive behavior and reduced-motion support for visual changes.
- Do not claim mainland deployment is complete until the domain, ICP filing, CDN, HTTPS, and live access have been verified.

## Git commits

- Git 提交信息必须使用中文。

## Publishing safety

- Keep secrets and personal sensitive data out of the public repository.
- Treat unpublished drafts as private; a public repository makes draft source visible even if the site does not render it.
- Before publishing, review the exact files being staged and do not stage local notes or environment files.
