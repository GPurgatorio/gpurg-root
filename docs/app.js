
document.addEventListener('DOMContentLoaded', () => {
  // Validate configuration object availability
  if (typeof CONFIG === 'undefined') {
    console.error('Configuration object (CONFIG) is missing.');
    return;
  }

  initCursorGlow();
  renderHero(CONFIG.hero);
  renderBentoGrid(CONFIG.cards);
  setupModals(CONFIG.modals);
  setupFooterPrivacyLink();
});

// Cursor spotlight glow effect
function initCursorGlow() {
  const glowEl = document.getElementById('cursor-glow');
  if (!glowEl) return;

  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;
  let ticking = false;

  window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const xPct = ((e.clientX / windowWidth) * 100).toFixed(2);
        const yPct = ((e.clientY / windowHeight) * 100).toFixed(2);
        
        document.documentElement.style.setProperty('--mouse-x', `${xPct}%`);
        document.documentElement.style.setProperty('--mouse-y', `${yPct}%`);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// Hero section renderer
function renderHero(hero) {
  const heroContainer = document.getElementById('hero-container');
  if (!heroContainer) return;

  heroContainer.innerHTML = `
    <div class="hero-card animate-fade-in">
      <div class="hero-avatar-wrapper">
        <img 
          src="${escapeHTML(hero.avatar)}" 
          alt="${escapeHTML(hero.name)}" 
          class="hero-avatar"
          width="110"
          height="110"
          loading="eager"
          fetchpriority="high"
          id="hero-avatar-img"
        />
        <div class="avatar-fallback" id="hero-avatar-fallback" style="display: none;">
          ${escapeHTML(getInitials(hero.name))}
        </div>
      </div>
      <div class="hero-info">
        <div class="hero-header-row">
          <h1 class="hero-name">${escapeHTML(hero.name)}</h1>
          ${hero.status && hero.status.active ? `
            <div class="status-badge" aria-label="Status: ${escapeHTML(hero.status.text)}">
              <span class="status-pulse" aria-hidden="true"></span>
              <span class="status-text">${escapeHTML(hero.status.text)}</span>
            </div>
          ` : ''}
        </div>
        <p class="hero-title">${escapeHTML(hero.title)}</p>
        <p class="hero-tagline">${escapeHTML(hero.tagline)}</p>
      </div>
    </div>
  `;

  // Avatar error fallback
  const avatarImg = document.getElementById('hero-avatar-img');
  const avatarFallback = document.getElementById('hero-avatar-fallback');
  if (avatarImg && avatarFallback) {
    avatarImg.addEventListener('error', () => {
      avatarImg.style.display = 'none';
      avatarFallback.style.display = 'flex';
    });
  }
}

// Bento grid renderer & 3D tilt
function renderBentoGrid(cards) {
  const gridContainer = document.getElementById('bento-grid-container');
  if (!gridContainer) return;

  gridContainer.innerHTML = '';

  cards.forEach((card, index) => {
    const cardEl = document.createElement('a');
    cardEl.id = card.id;
    cardEl.className = `bento-card size-${card.size || 'medium'} animate-fade-in`;
    cardEl.setAttribute('data-accent', card.accent || 'cyan');
    cardEl.setAttribute('tabindex', '0');
    cardEl.style.animationDelay = `${(index + 1) * 0.1}s`;

    if (card.action.type === 'link') {
      cardEl.href = card.action.url;
      cardEl.target = card.action.target || '_blank';
      cardEl.rel = 'noopener noreferrer';
    } else {
      cardEl.href = `#${card.action.modalId}`;
      cardEl.setAttribute('role', 'button');
      cardEl.setAttribute('aria-haspopup', 'dialog');
      cardEl.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(card.action.modalId, cardEl);
      });

      cardEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card.action.modalId, cardEl);
        }
      });
    }

    cardEl.innerHTML = `
      <div class="card-top">
        <div class="card-icon-box">
          ${renderIcon(card.icon)}
        </div>
        ${card.badge ? `<span class="card-badge">${escapeHTML(card.badge)}</span>` : ''}
      </div>
      <div class="card-bottom">
        <div class="card-title-row">
          <h3 class="card-title">${escapeHTML(card.title)}</h3>
          ${renderIcon('arrow-up-right')}
        </div>
        <p class="card-description">${escapeHTML(card.description)}</p>
      </div>
    `;

    attach3DTilt(cardEl);
    gridContainer.appendChild(cardEl);
  });
}

// 3D Tilt effect
function attach3DTilt(card) {
  let bounds;
  let ticking = false;

  function update(e) {
    if (!bounds) return;
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;
    const leftPct = mouseX / bounds.width;
    const topPct = mouseY / bounds.height;
    
    const rotateX = (topPct - 0.5) * -12;
    const rotateY = (leftPct - 0.5) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    ticking = false;
  }

  card.addEventListener('mouseenter', () => {
    bounds = card.getBoundingClientRect();
  }, { passive: true });

  card.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => update(e));
      ticking = true;
    }
  }, { passive: true });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

// Modal Dialog System
let activeModalId = null;
let lastFocusedElement = null;

function setupModals(modalsConfig) {
  const modalsContainer = document.getElementById('modals-container');
  if (!modalsContainer) return;

  modalsContainer.innerHTML = '';

  Object.keys(modalsConfig).forEach((modalId) => {
    const modalData = modalsConfig[modalId];
    const modalOverlay = document.createElement('div');
    modalOverlay.id = modalId;
    modalOverlay.className = 'modal-overlay';
    modalOverlay.setAttribute('role', 'dialog');
    modalOverlay.setAttribute('aria-modal', 'true');
    modalOverlay.setAttribute('aria-labelledby', `${modalId}-title`);

    let innerContentHTML = '';

    if (modalData.type === 'cv-selector') {
      innerContentHTML = `
        <div class="cv-options-grid">
          ${modalData.options.map(opt => {
            const isFeatured = opt.badge && opt.badge.toLowerCase().includes('recommended');
            return `
              <a href="${escapeHTML(opt.url)}" ${opt.download ? `download="${escapeHTML(opt.download)}"` : ''} target="${escapeHTML(opt.target || '_blank')}" rel="noopener noreferrer" class="cv-option-card ${isFeatured ? 'is-featured' : ''}">
                <div class="cv-option-left">
                  <div class="cv-option-icon">
                    ${renderIcon(opt.icon)}
                  </div>
                  <div class="cv-option-info">
                    <div class="cv-option-header">
                      <h4>${escapeHTML(opt.title)}</h4>
                      ${opt.badge ? `<span class="option-badge ${isFeatured ? 'badge-featured' : ''}">${escapeHTML(opt.badge)}</span>` : ''}
                    </div>
                    <p>${escapeHTML(opt.description)}</p>
                  </div>
                </div>
                <button class="cv-btn-cta ${isFeatured ? 'primary' : 'secondary'}" type="button">${escapeHTML(opt.cta)}</button>
              </a>
            `;
          }).join('')}
        </div>
      `;
    } else if (modalData.type === 'social-list') {
      innerContentHTML = `
        <div class="social-list-grid">
          ${modalData.profiles.map(p => `
            <a href="${escapeHTML(p.url)}" target="_blank" rel="noopener noreferrer" class="social-item">
              <div class="social-left">
                <div class="social-icon-box">
                  ${renderIcon(p.icon)}
                </div>
                <div class="social-info">
                  <h4>${escapeHTML(p.platform)}</h4>
                  <p>${escapeHTML(p.handle)}</p>
                </div>
              </div>
              <span class="social-badge">${escapeHTML(p.badge || p.stat)}</span>
            </a>
          `).join('')}
        </div>
      `;
    } else if (modalData.type === 'privacy-notice') {
      innerContentHTML = `
        <div class="privacy-notice-container">
          ${modalData.sections.map(sec => `
            <div class="privacy-section-card">
              <div class="privacy-section-header">
                <div class="privacy-icon-box">
                  ${renderIcon(sec.icon)}
                </div>
                <h4>${escapeHTML(sec.title)}</h4>
              </div>
              <div class="privacy-section-body">
                <p>${escapeHTML(sec.content)}${sec.contactEmail ? ` <a href="mailto:${escapeHTML(sec.contactEmail)}" class="privacy-email-link">${escapeHTML(sec.contactEmail)}</a>.` : ''}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    modalOverlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <h3 id="${modalId}-title" class="modal-title">${escapeHTML(modalData.title)}</h3>
            ${modalData.subtitle ? `<p class="modal-subtitle">${escapeHTML(modalData.subtitle)}</p>` : ''}
          </div>
          <button class="modal-close-btn" aria-label="Close dialog" type="button">
            ${renderIcon('x')}
          </button>
        </div>
        <div class="modal-body">
          ${innerContentHTML}
        </div>
      </div>
    `;

    // Attach close button click handler programmatically (No inline onclick)
    const closeBtn = modalOverlay.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeActiveModal);
    }

    // Close on overlay backdrop click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeActiveModal();
      }
    });

    // Modal Focus Trap
    modalOverlay.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusableEls = modalOverlay.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    });

    modalsContainer.appendChild(modalOverlay);
  });

  // Global ESC key listener registered ONCE
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModalId) {
      closeActiveModal();
    }
  });
}

function openModal(modalId, triggerElement = null) {
  const modalEl = document.getElementById(modalId);
  if (!modalEl) return;

  lastFocusedElement = triggerElement || document.activeElement;
  activeModalId = modalId;
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtn = modalEl.querySelector('.modal-close-btn');
  if (closeBtn) closeBtn.focus();
}

function closeActiveModal() {
  if (!activeModalId) return;
  const modalEl = document.getElementById(activeModalId);
  if (modalEl) {
    modalEl.classList.remove('active');
  }
  activeModalId = null;
  document.body.style.overflow = '';

  // Restore focus to trigger element for accessibility
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function setupFooterPrivacyLink() {
  const privacyLink = document.getElementById('privacy-link');
  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('modal-privacy', privacyLink);
    });
    privacyLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal('modal-privacy', privacyLink);
      }
    });
  }
}

/* Inline Vector Icons (Lucide / Feather icon sets under ISC/MIT License) */
const SVG_ICONS = {
  "calendar-check": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>`,
  "share-2": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`,
  "file-code-2": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m5 12-3 3 3 3"/><path d="m9 18 3-3-3-3"/></svg>`,
  "gamepad-2": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="11" y2="11"/><rect width="20" height="12" x="2" y="6" rx="6"/></svg>`,
  "download": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  "arrow-up-right": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-arrow"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`,
  "x": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  "shield-check": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
  "server": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
  "eye-off": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .698 10.75 10.75 0 0 1-2.905 4.306"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499A10.75 10.75 0 0 1 2.062 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 4.417-5.17"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
  "lock": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  "linkedin": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
  "github": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  "twitter": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
  "instagram": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  "mail": `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  "star": `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
};

function renderIcon(iconName) {
  if (!iconName) return SVG_ICONS['star'];
  const nameLower = iconName.toLowerCase().trim();
  return SVG_ICONS[nameLower] || SVG_ICONS['star'];
}

function getInitials(name) {
  if (!name) return 'GP';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
