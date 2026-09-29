(function () {
  "use strict";
  const device = document.querySelector(".hero-section");
  if (!device) return;
  const pages = device.querySelector(".device-pages");
  const entries = Array.from(pages.querySelectorAll("[data-device-page]"));
  const directions = Array.from(device.querySelectorAll("[data-device-direction]"));
  const start = device.querySelector("[data-device-start]");
  const caption = device.querySelector("[data-device-caption]");
  const help = device.querySelector("[data-device-help]");
  const announcement = device.querySelector("[data-device-announcement]");
  const video = device.querySelector("[data-device-video]");
  const status = device.querySelector("[data-video-status]");
  const modes = { up: "profile", right: "research", down: "projects", left: "contact" };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let mode = "profile";
  let initialized = false;
  let heightTransition;
  let contentTransition;

  function finishTransition() {
    if (heightTransition) {
      heightTransition.onfinish = null;
      heightTransition.cancel();
    }
    if (contentTransition) contentTransition.cancel();
    heightTransition = contentTransition = null;
    pages.classList.remove("is-switching");
  }

  reducedMotion.addEventListener("change", finishTransition);
  window.addEventListener("resize", finishTransition);

  function controls() {
    const viewing = mode === "video";
    start.textContent = viewing ? (video.ended ? "REPLAY" : video.paused ? "PLAY" : "PAUSE") : "START";
    start.setAttribute("aria-label", viewing ? `${start.textContent.toLowerCase()} Jizura video` : "Play Jizura video");
    help.textContent = viewing ? "Center plays / pauses. Arrows explore. Esc exits." : "Arrows explore. START to play.";
    directions.forEach((button) => button.setAttribute("aria-pressed", String(modes[button.dataset.deviceDirection] === mode)));
  }

  function select(next) {
    if (initialized && next === mode) return;
    const animate = next !== mode && !reducedMotion.matches && typeof pages.animate === "function";
    // Read the in-flight height before cancelling so repeated presses never jump back.
    const previousHeight = animate ? pages.getBoundingClientRect().height : 0;
    finishTransition();
    mode = next;
    if (mode !== "video") video.pause();
    device.dataset.deviceMode = mode;
    entries.forEach((entry) => {
      const inactive = entry.dataset.devicePage !== mode;
      entry.inert = inactive;
      entry.setAttribute("aria-hidden", String(inactive));
      entry.hidden = false;
    });
    caption.textContent = `${mode.toUpperCase()} / 0${entries.findIndex((entry) => entry.dataset.devicePage === mode) + 1}`;
    announcement.textContent = `${mode} screen`;
    pages.dispatchEvent(new Event("hero-device:change"));
    controls();
    initialized = true;
    if (animate) {
      const nextHeight = pages.getBoundingClientRect().height;
      const active = entries.find((entry) => entry.dataset.devicePage === mode);
      pages.classList.add("is-switching");
      heightTransition = pages.animate([
        { height: `${previousHeight}px` },
        { height: `${nextHeight}px` }
      ], { duration: 360, easing: "cubic-bezier(.22, 1, .36, 1)" });
      contentTransition = active.animate([
        { opacity: 0, transform: "translateY(6px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 240, easing: "ease-out" });
      heightTransition.onfinish = finishTransition;
    }
  }

  async function play() {
    // Assign the media URL only after a user gesture, not during homepage loading.
    if (!video.src) video.src = video.dataset.src;
    if (video.ended) video.currentTime = 0;
    status.textContent = "Loading video...";
    try {
      await video.play();
      if (mode !== "video" || document.hidden) video.pause();
    } catch (error) {
      if (mode === "video" && error.name !== "AbortError") status.textContent = "Press Play to retry, or use Open video.";
    }
    controls();
  }

  directions.forEach((button) => button.addEventListener("click", () => select(modes[button.dataset.deviceDirection])));
  start.addEventListener("click", () => {
    if (mode !== "video") {
      select("video");
      if (window.matchMedia("(max-width: 768px)").matches) device.scrollIntoView({ block: "start" });
      return play();
    }
    if (video.paused) return play();
    video.pause();
  });
  function exit() { select("profile"); start.focus({ preventScroll: true }); }
  device.querySelector("[data-video-exit]").addEventListener("click", exit);
  device.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Escape" && mode === "video") {
      event.preventDefault(); exit();
    } else if (/^Arrow(Up|Right|Down|Left)$/.test(event.key) && event.target.closest(".hero-wheel")) {
      event.preventDefault(); select(modes[event.key.slice(5).toLowerCase()]);
    }
  });
  video.addEventListener("play", () => {
    if (mode !== "video" || document.hidden) { video.pause(); return; }
    status.textContent = "Playing Jizura.";
    controls();
  });
  video.addEventListener("pause", () => { status.textContent = "Paused."; controls(); });
  video.addEventListener("ended", () => { status.textContent = "Video ended. Press REPLAY to watch again."; controls(); });
  video.addEventListener("error", () => { status.textContent = "Video unavailable. Try Open video."; controls(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) video.pause(); });
  if ("IntersectionObserver" in window) new window.IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) video.pause();
  }).observe(device);
  select("profile");
  device.querySelector(".device-controls").hidden = false;
  device.querySelector(".hero-device-grid").classList.add("is-interactive");
})();
