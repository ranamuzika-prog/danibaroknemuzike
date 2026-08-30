(function () {
  const html = document.documentElement;
  const storedLang = localStorage.getItem("dbm-lang") || "sr";
  const navPanel = document.querySelector("[data-nav-panel]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const langButtons = document.querySelectorAll("[data-lang-switch]");
  const shareButtons = document.querySelectorAll("[data-share]");
  const copyButtons = document.querySelectorAll("[data-copy-link]");
  const cardLinks = document.querySelectorAll("[data-card-link]");
  const eventMedia = document.querySelectorAll(".event-media");

  function setLanguage(lang) {
    html.setAttribute("data-lang", lang);
    langButtons.forEach((button) => {
      const active = button.dataset.langSwitch === lang;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    localStorage.setItem("dbm-lang", lang);
  }

  function closeMenu() {
    if (!navPanel || !menuToggle) return;
    navPanel.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function openMenu() {
    if (!navPanel || !menuToggle) return;
    navPanel.classList.add("open");
    document.body.classList.add("menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
  }

  setLanguage(storedLang);

  langButtons.forEach((button) => {
    button.addEventListener("click", function () {
      setLanguage(button.dataset.langSwitch);
    });
  });

  if (menuToggle && navPanel) {
    menuToggle.addEventListener("click", function () {
      if (navPanel.classList.contains("open")) closeMenu();
      else openMenu();
    });

    navPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  shareButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      const title = button.dataset.shareTitle || document.title;
      if (navigator.share) {
        try {
          await navigator.share({ title, url: window.location.href });
          return;
        } catch (error) {
          if (error && error.name === "AbortError") return;
        }
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        button.textContent = html.getAttribute("data-lang") === "sr" ? "Link kopiran" : "Link copied";
      }
    });
  });

  copyButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      if (!navigator.clipboard) return;
      await navigator.clipboard.writeText(window.location.href);
      button.textContent = html.getAttribute("data-lang") === "sr" ? "Link kopiran" : "Link copied";
    });
  });

  cardLinks.forEach((card) => {
    const href = card.dataset.cardLink;
    if (!href) return;

    card.addEventListener("click", function (event) {
      if (event.target.closest("a, button")) return;
      window.location.href = href;
    });

    card.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      window.location.href = href;
    });
  });

  eventMedia.forEach((media) => {
    const image = media.querySelector("img");
    if (!image) return;

    function showImage() {
      media.classList.add("is-loaded");
    }

    if (image.complete && image.naturalWidth > 0) showImage();
    image.addEventListener("load", showImage);
  });
})();
