/**
 * MENTE EM EQUILÍBRIO — Script Principal
 * JavaScript puro responsável pelas interações da página:
 * - Menu mobile responsivo
 * - Destaque do link ativo e barra de progresso ao rolar
 * - Animações discretas ao exibir elementos na tela
 * - Efeito de brilho suave ao passar o mouse nos cards
 * - Perguntas e respostas interativas (Mitos e Verdades)
 * - Botão de voltar ao topo
 */

document.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.getElementById("siteHeader");
  const scrollProgressBar = document.getElementById("scrollProgressBar");
  const backToTopButton = document.getElementById("backToTop");

  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");
  const desktopLinks = document.querySelectorAll(".nav-link");

  const sections = document.querySelectorAll("main section[id]");
  const revealElements = document.querySelectorAll(".reveal");
  const glowCards = document.querySelectorAll(".glow-card");
  const faqItems = document.querySelectorAll(".faq-item");

  /* =========================================================
     1. MENU MOBILE (ABRIR / FECHAR)
     ========================================================= */
  function setMobileMenuState(isOpen) {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.classList.toggle("is-open", isOpen);
    mobileMenu.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
    );
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isCurrentlyOpen = mobileMenu.classList.contains("is-open");
      setMobileMenuState(!isCurrentlyOpen);
    });

    // Fecha o menu ao clicar em qualquer link
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setMobileMenuState(false);
      });
    });

    // Fecha o menu ao pressionar a tecla Escape
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        setMobileMenuState(false);
      }
    });

    // Fecha o menu ao redimensionar para desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1120 && mobileMenu.classList.contains("is-open")) {
        setMobileMenuState(false);
      }
    });
  }

  /* =========================================================
     2. ROLAGEM: HEADER, PROGRESSO, VOLTAR AO TOPO E MENU ATIVO
     ========================================================= */
  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 140;
    let activeId = "inicio";

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        activeId = section.id;
      }
    });

    // Mapeia a seção Mitos e Verdades para manter um item coerente destacado no menu
    const navTargetId = activeId === "mitos-e-verdades" ? "tratamento" : activeId;

    desktopLinks.forEach((link) => {
      const hrefId = link.getAttribute("href").replace("#", "");
      link.classList.toggle("is-active", hrefId === navTargetId);
    });

    mobileLinks.forEach((link) => {
      const hrefId = link.getAttribute("href").replace("#", "");
      link.classList.toggle("is-active", hrefId === activeId);
    });
  }

  function handleScroll() {
    const scrollTop = window.scrollY;
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    // Cabeçalho com fundo discreto após rolar
    if (siteHeader) {
      siteHeader.classList.toggle("is-scrolled", scrollTop > 24);
    }

    // Barra de progresso no topo
    if (scrollProgressBar && documentHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100));
      scrollProgressBar.style.width = `${progress}%`;
    }

    // Botão de voltar ao topo
    if (backToTopButton) {
      backToTopButton.classList.toggle("is-visible", scrollTop > 420);
    }

    updateActiveNavLink();
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* =========================================================
     3. BOTÃO VOLTAR AO TOPO
     ========================================================= */
  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* =========================================================
     4. ANIMAÇÃO DISCRETA AO APARECER NA TELA
     ========================================================= */
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const delay = Number(entry.target.dataset.delay || 0);
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback para navegadores antigos
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* =========================================================
     5. BRILHO SUAVE SEGUINDO O MOUSE NOS CARDS
     ========================================================= */
  glowCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
    });
  });

  /* =========================================================
     6. SEÇÃO INTERATIVA: MITOS E VERDADES
     ========================================================= */
  faqItems.forEach((item) => {
    const questionButton = item.querySelector(".faq-question");
    if (!questionButton) return;

    questionButton.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Fecha outras perguntas abertas para manter a leitura organizada
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("is-open");
          const otherBtn = otherItem.querySelector(".faq-question");
          if (otherBtn) {
            otherBtn.setAttribute("aria-expanded", "false");
          }
        }
      });

      item.classList.toggle("is-open", !isOpen);
      questionButton.setAttribute("aria-expanded", String(!isOpen));
    });
  });
});
