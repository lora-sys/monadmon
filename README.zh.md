# MonadMon（魔灵梦）

> **Monad 上的第一批生灵。**
> 捕捉、培养、对战——它们永远属于你。

MonadMon 是一款完全运行在链上的养成 + PvP 对战游戏，部署在 Monad 测试网。
每位玩家铸造一枚「创世之蛋」，孵化出 12 种精灵中的一种（普通 50% / 稀有 30% / 传说 20%），
然后培养进化、与其他玩家对战——所有状态都在 Monad 上可验证。

<table>
<tr>
  <td rowspan="4" width="60%"><img src="frontend/public/assets/monsters/1/stage3.png" alt="炎狐 第三阶——烈焰之狐" width="100%"/></td>
  <td align="center" width="20%"><img src="frontend/public/assets/monsters/1/stage3.png" alt="火系代表" width="100%"/><br/><sub>🔥 火</sub></td>
</tr>
<tr><td align="center"><img src="frontend/public/assets/monsters/6/stage3.png" alt="水系代表" width="100%"/><br/><sub>💧 水</sub></td></tr>
<tr><td align="center"><img src="frontend/public/assets/monsters/9/stage3.png" alt="自然系代表" width="100%"/><br/><sub>🌱 自然</sub></td></tr>
<tr><td align="center"><img src="frontend/public/assets/monsters/12/stage3.png" alt="电系代表" width="100%"/><br/><sub>⚡ 电</sub></td></tr>
</table>

---

## 12 种精灵

四大元素，每元素三种。稀有度由链上确定性随机数决定
（`block.prevrandao + tokenId + msg.sender`）；同样的输入永远孵化出同样的精灵。

| 元素 | 普通 (50%) | 普通 (50%) | 普通 (50%) | 稀有 (30%) | 稀有 (30%) | 传说 (20%) |
|---|---|---|---|---|---|---|
| 🔥 **火** | 炎狐 | 熔岩龟 | — | 烈焰鸟 | — | — |
| 💧 **水** | 水灵犬 | 泡泡鱼 | — | — | — | 海龙 |
| 🌱 **自然** | 草兔 | 苔藓巨人 | — | — | 森林鹿 | — |
| ⚡ **电** | 雷猫 | 电气鼠 | — | 雷狼 | — | — |

*每只精灵从第 1 阶开始，20 级时进化到第 2 阶，40 级时进化到第 3 阶。第 0 阶是蛋。*

---

## 精灵图鉴

每种精灵都有独特的栖息地、性格和三个签名招式，用于链上对战公式。图鉴是游戏内收集界面的真源。

### 火系

#### 炎狐 · 普通 · 第1阶=炎狐 · 第2阶=烈焰狐 · 第3阶=烈焰之狐
![炎狐 第1阶](frontend/public/assets/monsters/1/stage1.png)

- **栖息地：** 燃烧山脉的火山崖和熔岩河。
- **性格：** 脾气火爆但极其忠诚。好奇心总跑在谨慎前面。
- **招式：** *炎尾*（物理，+ATK）· *熔岩迸发*（特殊，目标 2 回合灼烧）· *炎之冲锋*（状态，+1 SPD）。

#### 熔岩龟 · 普通 · 第2阶=熔岩龟 · 第3阶=火山龟
![熔岩龟 第1阶](frontend/public/assets/monsters/2/stage1.png)

- **栖息地：** 燃野深处的硫磺泉。
- **性格：** 耐心慢热，背上扛着大地的重量。
- **招式：** *熔岩之壳*（状态，2 回合减半所受伤害）· *喷发*（特殊，无视目标 30% DEF）· *石化之肤*（状态，+1 DEF）。

#### 烈焰鸟 · 稀有 · 第2阶=凤凰 · 第3阶=日炎凤凰
![烈焰鸟 第1阶](frontend/public/assets/monsters/3/stage1.png)

- **栖息地：** 圣火山顶上高空热气流。
- **性格：** 俏皮敏捷，但对自己的天空极其有领地意识。
- **招式：** *俯冲*（物理，+1 暴击）· *火翼*（特殊，攻击一条线所有敌人）· *灼啄*（物理，目标灼烧时 +20% 伤害）。

### 水系

#### 水灵犬 · 普通 · 第2阶=潮汐猎犬 · 第3阶=大洋狼
![水灵犬 第1阶](frontend/public/assets/monsters/4/stage1.png)

- **栖息地：** 歌唱海岸的浅潮池和暖暗礁。
- **性格：** 忠诚热情，总用明亮的眼睛仰望你。
- **招式：** *水之嚎*（状态，全队 +1 ATK）· *潮汐之波*（特殊，攻击所有敌人）· *水之脉动*（物理，目标湿润时 +10% 伤害）。

#### 泡泡鱼 · 普通 · 第2阶=珊瑚巨灵 · 第3阶=暗礁泰坦
![泡泡鱼 第1阶](frontend/public/assets/monsters/5/stage1.png)

- **栖息地：** 珊瑚礁和温暖的热带洋流。
- **性格：** 开朗圆润，受惊时吐出一面泡泡墙。
- **招式：** *泡泡护盾*（状态，+2 DEF）· *水之喷射*（物理，无视目标 25% DEF）· *压力炮*（特殊，低 HP 时 +30% 伤害）。

#### 海龙 · 传说 · 第2阶=潮汐巨蟒 · 第3阶=利维坦
![海龙 第1阶](frontend/public/assets/monsters/6/stage1.png)

- **栖息地：** 光照不到的深海深渊。
- **性格：** 暴怒迟缓，一旦被激怒就毁天灭地。古老到难以想象。
- **招式：** *潮汐碾压*（物理，对 HP 低于 50% 的目标 +1.5×）· *深渊咆哮*（状态，目标 ATK -1，2 回合）· *利维坦之波*（特殊，攻击所有敌人，无视属性克制）。

### 自然系

#### 草兔 · 普通 · 第2阶=森林兔 · 第3阶=翠玉之兔
![草兔 第1阶](frontend/public/assets/monsters/7/stage1.png)

- **栖息地：** 阳光斑驳的林间草甸和空地。
- **性格：** 害羞但合群，总在朋友间蹦跳，分享发现的东西。
- **招式：** *叶愈*（状态，恢复 25% HP）· *跳踢*（物理，+1 暴击）· *三叶投掷*（特殊，10% 概率让目标入睡）。

#### 苔藓巨人 · 普通 · 第2阶=石巨人 · 第3阶=远古林
![苔藓巨人 第1阶](frontend/public/assets/monsters/8/stage1.png)

- **栖息地：** 长满百年苔藓的古老森林。
- **性格：** 慢热但可靠，背上长着整片小树林。
- **招式：** *苔藓之墙*（状态，+2 DEF，2 回合）· *藤蔓束缚*（特殊，目标 SPD -1，2 回合）· *远古之握*（物理，无视目标 50% DEF）。

#### 森林鹿 · 稀有 · 第2阶=原始雄鹿 · 第3阶=世界树
![森林鹿 第1阶](frontend/public/assets/monsters/9/stage1.png)

- **栖息地：** 阳光穿入的森林空地。
- **性格：** 迅捷优雅，鹿角引导着自然之力。
- **招式：** *森林步*（状态，+1 SPD，+1 闪避）· *鹿角冲锋*（物理，目标先攻时 +25% 伤害）· *世界树之佑*（状态，每回合恢复 5% HP，持续 3 回合）。

### 电系

#### 雷猫 · 普通 · 第2阶=暴风猫 · 第3阶=雷虎
![雷猫 第1阶](frontend/public/assets/monsters/10/stage1.png)

- **栖息地：** 发电 站和高压输电走廊。
- **性格：** 冷酷独立，永远走自己的路。轻微触碰就火花四溅。
- **招式：** *伏特之箭*（物理，15% 概率让目标麻痹 1 回合）· *静电之爪*（物理，对湿润目标附加伤害）· *雷之冲刺*（状态，+2 SPD，2 回合）。

#### 电气鼠 · 普通 · 第2阶=雷鼠 · 第3阶=闪电贤者
![电气鼠 第1阶](frontend/public/assets/monsters/11/stage1.png)

- **栖息地：** 电箱和老旧机房。
- **性格：** 小巧，神经质，速度惊人。靠面包屑和电活着。
- **招式：** *火花咬*（物理，以 60% 威力命中两次）· *电缆陷阱*（状态，目标 SPD -1，2 回合）· *电舌*（特殊，20% 概率让目标电击）。

#### 雷狼 · 稀有 · 第2阶=暴风牙首领 · 第3阶=雷之真神
![雷狼 第1阶](frontend/public/assets/monsters/12/stage1.png)

- **栖息地：** 永雷笼罩的暴雨山顶。
- **性格：** 孤狼，极其独立。统御着天穹。
- **招式：** *雷之嚎*（状态，全队 +1 ATK）· *闪电之牙*（物理，暴击 +15%）· *暴风牙一击*（特殊，对处于雨/雷中的目标 +1.5×）。

---

## 完整进化：12 种 × 4 阶段

每只精灵都走相同的生命周期。四个阶段展示从「未孵化的蛋」到「幼体」到「进化形态」再到「飞升形态」的视觉进展。

### 火系

<table>
<tr>
  <th align="center">炎狐</th>
  <td align="center"><img src="frontend/public/assets/monsters/1/stage0.png" width="100"/><br/>蛋</td>
  <td align="center"><img src="frontend/public/assets/monsters/1/stage1.png" width="100"/><br/>炎狐</td>
  <td align="center"><img src="frontend/public/assets/monsters/1/stage2.png" width="100"/><br/>烈焰狐</td>
  <td align="center"><img src="frontend/public/assets/monsters/1/stage3.png" width="100"/><br/>烈焰之狐</td>
</tr>
<tr>
  <th align="center">熔岩龟</th>
  <td align="center"><img src="frontend/public/assets/monsters/2/stage0.png" width="100"/><br/>蛋</td>
  <td align="center"><img src="frontend/public/assets/monsters/2/stage1.png" width="100"/><br/>熔岩龟</td>
  <td align="center"><img src="frontend/public/assets/monsters/2/stage2.png" width="100"/><br/>熔岩龟</td>
  <td align="center"><img src="frontend/public/assets/monsters/2/stage3.png" width="100"/><br/>火山龟</td>
</tr>
<tr>
  <th align="center">烈焰鸟</th>
  <td align="center"><img src="frontend/public/assets/monsters/3/stage0.png" width="100"/><br/>蛋</td>
  <td align="center"><img src="frontend/public/assets/monsters/3/stage1.png" width="100"/><br/>烈焰鸟</td>
  <td align="center"><img src="frontend/public/assets/monsters/3/stage2.png" width="100"/><br/>凤凰</td>
  <td align="center"><img src="frontend/public/assets/monsters/3/stage3.png" width="100"/><br/>日炎凤凰</td>
</tr>
</table>

### 水系

<table>
<tr>
  <th align="center">水灵犬</th>
  <td align="center"><img src="frontend/public/assets/monsters/4/stage0.png" width="100"/><br/>蛋</td>
  <td align="center"><img src="frontend/public/assets/monsters/4/stage1.png" width="100"/><br/>水灵犬</td>
  <td align="center"><img src="frontend/public/assets/monsters/4/stage2.png" width="100"/><br/>潮汐猎犬</td>
  <td align="center"><img src="frontend/public/assets/monsters/4/stage3.png" width="100"/><br/>大洋狼</td>
</tr>
<tr>
  <th align="center">泡泡鱼</th>
  <td align="center"><img src="frontend/public/assets/monsters/5/stage0.png" width="100"/><br/>蛋</td>
  <td align="center"><img src="frontend/public/assets/monsters/5/stage1.png" width="100"/><br/>泡泡鱼</td>
  <td align="center"><img src="frontend/public/assets/monsters/5/stage2.png" width="100"/><br/>珊瑚巨灵</td>
  <td align="center"><img src="frontend/public/assets/monsters/5/stage3.png" width="100"/><br/>暗礁泰坦</td>
</tr>
<tr>
  <th align="center">海龙</th>
  <td align="center"><img src="frontend/public/assets/monsters/6/stage0.png" width="100"/><br/>蛋</td>
  <td align="center"><img src="frontend/public/assets/monsters/6/stage1.png" width="100"/><br/>海龙</td>
  <td align="center"><img src="frontend/public/assets/monsters/6/stage2.png" width="100"/><br/>潮汐巨蟒</td>
  <td align="center"><img src="frontend/public/assets/monsters/6/stage3.png" width="100"/><br/>利维坦</td>
</tr>
</table>

### 自然系

<table>
<tr>
  <th align="center">草兔</th>
  <td align="center"><img src="frontend/public/assets/monsters/7/stage0.png" width="100"/><br/>蛋</td>
  <td align="center"><img src="frontend/public/assets/monsters/7/stage1.png" width="100"/><br/>草兔</td>
  <td align="center"><img src="frontend/public/assets/monsters/7/stage2.png" width="100"/><br/>森林兔</td>
  <td align="center"><img src="frontend/public/assets/monsters/7/stage3.png" width="100"/><br/>翠玉之兔</td>
</tr>
<tr>
  <th align="center">苔藓巨人</th>
  <td align="center"><img src="frontend/public/assets/monsters/8/stage0.png" width="100"/><br/>蛋</td>
  <td align="center"><img src="frontend/public/assets/monsters/8/stage1.png" width="100"/><br/>苔藓巨人</td>
  <td align="center"><img src="frontend/public/assets/monsters/8/stage2.png" width="100"/><br/>石巨人</td>
  <td align="center"><img src="frontend/public/assets/monsters/8/stage3.png" width="100"/><br/>远古林</td>
</tr>
<tr>
  <th align="center">森林鹿</th>
  <td align="center"><img src="frontend/public/assets/monsters/9/stage0.png" width="100"/><br/>蛋</td>
  <td align="center"><img src="frontend/public/assets/monsters/9/stage1.png" width="100"/><br/>森林鹿</td>
  <td align="center"><img src="frontend/public/assets/monsters/9/stage2.png" width="100"/><br/>原始雄鹿</td>
  <td align="center"><img src="frontend/public/assets/monsters/9/stage3.png" width="100"/><br/>世界树</td>
</tr>
</table>

### 电系

<table>
<tr>
  <th align="center">雷猫</th>
  <td align="center"><img src="frontend/public/assets/monsters/10/stage0.png" width="100"/><br/>蛋</td>
  <td align="center"><img src="frontend/public/assets/monsters/10/stage1.png" width="100"/><br/>雷猫</td>
  <td align="center"><img src="frontend/public/assets/monsters/10/stage2.png" width="100"/><br/>暴风猫</td>
  <td align="center"><img src="frontend/public/assets/monsters/10/stage3.png" width="100"/><br/>雷虎</td>
</tr>
<tr>
  <th align="center">电气鼠</th>
  <td align="center"><img src="frontend/public/assets/monsters/11/stage0.png" width="100"/><br/>蛋</td>
  <td align="center"><img src="frontend/public/assets/monsters/11/stage1.png" width="100"/><br/>电气鼠</td>
  <td align="center"><img src="frontend/public/assets/monsters/11/stage2.png" width="100"/><br/>雷鼠</td>
  <td align="center"><img src="frontend/public/assets/monsters/11/stage3.png" width="100"/><br/>闪电贤者</td>
</tr>
<tr>
  <th align="center">雷狼</th>
  <td align="center"><img src="frontend/public/assets/monsters/12/stage0.png" width="100"/><br/>蛋</td>
  <td align="center"><img src="frontend/public/assets/monsters/12/stage1.png" width="100"/><br/>雷狼</td>
  <td align="center"><img src="frontend/public/assets/monsters/12/stage2.png" width="100"/><br/>暴风牙首领</td>
  <td align="center"><img src="frontend/public/assets/monsters/12/stage3.png" width="100"/><br/>雷之真神</td>
</tr>
</table>

---

## 一局游戏怎么玩

```
连接钱包  →  铸造蛋（每钱包 1 枚）
       ↓
    孵化  →  物种 + DNA + 属性（链上，由 prevrandao 决定）
       ↓
    培养  →  +30 XP，+2 ATK（6 小时冷却）
       ↓
    升级  →  20 级进入第 2 阶，40 级进入第 3 阶
       ↓
    对战  →  选对手 → 接受 → 链上确定性公式结算
       ↓
   排行榜  →  按胜场排名（实时索引器）
```

### 对战公式（确定性）
每个回合：选择更快的精灵，计算伤害 = `ATK × 属性克制 × 随机(0.85-1.15) × 暴击(1.5× 12%概率)`，然后 `伤害 ×= (1 - DEF/(DEF+200))`。HP 先归零者负。50 回合上限 → 平局。

### 属性克制

| 攻击方 \ 防御方 | 🔥 火 | 💧 水 | 🌱 自然 | ⚡ 电 |
|---|---|---|---|---|
| 🔥 **火** | 1.0× | 0.5× | 1.5× | 1.0× |
| 💧 **水** | 1.5× | 1.0× | 0.5× | 0.5× |
| 🌱 **自然** | 0.5× | 1.5× | 1.0× | 0.5× |
| ⚡ **电** | 1.0× | 1.5× | 0.5× | 1.0× |

---

## 技术栈

| 层 | 选择 |
|---|---|
| 智能合约 | Solidity 0.8.24 · OpenZeppelin v5.1.0 · Foundry |
| 随机数 | `block.prevrandao`（可通过 `IRandomSource` 切换） |
| 前端 | Next.js 14 (App Router) · wagmi v2 · viem v2 · RainbowKit v2 · Tailwind v3 · framer-motion v11 |
| 索引器 | TypeScript · Hono · better-sqlite3 · viem |
| 美术 | Pollinations.ai `flux` 模型，12 物种 × 4 阶段 = 48 张主图 |
| CI | GitHub Actions：forge fmt + test，npm typecheck + lint + build |
| 测试 | 48 个合约测试通过 · 90% 行覆盖 · 稀有度 1 万次 fuzz |

---

## 自己跑一遍

```bash
# 1. 在 https://faucet.monad.xyz 拿测试网 MON
# 2. clone + install
git clone https://github.com/lora-sys/monadmon
cd monadmon
cd contracts && forge install && forge test
cd ../frontend && npm install
cd ../backend && npm install

# 3. 部署到测试网
cd ../contracts
DEPLOYER_PRIVATE_KEY=0x... forge script script/Deploy.s.sol \
  --rpc-url https://testnet-rpc.monad.xyz --broadcast

# 4. 把 5 个地址贴到 frontend/.env.local，然后：
cd ../frontend && npm run dev          # http://localhost:3000
cd ../backend && PORT=3002 npm start    # 索引器 :3002
```

完整演示走读在 [DEMO.md](./DEMO.md)（英文）。

---

## 项目状态

- ✅ 全部 14 个 Phase-1 issues 已关闭
- ✅ 9 个 PR 已合并，每个都经过对抗式审查
- ✅ 每次 push CI 绿
- ✅ 本地 Anvil 端到端已跑通（cast + 7 张 agent-browser 截图）
- ⏳ 测试网部署待用户钱包（[#24](https://github.com/lora-sys/monadmon/issues/24)）

完整状态表见 [PROJECT_STATUS.md](./PROJECT_STATUS.md)。
英文原版见 [README.md](./README.md)。

## 协议

MIT — 见 [LICENSE](./LICENSE)。
