(() => {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const backToTop = document.getElementById("backToTop");
  const heroArt = document.getElementById("heroArt");
  const header = document.querySelector("header");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  function initMobileMenu() {
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden");
      menuBtn.setAttribute("aria-expanded", String(!isOpen));
    });

    document.querySelectorAll("#mobileMenu a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const id = anchor.getAttribute("href");
        if (!id || id.length < 2) return;

        const target = document.querySelector(id);
        if (!target) return;

        event.preventDefault();
        const headerOffset = header ? header.offsetHeight : 0;
        const y = target.getBoundingClientRect().top + window.scrollY - headerOffset + 1;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  }

  function initBackToTopAndParallax() {
    if (!backToTop) return;

    const onScroll = () => {
      const y = window.scrollY;

      if (y > 500) {
        backToTop.classList.remove("hidden");
        backToTop.classList.add("flex");
      } else {
        backToTop.classList.add("hidden");
        backToTop.classList.remove("flex");
      }

      if (heroArt) {
        heroArt.style.transform = `translate3d(0, ${Math.min(y * 0.1, 36)}px, 0)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initRevealAnimations() {
    const revealItems = document.querySelectorAll(".reveal");
    if (!revealItems.length) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.15 });

      revealItems.forEach((item) => observer.observe(item));
      return;
    }

    revealItems.forEach((item) => item.classList.add("show"));
  }

  function initContactForm() {
    if (!contactForm || !formStatus) return;

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name || !email || !message) {
        formStatus.textContent = "Please complete all fields before sending.";
        formStatus.className = "text-sm text-red-400";
        return;
      }

      let delivered = true;
      const endpoint = contactForm.getAttribute("action") || "";

      if (endpoint && !endpoint.includes("your-form-id")) {
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" }
          });
          delivered = response.ok;
        } catch (error) {
          delivered = false;
        }
      }

      if (delivered) {
        formStatus.textContent = "Message sent successfully. I will get back to you soon.";
        formStatus.className = "text-sm text-emerald-400";
        alert(`Thanks, ${name}! Your message has been received.`);
        contactForm.reset();
        return;
      }

      formStatus.textContent = "Something went wrong. Please try again or message me on X.";
      formStatus.className = "text-sm text-amber-400";
    });
  }

  function initParticles() {
    const canvas = document.getElementById("particles");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const colors = ["rgba(34,211,238,0.9)", "rgba(168,85,247,0.9)", "rgba(236,72,153,0.8)"];
    const count = reducedMotion ? 20 : 46;

    let width = 0;
    let height = 0;
    let particles = [];

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function seedParticles() {
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.5,
        vx: (Math.random() - 0.5) * (reducedMotion ? 0.08 : 0.25),
        vy: (Math.random() - 0.5) * (reducedMotion ? 0.08 : 0.25),
        a: Math.random() * 0.5 + 0.2,
        c: colors[Math.floor(Math.random() * colors.length)]
      }));
    }

    function drawFrame() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -2) particle.x = width + 2;
        if (particle.x > width + 2) particle.x = -2;
        if (particle.y < -2) particle.y = height + 2;
        if (particle.y > height + 2) particle.y = -2;

        ctx.beginPath();
        ctx.globalAlpha = particle.a;
        ctx.fillStyle = particle.c;
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(drawFrame);
    }

    window.addEventListener("resize", () => {
      resizeCanvas();
      seedParticles();
    });

    resizeCanvas();
    seedParticles();
    drawFrame();
  }

  initMobileMenu();
  initSmoothScroll();
  initBackToTopAndParallax();
  initRevealAnimations();
  initContactForm();
  initParticles();
})();
