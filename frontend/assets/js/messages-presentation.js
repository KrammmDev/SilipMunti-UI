/* Layout and accessibility only. messages.js retains all data and message actions. */
(() => {
  const app = document.getElementById("messages-app");
  const chat = document.getElementById("active-chat");
  const info = document.getElementById("information-panel");
  const property = document.getElementById("property-summary");
  const header = chat?.querySelector(".chat-header");
  const toggle = document.getElementById("toggle-conversation-details");
  if (!app || !chat || !info || !property || !header || !toggle) return;
  const wide = window.matchMedia("(min-width: 1201px)");
  let previouslyActive = false;
  const isActive = () => !chat.classList.contains("hidden");
  const showDetails = () => window.openInformationPanel?.();
  const hideDetails = () => window.closeInformationPanel?.();
  const arrange = () => {
    const active = isActive();
    if (active && !previouslyActive && wide.matches) showDetails();
    previouslyActive = active;
    const open = !info.classList.contains("hidden");
    if (wide.matches && active && open) {
      const link = document.getElementById("information-property-button");
      if (property.parentElement !== info) info.insertBefore(property, link);
    } else if (property.parentElement !== chat) {
      header.after(property);
    }
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Hide conversation details" : "Show conversation details");
  };
  toggle.addEventListener("click", () => {
    if (info.classList.contains("hidden")) {
      showDetails();
      if (!wide.matches) document.getElementById("close-information-panel")?.focus();
    }
    else hideDetails();
    arrange();
  });
  document.getElementById("close-information-panel")?.addEventListener("click", () => toggle.focus());
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !info.classList.contains("hidden")) {
      hideDetails();
      toggle.focus();
    }
  });
  // Existing profile-click behavior is also available from the keyboard.
  for (const id of ["chat-user-name", "chat-user-picture"]) {
    const element = document.getElementById(id);
    if (!element) continue;
    element.tabIndex = 0;
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", "Show conversation details");
    element.setAttribute("aria-controls", "information-panel");
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        element.click();
      }
    });
  }
  const observer = new MutationObserver(arrange);
  observer.observe(chat, { attributes: true, attributeFilter: ["class"] });
  observer.observe(info, { attributes: true, attributeFilter: ["class"] });
  document.getElementById("conversation-list")?.addEventListener("click", (event) => {
    if (event.target.closest(".conversation-item") && wide.matches) {
      queueMicrotask(() => { if (isActive()) { showDetails(); arrange(); } });
    }
  });
  wide.addEventListener("change", () => {
    if (wide.matches && isActive()) showDetails();
    else hideDetails();
    arrange();
  });
  const navbar = document.querySelector("site-navbar");
  const setHeight = () => {
    const height = navbar?.getBoundingClientRect().height;
    if (height) document.documentElement.style.setProperty("--messages-nav-height", `${height}px`);
  };
  if (navbar) new ResizeObserver(setHeight).observe(navbar);
  setHeight();
  arrange();
})();
