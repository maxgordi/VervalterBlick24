/* global window, document */
(() => {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  const headerHost = document.getElementById("site-header");
  const footerHost = document.getElementById("site-footer");
  const page = document.body?.dataset?.page || "";

  const navItems = [
    { href: "index.html", label: "Startseite", key: "startseite" },
    { href: "ueber-uns.html", label: "Über uns", key: "ueber-uns" },
    { href: "referenzen.html", label: "Referenzen", key: "referenzen" },
    { href: "blog.html", label: "Blog", key: "blog" },
    { href: "kontakt.html", label: "Kontakt", key: "kontakt" },
  ];

  const normalizePath = (path) => {
    if (!path) return "/index.html";
    if (path === "/") return "/index.html";
    return path;
  };

  const currentPath = normalizePath(window.location.pathname);

  const isActive = (item) => {
    if (page) return item.key === page;
    return normalizePath(item.href) === currentPath;
  };

  const renderHeader = () => {
    if (!headerHost) return;

    headerHost.innerHTML = `
      <header class="site-header" data-elevated="false">
        <div class="container site-header__row">
          <a class="brand" href="index.html" aria-label="Verewaltung – Startseite">
            <span class="brand__mark" aria-hidden="true"></span>
            <span class="brand__name">Verewaltung</span>
            <span class="brand__sub">Hausverwaltung</span>
          </a>
          <nav class="nav" aria-label="Hauptnavigation">
            <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-panel">
              <span class="nav__toggle-line" aria-hidden="true"></span>
              <span class="nav__toggle-line" aria-hidden="true"></span>
              <span class="nav__toggle-line" aria-hidden="true"></span>
              <span class="sr-only">Menü</span>
            </button>
            <div class="nav__panel" id="nav-panel">
              <ul class="nav__list">
                ${navItems
                  .map((item) => {
                    const active = isActive(item);
                    return `<li class="nav__item">
                      <a class="nav__link ${active ? "is-active" : ""}" href="${item.href}" ${
                      active ? 'aria-current="page"' : ""
                    }>${item.label}</a>
                    </li>`;
                  })
                  .join("")}
              </ul>
              <div class="nav__cta">
                <a class="btn btn--primary btn--small" href="kontakt.html#formular">Erstgespräch</a>
              </div>
            </div>
          </nav>
        </div>
      </header>
    `;

    const headerEl = headerHost.querySelector(".site-header");
    const toggle = headerHost.querySelector(".nav__toggle");
    const panel = headerHost.querySelector("#nav-panel");
    const navRoot = headerHost.querySelector(".nav");

    const setExpanded = (expanded) => {
      toggle?.setAttribute("aria-expanded", expanded ? "true" : "false");
      panel?.classList.toggle("is-open", expanded);
      document.documentElement.classList.toggle("nav-open", expanded);
    };

    toggle?.addEventListener("click", () => {
      const next = toggle.getAttribute("aria-expanded") !== "true";
      setExpanded(next);
    });

    panel?.addEventListener("click", (e) => {
      const target = e.target;
      if (target?.closest?.("a")) setExpanded(false);
    });

    window.addEventListener(
      "pointerdown",
      (e) => {
        const expanded = toggle?.getAttribute("aria-expanded") === "true";
        if (!expanded) return;
        const target = e.target;
        if (navRoot && target && !navRoot.contains(target)) setExpanded(false);
      },
      { passive: true },
    );

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setExpanded(false);
    });

    const onScroll = () => {
      const y = window.scrollY || 0;
      headerEl?.setAttribute("data-elevated", y > 16 ? "true" : "false");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  const renderFooter = () => {
    if (!footerHost) return;

    const year = new Date().getFullYear();
    footerHost.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="brand brand--footer">
                <span class="brand__mark" aria-hidden="true"></span>
                <span class="brand__name">Verewaltung</span>
                <span class="brand__sub">Hausverwaltung</span>
              </div>
              <p class="muted">
                Strukturierte Immobilienverwaltung in Stade & Hamburg – für Eigentümer, WEGs und Privatinvestoren.
              </p>
            </div>
            <div>
              <div class="footer-title">Navigation</div>
              <ul class="footer-links">
                ${navItems
                  .map((item) => `<li><a class="footer-link" href="${item.href}">${item.label}</a></li>`)
                  .join("")}
              </ul>
            </div>
            <div>
              <div class="footer-title">Kontakt</div>
              <ul class="footer-links">
                <li><a class="footer-link" href="mailto:kontakt@verewaltung.de">kontakt@verewaltung.de</a></li>
                <li><a class="footer-link" href="tel:+49000000000">+49 000 000000</a></li>
                <li><span class="muted">Stade • Hamburg • Norddeutschland</span></li>
              </ul>
            </div>
            <div>
              <div class="footer-title">Schnellkontakt</div>
              <a class="btn btn--secondary btn--full" href="kontakt.html#formular">Anfrage senden</a>
              <a class="btn btn--ghost btn--full" href="referenzen.html">Referenzen</a>
            </div>
          </div>
          <div class="footer-bottom">
            <span class="muted small">© ${year} Verewaltung</span>
            <span class="muted small">Impressum & Datenschutz (Platzhalter)</span>
          </div>
        </div>
      </footer>
    `;
  };

  const revealOnScroll = () => {
    const nodes = Array.from(document.querySelectorAll(".reveal"));
    if (!nodes.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -12% 0px" },
    );

    nodes.forEach((n) => io.observe(n));
  };

  const wireSpotlight = () => {
    if (prefersReducedMotion) return;
    let raf = 0;
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        document.documentElement.style.setProperty("--mx", String(x));
        document.documentElement.style.setProperty("--my", String(y));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
  };

  const wireHeroParallax = () => {
    if (prefersReducedMotion) return;
    const bg = document.querySelector(".hero__bg, .hero-split__media, .hero-min__media, .hero-ed__media, .hero-band__image");
    if (!bg) return;
    let raf = 0;
    const onMove = (e) => {
      const rect = bg.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        bg.style.setProperty("--px", String(x));
        bg.style.setProperty("--py", String(y));
      });
    };
    bg.addEventListener("pointermove", onMove, { passive: true });
    bg.addEventListener(
      "pointerleave",
      () => {
        bg.style.setProperty("--px", "0");
        bg.style.setProperty("--py", "0");
      },
      { passive: true },
    );
  };

  const animateCounters = () => {
    const counters = Array.from(document.querySelectorAll("[data-count]"));
    if (!counters.length) return;

    const startCounter = (el) => {
      const target = Number(el.getAttribute("data-count") || "0");
      const durationMs = 900;
      const start = performance.now();
      const startValue = 0;

      const tick = (now) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.round(startValue + (target - startValue) * eased);
        el.textContent = String(value);
        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      counters.forEach((el) => (el.textContent = el.getAttribute("data-count") || "0"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounter(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 },
    );

    counters.forEach((el) => io.observe(el));
  };

  const wireContactForm = () => {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const subject = String(fd.get("subject") || "").trim();
      const message = String(fd.get("message") || "").trim();

      const mailSubject = encodeURIComponent(`Anfrage: ${subject} – ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nE-Mail: ${email}\nTelefon: ${phone || "-"}\nThema: ${subject}\n\nNachricht:\n${message}\n`,
      );
      window.location.href = `mailto:kontakt@verewaltung.de?subject=${mailSubject}&body=${body}`;
    });
  };

  renderHeader();
  renderFooter();
  revealOnScroll();
  wireSpotlight();
  wireHeroParallax();
  animateCounters();
  wireContactForm();
})();