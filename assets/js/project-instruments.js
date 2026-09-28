(function () {
  "use strict";

  function projectAt(starts, line) {
    let index = 0;
    for (let i = 1; i < starts.length && starts[i] <= line; i += 1) index = i;
    return index;
  }

  function readingLine(top, height, indexHeight, viewportHeight, compact, viewportTop = 0) {
    // At the section boundary, only the aperture below the masthead remains visible.
    const start = Math.max(top + indexHeight, viewportTop);
    const end = compact ? viewportHeight : Math.min(top + height, viewportHeight);
    return start + Math.max(0, end - start) / 3;
  }

  function selectorAngle(previous, index) {
    const target = -135 + index * 54;
    return previous + ((target - previous) % 360 + 540) % 360 - 180;
  }

  if (typeof module !== "undefined" && module.exports) module.exports = { projectAt, readingLine, selectorAngle };
  if (typeof document === "undefined") return;

  function init() {
    const region = document.querySelector(".project-explorer");
    if (!region) return;
    const panel = region.querySelector(".project-instruments");
    const projects = Array.from(region.querySelectorAll("[data-project]"));
    if (!panel || !projects.length) return;
    const header = panel.querySelector(".project-frame-header");
    const menu = panel.querySelector(".instrument-menu");
    const toggle = panel.querySelector(".instrument-menu-toggle");
    const links = Array.from(menu.querySelectorAll("a"));
    const masthead = document.querySelector(".masthead");
    const compact = window.matchMedia("(max-width: 1099px), (max-height: 699px)");
    const count = panel.querySelector("[data-project-count]");
    const title = panel.querySelector("[data-project-title]");
    const period = panel.querySelector("[data-period-readout]");
    const category = panel.querySelector("[data-category-readout]");
    const knob = panel.querySelector("[data-project-next]");
    let angle = 0;
    let active = -1;
    let starts = [];
    let regionTop = 0;
    let regionBottom = 0;
    let frameHeight = 0;
    let frameTop = 0;
    let indexHeight = 0;
    let frame = null;
    let needsMeasure = true;
    let nearby = true;

    function setMenu(open, restoreFocus = false) {
      const hide = compact.matches && !open;
      if (hide && (restoreFocus || menu.contains(document.activeElement))) toggle.focus({ preventScroll: true });
      menu.hidden = hide;
      toggle.setAttribute("aria-expanded", String(compact.matches && open));
    }

    function syncMode() {
      const toggleFocused = document.activeElement === toggle;
      if (compact.matches) toggle.hidden = false;
      setMenu(false);
      if (!compact.matches && toggleFocused) {
        (links[active] || links[0]).focus({ preventScroll: true });
      }
      toggle.hidden = !compact.matches;
      schedule(true);
    }

    function render(index) {
      if (index === active) return;
      active = index;
      const project = projects[index];
      count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
      title.textContent = project.querySelector("h3").textContent;
      period.textContent = project.dataset.period;
      category.textContent = project.dataset.category;
      angle = selectorAngle(angle, index);
      panel.style.setProperty("--project-angle", `${angle}deg`);
      knob.setAttribute("aria-label", `Next project: ${projects[(index + 1) % projects.length].querySelector("h3").textContent}`);
      projects.forEach((item, i) => item.classList.toggle("is-current-project", i === index));
      links.forEach((link) => {
        if (link.getAttribute("href") === `#${project.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }

    function update() {
      frame = null;
      if (needsMeasure) {
        // Write offsets before measuring the stream; ordinary scrolls only use the cache.
        if (masthead) document.documentElement.style.setProperty("--header-height", `${masthead.getBoundingClientRect().height}px`);
        indexHeight = header.getBoundingClientRect().height;
        region.style.setProperty("--project-index-height", `${indexHeight}px`);
        const bounds = region.getBoundingClientRect();
        regionTop = bounds.top + window.scrollY;
        regionBottom = bounds.bottom + window.scrollY;
        frameHeight = panel.getBoundingClientRect().height;
        frameTop = parseFloat(window.getComputedStyle(panel).top);
        starts = projects.map((project) => project.getBoundingClientRect().top + window.scrollY);
        needsMeasure = false;
      }
      const top = Math.min(Math.max(regionTop - window.scrollY, frameTop), regionBottom - window.scrollY - frameHeight);
      render(projectAt(starts, window.scrollY + readingLine(top, frameHeight, indexHeight, window.innerHeight, compact.matches, frameTop)));
    }

    function schedule(measure = false) {
      needsMeasure = needsMeasure || measure;
      if (frame === null) frame = window.requestAnimationFrame(update);
    }

    toggle.addEventListener("click", () => setMenu(menu.hidden));
    knob.addEventListener("click", () => links[(active + 1) % projects.length].click());
    panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && compact.matches && !menu.hidden) {
        setMenu(false, true);
        event.stopPropagation();
      }
    });
    document.addEventListener("click", (event) => {
      if (!panel.contains(event.target)) {
        setMenu(false, !menu.hidden && document.activeElement === document.body);
      }
    });
    panel.addEventListener("focusout", (event) => {
      if (event.relatedTarget && !panel.contains(event.relatedTarget)) setMenu(false);
    });
    menu.addEventListener("click", (event) => {
      const link = event.target.closest("a[href^='#']");
      if (!link || event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const project = projects.find((item) => `#${item.id}` === link.getAttribute("href"));
      if (!project) return;
      // Move focus before hiding the menu, leaving anchor scrolling and history native.
      project.setAttribute("tabindex", "-1");
      project.focus({ preventScroll: true });
      setMenu(false);
      schedule(true);
    });
    window.addEventListener("scroll", () => { if (nearby) schedule(); }, { passive: true });
    window.addEventListener("resize", () => schedule(true), { passive: true });
    window.addEventListener("hashchange", () => schedule(true));
    window.addEventListener("pageshow", () => schedule(true));
    window.addEventListener("load", () => schedule(true), { once: true });
    compact.addEventListener("change", syncMode);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        nearby = entry.isIntersecting;
        schedule(true);
      }, { rootMargin: "100% 0px" }).observe(region);
    }
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => schedule(true));
      const content = document.querySelector(".page__content");
      [content, masthead, region, panel, header, ...projects].filter(Boolean).forEach((element) => observer.observe(element));
    }
    if (document.fonts) document.fonts.ready.then(() => schedule(true));
    region.classList.add("is-enhanced");
    panel.classList.add("is-enhanced");
    knob.hidden = false;
    syncMode();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
