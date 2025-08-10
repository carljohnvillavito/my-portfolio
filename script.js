// Mobile nav toggle
const navToggleButton = document.querySelector('.nav-toggle');
const primaryNav = document.getElementById('primary-nav');

if (navToggleButton && primaryNav) {
  navToggleButton.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    navToggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}

// Smooth scroll for anchor links
const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      primaryNav?.classList.remove('open');
      navToggleButton?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Typed text effect
const typedEl = document.querySelector('.typed');
if (typedEl) {
  const phrases = [
    'Frontend Developer',
    'IS Student',
    'Vibe Coder Enjoyer',
    '🥷',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const current = phrases[phraseIndex];
    const visible = current.substring(0, charIndex);
    typedEl.textContent = ` — ${visible}`;

    if (!isDeleting && charIndex < current.length) {
      charIndex++;
      setTimeout(typeLoop, 90);
    } else if (isDeleting && charIndex > 0) {
      charIndex--;
      setTimeout(typeLoop, 50);
    } else {
      if (!isDeleting) {
        isDeleting = true;
        setTimeout(typeLoop, 1200);
      } else {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeLoop, 250);
      }
    }
  }
  typeLoop();
}

// Simple scroll-reveal animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.section, .card, .about-card, .contact-card, .section-card').forEach((el) => {
  el.classList.add('will-reveal');
  observer.observe(el);
});

// Minimal CSS hooks for reveal
const style = document.createElement('style');
style.textContent = `
  .will-reveal { opacity: 0; transform: translateY(16px); transition: opacity .5s ease, transform .5s ease; }
  .reveal { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Project search filter
const projectSearchInput = document.getElementById('project-search');
const projectCards = document.querySelectorAll('.project-grid .card');
const projectCountEl = document.getElementById('project-count');
const noProjectResultsEl = document.getElementById('no-project-results');

function updateProjectCount() {
  const visibleCount = Array.from(projectCards).filter((c) => !c.hasAttribute('hidden')).length;
  if (projectCountEl) {
    projectCountEl.textContent = `${visibleCount} project${visibleCount === 1 ? '' : 's'}`;
  }
}

function filterProjects() {
  const q = (projectSearchInput?.value || '').trim().toLowerCase();
  Array.from(projectCards).forEach((card) => {
    const title = ((card.dataset.title || card.querySelector('h3')?.textContent || '')).toLowerCase();
    const description = ((card.dataset.description || card.querySelector('p')?.textContent || '')).toLowerCase();
    const matches = !q || title.includes(q) || description.includes(q);
    if (matches) {
      card.removeAttribute('hidden');
    } else {
      card.setAttribute('hidden', '');
    }
  });

  const anyVisible = Array.from(projectCards).some((c) => !c.hasAttribute('hidden'));
  if (noProjectResultsEl) noProjectResultsEl.style.display = anyVisible ? 'none' : 'block';
  updateProjectCount();
}

projectSearchInput?.addEventListener('input', filterProjects);
projectSearchInput?.addEventListener('search', filterProjects);
filterProjects();
