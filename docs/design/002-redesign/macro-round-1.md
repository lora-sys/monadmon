# Macro Round 1 — Layout skeleton

## 1. Global system

- **Page shell**：将 `Header` 重做为 64px 高粘性极简顶栏；左侧 `🥚/MonadMon` 文字 logo（accent）；右侧 wallet 按钮 + 汉堡。
- **Page background**：双层——底层 `#0A0C13` 纯色，上层 18% opacity 噪点 + accent radial gradient 极淡（HSL 158 60 30% 0.05）。
- **Grid system**：12 列，列间距 24px。hero 使用 7 / 5 split。
- **Type scale**（clamp）：
  - display 6xl: clamp(4rem, 9vw, 12rem) — hero
  - display 5xl: clamp(3rem, 7vw, 8rem) — section
  - heading 2xl: clamp(1.75rem, 3vw, 2.5rem)
  - body base 0.95rem
  - mono：保留 0.85rem 用于地址
- **Spacing rhythm**：section vertical 12rem（hero 20rem）；block 2rem。
- **Motion tokens**：
  - entry：0.6s ease-out, stagger 60ms
  - hover：220ms ease-in-out
  - parallax hero：滚动 -8% 位移

## 2. Page-by-page skeleton

### `/` Landing

1. **Hero (100vh)**
   - 左侧 65%：`MYTHIC CREATURES BORN ON-CHAIN` (display 6xl, weight 700)。副标题 1.5 行。CTA `MINT YOUR GENESIS EGG`（accent bg，scale 1 → 1.05 on hover）+ 次 CTA `EXPLORE LEAGUE`（ghost）。
   - 右侧 35%：怪物 1.05 倍放大漂浮（`y: [-12, 12]`，2.6s loop），背后 1.2x 偏移 accent 光晕（mix-blend-screen），底部 0.3s 闪烁 "Token #0000/12,000" mono 标签。
2. **Species Codex**（horizontal marquee）：12 物种"连连看"展示 + 鼠标悬停暂停 + 显示 species name + element。
3. **"How a creature awakens"** 5-step 数字索引（01 → 05）叙事，左文字右怪物动画预览（每步一帧 static）。
4. **"The Arena"**：3 行战斗描述（Fire/Elemental/Evolution），全宽 60vh 视频/海报背景。
5. **"The League"**：实时排行榜预览，6 行表格 + 浮起的"see full leaderboard" ghost 按钮。
6. **Footer**：暗色，4 列小字，social 链接 + 版权。

### `/mint` Mint

- 全宽 80vh hero："Your egg awaits." + 旋转 3D 占位精灵（CSS perspective transform rotateY）。
- 下方：mint 进度 + 已用 stats 卡片 + 成功/失败动效。

### `/train` Training

- 左侧：怪物立绘（450x450）+ cooldown ring（SVG circle stroke-dasharray）。
- 右侧：stats 增长曲线（CSS sparkline）、训练按钮（accent glow）、6h cooldown 进度环。

### `/arena` Arena

- 双列：左 "Create challenge" 表单（accent bordered input），右 "Recent battles" 时间倒序卡片网格。

### `/leaderboard` Live League

- 全宽表格：4 列 Rank / Trainer / Wins / XP，header 行 0.6 opacity，tbody 行 1px line。
- 每行：rank 圆形 medal（gold/silver/bronze），hover 整行 accent 背景，address monospace + 悬浮 full address tooltip。

### `/profile/[address]` Showroom

- 顶部：地址巨幅 display + monster count + "Showing 12 most recent" tag。
- 主体：species 卡片网格（3 列 desktop / 2 列 mobile），每卡悬停怪物 scale + element glow。

### `/monster/[tokenId]` Creature detail

- 左 60%：怪物 768x768 立绘，2.4s "breath" 循环（scale 1 → 1.015）+ accent halo 呼吸。
- 右 40%：dna / element / level / xp / battle 统计 + 操作按钮（train, go to arena）。

## 3. Type

- display: **Space Grotesk 700**（保留现有 GeistVF 作为 fallback，CSS load Space Grotesk via `next/font`）
- body: Inter 400
- mono: JetBrains Mono（保留现有 GeistMonoVF）

## 4. Anti-patterns to avoid

- ❌ "Header → Hero → 3 Cards → Features → Footer"
- ❌ centered hero
- ❌ 4+ 同样的 card grid
- ❌ 每个 section 都 hero-style 大图
