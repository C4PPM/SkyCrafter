const workerURL = "https://skycrafter.finbob512.workers.dev/";

// -------------------- Search Player --------------------
async function search(usernameOverride) {
  const username = usernameOverride || document.getElementById("username").value.trim();
  if (!username) return;

  try {
    // 1️⃣ Fetch main player data
    const res = await fetch(`${workerURL}?username=${username}`);
    const data = await res.json();

    document.getElementById("player-data").classList.remove("hidden");

    // 2️⃣ RAW JSON button
    const jsonBtn = document.getElementById("view-json");
    jsonBtn.style.display = "inline-block";
    jsonBtn.onclick = () => {
      const w = window.open();
      w.document.write("<pre>" + JSON.stringify(data, null, 2) + "</pre>");
    };

    // 3️⃣ Update player header
    document.getElementById("player-name").textContent = data.name;
    document.getElementById("player-uuid").textContent = data.uuid ?? "N/A";
    document.getElementById("player-rank").textContent = data.selectedRank ?? "DEFAULT";
    document.getElementById("player-pixel").textContent = data.pixelId ?? "N/A";
    document.getElementById("network-xp").textContent = data.networkExp ?? 0;
    document.getElementById("network-coins").textContent = (data.networkCoins ?? 0).toLocaleString();

// Player skin head
const skinImg = document.getElementById("player-skin");
let uuid = data.uuid ?? ""; // Get UUID from API
uuid = uuid.replace(/-/g, ""); // Remove dashes if present

// If no UUID, fallback to default Steve head
if (!uuid) {
  skinImg.src = "https://crafatar.com/avatars/8667ba71b85a4004af54457a9734eed7?size=64&overlay";
} else {
  skinImg.src = `https://crafatar.com/avatars/${uuid}?size=64&overlay`;
}

// Ensure alt text
skinImg.alt = `${data.name ?? "Player"} Skin Head`;

    }

    // 5️⃣ Update login info
    document.getElementById("first-login").textContent = data.firstLogin ? new Date(data.firstLogin).toLocaleString() : "N/A";
    document.getElementById("last-login").textContent = data.lastLogin ? new Date(data.lastLogin).toLocaleString() : "N/A";
    document.getElementById("last-server").textContent = data.lastServer ?? "N/A";

    // 6️⃣ Account info
    document.getElementById("account-lang").textContent = data.language ?? "N/A";
    document.getElementById("account-chat").textContent = data.privateMessages ?? "ALL";
    document.getElementById("account-friends").textContent = data.friendRequests ?? "ALL";
    document.getElementById("account-pms").textContent = data.privateMessages ?? "ALL";

    // 7️⃣ Create SkyBlock profiles section
    createProfileTabs(data);

  } catch (e) {
    console.error(e);
    alert("Failed to fetch player data.");
  }
}

// -------------------- Format Seconds --------------------
function fmt(seconds) {
  const h = Math.floor(seconds / 3600);
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}

// -------------------- Profiles Section --------------------
function createProfileTabs(data) {
  const profiles = data.stats?.skyBlock?.profiles || {};
  const container = document.getElementById("profile-tabs");
  const content = document.getElementById("profile-content");
  container.innerHTML = "";
  content.innerHTML = "";

  const profileIds = Object.keys(profiles);
  const selectedProfileId = data.stats?.skyBlock?.profileId;

  profileIds.forEach(id => {
    const p = profiles[id];
    const btn = document.createElement("button");
    btn.classList.add("profile-btn");
    if (id === selectedProfileId) btn.classList.add("active");

    // Button content: Cute Name, Star if selected, Profile ID
    btn.innerHTML = `
      <div class="profile-name">${p.cuteName}</div>
      ${id === selectedProfileId ? '<div class="profile-star">★ Current</div>' : ''}
      <div class="profile-id">${id.slice(0,8)}...</div>
    `;

    btn.onclick = async () => {
      [...container.children].forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      await loadProfile(p.profileId);
    };

    container.appendChild(btn);

    // Load default selected profile
    if (id === selectedProfileId) loadProfile(p.profileId);
  });
}

// -------------------- Load Profile Stats --------------------
async function loadProfile(profileId) {
  const content = document.getElementById("profile-content");
  content.innerHTML = "Loading profile stats...";

  try {
    // Fetch SkyBlock profile stats
    const res = await fetch(`${workerURL}/v1/skyblock/profile/${profileId}`);
    const profileData = await res.json();

    // Update minimal profile info
    content.innerHTML = `
      <p>Profile ID: ${profileData.profileId}</p>
      <p>Cute Name: ${profileData.cuteName}</p>
    `;

    // Update stats cards
    updateStatsCards(profileData);

  } catch (e) {
    console.error(e);
    content.innerHTML = "Failed to load profile stats.";
  }
}

// -------------------- Update Stats Cards --------------------
function updateStatsCards(profileData) {
  // Playtime
  const playtime = profileData.playtimePerGame || {};
  const total = profileData.totalPlaytime || 0;
  document.getElementById("playtime-total").textContent = fmt(total);
  document.getElementById("playtime-skyblock").textContent = fmt(playtime.SKYBLOCK || 0);
  document.getElementById("playtime-hub").textContent = fmt(playtime.HUB || 0);
  document.getElementById("playtime-limbo").textContent = fmt(playtime.LIMBO || 0);

  // SkyBlock Level
  document.getElementById("sb-level").textContent = profileData.skyBlockLevel ?? 0;
  document.getElementById("sb-exp").textContent = profileData.skyBlockExp ?? 0;

  // Combat Stats
  document.getElementById("combat-kills").textContent = profileData.combat?.kills ?? 0;
  document.getElementById("combat-deaths").textContent = profileData.combat?.deaths ?? 0;
  document.getElementById("combat-max-dmg").textContent = profileData.combat?.maxDamage ?? 0;
  document.getElementById("combat-max-crit").textContent = profileData.combat?.maxCrit ?? 0;
}

// -------------------- Footer Link --------------------
document.getElementById("link-c4ppm").onclick = () => search("C4PPM");
