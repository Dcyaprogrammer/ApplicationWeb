<div align="center">

# 🎓 Gradventure

### ✨ A Gamified Journey Through Study Abroad Applications

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Astro](https://img.shields.io/badge/Astro-v6-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**An interactive card game about the graduate school application journey** 🎮
**Paired with an HCI design portfolio documenting the entire process** 📚

[**🚀 Try the Game**](https://gradventure-yijl.vercel.app) · [**📖 View Portfolio**](https://dcyaprogrammer.github.io/Gradventure/) · [**🐛 Report Issues**](../../issues)

</div>

---

## 📸 Project Preview

<table>
<tr>
<td width="50%">

### 🎮 The Game

Play through 3 years of graduate school preparation, earn currency, unlock achievements, and redeem real rewards!

- ⚡ **Progress Persistence**
- 🏆 **Achievement System**
- 🎁 **Reward Store**
- 📚 **Knowledge Base**
- 🔐 **Supabase Auth & Database**

</td>
<td width="50%">

### 📚 The Portfolio

Complete HCI design documentation featuring research, design iterations, prototypes, and evaluation.

- 🔍 **User Research & Personas**
- 🎨 **Design System**
- 📱 **Interactive Prototypes**
- 🧪 **User Testing & Evaluation**
- 👥 **Team Contributions**

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### Frontend Game
[![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=flat)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white&style=flat)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/-Zustand-20B2AA?logoColor=white&style=flat)](https://zustand-demo.pmnd.rs/)
[![Framer Motion](https://img.shields.io/badge/-Framer_Motion-FF0080?logoColor=white&style=flat)](https://www.framer.com/motion/)

### Backend & Database
[![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?logo=supabase&logoColor=white&style=flat)](https://supabase.com/)
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=flat)](https://www.postgresql.org/)

### Documentation Site
[![Astro](https://img.shields.io/badge/-Astro-FF5D01?logo=astro&logoColor=white&style=flat)](https://astro.build/)
[![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white&style=flat)](https://tailwindcss.com/)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 24+
- **npm** or **bun**

### 📦 Installation

```bash
# Clone the repo
git clone https://github.com/Dcyaprogrammer/Gradventure.git
cd Gradventure

# Install root dependencies
npm install
```

### 🎮 Run the Game

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The game will be available at `http://localhost:5173`

### 📚 Run the Portfolio

```bash
# Install docs dependencies
npm --prefix docs install

# Start docs server
npm --prefix docs run dev
```

The portfolio will be available at `http://localhost:4321/Gradventure/`

---

## 📁 Project Structure

```
Gradventure/
├── src/
│   ├── client/          # React UI components
│   ├── db/              # Supabase utilities & schemas
│   ├── game/            # Game engine, runtime, content
│   ├── shared/          # Shared helpers
│   └── types/           # TypeScript types
├── docs/                # Astro portfolio site
│   └── src/
│       ├── pages/       # Portfolio pages (research, design, etc.)
│       ├── components/  # Astro components
│       └── styles/      # Global styles
├── scripts/
│   └── analysis/        # Game analysis utilities
└── notes/               # Reference & archived notes
```

---

## 🎯 Key Features

### Game Mechanics
- 🃏 **Interactive Card System** - Make meaningful choices across 3 academic years
- 💰 **Currency & Rewards** - Earn points and redeem real school rewards
- 🏆 **Achievement System** - Unlock badges as you progress
- 📊 **Progress Persistence** - Supabase-backed save system
- 🎨 **Neo-Brutalism Design** - Bold, playful visual aesthetic

### Design Documentation
- 👤 **User Personas** - Detailed user research and journey mapping
- 🔬 **A/B Testing** - Data-driven design decisions
- 📱 **Prototypes** - Low-fi to high-fi interactive mockups
- 🧪 **Usability Testing** - Comprehensive evaluation and iteration

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (for utility scripts)
DATABASE_URL=your_database_url
DIRECT_DATABASE_URL=your_direct_database_url

# Game Catalog Source
# Options: auto | supabase | local | demo
VITE_GAME_CATALOG_SOURCE=auto
```

> 💡 **Tip**: Set `VITE_GAME_CATALOG_SOURCE=demo` to play without Supabase setup!

---

## 📊 Database Utilities

```bash
# Initialize database schema
npm run db:init

# Seed database with game content
npm run db:seed

# Export Supabase schema
npm run db:export:supabase

# Verify Supabase integration
npm run db:check:supabase

# Analyze game balance
npm run analyze:game
```

---

## 🎨 Design System

Gradventure uses a custom **Neo-Brutalism** design system characterized by:

- 🎨 **Bold Colors** - High-contrast, playful palette
- ⬛ **Thick Borders** - 4px black borders throughout
- 🔄 **Subtle Rotations** - Dynamic, hand-crafted feel
- ✨ **Smooth Animations** - Powered by Framer Motion
- 📱 **Fully Responsive** - Works on all devices

👉 **[Explore our design documentation](https://dcyaprogrammer.github.io/Gradventure/design/)**

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 **Fork the repository**
2. 🔧 **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **Push to the branch** (`git push origin feature/AmazingFeature`)
5. 🔀 **Open a Pull Request**

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ⭐ Star Us!

If you find this project helpful or interesting, please consider giving it a star ⭐

<div align="center">

**Made with ❤️ by the Gradventure Team**

[**🔝 Back to Top**](#-gradventure)

</div>
