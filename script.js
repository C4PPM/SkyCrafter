const WORKER_URL = "https://skycrafter.finbob512.workers.dev/"; // <- restore your actual Cloudflare worker URL

let currentPlayerData = null;

async function search(usernameInput) {
  const username = usernameInput || document.getElementById("username").value.trim();
  if (!username) return;

  hideSections();

  try {
    const res = await fetch(`${WORKER_URL}?username=${username}`);
    const data = await res.json();

    if (!data || data.error) throw new Error("Player not found");

    currentPlayerData = data;
    displayPlayer(data);
    displaySkyblockProfiles(data.skyblockProfiles || []);
    displayStats(data);
    document.getElementById("view-json").style.display = "inline-block";

  } catch (err) {
    alert("Player not found or failed to load.");
    console.error(err);
  }
}

function hideSections() {
  document.getElementById("player-container").classList.add("hidden");
  document.getElementById("skyblock-section").classList.add("hidden");
  document.getElementById("stats-section").classList.add("hidden");
}

function displayPlayer(data) {
  const skinImg = document.getElementById("player-skin");
  skinImg.src = `https://crafatar.com/avatars/${data.uuid}?size=64&overlay`;
  skinImg.alt = `${data.username} Head`;

  document.getElementById("player-name").textContent = data.username;
  document.getElementById("player-uuid").textContent = data.uuid;
  document.getElementById("player-rank").textContent = data.rank || "DEFAULT";
  document.getElementById("player-pixel").textContent = `Pixel ID: ${data.pixelId || "N/A"}`;
  document.getElementById("network-xp").textContent = data.networkXp || 0;
  document.getElementById("network-coins").textContent = data.networkCoins || 0;

  document.getElementById("player-container").classList.remove("hidden");
}

function displaySkyblockProfiles(profiles) {
  const tabs = document.getElementById("profile-tabs");
  tabs.innerHTML = "";
  document.getElementById("profiles-count").textContent = profiles.length;

  profiles.forEach(profile => {
    const btn = document.createElement("button");
    btn.innerHTML = `<strong>${profile.cuteName}</strong><br>${profile.id}`;
    if (profile.current) btn.classList.add("active");
    btn.onclick = () => {
      profiles.forEach(p => p.current = false);
      profile.current = true;
      tabs.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      displayStats(profile);
    };
    tabs.appendChild(btn);
  });

  document.getElementById("skyblock-section").classList.remove("hidden");
}

function displayStats(profile) {
  const statsGrid = document.getElementById("stats-grid");
  statsGrid.innerHTML = "";

  // Example stats boxes
  const stats = [
    { title: "Playtime", value: profile.playtime || "0h" },
    { title: "SkyBlock Level", value: profile.level || 0 },
    { title: "Combat Kills", value: profile.kills || 0 }
  ];

  stats.forEach(s => {
    const box = document.createElement("div");
    box.className = "stat-box";
    box.innerHTML = `<strong>${s.title}</strong><br>${s.value}`;
    statsGrid.appendChild(box);
  });

  document.getElementById("stats-section").classList.remove("hidden");
}

function viewRawJson() {
  const win = window.open();
  win.document.write(`<pre>${JSON.stringify(currentPlayerData, null, 2)}</pre>`);
}

function searchMyData() {
  document.getElementById("username").value = "C4PPM";
  search("C4PPM");
}
