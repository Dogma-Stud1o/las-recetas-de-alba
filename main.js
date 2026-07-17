/* Las Recetas de Alba — nav + hero crossfade */
(() => {
  const nav = document.querySelector("[data-nav]");
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle("is-solid", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const stage = document.querySelector("[data-hero-stage]");
  if (!stage) return;

  const slides = [...stage.querySelectorAll("[data-hero-slide]")];
  const dots = [...stage.querySelectorAll("[data-hero-dot]")];
  if (slides.length < 2) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hold = reduce ? 0 : 3200;
  let index = 0;
  let timer = 0;

  const show = (next) => {
    index = ((next % slides.length) + slides.length) % slides.length;
    slides.forEach((img, i) => {
      img.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle("is-active", on);
      dot.setAttribute("aria-selected", on ? "true" : "false");
    });
  };

  const clear = () => {
    if (timer) {
      window.clearTimeout(timer);
      timer = 0;
    }
  };

  const arm = () => {
    clear();
    if (reduce || hold <= 0) return;
    timer = window.setTimeout(() => {
      show(index + 1);
      arm();
    }, hold);
  };

  const go = (next) => {
    show(next);
    arm();
  };

  // Click en la foto → siguiente
  stage.addEventListener("click", (e) => {
    if (e.target.closest("[data-hero-dot]")) return;
    go(index + 1);
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      const i = Number(dot.dataset.heroDot);
      if (Number.isNaN(i)) return;
      go(i);
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clear();
    else arm();
  });

  show(0);
  arm();
})();
