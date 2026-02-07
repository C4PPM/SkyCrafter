const workerURL = "https://skycrafter.finbob512.workers.dev/";

let lastSearch = 0;
const SEARCH_COOLDOWN = 3000; // 3 seconds

// ---- SEARCH FUNCTION ----
async function search() {
  const now = Date.now();
  if (now - lastSearch < SEARCH_COOLDOWN) {
    alert("Please wait a few seconds before searching again.");
    return;
  }
  lastSearch = now;

  const username = document.getElementById("username").value.trim();
  if (!username) return;

  try {
    const res = await fetch(`${workerURL}?username=${username}`);
    if (!res.ok) throw new Error("Player not found");

    const data = await res.json();

    // Basic validation
    if (!data.name || !data.uuid) throw new Error("Invalid data");

    // Show player container
    document.getElementById("player-container").classList.remove("hidden");

    // Show RAW JSON button
    const jsonBtn = document.getElementById("view-json");
    jsonBtn.style.display = "inline-block";
    jsonBtn.onclick = () => window.open(`${workerURL}?username=${username}`, "_blank");

    renderPlayer(data);
    renderProfiles(data);

  } catch (e) {
    console.error(e);
    document.getElementById("player-container").classList.add("hidden");
    document.getElementById("profile-tabs").innerHTML = "";
    document.getElementById("profile-content").innerHTML = "";
    document.getElementById("stats-grid").innerHTML = "";
    alert("Player not found or failed to load.");
  }
}

// ---- PLAYER INFO ----
function renderPlayer(data) {
  document.getElementById("player-name").textContent = data.name || "Unknown";
  document.getElementById("player-uuid").textContent = (data.uuid || "").replace(/-/g, "");
  document.getElementById("player-rank").textContent = data.selectedRank || "DEFAULT";
  document.getElementById("player-pixel").textContent = `Pixel ID: ${data.pixelId || "N/A"}`;
  document.getElementById("network-xp").textContent = Math.floor(data.networkExp || 0);
  document.getElementById("network-coins").textContent = (data.networkCoins || 0).toLocaleString();

  // Load player head image from Crafatar
  const skinImg = document.getElementById("player-skin");
  const uuid = (data.uuid || "").replace(/-/g, "");
  skinImg.src = uuid
    ? `https://crafatar.com/avatars/${uuid}?size=64&overlay`
    : "https://crafatar.com/avatars/8667ba71b85a4004af54457a9734eed7?size=64&overlay";
  skinImg.alt = `${data.name || "Player"} Skin Head`;
}

// ---- SKYBLOCK PROFILES ----
function renderProfiles(data) {
  const profileContainer = document.getElementById("profile-tabs");
  const profileContent = document.getElementById("profile-content");
  profileContainer.innerHTML = "";
  profileContent.innerHTML = "";

  const profiles = Object.values(data.stats?.skyBlock?.profiles || []);
  document.getElementById("profiles-count").textContent = profiles.length;

  if (profiles.length === 0) {
    profileContent.textContent = "No SkyBlock profiles available.";
    return;
  }

  const activeProfileId = data.stats?.skyBlock?.profileId || profiles[0]?.profileId;

  profiles.forEach(profile => {
    const btn = document.createElement("div");
    btn.className = "profile-btn";
    if (profile.profileId === activeProfileId) btn.classList.add("active");

    btn.innerHTML = `
      <div class="profile-name">${profile.cuteName || "Unknown"}</div>
      <div class="profile-star">${profile.profileId === activeProfileId ? "★" : ""}</div>
      <div class="profile-id">${profile.profileId?.slice(0, 8) || ""}...</div>
    `;

    btn.onclick = () => {
      document.querySelectorAll(".profile-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      loadProfile(profile.profileId);
    };

    profileContainer.appendChild(btn);
  });

  loadProfile(activeProfileId);
}

// ---- LOAD PROFILE DETAILS ----
async function loadProfile(profileId) {
  const container = document.getElementById("profile-content");
  container.innerHTML = "Loading profile stats...";

  try {
    const res = await fetch(`${workerURL}/v1/skyblock/profile/${profileId}`);
    if (!res.ok) throw new Error("Failed to fetch profile");
    const profileData = await res.json();

    const memberData = Object.values(profileData.members || {})[0] || {};

    container.innerHTML = `
      <div class="profile-grid">
        <div class="stat-card"><h4>Playtime</h4>
          <p>Total: ${formatTime(profileData.playtimes?.total || 0)}</p>
          <p>SkyBlock: ${formatTime(profileData.playtimes?.SKYBLOCK || 0)}</p>
          <p>Hub: ${formatTime(profileData.playtimes?.HUB || 0)}</p>
        </div>

        <div class="stat-card"><h4>Slayer & Combat</h4>
          <p>Slayer Kills: ${memberData.slayerData?.killedSlayer || 0}</p>
          <p>Max Damage: ${memberData.maxDamage || 0}</p>
          <p>Max Crit: ${memberData.maxCritDamage || 0}</p>
        </div>

        <div class="stat-card"><h4>Coins & Skills</h4>
          <p>Coin Purse: ${memberData.coinPurse || 0}</p>
          <p>Level: ${memberData.level || 0}</p>
          <p>Exp: ${memberData.exp || 0}</p>
          <p>Unique Pets: ${memberData.uniquePets?.length || 0}</p>
        </div>
      </div>
    `;
  } catch (e) {
    console.error(e);
    container.innerHTML = "Failed to load profile.";
  }
}

// ---- HELPERS ----
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const d = Math.floor(h / 24);
  return `${d}d ${h % 24}h`;
}
