(function () {
  "use strict";

  const topbar = document.getElementById("topbar");
  const menu = document.getElementById("navMenu");

  if (topbar) {
    const SCROLL_THRESHOLD = 8;
    let ticking = false;

    const syncScrollState = () => {
      const scrolled = window.scrollY > SCROLL_THRESHOLD;
      topbar.setAttribute("data-scrolled", String(scrolled));
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(syncScrollState);
          ticking = true;
        }
      },
      { passive: true }
    );

    syncScrollState();
  }

  const inner = topbar ? topbar.querySelector(".topbar__inner") : null;
  if (menu && inner) {
    const root = document.documentElement;
    const isDesktop = () => window.matchMedia("(min-width: 721px)").matches;

    const syncContentWidth = () => {
      if (isDesktop()) {
        root.style.removeProperty("--content-max");
        const width = Math.ceil(inner.getBoundingClientRect().width);
        root.style.setProperty("--content-max", width + "px");
      } else {
        root.style.removeProperty("--content-max");
      }
    };

    syncContentWidth();
    window.addEventListener("resize", syncContentWidth, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncContentWidth);
    }
    window.addEventListener("load", syncContentWidth);
  }

  if (menu) {
    const spyLinks = Array.from(menu.querySelectorAll(".nav-link"))
      .map((link) => {
        const href = link.getAttribute("href") || "";
        if (!href.startsWith("#") || href === "#") return null;
        const section = document.querySelector(href);
        return section ? { link, section } : null;
      })
      .filter(Boolean);

    if (spyLinks.length) {
      const barHeight = topbar ? topbar.offsetHeight : 56;
      let spyTicking = false;

      const syncActive = () => {
        const probe = window.scrollY + barHeight + 24;
        let current = spyLinks[0];
        for (const entry of spyLinks) {
          if (entry.section.offsetTop <= probe) {
            current = entry;
          }
        }

        const atBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2;
        if (atBottom) {
          current = spyLinks[spyLinks.length - 1];
        }

        spyLinks.forEach((entry) => {
          const isActive = entry === current;
          entry.link.classList.toggle("is-active", isActive);
          if (isActive) {
            entry.link.setAttribute("aria-current", "true");
          } else {
            entry.link.removeAttribute("aria-current");
          }
        });
        spyTicking = false;
      };

      window.addEventListener(
        "scroll",
        () => {
          if (!spyTicking) {
            window.requestAnimationFrame(syncActive);
            spyTicking = true;
          }
        },
        { passive: true }
      );
      window.addEventListener("resize", syncActive, { passive: true });

      syncActive();
    }
  }

  const modal = document.getElementById("citeModal");
  const modalCode = document.getElementById("citeModalCode");
  const copyBtn = document.getElementById("citeModalCopy");
  const citeButtons = Array.from(document.querySelectorAll(".paper__cite"));

  if (modal && modalCode && citeButtons.length) {
    let lastTrigger = null;
    let copyResetTimer = null;

    const openModal = (trigger) => {
      const paper = trigger.closest(".paper");
      const source = paper ? paper.querySelector(".paper__bibtex") : null;
      const bibtex = source ? source.innerHTML : "";
      modalCode.textContent = decodeEntities(bibtex).trim();
      lastTrigger = trigger;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      resetCopyLabel();
      const closeEl = modal.querySelector(".cite-modal__close");
      if (closeEl) closeEl.focus();
    };

    const closeModal = () => {
      modal.hidden = true;
      document.body.style.overflow = "";
      if (lastTrigger) {
        lastTrigger.focus();
        lastTrigger = null;
      }
    };

    const decodeEntities = (html) => {
      const textarea = document.createElement("textarea");
      textarea.innerHTML = html;
      return textarea.value;
    };

    const resetCopyLabel = () => {
      if (copyResetTimer) {
        clearTimeout(copyResetTimer);
        copyResetTimer = null;
      }
      const label = copyBtn ? copyBtn.querySelector("span") : null;
      if (label) label.textContent = "Copy";
    };

    citeButtons.forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn));
    });

    modal.querySelectorAll("[data-cite-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    });

    if (copyBtn) {
      copyBtn.addEventListener("click", async () => {
        const text = modalCode.textContent;
        const label = copyBtn.querySelector("span");
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            const range = document.createRange();
            range.selectNodeContents(modalCode);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("copy");
            selection.removeAllRanges();
          }
          if (label) label.textContent = "Copied";
        } catch (err) {
          if (label) label.textContent = "Press Ctrl+C";
        }
        copyResetTimer = window.setTimeout(resetCopyLabel, 2000);
      });
    }
  }

  const updatesToggle = document.getElementById("updatesToggle");
  const updatesTimeline = document.getElementById("updatesTimeline");

  if (updatesToggle && updatesTimeline) {
    updatesToggle.addEventListener("click", () => {
      const expanded = updatesTimeline.classList.toggle("is-expanded");
      updatesToggle.setAttribute("aria-expanded", String(expanded));
      updatesToggle.textContent = expanded ? "Show less" : "Show more";
    });
  }
})();
