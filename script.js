const workerURL = "https://skycrafter.finbob512.workers.dev/";

async function search() {
  const username = document.getElementById("username").value.trim();
  if (!username) return;

  try {
    const res = await fetch(`${workerURL}?username=${username}`);
    if (!res.ok) throw new Error("Player not found");
    const data = await res.json();

    // Show RAW JSON button
    const jsonBtn = document.getElementById("view-json");
    jsonBtn.style.display = "inline-block";
    jsonBtn.onclick = () => window.open(`${workerURL}?username=${username}`, "_blank");

    document.getElementById("player-container").classList.remove("hidden");

    renderPlayer(data);
    renderProfiles(data);
    renderStats(data);

  } catch (e) {
    console.error(e);
    alert("Player not found or failed to load.");
    document.getElementById("player-container").classList.add("hidden");
    document.getElementById("stats-grid").innerHTML = "";
  }
}

// Render Player Info
function renderPlayer(data) {
  document.getElementById("player-name").textContent = data.name;
  document.getElementById("player-uuid").textContent = data.uuid.replace(/-/g, "");
  document.getElementById("player-rank").textContent = data.selectedRank;
  document.getElementById("player-pixel").textContent = data.pixelId;
  document.getElementById("network-xp").textContent = Math.floor(data.networkExp || 0);
  document.getElementById("network-coins").textContent = (data.networkCoins || 0).toLocaleString();

  // Player skin head using Crafatar
  const skinImg = document.getElementById("player-skin");
  const uuid = (data.uuid || "").replace(/-/g, "");
  skinImg.src = uuid
    ? `https://crafatar.com/avatars/${uuid}?size=64&overlay`
    : "https://crafatar.com/avatars/8667ba71b85a4004af54457a9734eed7?size=64&overlay";
  skinImg.alt = `${data.name} Skin Head`;
}

// Profiles
function renderProfiles(data) {
  const profileContainer = document.getElementById("profile-tabs");
  const profileContent = document.getElementById("profile-content");
  profileContainer.innerHTML = "";
  profileContent.innerHTML = "";

  const profiles = Object.values(data.stats.skyBlock.profiles);
  document.getElementById("profiles-count").textContent = profiles.length;

  profiles.forEach(profile => {
    const btn = document.createElement("div");
    btn.className = "profile-btn";
    if (profile.profileId === data.stats.skyBlock.profileId) btn.classList.add("active");

    btn.innerHTML = `
      <div class="profile-name">${profile.cuteName}</div>
      <div class="profile-star">${profile.profileId === data.stats.skyBlock.profileId ? "★" : ""}</div>
      <div class="profile-id">${profile.profileId.slice(0,8)}...</div>
    `;

    btn.onclick = () => {
      document.querySelectorAll(".profile-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadProfile(profile.profileId);
    };

    profileContainer.appendChild(btn);
  });

  loadProfile(data.stats.skyBlock.profileId);
}

// Load profile stats
async function loadProfile(profileId) {
  const container = document.getElementById("profile-content");
  container.innerHTML = "Loading...";

  try {
    const res = await fetch(`${workerURL}/v1/skyblock/profile/${profileId}`);
    const profileData = await res.json();

    // Playtime
    const playtime = profileData.playtimePerGame || {};
    document.getElementById("playtime-total").textContent = formatTime(profileData.totalPlaytime || 0);
    document.getElementById("playtime-skyblock").textContent = formatTime(playtime.SKYBLOCK || 0);
    document.getElementById("playtime-hub").textContent = formatTime(playtime.HUB || 0);
    document.getElementById("playtime-limbo").textContent = formatTime(playtime.LIMBO || 0);

    // Login
    document.getElementById("first-login").textContent = new Date(profileData.firstLogin).toLocaleString();
    document.getElementById("last-login").textContent = new Date(profileData.lastLogin).toLocaleString();
    document.getElementById("last-server").textContent = profileData.lastServer;

    // SkyBlock Level
    document.getElementById("sb-level").textContent = profileData.skyBlockLevel || 0;
    document.getElementById("sb-exp").textContent = profileData.skyBlockExp || 0;

    // Combat Stats
    document.getElementById("combat-kills").textContent = profileData.combatStats?.totalKills || 0;
    document.getElementById("combat-deaths").textContent = profileData.combatStats?.totalDeaths || 0;
    document.getElementById("combat-max-dmg").textContent = profileData.combatStats?.maxDamage || 0;
    document.getElementById("combat-max-crit").textContent = profileData.combatStats?.maxCrit || 0;

    // Account Info
    document.getElementById("account-lang").textContent = profileData.language || "N/A";
    document.getElementById("account-chat").textContent = profileData.privateMessages || "ALL";
    document.getElementById("account-friends").textContent = profileData.friendRequests || "ALL";
    document.getElementById("account-pms").textContent = profileData.privateMessages || "ALL";

    container.innerHTML = ""; // clear after loading
  } catch (e) {
    console.error(e);
    container.innerHTML = "Failed to load profile.";
  }
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}
