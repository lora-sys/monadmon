# Battle Formula

Deterministic, reproducible, simple. Verifiable by replaying from on-chain data.

## Inputs
- `attacker`: Monster struct of attacker.
- `defender`: Monster struct of defender.
- `seed`: bytes32 from `block.prevrandao` at battle block.

## Turn order
```
firstActor = attacker.spd >= defender.spd ? attacker : defender
secondActor = (firstActor == attacker) ? defender : attacker
```

## Per-turn damage
```
effectiveness = typeChart[attacker.element][defender.element]
                // 1.0 normal, 1.5 super effective, 0.5 resisted

base = attacker.atk * 1.0
rand = 0.85 + (uint256(seed) % 31) / 100.0   // 0.85..1.15
crit = ((uint256(seed) >> 8) % 100) < 12 ? 1.5 : 1.0

raw = base * effectiveness * rand * crit
defMit = max(0.1, 1.0 - defender.def / (defender.def + 200.0))
damage = max(1, floor(raw * defMit))
```

## Type chart
```
                Defender
                Fire  Water  Nature  Electric
Attacker Fire    1.0    0.5    1.5     1.0
         Water   1.5    1.0    0.5     1.0
         Nature  0.5    1.5    1.0     1.0
         Electric 1.0  1.5    0.5     1.0
```

Wait — this is wrong. Type chart direction matters. We define `typeChart[attacker][defender]`:

|           | Fire def | Water def | Nature def | Electric def |
|-----------|----------|-----------|------------|--------------|
| Fire atk  | 1.0      | 0.5       | 1.5        | 1.0          |
| Water atk | 1.5      | 1.0       | 0.5        | 1.0          |
| Nature atk | 0.5     | 1.5       | 1.0        | 0.5          |
| Electric atk | 1.0   | 1.5       | 0.5        | 1.0          |

Wait again — the original brief said:
- Fire beats Nature, weak to Water.
- Water beats Fire, weak to Electric.
- Nature beats Water, weak to Fire.
- Electric beats Water, weak to Nature.

So the correct matrix (attacker → defender):
- Fire → Water: 0.5 (Fire weak to Water)
- Fire → Nature: 1.5 (Fire beats Nature)
- Water → Fire: 1.5 (Water beats Fire)
- Water → Electric: 0.5 (Water weak to Electric)
- Nature → Fire: 0.5 (Nature weak to Fire)
- Nature → Water: 1.5 (Nature beats Water)
- Electric → Nature: 0.5 (Electric weak to Nature)
- Electric → Water: 1.5 (Electric beats Water)

That's a clean 4-cycle: Fire → Nature → Water → Electric → Fire (clockwise). 1.5 super, 0.5 resisted, 1.0 neutral.

```
typeChart = [
  // defender:        Fire  Water Nature Electric
  /* Fire atk */     [ 1.0,  0.5,   1.5,   1.0  ],
  /* Water atk */    [ 1.5,  1.0,   0.5,   1.0  ],
  /* Nature atk */   [ 0.5,  1.5,   1.0,   1.0  ],
  /* Electric atk */ [ 1.0,  1.5,   0.5,   1.0  ],
]
```

(Notice Electric is weak to Nature, not strong — keeps the cycle Fire→Nature→Water→Electric→Fire clean.)

## End condition
- Battle ends when one side's `hp` reaches 0.
- Cap at 50 turns to prevent infinite loops. If 50 turns pass with both alive, the higher-HP monster wins; ties broken by higher SPD.

## Rewards
- Winner: `+50 XP`, `+1 battlesWon`.
- Loser: `+10 XP`, `+1 battlesLost`.
- Both monsters' stats unchanged otherwise (no HP loss persisted on-chain for MVP; battle is a snapshot).

## Why this formula
- Deterministic from `(state, seed)` — replayable.
- Pure functions — easy to test.
- Small surface — golden-vector tests cover the matrix.
