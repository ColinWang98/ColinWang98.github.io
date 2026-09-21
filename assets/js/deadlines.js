(function () {
  const app = document.getElementById("deadlines-app");
  if (!app) return;
  const search = document.getElementById("deadline-search");
  const field = document.getElementById("deadline-field");
  const status = document.getElementById("deadline-status");
  const source = document.getElementById("deadline-source");
  const list = document.getElementById("deadline-list");
  const count = document.getElementById("deadline-count");
  const upstream = "https://raw.githubusercontent.com/hci-deadlines/hci-deadlines.github.io/gh-pages/_data/conferences.yml";
  let conferences = [];
  const fields = { HCI: "Human-Computer Interaction", XR: "Extended Reality", VIS: "Visualization", CSCW: "Cooperative Work", DES: "Design", AI: "Artificial Intelligence", GM: "Games & Multimedia", SP: "Security & Privacy", HRI: "Human-Robot Interaction", ART: "Art", HAP: "Haptics" };

  // Upstream expresses deadlines in fixed UTC offsets, including AoE (UTC-12).
  function timestamp(value, zone) {
    const date = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(value));
    const offset = /^UTC([+-])(\d{1,2})(?::(\d{2}))?$/.exec(String(zone));
    if (!date || !offset) return NaN;
    const minutes = (Number(offset[2]) * 60 + Number(offset[3] || 0)) * (offset[1] === "+" ? 1 : -1);
    return Date.UTC(+date[1], +date[2] - 1, +date[3], +date[4], +date[5], +(date[6] || 0)) - minutes * 60000;
  }
  function element(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function normalize(data) {
    if (!Array.isArray(data) || !data.length) throw new Error("Invalid data");
    return data.filter(c => c && typeof c.title === "string").map(c => ({
      ...c, categories: Array.isArray(c.sub) ? c.sub : [c.sub].filter(Boolean),
      due: timestamp(c.deadline, c.timezone)
    }));
  }
  function render() {
    const now = Date.now();
    const query = search.value.trim().toLowerCase();
    const selected = conferences.filter(c => {
      const past = Number.isFinite(c.due) && c.due <= now;
      return (!field.value || c.categories.includes(field.value)) &&
        (status.value === "all" || (status.value === "past" ? past : !past)) &&
        `${c.title} ${c.year} ${c.full_name || ""} ${c.place || ""}`.toLowerCase().includes(query);
    }).sort((a, b) => {
      if (!Number.isFinite(a.due)) return Number.isFinite(b.due) ? 1 : 0;
      if (!Number.isFinite(b.due)) return -1;
      if (status.value === "past") return b.due - a.due;
      if ((a.due <= now) !== (b.due <= now)) return a.due <= now ? 1 : -1;
      return a.due <= now ? b.due - a.due : a.due - b.due;
    });
    count.textContent = `${selected.length} conferences`;
    list.replaceChildren();
    if (!selected.length) list.append(element("p", "No conferences match these filters."));
    selected.forEach(c => {
      const row = element("article", "", "deadline-row");
      if (c.due <= now) row.classList.add("is-past");
      const info = element("div", "");
      const heading = element("h2", "");
      const link = element("a", `${c.title} ${c.year || ""}`);
      if (/^https?:\/\//i.test(c.link || "")) {
        link.href = c.link; link.target = "_blank"; link.rel = "noopener noreferrer";
      }
      heading.append(link); info.append(heading);
      if (c.full_name) info.append(element("p", c.full_name));
      info.append(element("p", c.categories.map(x => fields[x] || x).join(" / "), "deadline-meta"));
      info.append(element("p", [c.date, c.place].filter(Boolean).join(" / "), "deadline-meta"));
      if (c.note) info.append(element("p", c.note, "deadline-meta"));
      const timing = element("div", "");
      const clock = element("p", "", "deadline-clock");
      clock.dataset.due = String(c.due);
      timing.append(clock);
      timing.append(element("p", `Paper: ${c.deadline || "TBA"} (${c.timezone || "Unknown timezone"})`, "deadline-meta"));
      if (Number.isFinite(c.due)) timing.append(element("p", `Local: ${new Date(c.due).toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`, "deadline-meta"));
      if (c.abstract_deadline) timing.append(element("p", `Abstract: ${c.abstract_deadline} (${c.timezone || "Unknown timezone"})`, "deadline-meta"));
      row.append(info, timing); list.append(row);
    });
    tick();
  }
  function tick() {
    list.querySelectorAll("[data-due]").forEach(node => {
      const due = Number(node.dataset.due);
      const seconds = Math.max(0, Math.floor((due - Date.now()) / 1000));
      node.textContent = !Number.isFinite(due) ? "To be announced" : due <= Date.now() ? "Closed" :
        `${Math.floor(seconds / 86400)}d ${String(Math.floor(seconds / 3600) % 24).padStart(2, "0")}h ${String(Math.floor(seconds / 60) % 60).padStart(2, "0")}m ${String(seconds % 60).padStart(2, "0")}s`;
      if (Number.isFinite(due) && due <= Date.now() && !node.closest("article").classList.contains("is-past")) render();
    });
  }
  async function request(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error("Request failed");
      return await response.text();
    } finally { clearTimeout(timer); }
  }
  async function load() {
    try {
      conferences = normalize(window.jsyaml.load(await request(upstream), { schema: window.jsyaml.JSON_SCHEMA }));
      source.textContent = "Live data from HCI Deadlines. Times include the original conference timezone.";
    } catch (_) {
      try {
        const snapshot = JSON.parse(await request(app.dataset.snapshot));
        conferences = normalize(snapshot.conferences);
        source.textContent = `Live data unavailable. Saved data from ${new Date(snapshot.retrieved_at).toLocaleDateString()}.`;
      } catch (_) {
        source.textContent = "Conference data could not be loaded. Please open the original site above.";
        return;
      }
    }
    [...new Set(conferences.flatMap(c => c.categories))].sort().forEach(value => {
      const option = element("option", fields[value] || value); option.value = value; field.append(option);
    });
    render();
    setInterval(tick, 1000);
  }
  app.querySelector("form").addEventListener("submit", event => event.preventDefault());
  search.addEventListener("input", render);
  field.addEventListener("change", render);
  status.addEventListener("change", render);
  load();
})();
