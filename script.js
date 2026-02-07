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

//Bazaar
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
      ${renderServerStatusCard()}  <!-- NEW -->
      ${renderBazaarSection()}     <!-- NEW -->
    </div>
  `;

  // Load Bazaar & Server Status asynchronously
  fetchServerStatus();
  fetchBazaarItems();
  createProfileTabs(data);
}

//server status
// Placeholder card
function renderServerStatusCard() {
  return `
    <div class="card" id="server-status-card">
      <h2>Server Status</h2>
      <div class="small" id="server-status">Loading...</div>
      <div class="small" id="online-players"></div>
    </div>
  `;
}

// Fetch server status from Worker API
async function fetchServerStatus() {
  try {
    const res = await fetch(workerURL + "/v1/network/status");
    const status = await res.json();
    const card = document.getElementById("server-status-card");
    if (!card) return;

    card.querySelector("#server-status").textContent = `Status: ${status.online ? "🟢 Online" : "🔴 Offline"}`;
    card.querySelector("#online-players").textContent = `Players Online: ${status.players ?? "N/A"}`;
  } catch (e) {
    console.error(e);
  }
}

// Placeholder card
function renderBazaarSection() {
  return `
    <div class="card" id="bazaar-card">
      <h2>Bazaar</h2>
      <div id="bazaar-items">Loading items...</div>
    </div>
  `;
}

// Fetch all Bazaar items
async function fetchBazaarItems() {
  try {
    const res = await fetch(workerURL + "/v1/resources/skyblock/bazaar/items");
    const items = await res.json();

    const container = document.getElementById("bazaar-items");
    if (!container) return;

    // Show first 10 items as an example
    container.innerHTML = items.slice(0,10).map(item => `
      <div class="small">
        <strong>${item.name}</strong> - Price: ${item.price ?? "N/A"}
      </div>
    `).join("");
  } catch (e) {
    console.error(e);
  }
}

function createProfileTabs(data) {
  const profiles = data.stats.skyBlock.profiles;
  const profileIds = Object.keys(profiles);

  const container = document.createElement("div");
  container.classList.add("card");
  container.innerHTML = `<h2>SkyBlock Profiles</h2> <div id="profile-tabs"></div>`;

  const tabs = document.createElement("div");
  tabs.style.display = "flex";
  tabs.style.gap = "5px";
  const content = document.createElement("div");
  content.style.marginTop = "10px";

  profileIds.forEach((id, index) => {
    const profile = profiles[id];
    const tab = document.createElement("button");
    tab.textContent = profile.cuteName;
    tab.onclick = () => loadProfile(id, content);
    tabs.appendChild(tab);

    // Load first profile by default
    if (index === 0) loadProfile(id, content);
  });

  container.querySelector("#profile-tabs").appendChild(tabs);
  container.querySelector("#profile-tabs").appendChild(content);
  document.getElementById("content").appendChild(container);
}

// Load a profile's detailed info
async function loadProfile(profileId, container) {
  try {
    container.innerHTML = "Loading...";
    const res = await fetch(`${workerURL}/v1/skyblock/profile/${profileId}`);
    const profileData = await res.json();

    container.innerHTML = `
      <div class="small">Profile ID: ${profileId}</div>
      <div class="small">Cute Name: ${profileData.cuteName ?? "N/A"}</div>
      <div class="small">Coins: ${profileData.coins ?? "0"}</div>
      <div class="small">Cakes Claimed: ${profileData.sbClaimedCakes?.length ?? 0}</div>
      <div class="small">Playtime: ${profileData.totalPlaytime ? fmt(profileData.totalPlaytime) : "0d 0h"}</div>
    `;
  } catch (e) {
    console.error(e);
    container.innerHTML = "Failed to load profile.";
  }
}
