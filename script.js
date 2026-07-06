document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navAnchors = document.querySelectorAll(".nav-links a");
  const revealItems = document.querySelectorAll(".reveal");
  const workflowGrid = document.querySelector(".workflow-grid");
  const workflowCards = document.querySelectorAll(".workflow-card");
  const workflowVisual = document.querySelector(".workflow-visual");
  const workflowDots = document.querySelectorAll("[data-workflow-dot]");
  const workflowDetailCard = document.querySelector("[data-workflow-detail]");
  const workflowDetailIcon = document.querySelector("[data-workflow-detail-icon]");
  const workflowDetailMeta = document.querySelector("[data-workflow-meta]");
  const workflowDetailTitle = document.querySelector("[data-workflow-title]");
  const workflowDetailText = document.querySelector("[data-workflow-text]");
  const playButton = document.querySelector(".play-button");
  const demoVideo = document.querySelector(".demo-video");
  const heroImage = document.querySelector(".hero-yolo-image");
  const modalTriggers = document.querySelectorAll("[data-open-modal]");
  const modals = document.querySelectorAll(".cad-modal");
  const modalCloseButtons = document.querySelectorAll("[data-close-modal]");
  const aiDemo = document.querySelector("[data-ai-demo]");
  let activeModal = null;
  let lastFocusedElement = null;

  const closeMenu = () => {
    if (!navToggle || !navLinks) return;
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
    body.classList.remove("menu-open");
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navLinks.classList.toggle("is-open", !isOpen);
      body.classList.toggle("menu-open", !isOpen);
    });

    navAnchors.forEach((anchor) => {
      anchor.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  const setActiveNav = (href) => {
    if (!href) return;

    navAnchors.forEach((anchor) => {
      anchor.classList.toggle("is-active", anchor.getAttribute("href") === href);
    });
  };

  const navTargets = Array.from(navAnchors)
    .map((anchor) => ({
      href: anchor.getAttribute("href"),
      section: document.querySelector(anchor.getAttribute("href")),
    }))
    .filter((item) => item.href && item.section);
  let navHashLockUntil = 0;

  const updateActiveNav = () => {
    if (!navTargets.length) return;

    const header = document.querySelector(".site-header");
    const headerHeight = header?.offsetHeight || 0;
    const activationLine = headerHeight + Math.min(window.innerHeight * 0.24, 180);
    let activeHref = navTargets[0].href;
    let largestVisibleArea = 0;

    navTargets.forEach(({ href, section }) => {
      const rect = section.getBoundingClientRect();
      const visibleTop = Math.max(rect.top, headerHeight);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);
      const visibleArea = Math.max(0, visibleBottom - visibleTop);

      if (visibleArea > largestVisibleArea) {
        largestVisibleArea = visibleArea;
        activeHref = href;
      }
    });

    if (largestVisibleArea === 0) {
      navTargets.forEach(({ href, section }) => {
        if (section.getBoundingClientRect().top <= activationLine) {
          activeHref = href;
        }
      });
    }

    const hashTarget = navTargets.find(({ href, section }) => href === window.location.hash && section);
    if (hashTarget) {
      const rect = hashTarget.section.getBoundingClientRect();
      const isHashTargetVisible = rect.top < window.innerHeight * 0.72 && rect.bottom > headerHeight;
      if (isHashTargetVisible || Date.now() < navHashLockUntil) {
        activeHref = hashTarget.href;
      }
    }

    setActiveNav(activeHref);
  };

  let navTicking = false;
  const requestNavUpdate = () => {
    if (navTicking) return;

    navTicking = true;
    window.requestAnimationFrame(() => {
      updateActiveNav();
      navTicking = false;
    });
  };

  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", () => {
      navHashLockUntil = Date.now() + 900;
      setActiveNav(anchor.getAttribute("href"));
      window.setTimeout(updateActiveNav, 450);
    });
  });

  window.addEventListener("scroll", requestNavUpdate, { passive: true });
  window.addEventListener("resize", requestNavUpdate);
  window.addEventListener("hashchange", () => {
    const matchingAnchor = Array.from(navAnchors).find((anchor) => anchor.getAttribute("href") === window.location.hash);
    if (matchingAnchor) {
      navHashLockUntil = Date.now() + 900;
      setActiveNav(matchingAnchor.getAttribute("href"));
    }
    window.setTimeout(updateActiveNav, 350);
  });
  window.addEventListener("load", () => {
    if (window.location.hash) {
      navHashLockUntil = Date.now() + 900;
      setActiveNav(window.location.hash);
    }

    window.setTimeout(updateActiveNav, 120);
    window.setTimeout(updateActiveNav, 650);
  });
  if (window.location.hash) {
    navHashLockUntil = Date.now() + 900;
    setActiveNav(window.location.hash);
  }
  updateActiveNav();

  const closeModal = () => {
    if (!activeModal) return;

    activeModal.classList.remove("is-open");
    activeModal.setAttribute("aria-hidden", "true");
    body.classList.remove("modal-open");
    activeModal = null;

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  const openModal = (modalId, trigger) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    lastFocusedElement = trigger || document.activeElement;
    activeModal = modal;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    body.classList.add("modal-open");

    const closeButton = modal.querySelector(".cad-modal-close");
    if (closeButton) closeButton.focus();
  };

  modalTriggers.forEach((trigger) => {
    const modalId = trigger.getAttribute("data-open-modal");

    trigger.addEventListener("click", () => openModal(modalId, trigger));

    trigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      event.preventDefault();
      openModal(modalId, trigger);
    });
  });

  modalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target.matches("[data-close-modal]")) {
        closeModal();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  if (aiDemo) {
    const aiStates = [
      {
        className: "Sedan",
        label: "Xe Sedan 94,2%",
        confidence: 94.2,
        sedan: 94.2,
        suv: 5.8,
        stable: 28,
      },
      {
        className: "SUV",
        label: "Xe SUV 92,8%",
        confidence: 92.8,
        sedan: 7.2,
        suv: 92.8,
        stable: 27,
      },
    ];

    const stabilityGrid = aiDemo.querySelector("[data-stability-grid]");
    const classBadge = aiDemo.querySelector("[data-ai-class-badge]");
    const tag = aiDemo.querySelector("[data-ai-tag]");
    const confidenceText = aiDemo.querySelector("[data-ai-confidence]");
    const sedanText = aiDemo.querySelector("[data-sedan-percent]");
    const suvText = aiDemo.querySelector("[data-suv-percent]");
    const stableText = aiDemo.querySelector("[data-stable-count]");
    const lockText = aiDemo.querySelector("[data-ai-lock]");
    const codeClass = aiDemo.querySelector("[data-code-class]");
    const codeConfidence = aiDemo.querySelector("[data-code-confidence]");
    let aiIndex = 0;
    let aiTimer = null;

    const formatPercent = (value) => `${value.toFixed(1).replace(".", ",")}%`;

    if (stabilityGrid && !stabilityGrid.children.length) {
      Array.from({ length: 30 }).forEach(() => {
        stabilityGrid.appendChild(document.createElement("span"));
      });
    }

    const renderAiState = (state) => {
      aiDemo.classList.toggle("is-suv", state.className === "SUV");
      aiDemo.classList.remove("is-targeting");
      void aiDemo.offsetWidth;
      aiDemo.classList.add("is-targeting");
      aiDemo.style.setProperty("--confidence", `${state.confidence}%`);
      aiDemo.style.setProperty("--sedan", `${state.sedan}%`);
      aiDemo.style.setProperty("--suv", `${state.suv}%`);

      if (classBadge) classBadge.textContent = state.className;
      if (tag) tag.textContent = state.label;
      if (confidenceText) confidenceText.textContent = formatPercent(state.confidence);
      if (sedanText) sedanText.textContent = formatPercent(state.sedan);
      if (suvText) suvText.textContent = formatPercent(state.suv);
      if (stableText) stableText.textContent = `${state.stable}/30 khung hình ổn định`;
      if (lockText) lockText.textContent = `ĐÃ KHÓA: ${state.className}`;
      if (codeClass) codeClass.textContent = state.className;
      if (codeConfidence) codeConfidence.textContent = state.confidence.toFixed(1);

      if (stabilityGrid) {
        Array.from(stabilityGrid.children).forEach((cell, index) => {
          cell.classList.toggle("is-active", index < state.stable);
        });
      }
    };

    const startAiDemo = () => {
      if (aiTimer) return;
      aiTimer = window.setInterval(() => {
        aiIndex = (aiIndex + 1) % aiStates.length;
        renderAiState(aiStates[aiIndex]);
      }, 3600);
    };

    const stopAiDemo = () => {
      if (!aiTimer) return;
      window.clearInterval(aiTimer);
      aiTimer = null;
    };

    renderAiState(aiStates[aiIndex]);

    const aiObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAiDemo();
          } else {
            stopAiDemo();
          }
        });
      },
      { threshold: 0.25 }
    );

    aiObserver.observe(aiDemo);
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -70px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  if (workflowVisual && workflowGrid && workflowCards.length) {
    let workflowIndex = 0;
    let workflowInterval = null;
    let workflowChangeTimer = null;

    const setWorkflowStep = (index) => {
      workflowIndex = (index + workflowCards.length) % workflowCards.length;
      const activeCard = workflowCards[workflowIndex];
      const progress = workflowCards.length > 1 ? (workflowIndex / (workflowCards.length - 1)) * 100 : 0;

      workflowVisual.style.setProperty("--workflow-progress", `${progress}%`);

      workflowCards.forEach((card, cardIndex) => {
        card.classList.toggle("is-active", cardIndex === workflowIndex);
        card.classList.toggle("is-complete", cardIndex < workflowIndex);
        card.setAttribute("aria-current", cardIndex === workflowIndex ? "step" : "false");
      });

      workflowDots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === workflowIndex);
        dot.classList.toggle("is-complete", dotIndex < workflowIndex);
      });

      if (workflowDetailMeta && workflowDetailTitle && workflowDetailText && activeCard) {
        workflowDetailMeta.textContent = activeCard.dataset.meta || "";
        workflowDetailTitle.textContent = activeCard.dataset.title || activeCard.querySelector("h3")?.textContent || "";
        workflowDetailText.textContent = activeCard.dataset.detail || activeCard.querySelector("p")?.textContent || "";
      }

      if (workflowDetailIcon && activeCard?.dataset.icon) {
        workflowDetailIcon.className = `workflow-detail-icon workflow-icon ${activeCard.dataset.icon}`;
      }

      if (workflowDetailCard) {
        window.clearTimeout(workflowChangeTimer);
        workflowDetailCard.classList.add("is-changing");
        workflowChangeTimer = window.setTimeout(() => {
          workflowDetailCard.classList.remove("is-changing");
        }, 260);
      }
    };

    const stopWorkflow = () => {
      window.clearInterval(workflowInterval);
      workflowInterval = null;
    };

    const startWorkflow = () => {
      stopWorkflow();
      workflowInterval = window.setInterval(() => {
        setWorkflowStep(workflowIndex + 1);
      }, 1900);
    };

    const chooseWorkflowStep = (index) => {
      setWorkflowStep(index);
      startWorkflow();
    };

    workflowCards.forEach((card, index) => {
      card.addEventListener("click", () => chooseWorkflowStep(index));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          chooseWorkflowStep(index);
        }
      });
    });

    workflowDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        chooseWorkflowStep(Number(dot.dataset.workflowDot || 0));
      });
    });

    setWorkflowStep(0);

    const workflowObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startWorkflow();
          } else {
            stopWorkflow();
          }
        });
      },
      {
        threshold: 0.35,
      }
    );

    workflowObserver.observe(workflowVisual);
  }

  if (playButton) {
    playButton.addEventListener("click", () => {
      const videoPlaceholder = playButton.closest(".video-placeholder");
      if (!videoPlaceholder) return;
      const video = videoPlaceholder.querySelector("video");

      if (video) {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }

        return;
      }

      videoPlaceholder.classList.toggle("is-playing");
      const isPlaying = videoPlaceholder.classList.contains("is-playing");
      playButton.setAttribute("aria-label", isPlaying ? "Tạm dừng video demo" : "Phát video demo");
    });
  }

  if (demoVideo) {
    const videoFrame = demoVideo.closest(".video-placeholder");

    const syncVideoState = () => {
      if (!videoFrame) return;

      const isPlaying = !demoVideo.paused && !demoVideo.ended;
      videoFrame.classList.toggle("is-playing", isPlaying);
      if (playButton) {
        playButton.setAttribute("aria-label", isPlaying ? "Tạm dừng video demo" : "Phát video demo");
      }
    };

    demoVideo.addEventListener("play", syncVideoState);
    demoVideo.addEventListener("pause", syncVideoState);
    demoVideo.addEventListener("ended", syncVideoState);
  }

  if (heroImage) {
    const markMissingHeroImage = () => {
      const frame = heroImage.closest(".hero-image-frame");
      if (!frame) return;

      frame.classList.add("image-missing");
      heroImage.setAttribute("hidden", "");
    };

    heroImage.addEventListener("error", markMissingHeroImage);

    if (heroImage.complete && heroImage.naturalWidth === 0) {
      markMissingHeroImage();
    }
  }
});
