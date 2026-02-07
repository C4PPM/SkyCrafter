const workerURL = "https://skycrafter.finbob512.workers.dev/";

// Search
async function search(usernameOverride) {
  const username = usernameOverride || document.getElementById("username").value.trim();
  if (!username) return;

  try {
    const res = await fetch(`${workerURL}?username=${username}`);
    const data = await res.json();

    document.getElementById("player-data").classList.remove("hidden");

    // RAW JSON button
    const jsonBtn = document.getElementById("view-json");
    jsonBtn.style.display = "inline-block";
    jsonBtn.onclick = () => {
      const w = window.open();
      w.document.write("<pre>" + JSON.stringify(data, null, 2) + "</pre>");
    };

    // Header info
    document.getElementById("player-name").textContent = data.name;
    document.getElementById("player-uuid").textContent = data.uuid ?? "N/A";
    document.getElementById("player-rank").textContent = data.selectedRank ?? "DEFAULT";
    document.getElementById("player-pixel").textContent = data.pixelId ?? "N/A";
    document.getElementById("network-xp").textContent = data.networkExp ?? 0;
    document.getElementById("network-coins").textContent = data.networkCoins?.toLocaleString() ?? 0;

    // Skin head
    document.getElementById("player-skin").src = `https://crafatar.com/avatars/${data.uuid}?size=64&overlay`;

    // Playtime
    const total = data.totalPlaytime || 0;
    const sky = data.playtimePerGame?.SKYBLOCK || 0;
    const hub = data.playtimePerGame?.HUB || 0;
    document.getElementById("playtime-total").textContent = fmt(total);
    document.getElementById("playtime-skyblock").textContent = fmt(sky);
    document.getElementById("playtime-hub").textContent = fmt(hub);

    // Login info
    document.getElementById("first-login").textContent = data.firstLogin ? new Date(data.firstLogin).toLocaleString() : "N/A";
    document.getElementById("last-login").textContent = data.lastLogin ? new Date(data.lastLogin).toLocaleString() : "N/A";
    document.getElementById("last-server").textContent = data.lastServer ?? "N/A";

    // Placeholder SkyBlock Level / Combat / Account Info
    document.getElementById("sb-level").textContent = data.stats?.skyBlock?.level ?? 0;
    document.getElementById("sb-exp").textContent = data.stats?.skyBlock?.exp ?? 0;
    document.getElementById("combat-kills").textContent = data.stats?.combat?.kills ?? 0;
    document.getElementById("combat-deaths").textContent = data.stats?.combat?.deaths ?? 0;
    document.getElementById("combat-max-dmg").textContent = data.stats?.combat?.maxDamage ?? 0;
    document.getElementById("combat-max-crit").textContent = data.stats?.combat?.maxCrit ?? 0;
    document.getElementById("account-lang").textContent = data.language ?? "N/A";
    document.getElementById("account-chat").textContent = data.privateMessages ?? "ALL";
    document.getElementById("account-friends").textContent = data.friendRequests ?? "ALL";
    document.getElementById("account-pms").textContent = data.privateMessages ?? "ALL";

    // Profiles Tabs
    createProfileTabs(data);

  } catch (e) {
    console.error(e);
    alert("Failed to fetch player data.");
  }
}

// Format seconds into d h
function fmt(s) {
  const h = Math.floor(s/3600);
  const d = Math.floor(h/24);
  return `${d}d ${h%24}h`;
}

// Profiles Tabs
function createProfileTabs(data) {
  const profiles = data.stats?.skyBlock?.profiles || {};
  const container = document.getElementById("profile-tabs");
  const content = document.getElementById("profile-content");
  container.innerHTML = "";
  content.innerHTML = "";

  Object.keys(profiles).forEach((id, idx) => {
    const p = profiles[id];
    const btn = document.createElement("button");
    btn.textContent = p.cuteName;
    btn.onclick = () => {
      [...container.children].forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadProfile(p);
    };
    container.appendChild(btn);
    if (idx === 0) btn.click();
  });
}

// Load profile
function loadProfile(profile) {
  const content = document.getElementById("profile-content");
  content.innerHTML = `
    <p>Profile ID: ${profile.profileId}</p>
    <p>Cute Name: ${profile.cuteName}</p>
    <p>Coins: ${profile.coins ?? 0}</p>
    <p>Cakes Claimed: ${profile.sbClaimedCakes?.length ?? 0}</p>
    <p>Playtime: ${profile.totalPlaytime ? fmt(profile.totalPlaytime) : "0d 0h"}</p>
  `;
}

// Footer C4PPM click
document.getElementById("link-c4ppm").onclick = () => search("C4PPM");
