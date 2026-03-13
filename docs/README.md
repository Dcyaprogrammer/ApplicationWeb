# HCI Process Portfolio - Vercel-inspired Neo-Brutalist Design

This portfolio documents the iterative design process for the HCI group project. It has been redesigned using **Astro** and **Tailwind CSS** to provide a fast, performant, and minimalist experience.

## Design Philosophy

- **Neo-Brutalist:** Strong lines, no rounded corners (`rounded-none`), high contrast.
- **Vercel-inspired:** Dark mode by default, clean typography (Inter & JetBrains Mono), grid patterns.
- **Minimalist:** Focus on content and process documentation.

## Project Structure

- `src/pages/`: Contains the individual pages of the portfolio.
  - `index.astro`: Home page.
  - `brainstorm.astro`: Brainstorming & Ideation.
  - `process.astro`: Design Process (Wireframes, User Flows).
  - `prototypes.astro`: Interactive Prototypes.
  - `testing.astro`: User Testing & Results.
  - `reflection.astro`: Project Reflection & Future Steps.
- `src/components/`: Reusable UI components.
  - `Card.astro`: For grid layouts.
  - `Hero.astro`: Large introductory sections.
  - `Section.astro`: Standard content sections with consistent spacing.
  - `PageHeader.astro`: Headers for internal pages.
- `src/layouts/Layout.astro`: Main layout file containing the Navbar and Footer.
- `src/styles/global.css`: Global styles, including custom Tailwind configuration.

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```

## Deployment

This project is configured to deploy to **GitHub Pages** using GitHub Actions.

1.  Push your changes to the `main` branch.
2.  Go to your repository on GitHub.
3.  Navigate to **Settings** > **Pages**.
4.  Under **Build and deployment** > **Source**, select **GitHub Actions**.
5.  The deployment will trigger automatically.

**Important:** If your site is hosted at `username.github.io/repo-name/`, you must update `astro.config.mjs`:
```js
export default defineConfig({
  site: 'https://username.github.io',
  base: '/repo-name', // Add your repository name here
  // ...
});
```

## Customization

- **Colors & Fonts:** Modify `src/styles/global.css`.
- **Navigation:** Update the `navItems` array in `src/layouts/Layout.astro`.
- **Content:** Edit the `.astro` files in `src/pages/` to add your specific project content.

## Backup

The original project files are safely backed up in `docs/_backup/`.
