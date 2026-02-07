<!DOCTYPE html>
<html>
<head>
  <title>SkyCrafter</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #0f172a;
      color: #e5e7eb;
      padding: 20px;
    }
    h1, h2 {
      margin-bottom: 8px;
    }
    input, button {
      padding: 10px;
      font-size: 16px;
    }
    button { cursor: pointer; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }
    .card {
      background: #020617;
      border-radius: 8px;
      padding: 15px;
    }
    .label {
      color: #94a3b8;
      font-size: 13px;
    }
    .value {
      font-size: 18px;
      font-weight: bold;
    }
    .small {
      font-size: 14px;
    }
    .bar {
      background: #1e293b;
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 4px;
    }
    .bar > div {
      background: #38bdf8;
      height: 100%;
    }
  </style>
</head>
<body>

<h1>SkyCrafter</h1>

<input id="username" placeholder="Enter username">
<button onclick="search()">Search</button>

<div id="content"></div>

<script>
async function search() {
  const u = document.getElementById("username").value.trim()
  if (!u) return
  const res = await fetch(`https://skycrafter.finbob512.workers.dev/?username=${u}`)
  render(await res.json())
}

function render(d) {
  const cakes = d.sbClaimedCakes ?? []
  const highestCake = cakes.length ? Math.max(...cakes) : "None"
  const totalPT = d.totalPlaytime
  const skyPT = d.playtimePerGame?.SKYBLOCK ?? 0

  document.getElementById("content").innerHTML = `
    <div class="grid">

      <div class="card">
        <h2>Player</h2>
        <div class="value">${d.name}</div>
        <div class="small">UUID: ${d.uuid.slice(0, 8)}…</div>
        <div class="small">Language: ${d.language}</div>
        <div class="small">First Login: ${new Date(d.firstLogin).toLocaleDateString()}</div>
        <div class="small">Last Login: ${new Date(d.lastLogin).toLocaleString()}</div>
      </div>

      <div class="card">
        <h2>Network</h2>
        <div class="label">Rank</div>
        <div class="value" style="color:${rankColor(d.selectedRank)}">${d.selectedRank}</div>
        <div class="label">Level</div>
        <div class="value">${Math.floor(d.networkExp / 10000)}</div>
        <div class="label">Coins</div>
        <div class="value">${d.networkCoins.toLocaleString()}</div>
      </div>

      <div class="card">
        <h2>SkyBlock</h2>
        <div class="label">Profiles</div>
        <div class="value">${Object.values(d.stats.skyBlock.profiles).map(p=>p.cuteName).join(", ")}</div>
        <div class="label">Cakes Claimed</div>
        <div class="value">${cakes.length}</div>
        <div class="small">Highest Cake: ${highestCake}</div>
      </div>

      <div class="card">
        <h2>Playtime</h2>
        <div class="label">Total</div>
        <div class="value">${fmt(totalPT)}</div>
        <div class="label">SkyBlock</div>
        <div class="small">${fmt(skyPT)}</div>
        <div class="bar"><div style="width:${(skyPT/totalPT)*100}%"></div></div>
      </div>

      <div class="card">
        <h2>Cosmetics</h2>
        <div class="small">Pet: ${pet(d.selectedPet)}</div>
        <div class="small">Particle: ${d.selectedParticle}</div>
        <div class="small">Gadget: ${d.selectedGadget}</div>
        <div class="small">Collectables Unlocked: ${d.unlockedCollectables.length}</div>
      </div>

      <div class="card">
        <h2>Music</h2>
        <div class="small">Playing: ${d.playingMusic}</div>
        <div class="small">Queue: ${d.musicQueue.length} tracks</div>
        <div class="small">Shuffle: ${d.musicShuffle ? "On" : "Off"}</div>
      </div>

    </div>
  `
}

function fmt(s) {
  const h = Math.floor(s / 3600)
  const d = Math.floor(h / 24)
  return `${d}d ${h % 24}h`
}

function rankColor(r) {
  return {
    MODERATOR:"#3b82f6",
    ADMIN:"#f97316",
    SENIOR_MODERATOR:"#1e40af",
    HELPER:"#2dd4bf",
    TRAINEE:"#facc15",
    GOLD:"#fbbf24",
    DIAMOND:"#7dd3fc",
    EMERALD:"#22c55e"
  }[r] ?? "#e5e7eb"
}

function pet(p) {
  return {
    pet_snowman:"☃️ Snowman",
    pet_cat:"🐱 Cat",
    pet_zombie:"🧟 Zombie",
    pet_creeper:"💥 Creeper"
  }[p] ?? "🐾 " + (p ?? "None")
}
</script>

</body>
</html>
