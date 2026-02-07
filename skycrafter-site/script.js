// Your Cloudflare Worker URL
const workerURL = "https://skycrafter.finbob512.workers.dev/";

// Entry point when searching
async function search() {
  const username = document.getElementById("username").value.trim();
  if (!username) return;
  
  const res = await fetch(`${workerURL}?username=${username}`);
  const data = await res.json();
  
  renderPage(data);
}

// Main page renderer
function renderPage(data) {
  document.getElementById("content").innerHTML = `
    <div class="grid">
      ${renderPlayerCard(data)}
      ${renderNetworkCard(data)}
      ${renderProfilesCard(data)}
      ${renderCosmeticsCard(data)}
      ${renderCakesCard(data)}
      ${renderPlaytimeCard(data)}
      ${renderMusicCard(data)}
    </div>
  `;
}

/* ------------------- Sections ------------------- */

// Player Overview
function renderPlayerCard(d) {
  return `
    <div class="card">
      <h2>Player</h2>
      <div class="value">${d.name}</div>
      <div class="small">UUID: ${d.uuid.slice(0,8)}…</div>
      <div class="small">Rank: <span style="color:${rankColor(d.selectedRank)}">${d.selectedRank}</span></div>
      <div class="small">First Login: ${new Date(d.firstLogin).toLocaleDateString()}</div>
      <div class="small">Last Login: ${new Date(d.lastLogin).toLocaleString()}</div>
      <div class="small">Last Server: ${d.lastServer}</div>
    </div>
  `;
}

// Network Stats
function renderNetworkCard(d) {
  return `
    <div class="card">
      <h2>Network</h2>
      <div class="label">Level</div>
      <div class="value">${Math.floor(d.networkExp/10000)}</div>
      <div class="label">Coins</div>
      <div class="value">${d.networkCoins.toLocaleString()}</div>
    </div>
  `;
}

// SkyBlock Profiles
function renderProfilesCard(d) {
  return `
    <div class="card">
      <h2>SkyBlock Profiles</h2>
      <div class="value">${Object.values(d.stats.skyBlock.profiles).map(p => p.cuteName).join(", ")}</div>
    </div>
  `;
}

// Cosmetics
function renderCosmeticsCard(d) {
  return `
    <div class="card">
      <h2>Cosmetics</h2>
      <div class="small">Pet: ${pet(d.selectedPet)}</div>
      <div class="small">Particle: ${d.selectedParticle}</div>
      <div class="small">Gadget: ${d.selectedGadget}</div>
      <div class="small">Collectables Unlocked: ${d.unlockedCollectables.length}</div>
    </div>
  `;
}

// Cakes / Progress
function renderCakesCard(d) {
  const cakes = d.sbClaimedCakes || [];
  const highest = cakes.length ? Math.max(...cakes) : "None";
  return `
    <div class="card">
      <h2>Cakes & Progress</h2>
      <div class="small">Cakes Claimed: ${cakes.length}</div>
      <div class="small">Highest Cake: ${highest}</div>
    </div>
  `;
}

// Playtime
function renderPlaytimeCard(d) {
  const total = d.totalPlaytime;
  const sky = d.playtimePerGame?.SKYBLOCK || 0;
  return `
    <div class="card">
      <h2>Playtime</h2>
      <div class="label">Total</div>
      <div class="value">${fmt(total)}</div>
      <div class="label">SkyBlock</div>
      <div class="small">${fmt(sky)}</div>
      <div class="bar"><div style="width:${(sky/total)*100}%"></div></div>
    </div>
  `;
}

// Music
function renderMusicCard(d) {
  return `
    <div class="card">
      <h2>Music</h2>
      <div class="small">Playing: ${d.playingMusic}</div>
      <div class="small">Queue: ${d.musicQueue.length} tracks</div>
      <div class="small">Shuffle: ${d.musicShuffle ? "On":"Off"}</div>
    </div>
  `;
}

/* ------------------- Helpers ------------------- */

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
  }[r] ?? "#e5e7eb";
}

function pet(p) {
  return {
    pet_snowman:"☃️ Snowman",
    pet_cat:"🐱 Cat",
    pet_zombie:"🧟 Zombie",
    pet_creeper:"💥 Creeper"
  }[p] ?? "🐾 " + (p ?? "None");
}

function fmt(s) {
  const h = Math.floor(s/3600);
  const d = Math.floor(h/24);
  return `${d}d ${h%24}h`;
}
