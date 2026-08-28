const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (header) {
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
    });
  });
}

function animateCounter(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (!target || el.dataset.animated === "true") return;

  el.dataset.animated = "true";
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

function activateReveal(el) {
  el.classList.add("is-visible");
  el.querySelectorAll(".stagger-group").forEach((group) => group.classList.add("is-visible"));

  if (el.classList.contains("stagger-group")) {
    el.querySelectorAll("[data-count]").forEach(animateCounter);
  }
}

const revealTargets = document.querySelectorAll(".reveal, .reveal-scale, .stagger-group");

if (revealTargets.length && !prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateReveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => {
    el.classList.add("is-visible");
    el.querySelectorAll("[data-count]").forEach((counter) => {
      counter.textContent = `${counter.dataset.count}${counter.dataset.suffix || ""}`;
    });
  });
}

const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
const navSections = Array.from(navAnchors)
  .map((link) => {
    const id = link.getAttribute("href")?.slice(1);
    const section = id ? document.getElementById(id) : null;
    return section ? { link, section } : null;
  })
  .filter(Boolean);

if (navSections.length) {
  const setActiveNav = () => {
    const scrollPos = window.scrollY + 120;

    let current = navSections[0];
    navSections.forEach((item) => {
      if (item.section.offsetTop <= scrollPos) {
        current = item;
      }
    });

    navSections.forEach(({ link, section }) => {
      link.classList.toggle("is-active", section === current.section);
    });
  };

  setActiveNav();
  window.addEventListener("scroll", setActiveNav, { passive: true });
}

if (!prefersReducedMotion) {
  const heroVisual = document.getElementById("hero-visual");
  if (heroVisual) {
    window.addEventListener(
      "scroll",
      () => {
        const offset = Math.min(window.scrollY * 0.08, 40);
        heroVisual.style.transform = `translateY(${offset}px)`;
      },
      { passive: true }
    );
  }
}
