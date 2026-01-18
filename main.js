/* GSAP Project Intro to Page Transition POC
   Click album cover in intro state -> move left -> expand to LEFT hero width -> show right panel -> fade in detail content
*/

(() => {
  const intro = document.getElementById("intro");
  const detail = document.getElementById("detail");
  const albumCard = document.getElementById("albumCard");
  const albumImg = document.getElementById("albumImg");
  const transitionLayer = document.getElementById("transitionLayer");
  const closeBtn = document.getElementById("closeBtn");
  const rightPanel = document.getElementById("rightPanel");

  let isOpen = false;
  let tl = null;

  function lockScroll(locked) {
    document.body.style.overflow = locked ? "hidden" : "";
  }

  function rectOf(el) {
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  function heroWidthPx() {
    // Match CSS variable --heroW (62vw by default, 100vw on mobile via media query)
    // We compute in JS so the end state is consistent.
    const cssHeroW = getComputedStyle(document.documentElement).getPropertyValue("--heroW").trim();
    if (cssHeroW.endsWith("vw")) {
      const vw = parseFloat(cssHeroW.replace("vw", ""));
      return Math.round((window.innerWidth * vw) / 100);
    }
    if (cssHeroW.endsWith("px")) return Math.round(parseFloat(cssHeroW.replace("px", "")));
    // fallback
    return Math.round(window.innerWidth * 0.62);
  }

  function openTransition() {
    if (isOpen) return;
    isOpen = true;

    lockScroll(true);

    const start = rectOf(albumCard);

    // Create moving hero
    const hero = document.createElement("div");
    hero.className = "movingHero";
    hero.style.left = `${start.left}px`;
    hero.style.top = `${start.top}px`;
    hero.style.width = `${start.width}px`;
    hero.style.height = `${start.height}px`;

    // Clone image so intro stays stable
    const imgClone = albumImg.cloneNode(true);
    imgClone.removeAttribute("id");
    imgClone.style.width = "100%";
    imgClone.style.height = "100%";
    imgClone.style.objectFit = "cover";
    imgClone.style.display = "block";

    hero.appendChild(imgClone);
    transitionLayer.appendChild(hero);

    // Reset detail and right panel visuals
    gsap.set(detail, { opacity: 0, pointerEvents: "none" });
    gsap.set(rightPanel, { opacity: 0, pointerEvents: "none" });

    // End state is LEFT-aligned hero, not full width
    const endW = heroWidthPx();
    const end = { left: 0, top: 0, width: endW, height: window.innerHeight };

    tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        detail.setAttribute("aria-hidden", "false");
        gsap.set(detail, { pointerEvents: "auto" });

        intro.style.pointerEvents = "none";
      },
    });

    // Step 1: small move left first (matches your described motion)
    tl.to(hero, {
      duration: 0.45,
      left: Math.max(24, start.left - 140),
      borderRadius: 18,
    });

    // Step 2: expand to LEFT hero region (not full width)
    tl.to(
      hero,
      {
        duration: 0.85,
        left: end.left,
        top: end.top,
        width: end.width,
        height: end.height,
        borderRadius: 0,
      },
      "-=0.1"
    );

    // Step 3: reveal right panel once the hero is close to final
    tl.to(
      rightPanel,
      {
        duration: 0.45,
        opacity: 1,
        ease: "power2.out",
      },
      "-=0.45"
    );

    // Step 4: fade in detail content after hero settles
    tl.to(
      detail,
      {
        duration: 0.55,
        opacity: 1,
        ease: "power2.out",
      },
      "-=0.15"
    );

    // Step 5: stagger in key text blocks
    const textTargets = detail.querySelectorAll(
      ".detailLeft .kicker, .detailLeft .scrollHint, .detailTitle, .detailCopy, .detailBlocks .block"
    );

    tl.fromTo(
      textTargets,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" },
      "-=0.35"
    );

    tl.hero = hero;
  }

  function closeTransition() {
    if (!isOpen || !tl) return;
    isOpen = false;

    const back = rectOf(albumCard);

    gsap.set(detail, { pointerEvents: "none" });
    detail.setAttribute("aria-hidden", "true");

    const hero = tl.hero;

    const closeTl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        if (hero && hero.parentNode) hero.parentNode.removeChild(hero);

        gsap.set(detail, { opacity: 0 });
        gsap.set(rightPanel, { opacity: 0 });

        intro.style.pointerEvents = "auto";
        lockScroll(false);
      },
    });

    closeTl.to(detail, { duration: 0.25, opacity: 0, ease: "power2.inOut" }, 0);
    closeTl.to(rightPanel, { duration: 0.25, opacity: 0, ease: "power2.inOut" }, 0);

    closeTl.to(
      hero,
      {
        duration: 0.75,
        left: back.left,
        top: back.top,
        width: back.width,
        height: back.height,
        borderRadius: 18,
      },
      0.08
    );
  }

  albumCard.addEventListener("click", openTransition);
  closeBtn.addEventListener("click", closeTransition);

  // Simple approach for POC: if user resizes while open, close to avoid mismatched layout
  window.addEventListener("resize", () => {
    if (!isOpen) return;
    closeTransition();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeTransition();
  });
})();
