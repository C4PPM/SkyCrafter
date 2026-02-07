const workerURL = "https://your-worker-url.workers.dev"; // restore your worker URL here

const searchBtn = document.getElementById("search-btn");
const usernameInput = document.getElementById("username-input");

searchBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (!username) return alert("Please enter a username.");
  fetchPlayer(username);
});

async function fetchPlayer(username) {
  try {
    const res = await fetch(`${workerURL}?username=${username}`);
    if (!res.ok) throw new Error("Player not found");
    const data = await res.json();

    document.getElementById("player-info").classList.remove("hidden");
    document.getElementById("profiles-section").classList.remove("hidden");
    document.getElementById("stats-section").classList.remove("hidden");

    // Player info
    document.getElementById("player-username").textContent = data.username;
    document.getElementById("player-uuid").textContent = data.uniqueId || "";
    document.getElementById("player-rank").textContent = data.rank || "DEFAULT";
    document.getElementById("player-pixel-id").textContent = `Pixel ID: ${data.pixelId || ""}`;
    document.getElementById("network-xp").textContent = `Network XP: ${data.networkXp || 0}`;
    document.getElementById("network-coins").textContent = `Network Coins: ${data.networkCoins || 0}`;

    // Player head
    document.getElementById("player-head-img").src = `https://craftersmc.net/api/skins/head/${username}`;

    // Profiles
    const profilesButtons = document.getElementById("profiles-buttons");
    profilesButtons.innerHTML = "";
    const profiles = data.skyblockProfiles || [];
    document.getElementById("profile-count").textContent = profiles.length;
    profiles.forEach(profile => {
      const btn = document.createElement("div");
      btn.classList.add("profile-btn");
      if (profile.current) btn.classList.add("current");
      btn.innerHTML = `<strong>${profile.cuteName}</strong><br>${profile.id}`;
      btn.addEventListener("click", () => {
        alert(`You clicked profile ${profile.cuteName}`);
        // Update stats display for this profile here
      });
      profilesButtons.appendChild(btn);
    });

    // Stats
    document.getElementById("playtime-total").textContent = data.playtime?.total || "0h";
    document.getElementById("playtime-skyblock").textContent = data.playtime?.skyblock || "0h";
    document.getElementById("playtime-hub").textContent = data.playtime?.hub || "0h";
    document.getElementById("first-login").textContent = data.firstLogin || "";
    document.getElementById("last-login").textContent = data.lastLogin || "";
    document.getElementById("last-server").textContent = data.lastServer || "";
    document.getElementById("sb-level").textContent = data.skyblockLevel?.level || 0;
    document.getElementById("sb-xp").textContent = data.skyblockLevel?.xp || 0;
    document.getElementById("combat-kills").textContent = data.combat?.kills || 0;
    document.getElementById("combat-deaths").textContent = data.combat?.deaths || 0;
    document.getElementById("combat-max-dmg").textContent = data.combat?.maxDamage || 0;
    document.getElementById("combat-max-crit").textContent = data.combat?.maxCrit || 0;
    document.getElementById("account-language").textContent = data.account?.language || "";
    document.getElementById("account-chat").textContent = data.account?.chatVisible || "";
    document.getElementById("account-friend-requests").textContent = data.account?.friendRequests || "";
    document.getElementById("account-pms").textContent = data.account?.privateMessages || "";

  } catch (err) {
    alert("Player not found or failed to load.");
  }
}
