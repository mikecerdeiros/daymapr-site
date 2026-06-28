const header = document.querySelector("[data-header]");
const hero = document.querySelector(".hero");
const parallaxItems = [...document.querySelectorAll("[data-depth]")];
const prefersReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

function setupReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function updateMotion() {
  const scrollY = window.scrollY || 0;
  header?.classList.toggle("is-scrolled", scrollY > 20);

  if (hero) {
    const rect = hero.getBoundingClientRect();
    const travel = Math.max(1, hero.offsetHeight - innerHeight);
    const progress = prefersReducedMotion ? 0 : clamp(-rect.top / travel);
    hero.style.setProperty("--hero-progress", progress.toFixed(4));
  }

  if (!prefersReducedMotion) {
    parallaxItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const depth = Number(item.dataset.depth || 0);
      const centerOffset = rect.top + rect.height * 0.5 - innerHeight * 0.5;
      const y = centerOffset * depth;
      item.style.translate = `0 ${y.toFixed(2)}px`;
    });
  }

  requestAnimationFrame(updateMotion);
}

setupReveals();
requestAnimationFrame(updateMotion);
