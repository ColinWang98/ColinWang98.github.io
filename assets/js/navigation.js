(function () {
  "use strict";
  function init() {
    const nav = document.getElementById("site-nav");
    if (!nav) return;
    const toggle = nav.querySelector(".nav-toggle");
    const links = nav.querySelector("#primary-links");
    const experience = nav.querySelector(".nav-experience");
    const compact = window.matchMedia("(max-width: 900px)");
    const setOpen = (open, restoreFocus = links.contains(document.activeElement)) => {
      if (!open && restoreFocus) toggle.focus();
      toggle.setAttribute("aria-expanded", String(open));
      links.hidden = compact.matches && !open;
      if (!open) experience.open = false;
    };
    toggle.hidden = false;
    nav.classList.add("is-enhanced");
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (experience.open) {
        experience.open = false;
        experience.querySelector("summary").focus();
      } else if (compact.matches && toggle.getAttribute("aria-expanded") === "true") setOpen(false, true);
    });
    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) {
        if (experience.open && experience.contains(document.activeElement)) experience.querySelector("summary").focus();
        experience.open = false;
        if (compact.matches) setOpen(false);
      }
    });
    nav.addEventListener("focusout", (event) => {
      if (event.relatedTarget && !nav.contains(event.relatedTarget)) {
        experience.open = false;
        if (compact.matches) setOpen(false, false);
      }
    });
    compact.addEventListener("change", () => {
      const toggleFocused = document.activeElement === toggle;
      setOpen(!compact.matches);
      if (!compact.matches && toggleFocused) links.querySelector("a").focus({ preventScroll: true });
    });
    setOpen(!compact.matches);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
