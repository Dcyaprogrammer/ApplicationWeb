# Contributing to Gradventure

Thank you for your interest in contributing to Gradventure! We welcome contributions from the community.

## 🚀 Development Roadmap

### ✅ Completed Features

- [x] Core game mechanics
- [x] Supabase integration
- [x] Authentication system
- [x] Achievement system
- [x] Reward store with QR code redemption
- [x] Knowledge base system
- [x] Portfolio documentation site
- [x] User research and personas
- [x] Design system (Neo-Brutalism)
- [x] Progress persistence

### 🎯 Planned Features

#### High Priority
- [ ] **Mobile App Version** - React Native or Progressive Web App
- [ ] **Real-time Sync** - Multi-device synchronization using Supabase Realtime
- [ ] **Offline Mode** - Service worker for offline gameplay
- [ ] **Internationalization** - Multi-language support (i18n)

#### Medium Priority
- [ ] **Multiplayer Features** - Competitive and cooperative modes
- [ ] **Advanced Analytics** - Dashboard for player behavior insights
- [ ] **Achievement Sharing** - Social media integration
- [ ] **Leaderboards** - Global and friend rankings

#### Low Priority
- [ ] **Theming System** - Custom color schemes and visual styles
- [ ] **Accessibility Improvements** - Enhanced screen reader support, keyboard navigation
- [ ] **Performance Optimization** - Lazy loading, code splitting improvements
- [ ] **API Documentation** - Public API for third-party integrations

### 💡 Future Enhancements

- [ ] AI-powered card recommendations
- [ ] Expanded reward catalog
- [ ] Gamified tutorial system
- [ ] Community-created card content
- [ ] Export/save game data as PDF
- [ ] Integration with university systems

---

## 🛠️ How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title** describing the bug
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)
- **Additional context** (error logs, related issues)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Use case** - What problem would this solve?
- **Proposed solution** - How should it work?
- **Alternatives considered** - What other approaches did you think of?
- **Mockups/examples** - Visual aids help understanding

### Pull Request Process

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies** following the setup instructions
3. **Make your changes** following our code style
4. **Test thoroughly** - Ensure no existing tests break
5. **Commit clearly** - Use descriptive commit messages
6. **Push to your fork** and create a Pull Request

### Code Style Guidelines

- **TypeScript** - Use proper type annotations
- **Naming Conventions** - camelCase for variables/functions, PascalCase for components/types
- **File Organization** - Keep related code together
- **Comments** - Document complex logic and public APIs
- **Testing** - Add tests for new features when applicable

### Development Workflow

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/Gradventure.git
cd Gradventure

# 2. Add upstream remote
git remote add upstream https://github.com/Dcyaprogrammer/Gradventure.git

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Make changes and test
npm run dev
npm run lint

# 5. Commit your changes
git add .
git commit -m "feat: add your feature description"

# 6. Push and create PR
git push origin feature/your-feature-name
```

### Project Structure Overview

```
src/
├── client/          # React UI components
│   ├── components/  # Reusable UI components
│   ├── screens/     # Main game screens
│   └── store/       # State management (Zustand)
├── db/              # Database utilities and schemas
├── game/            # Game engine and logic
│   ├── runtime/     # Game runtime and persistence
│   ├── content/     # Card content and definitions
│   └── engine/      # Core game mechanics
├── shared/          # Shared utilities
└── types/           # TypeScript type definitions
```

---

## 📝 Commit Message Guidelines

We follow conventional commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
- `feat(game): add new card type for special events`
- `fix(auth): resolve login timeout issue`
- `docs(readme): update installation instructions`
- `style(ui): improve button hover states`

---

## 🧪 Testing

### Running Tests

```bash
# Lint code
npm run lint

# Run game analysis
npm run analyze:game

# Check database integration
npm run db:check:supabase
```

### Test Coverage

When adding features, please:
1. Test on multiple browsers (Chrome, Firefox, Safari)
2. Test on different screen sizes (mobile, tablet, desktop)
3. Test with and without Supabase backend
4. Verify accessibility (keyboard navigation, screen readers)

---

## 🎨 Design Contributions

For UI/UX contributions:

1. **Follow Neo-Brutalism style** - Bold borders, high contrast, playful colors
2. **Maintain consistency** - Use existing components and patterns
3. **Responsive design** - Ensure mobile compatibility
4. **Accessibility** - Consider color contrast, focus states, ARIA labels
5. **Performance** - Optimize images and animations

### Design Resources

- 🎨 [Design System Documentation](https://dcyaprogrammer.github.io/Gradventure/design/)
- 🎯 [Design Decisions](https://dcyaprogrammer.github.io/Gradventure/brainstorm/)
- 📱 [Component Library](neo-brutalism-ui-library/)

---

## 📚 Documentation Contributions

We appreciate documentation improvements! Areas that need help:

- **API Documentation** - JSDoc comments for public functions
- **Component Examples** - Usage examples for UI components
- **Tutorials** - Step-by-step guides for features
- **Translation** - Multi-language support when ready

### Documentation Structure

```
docs/src/pages/
├── research.astro      # User research and findings
├── design.astro         # Design system and decisions
├── prototypes.astro     # Interactive prototypes
├── evaluation.astro     # User testing results
└── team.astro          # Team contributions
```

---

## 💬 Communication

- **GitHub Issues** - For bugs and feature requests
- **Pull Requests** - For code reviews and discussions
- **Discussions** - For general questions and ideas

---

## 🙏 Recognition

Contributors will be:
- Listed in the contributors section
- Credited in release notes
- Invited to join as collaborators (for significant contributions)

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

## ❓ Questions?

Feel free to:
- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing documentation first

**Happy contributing!** 🎉
