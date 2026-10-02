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
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const titleReveals = new Map();
  let titleTimer;
  const symbols = Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@?+");
  const emojis = ["\u2728", "\u{1F4A1}", "\u{1F30D}", "\u{1F680}", "\u{1F3A8}"];
  const titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      titleObserver.unobserve(entry.target);
      if (reducedMotion.matches) return;
      titleReveals.set(entry.target, 0);
      if (!titleTimer) titleTimer = setInterval(revealTitles, 120);
      entry.target.querySelectorAll('.deadline-flap').forEach((cell, index) => {
        const deck = index % 3 === 0 ? emojis : symbols;
        flip(cell, deck[Math.floor(Math.random() * deck.length)], false);
      });
    });
  });
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
    titleObserver.disconnect();
    titleReveals.clear();
    clearInterval(titleTimer);
    titleTimer = null;
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
    if (!selected.length) list.append(element("p", "No conferences match these filters.", "deadline-empty"));
    selected.forEach(c => {
      const row = element("article", "", "deadline-row");
      if (c.due <= now) row.classList.add("is-past");
      const info = element("div", "");
      const heading = element("h2", "");
      const link = element("a", `${c.title} ${c.year || ""}`);
      const title = link.textContent.trim();
      link.replaceChildren(element("span", title, "deadline-title-label"));
      const display = element("span", "", "deadline-title");
      display.setAttribute("aria-hidden", "true");
      const graphemes = new Intl.Segmenter(undefined, { granularity: "grapheme" });
      for (const { segment } of graphemes.segment(title)) {
        const cell = flap(segment);
        cell.dataset.target = segment;
        display.append(cell);
      }
      link.append(display);
      if (/^https?:\/\//i.test(c.link || "")) {
        link.href = c.link; link.target = "_blank"; link.rel = "noopener noreferrer";
      }
      heading.append(link); info.append(heading);
      if (c.full_name) info.append(element("p", c.full_name));
      info.append(element("p", c.categories.map(x => fields[x] || x).join(" / "), "deadline-meta"));
      info.append(element("p", [c.date, c.place].filter(Boolean).join(" / "), "deadline-meta"));
      if (c.note) info.append(element("p", c.note, "deadline-meta"));
      const timing = element("div", "", "deadline-timing");
      const clock = element("div", "", "deadline-clock");
      clock.setAttribute("role", "img");
      clock.dataset.due = String(c.due);
      timing.append(clock);
      timing.append(element("p", `Paper: ${c.deadline || "TBA"} (${c.timezone || "Unknown timezone"})`, "deadline-meta"));
      if (Number.isFinite(c.due)) timing.append(element("p", `Local: ${new Date(c.due).toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`, "deadline-meta"));
      if (c.abstract_deadline) timing.append(element("p", `Abstract: ${c.abstract_deadline} (${c.timezone || "Unknown timezone"})`, "deadline-meta"));
      row.append(info, timing); list.append(row);
      titleObserver.observe(display);
    });
    tick();
  }
  function flap(value) {
    const cell = element("span", "", "deadline-flap");
    for (const half of ["top", "bottom", "out", "in"]) cell.append(element("span", value, `flap-${half}`));
    cell.dataset.value = value;
    return cell;
  }
  function flip(cell, next, animate, duration = 340) {
    if (cell.dataset.value === next) return;
    const [top, bottom, outgoing, incoming] = cell.children;
    cell.getAnimations({ subtree: true }).forEach(animation => animation.cancel());
    outgoing.textContent = cell.dataset.value;
    top.textContent = bottom.textContent = incoming.textContent = next;
    cell.dataset.value = next;
    if (animate) {
      outgoing.animate([{ transform: "rotateX(0deg)", visibility: "visible" }, { transform: "rotateX(-90deg)", visibility: "visible" }], { duration: duration / 2, easing: "ease-in" });
      incoming.animate([{ transform: "rotateX(90deg)", visibility: "visible" }, { transform: "rotateX(0deg)", visibility: "visible" }], { duration: duration / 2, delay: duration / 2, easing: "ease-out", fill: "backwards" });
    }
  }
  function revealTitles() {
    titleReveals.forEach((step, title) => {
      const cells = [...title.querySelectorAll('.deadline-flap')];
      const immediate = reducedMotion.matches || document.hidden;
      cells.forEach((cell, index) => {
        const settled = immediate || step >= 5 + Math.floor(index / 2);
        const deck = (step + index) % 3 === 0 ? emojis : symbols;
        flip(cell, settled ? cell.dataset.target : deck[Math.floor(Math.random() * deck.length)], !immediate, 100);
      });
      if (immediate || step >= 5 + Math.floor((cells.length - 1) / 2)) titleReveals.delete(title);
      else titleReveals.set(title, step + 1);
    });
    if (!titleReveals.size) {
      clearInterval(titleTimer);
      titleTimer = null;
    }
  }
  function updateClock(node, seconds) {
    const values = [String(Math.floor(seconds / 86400)).padStart(3, "0"),
      String(Math.floor(seconds / 3600) % 24).padStart(2, "0"),
      String(Math.floor(seconds / 60) % 60).padStart(2, "0"), String(seconds % 60).padStart(2, "0")];
    const labels = ["Days", "Hours", "Min", "Sec"];
    node.setAttribute("aria-label", `${Number(values[0])} days, ${values[1]} hours, ${values[2]} minutes, ${values[3]} seconds remaining`);
    const text = values.join("");
    if (node.querySelectorAll(".deadline-flap").length !== text.length) {
      node.replaceChildren();
      values.forEach((value, index) => {
        const group = element("span", "", "deadline-unit");
        group.setAttribute("aria-hidden", "true");
        const digits = element("span", "", "deadline-digits");
        for (const digit of value) {
          digits.append(flap(digit));
        }
        group.append(digits, element("span", labels[index], "deadline-unit-label"));
        node.append(group);
      });
      return;
    }
    const bounds = node.getBoundingClientRect();
    const animate = !reducedMotion.matches && bounds.bottom > 0 && bounds.top < innerHeight;
    node.querySelectorAll(".deadline-flap").forEach((cell, index) => {
      flip(cell, text[index], animate);
    });
  }
  function tick() {
    if (document.hidden) return;
    const now = Date.now();
    if ([...list.querySelectorAll("[data-due]")].some(node => Number(node.dataset.due) <= now && !node.closest("article").classList.contains("is-past"))) {
      render();
      return;
    }
    list.querySelectorAll("[data-due]").forEach(node => {
      const due = Number(node.dataset.due);
      const seconds = Math.max(0, Math.floor((due - now) / 1000));
      if (!Number.isFinite(due) || due <= now) {
        const label = Number.isFinite(due) ? "Closed" : "To be announced";
        if (node.textContent !== label) node.replaceChildren(element("span", label, "deadline-state"));
        node.setAttribute("aria-label", label);
      } else updateClock(node, seconds);
      node.closest("article").classList.toggle("is-soon", due > now && seconds < 604800);
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
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) revealTitles();
    tick();
  });
  reducedMotion.addEventListener("change", () => { if (reducedMotion.matches) revealTitles(); });
  load();
})();
