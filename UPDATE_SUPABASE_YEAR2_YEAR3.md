# 🔄 Update Supabase with Year 2/Year 3 Content

Generated: 2025-05-01

## ✅ What's New

**SQL file**: `dist/supabase/gradventure_seed.sql`
**Cards**: 80 cards (was 37, +116%)
**File size**: 7,400 lines (was ~3,400 lines)

## 📋 Update Steps

### Step 1: Backup Current Data (Optional but Recommended)

```sql
-- In Supabase SQL Editor, run:
CREATE TABLE cards_backup AS SELECT * FROM cards;
```

### Step 2: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select project: `Gradventure`
3. Click `SQL Editor` → `New Query`

### Step 3: Upload and Run SQL File

**Option A: Upload File** (Recommended for large files)
1. Click `Upload File` button
2. Select: `dist/supabase/gradventure_seed.sql`
3. Click `Run` ▶️

**Option B: Copy-Paste** (May hit size limits)
1. Open `dist/supabase/gradventure_seed.sql`
2. Select all (Cmd+A)
3. Copy (Cmd+C)
4. Paste into SQL Editor
5. Click `Run` ▶️

### Step 4: Verify the Update

Run these verification queries:

```sql
-- Check card count
SELECT COUNT(*) as total_cards FROM cards;
-- Should return: 80

-- Check year distribution
SELECT
  phase,
  COUNT(*) as card_count
FROM cards
GROUP BY phase
ORDER BY phase;
-- Should show: year1=51, year2=14, year3=15

-- Check route-specific cards
SELECT
  CASE
    WHEN meta->>'routeTags' LIKE '%agency%' THEN 'Agency'
    WHEN meta->>'routeTags' LIKE '%diy%' THEN 'DIY'
    ELSE 'Common'
  END as route_type,
  COUNT(*) as card_count
FROM cards
GROUP BY route_type
ORDER BY card_count DESC;
-- Should show: Common=40, Agency=21, DIY=19

-- Sample Year 2 cards
SELECT id, title, phase
FROM cards
WHERE phase = 'year2'
LIMIT 5;

-- Sample Year 3 cards
SELECT id, title, phase
FROM cards
WHERE phase = 'year3'
LIMIT 5;

-- Check a route-specific variant
SELECT id, title, meta->>'routeTags' as route
FROM cards
WHERE id LIKE '%_agency' OR id LIKE '%_diy'
LIMIT 10;
```

## ✅ Expected Results

### Card Count
```
total_cards
-----------
80
```

### Phase Distribution
```
phase  | card_count
-------|------------
year1  | 51
year2  | 14
year3  | 15
```

### Route Distribution
```
route_type | card_count
-----------|------------
Common     | 40
Agency     | 21
DIY        | 19
```

### Sample Year 2 Cards
```
y2_cold_email_professor_agency
y2_cold_email_professor_diy
y2_research_group_join_agency
y2_research_group_join_diy
y2_academic_conference
```

### Sample Year 3 Cards
```
y3_sop_deep_dive_agency
y3_sop_deep_dive_diy
y3_interview_prep_intensive_agency
y3_interview_prep_intensive_diy
y3_waiting_game_strategy
```

## 🎮 Test the Updated Game

After updating Supabase:

1. **Visit your deployed site** (Vercel)
2. **Hard refresh** (Cmd+Shift+R) to clear cache
3. **Open browser console** (F12)
4. **Start a new game**
5. **Check console logs**:
   ```
   📦 Loading game catalog from source: supabase...
   ✅ Catalog loaded successfully: 80 cards
   ```
6. **Play through the game**:
   - Should progress Year 1 → Year 2 → Year 3
   - Should see Year 2 cards (research, networking)
   - Should see Year 3 cards (SOP, interviews, decisions)
   - Should reach Day 1000+ and complete the journey
7. **Try both routes**:
   - Agency route: Should see agency-specific cards
   - DIY route: Should see DIY-specific cards

## 🐛 Troubleshooting

### Issue: "relation does not exist"
**Cause**: Cards table doesn't exist yet

**Solution**: The SQL file includes CREATE TABLE statement. Make sure you run the ENTIRE file, not just INSERT statements.

### Issue: SQL file too large to paste
**Cause**: 7,400 lines is too big for copy-paste

**Solution**: Use the **Upload File** button in SQL Editor instead

### Issue: Still seeing old data
**Cause**: Browser cache or Supabase CDN

**Solution**:
1. Hard refresh: Cmd+Shift+R
2. Or clear browser cache
3. Or wait 1-2 minutes for Supabase CDN

### Issue: Game ends too early
**Cause**: Victory condition not updated

**Solution**: Check reducer.ts has `if (state.currentDay >= 1000)` for victory

### Issue: Not seeing Year 2/3 cards
**Cause**: Phase filtering or requirements not working

**Solution**:
1. Check console for errors
2. Verify cards have correct `phase` field
3. Check `daysToAdvance` values are high enough (45-180 range)

## 📊 What Changed

### New Milestones (4 cards)
- `year1_transition` - Year 1 → Year 2
- `year2_midpoint_review` - Year 2 checkpoint
- `year2_transition` - Year 2 → Year 3
- `year3_applications_intensive` - Final push
- `final_waiting_game` - Pre-decision

### New Year 2 Cards (14 cards)
- Research: Cold email, research groups, conferences, direction
- Skills: Writing, summer planning, citations, collaboration
- Crisis: GPA slump
- Networking: Recommender check-in

### New Year 3 Cards (15 cards)
- Applications: SOP rewrite, interview prep, waiting game
- Decisions: Offer comparison, funding negotiation, campus visits
- Completion: Research statement, thesis defense, scholarships
- Crisis: Dissertation pivot

### Route-Specific Variants (22 cards)
- Year 1: 7 pairs (deadline, budget, CV, recs, scores, schools, interview)
- Year 2: 2 pairs (cold email, research group)
- Year 3: 2 pairs (SOP, interview prep)

## ✅ Success Checklist

After updating, verify:

- [ ] Supabase shows 80 cards
- [ ] Console shows "80 cards" when loading
- [ ] Game progresses to Year 2
- [ ] Game progresses to Year 3
- [ ] Game completes at Day 1000+
- [ ] Agency route shows agency-specific cards
- [ ] DIY route shows DIY-specific cards
- [ ] Year 2 cards appear (research, networking)
- [ ] Year 3 cards appear (SOP, interviews, decisions)
- [ ] Victory screen shows "3-year journey"

## 🎯 Next Steps

After Supabase is updated:

1. **Test locally** with Supabase data:
   ```bash
   bun run src/db/testSupabaseFullGame.ts
   ```

2. **Deploy to Vercel** (if auto-deploy didn't trigger):
   ```bash
   git add .
   git commit -m "feat: add Year 2/Year 3 content (80 cards total)"
   git push
   ```

3. **Monitor deployment**:
   - Check Vercel build logs
   - Test live site
   - Verify Supabase connection

---

**Ready to update?** Follow the steps above and your game will have the full 3-year journey! 🚀
