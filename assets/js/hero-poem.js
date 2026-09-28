(function () {
  "use strict";

  // randomValue is in [0, 1); -1 means there is no previous selection.
  function nextPoemIndex(count, currentIndex, randomValue) {
    if (count < 1) return -1;
    if (count === 1) return 0;
    if (currentIndex < 0) return Math.floor(randomValue * count);
    const index = Math.floor(randomValue * (count - 1));
    return index >= currentIndex ? index + 1 : index;
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { nextPoemIndex };
  }
  if (typeof document === "undefined") return;

  function init() {
    document.querySelectorAll("[data-hero-poem]").forEach((panel) => {
      if (panel.dataset.heroPoemReady) return;
      panel.dataset.heroPoemReady = "true";
      const entries = Array.from(panel.querySelectorAll("[data-poem-entry]"));
      const verses = entries.map((entry) => entry.querySelector("[data-poem-text]"));
      const screen = panel.closest("[data-device-page]");
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      let current = nextPoemIndex(entries.length, -1, Math.random());
      let hovered = panel.matches(":hover");
      let focused = panel.contains(document.activeElement);
      let inView = !("IntersectionObserver" in window);
      let timer = null;
      let animation = null;
      let transition = 0;

      function render() {
        panel.dataset.poemIndex = String(current);
        entries.forEach((entry, index) => {
          entry.inert = index !== current;
          entry.setAttribute("aria-hidden", String(index !== current));
          entry.hidden = false;
        });
      }

      function clearTransition() {
        transition += 1;
        if (animation) animation.cancel();
        animation = null;
        verses.forEach((verse) => {
          ["mask-image", "mask-position", "mask-size", "mask-repeat"].forEach((property) => verse.style.removeProperty(property));
        });
        render();
      }

      function animateTiles(verse, reveal) {
        const order = Array.from({ length: 64 }, (_, index) => index);
        for (let index = order.length - 1; index > 0; index -= 1) {
          const other = Math.floor(Math.random() * (index + 1));
          [order[index], order[other]] = [order[other], order[index]];
        }
        // Each opaque layer occupies one cell of a 16-by-4 grid; no text is split.
        verse.style.maskImage = order.map(() => "linear-gradient(#000, #000)").join(", ");
        verse.style.maskPosition = order.map((_, index) => `${(index % 16) * 100 / 15}% ${Math.floor(index / 16) * 100 / 3}%`).join(", ");
        verse.style.maskRepeat = "no-repeat";
        const frames = Array.from({ length: 9 }, (_, stage) => ({
          easing: "steps(1, end)",
          maskSize: order.map((rank) => (rank < stage * 8) === reveal
            ? "calc(6.25% + 0.5px) calc(25% + 0.5px)" : "0 0").join(", ")
        }));
        verse.style.maskSize = frames[0].maskSize;
        animation = verse.animate(frames, { duration: reveal ? 360 : 240, easing: "linear", fill: "both" });
        return animation.finished;
      }

      function hidden() {
        return document.hidden || !inView || screen?.getAttribute("aria-hidden") === "true";
      }

      async function advance() {
        clearTransition();
        const previous = current;
        current = nextPoemIndex(entries.length, current, Math.random());
        if (motion.matches || hidden() || !verses[current].animate || !window.CSS?.supports("mask-image", "linear-gradient(#000, #000)")) {
          render();
          return;
        }
        const version = transition;
        try {
          await animateTiles(verses[previous], false);
          if (version !== transition) return;
          render();
          animation.cancel();
          await animateTiles(verses[current], true);
        } catch {
          // Cancellation and animation failures must both leave readable text.
        } finally {
          if (version === transition) clearTransition();
        }
      }

      function stopTimer() {
        if (timer === null) return;
        window.clearInterval(timer);
        timer = null;
      }

      function syncTimer() {
        const stopped = motion.matches || hovered || focused || hidden();
        if (stopped) {
          stopTimer();
          if (animation) clearTransition();
        }
        else if (timer === null) timer = window.setInterval(advance, 15000);
      }

      render();
      panel.addEventListener("mouseenter", () => { hovered = true; syncTimer(); });
      panel.addEventListener("mouseleave", () => { hovered = false; syncTimer(); });
      panel.addEventListener("focusin", () => { focused = true; syncTimer(); });
      panel.addEventListener("focusout", (event) => {
        focused = panel.contains(event.relatedTarget);
        syncTimer();
      });
      document.addEventListener("visibilitychange", syncTimer);
      if (screen) screen.parentElement.addEventListener("hero-device:change", syncTimer);
      motion.addEventListener("change", syncTimer);
      if ("IntersectionObserver" in window) {
        new window.IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          syncTimer();
        }).observe(panel);
      }
      syncTimer();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
