# MonadMon（魔灵梦）

> **Monad 上的第一批生灵。**
> 捕捉、培养、对战——它们永远属于你。

MonadMon 是一款部署在 **Monad**（EVM 兼容 L1）上的链上生物养成与 PvP 对战游戏。玩家连接钱包后铸一个 **创世蛋**，再孵化成绑定到 ERC-721 的 **精灵**（配 64 位 DNA），进入由确定性规则驱动的 1v1 竞技场，胜利会通过链下索引器实时上榜。

本仓库包含完整的 MVP：

- **智能合约** — Foundry（Solidity 0.8.24 + OpenZeppelin v5）
- **链下索引器** — TypeScript + viem + better-sqlite3 + Hono
- **前端** — Next.js 14 + wagmi v2 + RainbowKit v2 + framer-motion v12
- **端到端驱动** — fresh Anvil 双钱包流程 + axe-core WCAG 2.0/2.1
  A/AA 可视化证据

| 层级 | 技术栈 |
| --- | --- |
| 合约 | Solidity 0.8.24、OpenZeppelin v5、Foundry（forge / cast / anvil） |
| 索引器 | TypeScript、viem、better-sqlite3、Hono |
| 前端 | Next.js 14、React 18、TypeScript strict、Tailwind v3、framer-motion v12 |
| Web3 | wagmi v2、viem v2、RainbowKit v2 |
| 测试 / E2E | forge test、vitest、agent-browser、axe-core |
| CI | GitHub Actions（contracts / backend / frontend） |

## 玩法

一次完整流程 **五步，五分钟**：

1. **连接** 钱包。RainbowKit 支持 MetaMask、Rabby 与任意 WalletConnect 客户端。
2. **铸** 一个创世蛋。每个钱包仅可铸造一次，永久归该地址所有。
3. **孵化**。链上 `block.prevrandao` + 蛋 tokenId 推导出物种（1–12）与 64 位 DNA——结果确定性、不可复制。
4. **训练**。每 6 小时 一次冷却，获得 +30 XP 与 +2 ATK；XP ≥ level × 100 升级。
5. **对战**。Alice 发起挑战 → Bob 接战 → 链上确定性裁决 → 胜者上排行榜。

### 物种（12）× 阶段（4）

孵化揭示物种 + 1–3 阶段。每个物种有唯一的元素（Fire / Water / Nature / Electric）、定位（attacker / tank / support / crit striker）、稀有度（Common / Rare / Legendary）。
12 物种 × 4 阶段 × 4 DNA 变体 × 2 来源 = 384 种视觉配置，全部由链上熵确定性生成。

### 元素克制

Fire > Nature > Water > Electric > Fire。战斗伤害公式与稀有度种子分布共用同一张表。完整数学见 `docs/design/battle-formula.md`。

### 战斗结果

`Battle.acceptAndResolve` 读取双方精灵、按区块推导出种子、模拟最多 50 回合攻击（含元素克制与 12% 暴击），并 emit `ChallengeResolved` 携带 winnerTokenId、loserTokenId、draw 与 turn 数。链下索引器在 1 个区块确认后立即上榜。

## 路由

| 路径 | 描述 |
| --- | --- |
| `/` | 五段式首页：hero + 12 物种 marquee + 01–05 孵化步骤 + 全幅 arena + 排行榜预览 |
| `/mint` | 一蛋一钱包铸造 + 影院感 3D 蛋壳 |
| `/train` | 6 小时冷却训练 + XP 进度条 |
| `/arena` | 发起挑战表单 + 最近战斗记录 |
| `/leaderboard` | 实时排行榜，含 loading / empty / unavailable 三态 |
| `/profile/[address]` | 由索引器 owner 端点驱动的公开展示页 |
| `/monster/[tokenId]` | bigint 精度 DNA、属性面板、breath 动画 |

## 本地开发

### 前置依赖

- Node 20+（建议 `.nvmrc`）
- Foundry（`curl -L https://foundry.paradigm.xyz | bash`）
- Anvil 包含在 Foundry 中
- Python 3（仅本地 E2E 驱动使用）

### 安装

```bash
git clone https://github.com/lora-sys/monadmon.git
cd monadmon
cd contracts && forge install foundry-rs/forge-std --no-git && forge install OpenZeppelin/openzeppelin-contracts@v5.1.0 --no-git && cd ..
cd frontend && npm install --no-audit --no-fund
cd ../backend && npm install --no-audit --no-fund
```

### 运行确定性双钱包流程

`scripts/local-e2e.sh` 启动一个全新的 Anvil，部署合约，用两个 Anvil 账户
（Alice = deployer，Bob = account #1）走完 mint → hatch → train →
challenge → accept-and-resolve 全流程，断言排行榜反映了战斗结果，再重启
索引器证明重启幂等，并让栈保持运行以便浏览器检查：

```bash
# 任选空闲端口，下面以 8545 / 8101 / 8100 为例
ANVIL_PORT=8545 RPC_URL=http://127.0.0.1:8545 \
BACKEND_PORT=8101 FRONTEND_PORT=8100 \
KEEP_RUNNING=1 ./scripts/local-e2e.sh
```

脚本会自动检测已占用端口并切换。`KEEP_RUNNING=1` 让栈在脚本退出后仍可访问；
省略它即一次性执行。

### 打开站点

脚本输出栈 URL 后，用浏览器打开 `http://127.0.0.1:8100/`。RainbowKit 会在
header 提供 MetaMask / Rabby 等选项；选一个并连接到本地 Anvil RPC。

### 抓取可访问性证据

```bash
BASE_URL=http://127.0.0.1:8100 ./scripts/run-browser-evidence.sh
```

脚本会在桌面（1440×900）与移动（390×844）下渲染排行榜的
populated / empty / unavailable 三种状态，以及 monster 详情和两个 profile，
并对每一页注入 `axe-core`（WCAG 2.0/2.1 A/AA）。产物落到
`docs/evidence/0021/screenshots/` 与 `docs/evidence/0021/test-results/axe-*.json`。

## 测试

| 套件 | 命令 | 数量 |
| --- | --- | --- |
| 合约 | `cd contracts && forge test -q` | 47 |
| 后端 | `cd backend && npm test` | 9 |
| 前端 | `cd frontend && npm test` | 14 |
| 后端类型检查（含 test） | `cd backend && npm run typecheck` | 全绿 |
| 前端类型检查 | `cd frontend && npm run typecheck` | 全绿 |
| 前端 lint | `cd frontend && npm run lint` | 干净 |
| 前端生产构建 | `cd frontend && npm run build` | 9 路由 |
| 后端生产构建 | `cd backend && npm run build` | 全绿 |
| 合约 fmt | `cd contracts && forge fmt --check` | 干净 |

三个 CI 任务（contracts / backend / frontend）由
`.github/workflows/ci.yml` 在每次 push / PR 时运行。

## 项目结构

```
monadmon/
├── AGENTS.md                # L0 协议（AI agent 操作合约）
├── CLAUDE.md                # AGENTS.md 镜像版
├── CONTRIBUTING.md          # issue-first 工作流
├── DEMO.md                  # 5 分钟演示脚本
├── ENGINEERING.md           # 风格、依赖、审查规则
├── LICENSE                  # MIT
├── PROJECT_STATUS.md        # 实时看板
├── README.md                # 英文 README
├── README.zh.md             # 中文 README
├── TESTING.md               # 测试策略
├── backend/                 # Phase 2 索引器（TS + Hono + SQLite）
├── contracts/               # Foundry 工作区
├── docs/                    # product / arch / design / decisions / evidence
├── frontend/                # Next.js 14 app router
├── memory/                  # 项目 + 教训
├── scripts/                 # local-e2e.sh, run-browser-evidence.sh
├── sessions/                # 单次会话日志
└── skills/                  # 项目本地 skill 扩展
```

## 架构概览

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Next.js 14  │───▶│ Monad RPC    │───▶│  Contracts   │
│  + wagmi/viem │    │ (viem JSON-  │    │  - MonsterNFT│
│  + RainbowKit│    │  RPC)        │    │  - Genesis   │
└──────┬───────┘    └──────────────┘    │  - Battle    │
       │                                │  - IRandomSrc│
       │                                └──────┬───────┘
       │ events via logs                      │ events
       │                                      ▼
       │                              ┌──────────────┐
       │                              │   Indexer    │
       │                              │ TS + Hono +  │
       ▼                              │   SQLite     │
  read /api/leaderboard              └──────┬───────┘
  read /api/monsters/owner/:addr           ▲
  read /api/monsters/:id                  │
                                           │
                                  每 250 ms 轮询
                                  等 0 确认立即上榜
```

完整数据流、事件 schema、安全模型见 `docs/architecture/`。

## 环境变量

| 变量 | 默认 | 用途 |
| --- | --- | --- |
| `RPC_URL` | `http://127.0.0.1:8545` | 后端 → Anvil / Monad RPC |
| `PORT` (backend) | `3001` | Hono HTTP 端口 |
| `MONSTER_NFT_ADDRESS` | （每次运行设置） | 索引器读取 `EggMinted` / `MonsterHatched` / `Trained` |
| `BATTLE_ADDRESS` | （每次运行设置） | 索引器读取 `ChallengeCreated` / `ChallengeResolved` |
| `CONFIRMATIONS` | `5` | 持久化前等待 N 个确认（防重组） |
| `POLL_INTERVAL_MS` | `2000` | RPC 轮询频率 |
| `DB_PATH` | `data/monadmon.db` | 索引器 SQLite 文件 |
| `NEXT_PUBLIC_INDEXER_URL` | `http://127.0.0.1:3001` | 前端 → 索引器 |
| `NEXT_PUBLIC_MONAD_RPC_URL` | （testnet） | 前端 → 钱包 RPC |
| `NEXT_PUBLIC_MONSTER_NFT_ADDRESS` | （每次运行设置） | 前端读取 `getMonster` / `ownerOf` |
| `NEXT_PUBLIC_BATTLE_ADDRESS` | （每次运行设置） | 前端读取 `getChallenge` / `challengeCount` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | _空_ | 设置后启用完整 RainbowKit（含 WalletConnect）；空则仅使用浏览器注入钱包 |
| `NEXT_PUBLIC_GENESIS_MINTER_ADDRESS` | （每次运行设置） | Mint 页的便利地址，可选 |

`scripts/local-e2e.sh` 会自动写入所有上述变量。
`backend/.env.example` 与 `frontend/.env.example` 是仓库中已签入的模板。

## 路线图（MVP 之后）

- #24 — 部署到 Monad testnet（需用户出资钱包）
- 市场 / 交易
- Item NFT 集成（ERC-1155 框架已发布）
- 探索玩法
- 公会与锦标赛
- 观战 / 回放（含 3D 管道）

## 贡献

`AGENTS.md` 是仓库内 AI agent 的真实操作合约。
`CONTRIBUTING.md` 是写给人类贡献者的相同工作流。两者都基于 **Issue-first** 模式：

1. 选择或开启一个 Issue。
2. 在 worktree 中切分支（`git worktree add -b fix/<id>-<slug>`）。
3. 写测试 + 证据，提交实现。
4. 开启 PR；通过五角色冷审（bug-hunter、behavior-reviewer、architecture-reviewer、security-reviewer、ui-reviewer）与三道 CI 门禁。
5. 人类评审通过后 squash-merge。

## 许可

[MIT](./LICENSE)

## 致谢

- **品牌 & 设计语言**：高科技链上的活物（见 `docs/design/brand.md`）。
- **物种素材**：12 物种 × 4 阶段由 `scripts/generate-monsters.mjs` 通过 Pollinations.ai（`flux`）生成，无需 API key，确定性种子。
- **营销海报**：`frontend/public/assets/marketing/` 下三张 1402×1122 PNG（`poster-hero.png` / `poster-arena.png` / `poster-team.png`）。
- **字体**：Space Grotesk（标题）+ Inter（正文）+ JetBrains Mono（地址 / DNA），通过 `next/font` 在生产中加载。
