/* =========================================================
   GRILVEX — script.js
========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     0. PRELOADER
  --------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('done'), 350);
  });
  // fallback in case load already fired
  setTimeout(() => preloader.classList.add('done'), 2200);

  /* ---------------------------------------------------
     1. HEADER SCROLL STATE
  --------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  // NOTE: switching the "scrolled" class shrinks the navbar height (84px -> 66px).
  // That height change nudges the page's scroll position by a few pixels, which
  // used to re-cross the old single "y > 30" threshold and made the class toggle
  // on/off/on/on... in a loop -> the header visibly trembled non-stop whenever
  // scrollY hovered near 30 (e.g. right after clicking "Accueil"/the logo).
  // Fix: use two different thresholds (hysteresis) far enough apart that the
  // header's own height change can never cross both, and throttle with rAF so
  // we only evaluate once per frame instead of on every scroll tick.
  const SCROLL_ON = 80;
  const SCROLL_OFF = 40;
  let isScrolled = false;
  let scrollTicking = false;
  const evaluateScroll = () => {
    const y = window.scrollY;
    if (!isScrolled && y > SCROLL_ON) {
      isScrolled = true;
      header.classList.add('scrolled');
    } else if (isScrolled && y < SCROLL_OFF) {
      isScrolled = false;
      header.classList.remove('scrolled');
    }
    backToTop.classList.toggle('show', y > 700);
    scrollTicking = false;
  };
  const onScroll = () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(evaluateScroll);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  evaluateScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------------------------------------------
     2. MOBILE MENU
  --------------------------------------------------- */
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', isOpen);
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };
  burger.addEventListener('click', () => toggleMenu());
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  /* ---------------------------------------------------
     3. CURSOR GLOW (desktop)
  --------------------------------------------------- */
  const glow = document.getElementById('cursorGlow');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      glow.classList.add('active');
    });
    document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  }

  /* ---------------------------------------------------
     4. HERO PHOTO CAROUSEL
  --------------------------------------------------- */
  const heroSlides = document.querySelectorAll('#heroCarousel .hero-slide');
  if (heroSlides.length > 1) {
    let heroIndex = 0;
    setInterval(() => {
      heroSlides[heroIndex].classList.remove('active');
      heroIndex = (heroIndex + 1) % heroSlides.length;
      heroSlides[heroIndex].classList.add('active');
    }, 5000);
  }

  /* ---------------------------------------------------
     5. CATALOGUE DATA + RENDER
  --------------------------------------------------- */
  const categories = [
    { name: 'Panneaux de Criblage', mat: 'Acier haute résistance', desc: "Précision de tissage optimale pour le criblage d'agrégats, adaptée aux cadences minières les plus exigeantes.", specs: ['Ø fil 1.5–12 mm', 'Ouverture 2–100 mm', 'Bords renforcés'], imgs: ['images/WhatsApp Image 2026-08-07 at 16.55.57.jpeg','images/WhatsApp Image 2026-08-08 at 17.23.07.jpeg','images/WhatsApp Image 2026-08-08 at 17.23.07 (1).jpeg','https://5.imimg.com/data5/SELLER/Default/2022/12/KW/QX/VP/1224512/vibrating-screen-1000x1000.jpg'] },
    { name: 'Panneaux de Criblage en Polyuréthane', mat: 'Polyuréthane', desc: 'Longévité accrue, faible niveau sonore et excellente résistance à la déchirure et au colmatage.', specs: ['Anti-colmatage', 'Faible bruit', 'Durée de vie x3 vs acier'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.50.57.jpeg','images/WhatsApp Image 2026-08-08 at 19.50.57 (1).jpeg'] },
    { name: 'Grillage Ondulé Galvanisé', mat: 'Acier galvanisé', desc: "Ondulations régulières, haute résistance à l'humidité et à la corrosion, conçu pour les cribles lourds en carrière.", specs: ['Ø fil 3–10 mm', 'Ouverture 15–80 mm', 'Rouleaux sur mesure'], imgs: ['images/WhatsApp Image 2026-08-08 at 17.24.36.jpeg'] },
    { name: 'Grillage Ondulé Inox', mat: 'Inox 304 / 316', desc: "Résistance chimique maximale, idéal pour l'agroalimentaire, la pharmaceutique et les environnements corrosifs.", specs: ['Inox 304 / 316', 'Ouverture 2–50 mm', 'Certifié contact alimentaire'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.40.33.jpeg', 'images/WhatsApp Image 2026-08-08 at 19.40.32 (6).jpeg','images/WhatsApp Image 2026-08-08 at 19.40.32 (7).jpeg'] },
    { name: 'Grillage Ondulé', mat: 'Acier', desc: "Toile ondulée standard, robuste et économique, pour cribles légers à moyens.", specs: ['Ø fil 2–8 mm', 'Ouverture 10–60 mm', 'Livraison rapide'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.40.32.jpeg'] },
    { name: 'Grillage Ondulé Noir', mat: 'Acier noir', desc: "Toile ondulée en acier noir, idéale pour applications intérieures non exposées à la corrosion.", specs: ['Ø fil 2–8 mm', 'Finition brute noire', 'Prix compétitif'], imgs: ['images/WhatsApp Image 2026-08-08 at 16.38.46.jpeg'] },
    { name: 'Grillage en Inox', mat: 'Inox 304 / 316', desc: "Toile tissée fine en inox pour filtration, tamisage précis et environnements exigeants.", specs: ['Maille fine à moyenne', 'Inox 304 / 316', 'Résistant à la corrosion'], imgs: ['images/WhatsApp Image 2026-08-08 at 16.44.09.jpeg'] },
    { name: 'Grillage Simple Torsion Galvanisé', mat: 'Acier galvanisé', desc: "Maille losange classique pour clôtures de sécurité, protections de machines et délimitations de site.", specs: ['Galvanisé à chaud', 'Hauteur jusqu\'à 2 m', 'Pose rapide'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.40.32 (2).jpeg'] },
    { name: 'Grillage Simple Torsion Plastifié Vert', mat: 'Acier plastifié', desc: "Clôture losange plastifiée verte, esthétique et durable pour délimitations extérieures.", specs: ['Coloris vert', 'Fil plastifié PVC', 'Hauteur jusqu\'à 2 m'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.40.32 (1).jpeg'] },
    { name: 'Grillage Métallique en Acier Galvanisé', mat: 'Acier galvanisé', desc: "Toutes les mailles disponibles, pour tous vos besoins de tissage sur mesure.", specs: ['Toutes mailles disponibles', 'Acier galvanisé', 'Découpe sur mesure'], imgs: ['images/WhatsApp Image 2026-08-08 at 20.03.34.jpeg'] },
    { name: 'Panneau Grillage Rigide', mat: 'Acier galvanisé', desc: "Panneaux rigides prêts à poser pour clôtures résidentielles et industrielles.", specs: ['Structure rigide', 'Pose sur poteaux', 'Finition galvanisée ou plastifiée'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.40.31 (1).jpeg','images/WhatsApp Image 2026-08-08 at 19.40.31.jpeg'] },
    { name: 'Treillis Soudés', mat: 'Acier', desc: 'Panneaux rigides à mailles carrées, parfaits pour caillebotis, renforts béton et structures de protection.', specs: ['Maille 25–150 mm', 'Panneaux rigides', 'Découpe sur plan'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.30.03.jpeg','images/WhatsApp Image 2026-08-08 at 16.15.59.jpeg', 'images/WhatsApp Image 2026-08-08 at 16.15.58.jpeg'] },
    { name: 'Métal Déployé', mat: 'Acier / Aluminium', desc: 'Ventilation, filtration, garde-corps et protections décoratives — un seul métal, une infinité d\'usages.', specs: ['Maille losange', 'Acier ou alu', 'Épaisseur sur demande'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.40.32 (8).jpeg','images/WhatsApp Image 2026-08-08 at 19.40.32 (5).jpeg'] },
    { name: 'Caillebotis', mat: 'Acier galvanisé', desc: 'Passerelles et planchers industriels antidérapants, portants et durables pour zones à fort passage.', specs: ['Anti-dérapant', 'Charge lourde', 'Galvanisation à chaud'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.40.33 (4).jpeg','images/WhatsApp Image 2026-08-08 at 16.57.37.jpeg'] },
    { name: 'Tous Types de Fer', mat: 'Acier', desc: 'Barres, tubes, cornières et profilés en acier pour toutes vos constructions métalliques.', specs: ['Toutes sections', 'Stock permanent', 'Découpe sur mesure'], imgs: ['images/WhatsApp Image 2026-08-08 at 20.13.53.jpeg'] },
    { name: 'Inox', mat: 'Inox 304 / 316', desc: "Tubes, barres et accessoires en inox pour environnements corrosifs ou alimentaires.", specs: ['Inox 304 / 316', 'Toutes dimensions', 'Certifié contact alimentaire'], imgs: ['images/WhatsApp Image 2026-08-08 at 20.16.19.jpeg'] },
    { name: 'Tambour Convoyeur', mat: 'Acier / Inox', desc: 'Fourniture de tambour acier ou inox : fabrication, réparation et rénovation de tambours de convoyeur pour vos lignes de production.', specs: ['Acier ou inox', 'Diamètres variés', 'Rénovation sur site'], imgs: ['images/WhatsApp Image 2026-08-07 at 16.55.48.jpeg'] },
    { name: 'Rouleaux pour Convoyeur', mat: 'Acier / Caoutchouc', desc: 'Rouleau NUS, rouleaux amortisseurs et rouleaux porteurs pour toutes vos installations de convoyage.', specs: ['Rouleau NUS', 'Rouleaux amortisseurs', 'Diamètres et longueurs sur mesure'], imgs: ['images/WhatsApp Image 2026-08-07 at 17.03.02.jpeg'] },
    { name: 'Bande transporteuse', mat: ' Bande transporteuse', desc: 'Bande transporteuse  plis pour convoyage industriel de charges moyennes à lourdes.', specs: ['3 plis', 'Résistance à l\'abrasion', 'Largeurs sur mesure'], imgs: ['images/WhatsApp Image 2026-08-08 at 16.31.47.jpeg'] },
    { name: 'Fixation de Plaque pour Connecter les Bandes', mat: 'Acier', desc: 'Fixations et agrafes de plaque pour raccorder solidement vos bandes transporteuses.', specs: ['Compatible multi-plis', 'Pose rapide', 'Haute tenue mécanique'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.40.33 (5).jpeg'] },
    { name: 'Joints de Crible', mat: 'Caoutchouc', desc: "Étanchéité et amortissement des vibrations pour cribles vibrants, prolongeant la durée de vie du châssis.", specs: ['Caoutchouc renforcé', 'Sur-mesure', 'Anti-vibration'], imgs: ['images/WhatsApp Image 2026-08-07 at 17.05.45.jpeg'] },
    { name: 'Réducteur - Moteur', mat: 'Mécanique / Transmission', desc: 'Groupes réducteurs-moteurs pour l\'entraînement de vos convoyeurs et cribles industriels.', specs: ['Plusieurs puissances', 'Montage sur mesure', 'Maintenance et SAV'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.40.33 (3).jpeg'] },
    { name: 'Mâchoire', mat: 'Acier au manganèse', desc: 'Mâchoires de concasseur en acier au manganèse, haute résistance à l\'usure et à l\'impact.', specs: ['Acier au manganèse', 'Compatible principaux modèles', 'Haute résistance à l\'usure'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.40.33 (1).jpeg'] },
    { name: 'Cône', mat: 'Acier moulé', desc: 'Cônes de concasseur en acier moulé pour le remplacement de pièces d\'usure sur vos installations.', specs: ['Acier moulé', 'Plusieurs diamètres', 'Montage précis'], imgs: ['images/WhatsApp Image 2026-08-07 at 17.08.52.jpeg'] },
    { name: 'Boulons & Fixations', mat: 'Acier', desc: 'Quincaillerie industrielle complète pour montage, fixation et maintenance de vos installations.', specs: ['Toutes tailles', 'Zingué / inox', 'Stock permanent'], imgs: ['images/WhatsApp Image 2026-08-08 at 19.40.32 (4).jpeg'] },
    { name: 'Colle Forbo Helmitin® 1430', mat: 'Adhésif industriel', desc: 'Colle Forbo Helmitin® 1430, référence pour le collage de bandes transporteuses et revêtements.', specs: ['Boîte prête à l\'emploi', 'Forte adhérence', 'Usage industriel'], imgs: ['images/WhatsApp Image 2026-08-08 at 20.26.26 (1).jpeg'] },
    { name: 'Swift®prime 2903', mat: 'Primaire adhésif', desc: 'Swift®prime 2903, boîte de 700 g, primaire d\'accrochage pour préparation avant collage.', specs: ['Boîte de 700 g', 'Primaire d\'accrochage', 'Usage industriel'], imgs: ['images/WhatsApp Image 2026-08-08 at 20.26.26 (2).jpeg'] },
    { name: 'Ultraflex™ 56', mat: 'Adhésif à base de solvant', desc: 'Ultraflex™56, adhésifs à base de solvant pour le collage de bandes et revêtements industriels.', specs: ['Base solvant', 'Forte adhérence', 'Séchage rapide'], imgs: ['images/WhatsApp Image 2026-08-08 at 20.26.26.jpeg'] },
    { 
  name: 'Ressort ', 
  mat: 'Ressort en acier', 
  desc: 'Ressort  robuste destiné aux applications industrielles et mécaniques nécessitant une bonne résistance à la compression.', 
  specs: ['Acier haute résistance', 'Bonne élasticité', 'Usage industriel'], 
  imgs: ['images/WhatsApp Image 2026-08-09 at 16.09.35.jpeg','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp0RH7CNAP9pIBEJrj9gbZmBvTuBN0uzc5yoCLqLRbGQ&s', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm1hBzxN6dho4VgIBlgI3ykXL-k5xlP5CSVhF7HDJkoA&s=10'] 
},

{ 
  name: 'Rouleau de grillage ondulé HR', 
  mat: 'Grillage en fil HR', 
  desc: 'Rouleau de grillage ondulé en fil HR, conçu pour les applications industrielles nécessitant résistance, rigidité et durabilité.', 
  specs: ['Fil HR haute résistance', 'Grillage ondulé', 'Usage industriel'], 
  imgs: ['images/WhatsApp Image 2026-08-09 at 16.10.11.jpeg'] 
},

{ 
  name: 'Rouleau de grillage ondulé inox', 
  mat: 'Grillage en fil inoxydable', 
  desc: 'Rouleau de grillage ondulé en fil inoxydable, offrant une excellente résistance à la corrosion et adapté aux environnements industriels exigeants.', 
  specs: ['Fil inoxydable', 'Résistant à la corrosion', 'Usage industriel'], 
  imgs: ['images/WhatsApp Image 2026-08-09 at 16.10.28.jpeg'] 
},
{ 
  name: 'Bobine de tôle acier', 
  mat: 'Acier laminé', 
  desc: 'Bobine de tôle en acier destinée aux applications industrielles et métallurgiques, offrant une bonne résistance et adaptée aux opérations de transformation et de fabrication.', 
  specs: ['Acier laminé', 'Format en bobine', 'Usage industriel'], 
  imgs: ['images/WhatsApp Image 2026-08-10 at 15.57.50.jpeg', 'images/WhatsApp Image 2026-08-10 at 15.58.17.jpeg'] 
}, ];

  const catGrid = document.getElementById('catGrid');

  /* ---- Reusable swipeable photo carousel (used on cards + modal) ---- */
  function buildCarouselHTML(imgs, alt, extraClass) {
    const list = (imgs && imgs.length ? imgs : ['']);
    const slides = list.map((src, i) => `<div class="carousel-slide"${i === 0 ? ' data-active="true"' : ''}><img src="${src}" alt="${alt}" loading="lazy"></div>`).join('');
    const arrows = list.length > 1 ? `
      <button type="button" class="carousel-arrow prev" aria-label="Photo précédente"><svg class="ic" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
      <button type="button" class="carousel-arrow next" aria-label="Photo suivante"><svg class="ic" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>` : '';
    const dots = list.length > 1 ? `<div class="carousel-dots">${list.map((_, i) => `<button type="button" class="carousel-dot${i === 0 ? ' active' : ''}" aria-label="Photo ${i + 1}"></button>`).join('')}</div>` : '';
    return `<div class="photo-carousel ${extraClass || ''}" data-count="${list.length}">
        <div class="carousel-track">${slides}</div>
        ${arrows}
        ${dots}
      </div>`;
  }

  function initCarousel(root) {
    const carousel = root.querySelector('.photo-carousel');
    if (!carousel) return;
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const dots = Array.from(carousel.querySelectorAll('.carousel-dot'));
    const count = slides.length;
    let index = 0;

    const goTo = (i) => {
      index = (i + count) % count;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === index));
    };

    const prevBtn = carousel.querySelector('.carousel-arrow.prev');
    const nextBtn = carousel.querySelector('.carousel-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(index + 1); });
    dots.forEach((dot, i) => dot.addEventListener('click', (e) => { e.stopPropagation(); goTo(i); }));

    if (count > 1) {
      let startX = 0, deltaX = 0, dragging = false;
      const onStart = (x) => { dragging = true; startX = x; deltaX = 0; track.style.transition = 'none'; };
      const onMove = (x) => { if (!dragging) return; deltaX = x - startX; track.style.transform = `translateX(calc(-${index * 100}% + ${deltaX}px))`; };
      const onEnd = () => {
        if (!dragging) return;
        dragging = false;
        track.style.transition = '';
        if (Math.abs(deltaX) > 40) { goTo(index + (deltaX < 0 ? 1 : -1)); } else { goTo(index); }
      };
      carousel.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX), { passive: true });
      carousel.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
      carousel.addEventListener('touchend', onEnd);
      carousel.addEventListener('mousedown', (e) => { e.preventDefault(); onStart(e.clientX); });
      window.addEventListener('mousemove', (e) => onMove(e.clientX));
      window.addEventListener('mouseup', onEnd);
    }

    goTo(0);
  }

  categories.forEach((cat, i) => {
    const card = document.createElement('div');
    card.className = 'cat-card reveal';
    card.style.transitionDelay = `${(i % 4) * 0.06}s`;
    card.innerHTML = `
      <div class="cat-card-photo">
        ${buildCarouselHTML(cat.imgs, cat.name, 'carousel-card')}
      </div>
      <div class="cat-card-body">
        <span class="cat-mat">${cat.mat}</span>
        <h3>${cat.name}</h3>
        <p>${cat.desc}</p>
        <span class="cat-more">Voir la fiche <svg class="ic" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
      </div>
    `;
    initCarousel(card);
    card.addEventListener('click', () => openModal(cat));
    catGrid.appendChild(card);
  });

  /* ---------------------------------------------------
     6. PRODUCT MODAL
  --------------------------------------------------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalPhoto = document.getElementById('modalPhoto');
  const modalMaterial = document.getElementById('modalMaterial');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalClose = document.getElementById('modalClose');
  const modalCta = document.getElementById('modalCta');

  function openModal(cat) {
    modalPhoto.innerHTML = buildCarouselHTML(cat.imgs, cat.name, 'carousel-modal');
    initCarousel(modalPhoto);
    modalMaterial.textContent = cat.mat;
    modalTitle.textContent = cat.name;
    modalDesc.textContent = cat.desc;
    modalSpecs.innerHTML = cat.specs.map(s => `<span>${s}</span>`).join('');
    modalCta.dataset.product = cat.name;
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* "Demander un devis pour ce produit" -> pre-fill the quote form with the product name */
  const productField = document.getElementById('productField');
  const selectedProductTag = document.getElementById('selectedProductTag');
  const selectedProductName = document.getElementById('selectedProductName');
  const selectedProductClear = document.getElementById('selectedProductClear');

  function setSelectedProduct(name) {
    productField.value = name || '';
    if (name) {
      selectedProductName.textContent = name;
      selectedProductTag.classList.add('show');
    } else {
      selectedProductTag.classList.remove('show');
    }
  }

  modalCta.addEventListener('click', (e) => {
    e.preventDefault();
    setSelectedProduct(modalCta.dataset.product || '');
    closeModal();
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => document.getElementById('nameField').focus(), 650);
  });

  if (selectedProductClear) {
    selectedProductClear.addEventListener('click', () => setSelectedProduct(''));
  }

  /* ---------------------------------------------------
     7. WEAVE GALLERY (bibliothèque de tissages)
  --------------------------------------------------- */
  const weaves = [
    { label: 'Tissage Toile', tag: 'Fin – filtration', img: 'https://images.unsplash.com/photo-1648583189779-536c76a17957?auto=format&fit=crop&w=600&q=70' },
    { label: 'Torsion Simple', tag: 'Losange – clôture', img: 'https://images.unsplash.com/photo-1517265598349-76511a2fb389?auto=format&fit=crop&w=600&q=70' },
    { label: 'Ondulé Renforcé', tag: 'Lourd – criblage', img: 'https://images.unsplash.com/photo-1605455861849-0ff83304ac44?auto=format&fit=crop&w=600&q=70' },
    { label: 'Soudé Rigide', tag: 'Carré – structure', img: 'https://images.unsplash.com/photo-1550531500-e4182793ff06?auto=format&fit=crop&w=600&q=70' }
  ];
  const weaveGallery = document.getElementById('weaveGallery');
  weaves.forEach((w, i) => {
    const tile = document.createElement('div');
    tile.className = 'weave-tile reveal';
    tile.style.transitionDelay = `${i * 0.08}s`;
    tile.innerHTML = `
      <div class="weave-swatch"><img src="${w.img}" alt="${w.label}" loading="lazy"></div>
      <div class="weave-tile-label"><strong>${w.label}</strong><span>${w.tag}</span></div>
    `;
    weaveGallery.appendChild(tile);
  });

  /* ---------------------------------------------------
     8. STATS COUNTER
  --------------------------------------------------- */
  const statNums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statsObserver.observe(el));

  /* ---------------------------------------------------
     9. SCROLL REVEAL
  --------------------------------------------------- */
  const revealTargets = document.querySelectorAll(
    '.reveal, .section-head, .why-card, .stat-card, .apropos-copy, .apropos-visual, .contact-intro, .quote-form, .config-intro, .config-preview'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------
     10. MESH CONFIGURATOR
  --------------------------------------------------- */
  const wireRange = document.getElementById('wireRange');
  const openRange = document.getElementById('openRange');
  const wireVal = document.getElementById('wireVal');
  const openVal = document.getElementById('openVal');
  const freeArea = document.getElementById('freeArea');
  const useCase = document.getElementById('useCase');
  const configSvg = document.getElementById('configSvg');

  function setRangeFill(input) {
    const min = parseFloat(input.min), max = parseFloat(input.max), val = parseFloat(input.value);
    const pct = ((val - min) / (max - min)) * 100;
    input.style.setProperty('--fill', pct + '%');
  }

  function getUseCase(opening) {
    if (opening <= 8) return 'Filtration fine / criblage précis';
    if (opening <= 25) return 'Criblage moyen / concassage';
    if (opening <= 55) return 'Criblage lourd / carrière';
    return 'Gros calibre / pré-criblage';
  }

  function renderConfig() {
    const wire = parseFloat(wireRange.value);
    const open = parseFloat(openRange.value);
    wireVal.textContent = wire.toFixed(1) + ' mm';
    openVal.textContent = open.toFixed(0) + ' mm';
    setRangeFill(wireRange);
    setRangeFill(openRange);

    const pitch = wire + open; // center-to-center
    const area = Math.pow(open / pitch, 2) * 100;
    freeArea.textContent = area.toFixed(1) + '%';
    useCase.textContent = getUseCase(open);

    // Draw scaled mesh preview: fit ~5 cells across viewbox 320
    const cellsAcross = 5;
    const size = 320;
    const cell = size / cellsAcross;
    const scale = cell / pitch;
    const wirePx = Math.max(wire * scale, 1);
    const openPx = open * scale;

    let svg = `<g fill="none">`;
    for (let r = -1; r <= cellsAcross; r++) {
      for (let c = -1; c <= cellsAcross; c++) {
        const cx = c * cell + cell / 2;
        const cy = r * cell + cell / 2;
        svg += `<rect x="${cx - openPx/2}" y="${cy - openPx/2}" width="${openPx}" height="${openPx}" fill="rgba(13,132,214,0.08)" stroke="#0D84D6" stroke-width="${wirePx}"></rect>`;
      }
    }
    svg += `</g>`;
    configSvg.innerHTML = svg;
  }

  [wireRange, openRange].forEach(r => r.addEventListener('input', renderConfig));
  renderConfig();

  const configToQuote = document.getElementById('configToQuote');
  configToQuote.addEventListener('click', () => {
    document.getElementById('wireField').value = parseFloat(wireRange.value).toFixed(1);
    document.getElementById('openField').value = parseFloat(openRange.value).toFixed(0);
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth', block: 'start' });
    const form = document.getElementById('quoteForm');
    form.classList.add('reveal', 'in');
    setTimeout(() => document.getElementById('nameField').focus(), 700);
  });

  /* ---------------------------------------------------
     11. QUOTE FORM SUBMIT — redirection directe vers WhatsApp
  --------------------------------------------------- */
  const QUOTE_WHATSAPP_NUMBER = '212668880667';

  const quoteForm = document.getElementById('quoteForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('nameField');
    const phone = document.getElementById('phoneField');
    let valid = true;
    [name, phone].forEach(f => {
      if (!f.value.trim()) { f.style.borderColor = '#e0574f'; valid = false; }
      else { f.style.borderColor = '#dfe3e5'; }
    });
    if (!valid) return;

    submitBtn.querySelector('.btn-text').textContent = 'Redirection vers WhatsApp...';
    submitBtn.disabled = true;

    const product = document.getElementById('productField').value.trim();
    const wire = document.getElementById('wireField').value.trim();
    const opening = document.getElementById('openField').value.trim();
    const width = document.getElementById('widthField').value.trim();
    const length = document.getElementById('lengthField').value.trim();
    const note = document.getElementById('messageField').value.trim();

    const lines = [
      'Bonjour GRILVEX, je souhaite une demande de devis :',
      '',
      `• Nom : ${name.value.trim()}`,
      `• Téléphone : ${phone.value.trim()}`
    ];
    if (product) lines.push(`• Produit : ${product}`);
    if (wire)   lines.push(`• Diamètre du fil : ${wire} mm`);
    if (opening) lines.push(`• Ouverture de maille : ${opening} mm`);
    if (width)  lines.push(`• Largeur de la toile : ${width} m`);
    if (length) lines.push(`• Longueur de la toile : ${length} m`);
    if (note) { lines.push(''); lines.push(`Précisions : ${note}`); }

    const waUrl = `https://wa.me/${QUOTE_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;

    setTimeout(() => {
      formSuccess.classList.add('show');
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      window.open(waUrl, '_blank', 'noopener');
      submitBtn.querySelector('.btn-text').textContent = 'Obtenir mon devis';
      submitBtn.disabled = false;
      quoteForm.reset();
      setSelectedProduct('');
      setTimeout(() => formSuccess.classList.remove('show'), 6000);
    }, 600);
  });

  /* ---------------------------------------------------
     12. NEWSLETTER FORM
  --------------------------------------------------- */
  const newsForm = document.getElementById('newsForm');
  newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsForm.querySelector('input');
    const btn = newsForm.querySelector('button');
    const original = input.placeholder;
    input.value = '';
    input.placeholder = 'Merci, à bientôt !';
    btn.style.background = '#0D84D6';
    setTimeout(() => { input.placeholder = original; }, 3500);
  });

  /* ---------------------------------------------------
     13. WHATSAPP LINK
  --------------------------------------------------- */
  const wa = document.getElementById('whatsappFab');
  wa.href = 'https://wa.me/212668880667?text=' + encodeURIComponent('Bonjour GRILVEX, je souhaite un devis pour du grillage industriel.');

  /* ---------------------------------------------------
     14. FOOTER YEAR
  --------------------------------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------
     15. SMOOTH NAV LINK CLICK (offset for sticky header)
  --------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]:not(#modalCta)').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          const offset = window.innerWidth < 900 ? 20 : 90;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

});