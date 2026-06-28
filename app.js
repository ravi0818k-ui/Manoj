// ============================================
// Candify — App Logic (Figma-matched)
// ============================================

(async function init() {
  const res = await fetch('data.json');
  const data = await res.json();

  renderNav(data);
  renderHero(data);
  renderTickers(data);
  renderIntro(data);
  renderProcess(data);
  renderTestimonials(data);
  renderWork(data);
  renderAbout(data);
  renderPricing(data);
  renderFAQ(data);
  renderFooter(data);

  initScrollAnimations();
  initNavScroll();
  initFAQToggle();
  initSmoothScroll();
})();

// === Render Functions ===

function renderNav(data) {
  document.getElementById('nav-logo').textContent = data.personal.name;
}

function renderHero(data) {
  document.title = data.site.title;

  // Tag
  document.getElementById('hero-tag').textContent = data.personal.tagline;

  // Title
  const titleEl = document.getElementById('hero-title');
  const lines = data.personal.headline.split('\n');
  titleEl.innerHTML = lines.map((line, i) => {
    if (i === lines.length - 1) return `<em>${line}</em>`;
    return `<span>${line}</span>`;
  }).join('<br>');

  // Subheadline
  document.getElementById('hero-sub').textContent = data.personal.subheadline;

  // Buttons
  const heroButtons = document.getElementById('hero-buttons');
  data.heroButtons.forEach(btn => {
    const a = document.createElement('a');
    a.href = btn.href;
    a.className = 'btn btn--primary';
    a.innerHTML = `<span>${btn.label}</span><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 15L15 5M15 5H6M15 5V14" stroke="currentColor" stroke-width="1.5"/></svg>`;
    heroButtons.appendChild(a);
  });

  // Trusted avatars
  const avatarsEl = document.getElementById('trusted-avatars');
  data.trustedLogos.forEach(logo => {
    const img = document.createElement('img');
    img.src = logo.image;
    img.alt = logo.name;
    img.loading = 'lazy';
    avatarsEl.appendChild(img);
  });
}

function renderTickers(data) {
  const grid = document.getElementById('tickers-grid');
  const images1 = data.projects.map(p => p.thumbnail);
  const images2 = [...images1].reverse();

  // Column 1 - scroll up
  const col1 = document.createElement('div');
  col1.className = 'tickers__col tickers__col--up';
  [...images1, ...images1].forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Project';
    img.loading = 'lazy';
    col1.appendChild(img);
  });
  grid.appendChild(col1);

  // Column 2 - scroll down
  const col2 = document.createElement('div');
  col2.className = 'tickers__col tickers__col--down';
  [...images2, ...images2].forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Project';
    img.loading = 'lazy';
    col2.appendChild(img);
  });
  grid.appendChild(col2);
}

function renderIntro(data) {
  document.getElementById('intro-greeting').textContent = data.intro.greeting;
  document.getElementById('intro-text').textContent = data.intro.text;

  const servicesEl = document.getElementById('intro-services');
  data.intro.services.forEach(service => {
    const pill = document.createElement('span');
    pill.className = 'intro__service-pill animate-on-scroll';
    pill.innerHTML = `<span>${service.icon}</span> ${service.label}`;
    servicesEl.appendChild(pill);
  });
}

function renderProcess(data) {
  document.getElementById('process-tag').textContent = data.process.sectionTag;
  document.getElementById('process-title').textContent = data.process.title;

  const cards = document.getElementById('process-cards');
  data.process.steps.forEach((step, i) => {
    const card = document.createElement('div');
    card.className = `process__card animate-on-scroll stagger-${i + 1}`;
    card.innerHTML = `
      <div class="process__card-num">${step.number}</div>
      <h3 class="process__card-title">${step.title}</h3>
      <p class="process__card-desc">${step.description}</p>
    `;
    cards.appendChild(card);
  });
}

function renderTestimonials(data) {
  const split = document.getElementById('testimonials-split');
  data.testimonials.forEach((t, i) => {
    if (i === 1) {
      const divider = document.createElement('div');
      divider.className = 'testimonials__divider';
      split.appendChild(divider);
    }
    const item = document.createElement('div');
    item.className = 'testimonials__item animate-on-scroll';
    item.innerHTML = `
      <span class="testimonials__quote-mark">"</span>
      <div class="testimonials__quote">${t.quote}</div>
      <div class="testimonials__author">
        ${t.avatar ? `<img class="testimonials__author-avatar" src="${t.avatar}" alt="${t.name}">` : '<div class="testimonials__author-avatar"></div>'}
        <div class="testimonials__author-info">
          <div class="testimonials__author-name">${t.name}</div>
          <div class="testimonials__author-role">${t.role || 'Founder & CEO'}</div>
        </div>
      </div>
    `;
    split.appendChild(item);
  });
}

function renderWork(data) {
  const grid = document.getElementById('work-grid');
  data.projects.forEach((project, i) => {
    const card = document.createElement('a');
    card.href = project.link;
    card.className = `work__card animate-on-scroll stagger-${(i % 4) + 1}`;
    card.innerHTML = `
      <div class="work__card-img-wrap">
        <img class="work__card-img" src="${project.thumbnail}" alt="${project.title}" loading="lazy">
      </div>
      <div class="work__card-info">
        <span class="work__card-title">${project.title}</span>
        <div class="work__card-tags">
          ${project.tags.map(tag => `<span class="work__tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderAbout(data) {
  document.getElementById('about-title').textContent = data.about.title;
  document.getElementById('about-photo').src = data.about.image;
  document.getElementById('about-photo').alt = data.personal.aboutName;
  document.getElementById('about-founder').textContent = data.personal.aboutRole;
  document.getElementById('about-bio').textContent = data.about.bio;

  // Social links
  const socials = document.getElementById('about-socials');
  const socialKeys = ['twitter', 'dribbble', 'linkedin', 'instagram'];
  socialKeys.forEach(key => {
    if (data.contact[key]) {
      const a = document.createElement('a');
      a.href = data.contact[key];
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = '●';
      a.title = key;
      socials.appendChild(a);
    }
  });

  // Experience table
  const expEl = document.getElementById('about-experience');
  data.about.experience.forEach(exp => {
    const row = document.createElement('div');
    row.className = 'about__exp-row';
    row.innerHTML = `<span>${exp.role}</span><span>${exp.company}</span><span>${exp.period}</span>`;
    expEl.appendChild(row);
  });
}

function renderPricing(data) {
  document.getElementById('pricing-tag').textContent = data.pricing.sectionTag;
  document.getElementById('pricing-title').textContent = data.pricing.title;

  const card = document.getElementById('pricing-card');
  const plan = data.pricing.plan;
  const testimonial = data.pricing.testimonial;

  card.innerHTML = `
    <div class="pricing__left">
      <div class="pricing__plan-name">${plan.name}</div>
      <div class="pricing__price">${plan.price}</div>
      <div class="pricing__spots">${plan.spotsInfo}</div>
      <a href="${plan.ctaLink}" class="btn btn--primary">
        <span>${plan.cta}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 15L15 5M15 5H6M15 5V14" stroke="currentColor" stroke-width="1.5"/></svg>
      </a>
    </div>
    <div class="pricing__right">
      <div class="pricing__features-title">What's included</div>
      <div class="pricing__features">
        ${plan.features.map(f => `<div class="pricing__feature">${f}</div>`).join('')}
      </div>
      <div class="pricing__testimonial">
        <div class="pricing__testimonial-quote">${testimonial.quote}</div>
        <div class="pricing__testimonial-author">
          <div class="pricing__testimonial-avatar"></div>
          <div>
            <div class="pricing__testimonial-name">${testimonial.name}</div>
            <div class="pricing__testimonial-role">${testimonial.role}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Benefits
  const benefitsEl = document.getElementById('pricing-benefits');
  plan.benefits.forEach(b => {
    const div = document.createElement('div');
    div.className = 'pricing__benefit animate-on-scroll';
    div.innerHTML = `${b}<span class="pricing__benefit-line"></span>`;
    benefitsEl.appendChild(div);
  });
}

function renderFAQ(data) {
  document.getElementById('faq-tag').textContent = data.faq.sectionTag;
  document.getElementById('faq-title').textContent = data.faq.title;

  // CTA card
  const ctaCard = document.getElementById('faq-cta');
  ctaCard.innerHTML = `
    <img class="faq__cta-avatar" src="${data.about.image}" alt="${data.personal.aboutName}">
    <div class="faq__cta-title">${data.faq.ctaTitle}</div>
    <div class="faq__cta-subtitle">${data.faq.ctaSubtitle}</div>
    <a href="${data.footer.ctaLink}" class="faq__cta-btn">
      <span>${data.faq.ctaCta}</span>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 15L15 5M15 5H6M15 5V14" stroke="currentColor" stroke-width="1.5"/></svg>
    </a>
    <div class="faq__cta-email">Or, email me at <a href="mailto:${data.faq.ctaEmail}">${data.faq.ctaEmail}</a></div>
  `;

  // FAQ items
  const list = document.getElementById('faq-list');
  data.faq.items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'faq__item';
    div.innerHTML = `
      <button class="faq__question">
        <span>${item.question}</span>
        <span class="faq__icon">+</span>
      </button>
      <div class="faq__answer">
        <p>${item.answer}</p>
      </div>
    `;
    list.appendChild(div);
  });
}

function renderFooter(data) {
  const footer = data.footer;

  // Tag
  const tagEl = document.getElementById('footer-tag');
  tagEl.innerHTML = `
    <span class="section-tag__line"></span>
    <em>${footer.spotTag}</em>
    <span class="section-tag__line"></span>
  `;

  document.getElementById('footer-headline').textContent = footer.headline;
  document.getElementById('footer-subtext').textContent = footer.subtext;

  const ctaBtn = document.getElementById('footer-cta');
  ctaBtn.href = footer.ctaLink;
  ctaBtn.querySelector('span').textContent = footer.cta;

  document.getElementById('footer-copyright').textContent = footer.copyright;

  // Socials
  const socials = document.getElementById('footer-socials');
  const socialKeys = ['twitter', 'dribbble', 'linkedin', 'instagram'];
  socialKeys.forEach(key => {
    if (data.contact[key]) {
      const a = document.createElement('a');
      a.href = data.contact[key];
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.title = key;
      a.textContent = key.charAt(0).toUpperCase();
      socials.appendChild(a);
    }
  });
}

// === Interactions ===

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

function initNavScroll() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });
}

function initFAQToggle() {
  document.addEventListener('click', (e) => {
    const question = e.target.closest('.faq__question');
    if (!question) return;
    const item = question.closest('.faq__item');
    document.querySelectorAll('.faq__item.active').forEach(active => {
      if (active !== item) active.classList.remove('active');
    });
    item.classList.toggle('active');
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}