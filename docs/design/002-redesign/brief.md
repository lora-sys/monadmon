# MonadMon — Creative Redesign Brief

> 编号 002；基于 PR #34 的可工作实现做 Awwwards 级视觉重设计。**不重写合约或后端**。
> 品牌名：MonadMon。复用已有 12 物种资产、3 张营销海报、Brand "The first living creatures on Monad"。

## 1. What

将 MonadMon 现有 7 条路由（`/`、`/mint`、`/train`、`/arena`、`/leaderboard`、`/profile/[address]`、`/monster/[tokenId]`）从功能化 dashboard 风格改造成生物 / 孵化 / 对战的创意叙事型 Web。核心事件是"破壳 + 训练 + 战斗"——视觉要把"诞生"的瞬间戏剧化。

## 2. Audience

- Monad 早期采用者：寻找"自己生出来的小生灵"的情感连接
- Axie / Axie 玩家：希望"看到自己怪物的故事"
- 设计师 / 收藏者：希望作品具有"相册 + 战利品"质感

## 3. Primary Action

- 首选：MINT 自己的 Genesis Egg
- 次选：浏览 `/leaderboard` 与 `/profile/[address]`
- 不强制：购买（无市场）

## 4. References

不复制，只学其语言：

1. **Awwwards** — "Awwwards Site of the Day 2024"集合：含 Asymmetric grid、巨型 display type、grain texture、scroll-driven timeline
2. **Apple AirPods Pro product page** — product hero 中的"分层 + 透明 + 运动"
3. **PUMA Eza Mega Nu** — 鲜艳橙 + 复古实验字体（Y2K 美学）
4. **Riot Vanguard 皮肤页** — 视频循环 + 屏息大图 + type drama
5. **Linear homepage** — 干净的 mono 标题、抽象渐变、克制 motion

## 5. Theme

**Custom — "Living Creature on a High-Tech Chain"**。
基于 Theme C（Retro Acid）的色调饱和度 + Theme D（Future 3D）的 motion depth + 现有 accent #7AF0BA 的品牌连续性。

- 黑底 + 暗紫到深青的光晕
- 巨幅 display type（无衬线变体）作为视觉主体
- 屏幕分屏的"对联式"布局：左 60% 文字叙事，右 40% 怪物实体 + 暗色视频
- 触发：scroll-tied "evolution" 进度条沿左轴
- Hover：怪物 1.03 倍 scale、accent 辉光
- 极轻 1% 噪点纹理覆盖整页

## 6. Constraints

- **Tech stack（固定）**：Next.js 14 + TypeScript + Tailwind v3 + framer-motion v12 + GSAP + @react-three/fiber + drei。已安装 framer-motion，可加 GSAP / R3F。
- **CI**：保留 contracts / backend / frontend 三门禁；axe 报告 0 serious/critical。
- **Backend / 合约**：**不可改动**。可继续使用 `NEXT_PUBLIC_INDEXER_URL`、`/api/leaderboard`、`/api/monsters/owner/:addr`、`/api/monsters/:id`。
- **资产**：12 物种 PNG + 3 营销海报 + 1 placeholder 已就位，可直接消费。
- **性能预算**：Lighthouse mobile ≥ 90；首屏 LCP < 2.5s；3D 仅在 hero / monster detail 局部，列表用 SVG / 静态 PNG。

## 7. Out of scope

- 不重做代币 / 排行榜数据层
- 不重写 E2E 脚本（`scripts/local-e2e.sh` 与 `run-browser-evidence.sh` 已绿）
- 不改 Region 标签
- 不引入新字体（保留现有 GeistVF + GeistMonoVF）

## 8. Open questions

- 是否引入 GSAP ScrollTrigger？视真实交互决定——优先 Framer Motion + CSS transitions，避免 LCP 阻塞。
- 是否对 `/arena` 引入实时 3D 转盘？**否**——MVP 阶段继续使用 PNG 资产，3D 留到 v1.1。
