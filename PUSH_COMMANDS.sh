#!/bin/bash
# 🚀 推送到 GitHub 并部署到 Vercel 的完整流程

echo "✨ 准备推送代码到 GitHub..."
echo ""

# Step 1: 检查状态
echo "📋 当前 Git 状态:"
git status --short
echo ""

# Step 2: 添加所有文件（.env 已被 .gitignore 排除）
echo "➕ 添加所有文件..."
git add .
echo ""

# Step 3: 查看即将提交的内容
echo "📝 即将提交的更改:"
git status --short
echo ""

# Step 4: 提交
echo "✅ 创建提交..."
git commit -m "feat: integrate Supabase as card catalog source

- Add SupabaseCatalogSource for loading cards from remote database
- Integrate with gameStore for auto source selection (auto → supabase → fallback demo)
- Implement complete runtime architecture (repository, director, reducer, engine)
- Add pipeline verification scripts and testing tools
- Update UI with catalog source indicator
- Seed 37 cards to Supabase database
- Add detailed deployment documentation

Backend:
- Add src/db/ for database schema and seed scripts
- Implement Supabase connection checking and pipeline testing

Runtime:
- Extract game logic from gameStore into separate runtime layer
- Support for milestone/dynamic/crisis/recovery/knowledge card types
- Implement director algorithm with scoring and weighted random selection
- Add pressure system and knowledge coverage tracking

Frontend:
- Update gameStore to use runtime layer
- Add console logging for debugging catalog source
- Display catalog source and card count in GameScreen

Testing:
- Add testSupabasePipeline.ts for end-to-end verification
- All tests passing: 37 cards loaded, 3 turns simulated successfully

Docs:
- Add DEPLOYMENT_CHECKLIST.md with Vercel setup instructions
- Add SUPABASE_PIPELINE_VERIFICATION.md with complete test results"
echo ""

# Step 5: 推送到 GitHub
echo "🚀 推送到 GitHub..."
git push origin main
echo ""

echo "✨ 推送完成！"
echo ""
echo "📌 下一步:"
echo "1. 进入 Vercel Dashboard 查看部署状态"
echo "2. 在 Vercel 项目设置中添加环境变量:"
echo "   - VITE_SUPABASE_URL=https://yowwscjmthbmcmidwsqr.supabase.co"
echo "   - VITE_SUPABASE_ANON_KEY=sb_publishable_3Q1E6QUO2BPvaCTL6N_nkw_cRlKbesi"
echo "   - VITE_GAME_CATALOG_SOURCE=auto"
echo "3. 等待自动部署完成"
echo "4. 访问部署的网站并验证控制台显示 'Loading from supabase'"
echo ""
echo "🎉 完成！"
