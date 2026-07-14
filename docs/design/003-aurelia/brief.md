# MonadMon — Creative Redesign #003 (Aurelia)

> 替代 #002-#0021 上轮"漂亮 dashboard"风格。本轮严格走 $frontend-creative
> 的 Awwwards 7 条原则，目标 60/60 自评。

## 1. What

把 MonadMon 当前 7 条路由（`/`、`/mint`、`/train`、`/arena`、`/leaderboard`、
`/profile/[address]`、`/monster/[tokenId]`）从 SaaS-dashboard 视觉提升为
**Awwwards-grade 实验性叙事型 Web**。核心事件是"破壳 / 孵化 / 训练 /
对战"——视觉要把"诞生"的瞬间戏剧化。

## 2. Audience

- Monad 早期采用者：寻找"自己生出来的小生灵"的情感连接
- 设计师 / 收藏者：希望作品具有"相册 + 战利品"质感
- Axie / Axie 玩家：希望"看到自己怪物的故事"

## 3. Primary Action

- 首选：MINT 自己的 Genesis Egg
- 次选：浏览 `/leaderboard` 与 `/profile/[address]`
- 不强制：购买（无市场）

## 4. References（学其语言，不复制）

1. **Awwwards "Site of the Day 2024"** — 全宽 video hero + 大字（无衬线巨型）
2. **A24 电影官网** — display 字体作主体，no marketing copy
3. **Linear homepage** — 不对称、grain texture、抽象渐变
4. **Apple AirPods Pro 产品页** — 大图分层 + 透明 + 慢 motion
5. **Riot Vanguard 皮肤页** — 屏幕比例的 hero + 视频背景 + 类型戏剧化

## 5. Theme — Theme D + B 混合

**Custom — "Aurelia: Living Creature on a High-Tech Chain"**
- Theme D (Future-Tech 3D Particle) 的 motion depth + 抽象 shader hero
- Theme B (Minimal Art Gallery) 的 whitespace + 巨幅 display type
- 保留品牌 accent #7AF0BA 与暗紫 / 深青光晕

### 关键视觉特征
- **type as subject**：display 字号 `clamp(5rem, 14vw, 18rem)`，weight 700，line-height 0.85；
  段落小字是次要主体，hero 文字本身就是图
- **asymmetric grid**：所有 7 个页面均非居中；hero 60/40 split、list 大量 negative
  space、grid 12 列但行跨度 7/3 或 9/3
- **texture**：固定 noise（sVG 滤镜）、混凝土 grain、glow radial
- **motion layers**：
  - R3F particle hero（1400 个 1px 粒子，随鼠标移动，20s 慢速漂移）
  - GSAP ScrollTrigger 滚动触发的 type 解构 / 重组装
  - Framer Motion hover / 进入态
- **3D**：仅在首页与 monster 详情局部；列表页保持 2D 极简
- **大型 SVG/Canvas 装饰**：`AnimatedMonster` 在 hero 与 monster detail 占据视口 50-70%
- **audio off**（spec §9）

## 6. Constraints

- **Tech stack**：Next.js 14 + TypeScript + Tailwind v3 + framer-motion v12
  + GSAP v3 + R3F v9 + drei v10（**已安装**）
- **CI**：保留 contracts / backend / frontend 三门禁；axe 报告 0 serious/critical
- **Backend / 合约**：**不可改动**。继续用 `NEXT_PUBLIC_INDEXER_URL`、`/api/leaderboard`、
  `/api/monsters/owner/:addr`、`/api/monsters/:id`
- **资产**：12 物种 PNG + 3 营销海报 + 1 placeholder 已就位
- **性能预算**：Lighthouse mobile ≥ 90；首屏 LCP < 2.5s；3D 仅在 hero / monster detail 局部
- **字体**：Space Grotesk（display）+ Inter（body）+ JetBrains Mono（地址 / DNA）
  通过 `next/font` 加载
- **保留所有后端与数据形状**：本 PR 是纯视觉 / 体验升级

## 7. Out of scope

- 不重做代币 / 排行榜数据层
- 不重写 E2E 脚本（`scripts/local-e2e.sh` 与 `run-browser-evidence.sh` 已绿）
- 不改 Region 标签
- 不引入新字体（保留现有 GeistVF 作为 fallback）

## 8. Open questions

- 是否引入 GSAP ScrollTrigger 滚动叙事？**是**——首页使用 / 全页面短节奏
- 是否对 `/arena` 引入实时 3D 转盘？**否**——MVP 阶段继续使用 PNG 资产，3D 留到 v1.1
- 是否全屏 hero 视频？**否**——纯 R3F 粒子 + accent 渐变
