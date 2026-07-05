# Learning & Generation Lab Website

Static website for the Learning & Generation Lab.

## Local Preview

Run a local static server from the repository root:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8000/
```

## Deployment

This site is designed for GitHub Pages or any static hosting service.

For GitHub Pages:

1. Push the site to GitHub.
2. Open repository settings.
3. Go to Pages.
4. Set the source to `Deploy from a branch`.
5. Select the `main` branch and `/root` folder.

The site does not require a build step.

## Editing Content

Publications and people are data-driven.

### Publications

1. Add one Markdown file under `data/publications/`.
2. Register the file in `data/publications/index.json`.
3. Leave any unused link field blank or remove it. Empty links are not rendered.

Example:

```markdown
---
title: Paper Title
authors: Author A, Author B
venue: CVPR
year: 2026
image: assets/img/project/example.jpg
paper: https://example.com/paper.pdf
project: https://example.com/project
code: https://github.com/example/repo
demo:
dataset:
bibtex:
highlight: false
type: paper
---

Optional short description.
```

Use `type: preprint` for preprints. Use `type: paper` for formal publications.
The publications page first renders all preprints, then groups formal publications by year.
Use `highlight: true` to add a star and subtle highlight to a paper.
Leave `paper`, `project`, or `code` blank if the link is unavailable. Blank links are not rendered.

### People

1. Add one Markdown file under `data/people/`.
2. Register the file in `data/people/index.json`.
3. Use `group: faculty` or `group: member`.
4. Leave missing links blank or remove them. Empty links are not rendered.

Example:

```markdown
---
name: Person Name
role: Ph.D. Student
group: member
image: assets/img/me.jpg
homepage:
scholar:
github:
linkedin:
email:
---

Optional short bio.
```
