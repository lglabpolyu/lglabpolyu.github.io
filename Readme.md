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
