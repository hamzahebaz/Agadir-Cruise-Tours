import fs from 'fs';
import path from 'path';
import { tours } from './data.js';

const __dirname = path.resolve();

// HTML Template function
function getTemplate(tour) {
  // Generate highlights HTML
  const highlightsHTML = tour.highlights.map(h => `<li><i data-lucide="check-circle" class="highlight-check-icon"></i> <span>${h}</span></li>`).join('\n');
  
  // Generate included HTML
  const includedHTML = tour.included.map(i => `<li><i data-lucide="check" class="included-check-icon"></i> <span>${i}</span></li>`).join('\n');
  
  // Generate important info HTML
  const importantInfoHTML = tour.importantInfo.map(info => `<li><i data-lucide="info" class="info-alert-icon"></i> <span>${info}</span></li>`).join('\n');

  // Generate languages HTML
  const languagesHTML = tour.languages.map(l => `<span class="lang-tag">${l}</span>`).join(' ');

  // Get all images
  const images = tour.images || [tour.image];
  // We want to render up to 5 thumbnails
  const maxThumbs = 5;
  const thumbsHTML = images.slice(0, maxThumbs).map((img, idx) => {
    const isLast = idx === maxThumbs - 1 && images.length > maxThumbs;
    const viewMoreOverlay = isLast ? `
      <div class="thumb-overlay">
        <span>View More &rarr;</span>
      </div>
    ` : '';
    return `
      <div class="gallery-thumb-item${idx === 0 ? ' active' : ''}" data-index="${idx}">
        <img src="../../${img}" alt="${tour.title} Thumbnail ${idx + 1}" loading="lazy">
        ${viewMoreOverlay}
      </div>
    `;
  }).join('\n');

  // Generate Recommended Tours HTML (first 3 other tours)
  const recommendedTours = tours
    .filter(t => t.id !== tour.id)
    .slice(0, 3);

  const recommendedHTML = recommendedTours.map(rec => `
    <div class="recommended-card">
      <a href="../${rec.slug}/">
        <div class="rec-card-image-wrapper">
          <img src="../../${rec.image}" alt="${rec.title}" class="rec-card-image" loading="lazy">
          <span class="rec-card-badge">${rec.type}</span>
        </div>
      </a>
      <div class="rec-card-content">
        <h3><a href="../${rec.slug}/">${rec.title}</a></h3>
        <div class="rec-card-footer">
          <span class="rec-card-price">From <strong>€${rec.price}</strong></span>
          <a href="../${rec.slug}/" class="btn btn-secondary btn-sm">View Tour</a>
        </div>
      </div>
    </div>
  `).join('\n');

  // Format schema lists
  const schemaHighlights = JSON.stringify(tour.highlights);
  const schemaIncluded = JSON.stringify(tour.included);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/webp" href="../../favicon.webp">
  <title>${tour.title} | Agadir Shore Excursion from Cruise Port</title>
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="${tour.description}">
  <meta name="keywords" content="${tour.title}, Agadir shore excursions, cruise port tours, Agadir private excursions, custom day trips Agadir, Morocco cruise tours, best excursions from Agadir port">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://agadircruisetours.com/tour/${tour.slug}/">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${tour.title} | Agadir Shore Excursion from Cruise Port">
  <meta property="og:description" content="${tour.description}">
  <meta property="og:image" content="https://agadircruisetours.com/${tour.image}">
  <meta property="og:url" content="https://agadircruisetours.com/tour/${tour.slug}/">
  <meta property="og:type" content="website">
  
  <!-- Stylesheets -->
  <!-- Fonts Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" media="print" onload="this.media='all'">
  
  <!-- CSS Preload -->
  <link rel="preload" href="../../style.css" as="style">
  <link rel="stylesheet" href="../../style.css">
  
  <!-- JS Module Preloads -->
  <link rel="modulepreload" href="../../app.js">
  <link rel="modulepreload" href="../../data.js">
  
  <!-- Lucide Icons CDN -->
  <script src="https://cdn.jsdelivr.net/npm/lucide@0.415.0/dist/umd/lucide.min.js" defer></script>

  <!-- Schema.org JSON-LD Markup -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": "${tour.title}",
    "description": "${tour.description}",
    "image": "https://agadircruisetours.com/${tour.image}",
    "touristType": "Cruise Passengers",
    "duration": "${tour.duration}",
    "offers": {
      "@type": "Offer",
      "price": "${tour.price}",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": "https://agadircruisetours.com/tour/${tour.slug}/"
    },
    "provider": {
      "@type": "TravelAgency",
      "name": "Agadir Cruise Tours",
      "url": "https://agadircruisetours.com/"
    },
    "itinerary": {
      "@type": "ItemList",
      "numberOfItems": ${tour.highlights.length},
      "itemListElement": ${schemaHighlights}
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://agadircruisetours.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Tours",
        "item": "https://agadircruisetours.com/tours.html"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "${tour.title}",
        "item": "https://agadircruisetours.com/tour/${tour.slug}/"
      }
    ]
  }
  </script>
</head>
<body>

  <!-- Navigation Bar -->
  <header class="navbar" id="navbar">
    <div class="container">
      <a href="../../index" class="logo">
        <img src="../../logo.webp" alt="Agadir Cruise Tours" class="logo-img" width="217" height="36">
      </a>
      <ul class="nav-links" id="nav-links">
        <li><a href="../../index">Home</a></li>
        <li><a href="../../tours" class="active">Tours</a></li>
        <li><a href="../../activities">Activities</a></li>
        <li><a href="../../cruises">Cruises</a></li>
        <li><a href="../../blog">Blog</a></li>
        <li><a href="../../about">About</a></li>
        <li><a href="../../contact">Contact</a></li>
      </ul>
      <div class="nav-actions">
        <a href="../../contact" class="btn btn-secondary">Book Excursion</a>
        
      <div class="lang-selector">
        <button class="lang-btn" id="lang-btn" aria-label="Select Language">
          <i data-lucide="languages" class="lang-icon"></i>
          <span class="current-lang-text">EN</span>
          <i data-lucide="chevron-down" class="chevron-icon"></i>
        </button>
        <div class="lang-dropdown" id="lang-dropdown">
          <a href="#" onclick="changeLanguage('en'); return false;" class="lang-option active" data-lang="en">English</a>
          <a href="#" onclick="changeLanguage('de'); return false;" class="lang-option" data-lang="de">Deutsch</a>
          <a href="#" onclick="changeLanguage('fr'); return false;" class="lang-option" data-lang="fr">Français</a>
          <a href="#" onclick="changeLanguage('es'); return false;" class="lang-option" data-lang="es">Español</a>
          <a href="#" onclick="changeLanguage('it'); return false;" class="lang-option" data-lang="it">Italiano</a>
        </div>
      </div>

        <button class="nav-toggle" id="nav-toggle">
          <i data-lucide="menu"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Tour Hero Banner -->
  <section class="tour-hero" style="background-image: linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.75)), url('../../${tour.image}');">
    <div class="container">
      <div class="tour-hero-content">
        <span class="tour-category-tag">${tour.type}</span>
        <h1>${tour.title}</h1>
        
        <div class="tour-meta-row">
          <div class="meta-item">
            <i data-lucide="clock" size="16"></i>
            <span>${tour.duration}</span>
          </div>
          <div class="meta-item">
            <i data-lucide="star" size="16" fill="#f59e0b" style="color: #f59e0b;"></i>
            <span>${tour.rating} (${tour.reviewCount} reviews)</span>
          </div>
          <div class="meta-item">
            <i data-lucide="anchor" size="16"></i>
            <span>Guaranteed Port Return</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Main Tour Details Content -->
  <section class="section tour-details-section">
    <div class="container">
      <div class="tour-details-grid">
        
        <!-- Left details content column -->
        <div class="tour-details-left">
          
          <div class="detail-block">
            <h2>Tour Gallery</h2>
            <div class="tour-gallery-layout">
              <div class="tour-gallery-featured" id="gallery-featured">
                <img src="../../${tour.image}" alt="${tour.title} Featured" id="featured-main-img">
                <span class="featured-rating-badge">
                  <i data-lucide="star" fill="#f59e0b" style="color:#f59e0b; width:12px; height:12px;"></i>
                  ${tour.rating} (${tour.reviewCount} reviews)
                </span>
                <button class="gallery-open-btn" id="gallery-open-btn">
                  <i data-lucide="camera" style="width:14px; height:14px;"></i>
                  Gallery
                </button>
              </div>
              <div class="tour-gallery-thumbs" id="gallery-thumbs">
                ${thumbsHTML}
              </div>
            </div>
          </div>

          <div class="detail-block">
            <h2>Overview & Description</h2>
            <p class="description-lead">${tour.fullDescription.replace(/\n\n/g, '</p><p class="description-lead">')}</p>
          </div>
          
          <div class="detail-block">
            <h2>Tour Highlights</h2>
            <ul class="highlights-custom-list">
              ${highlightsHTML}
            </ul>
          </div>
          
          <div class="detail-block">
            <h2>What's Included & Excluded</h2>
            <div class="inc-exc-grid">
              <div class="included-box">
                <h3>Included</h3>
                <ul class="included-custom-list">
                  ${includedHTML}
                </ul>
              </div>
              <div class="excluded-box">
                <h3>Excluded</h3>
                <ul class="excluded-custom-list">
                  <li><i data-lucide="x" class="excluded-x-icon"></i> <span>Gratuities / Tips</span></li>
                  <li><i data-lucide="x" class="excluded-x-icon"></i> <span>Personal shopping expenses</span></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="detail-block">
            <h2>Departure & Logistics</h2>
            <div class="logistics-card">
              <div class="logistics-item">
                <i data-lucide="map-pin" size="20"></i>
                <div>
                  <h4>Departure Location</h4>
                  <p>${tour.departureLocation}</p>
                </div>
              </div>
              <div class="logistics-item">
                <i data-lucide="languages" size="20"></i>
                <div>
                  <h4>Languages Offered</h4>
                  <p>${languagesHTML}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="detail-block">
            <h2>Important Information</h2>
            <ul class="important-custom-list">
              ${importantInfoHTML}
            </ul>
          </div>

          <div class="detail-block">
            <h2>Recommended Tours</h2>
            <div class="recommended-tours-grid">
              ${recommendedHTML}
            </div>
          </div>
          
        </div>
        
        <!-- Right sticky booking form column -->
        <div class="tour-details-right">
          <div class="sticky-booking-card glass-panel">
            <div class="booking-card-header">
              <span class="price-from-label">Price per person</span>
              <div class="booking-price-row">
                <span class="booking-price-value">€${tour.price}</span>
                <span class="booking-currency">EUR</span>
              </div>
            </div>
            
            <form id="tour-booking-form">
              <div class="form-group">
                <label for="book-name">Full Name</label>
                <input type="text" id="book-name" class="form-control" placeholder="Your name" required>
              </div>
              
              <div class="form-group">
                <label for="book-email">Email Address</label>
                <input type="email" id="book-email" class="form-control" placeholder="your@email.com" required>
              </div>
              
              <div class="form-group">
                <label for="book-phone">WhatsApp Number</label>
                <input type="tel" id="book-phone" class="form-control" placeholder="+1 234 567 8900" required>
              </div>
              
              <div class="form-group">
                <label for="book-date">Excursion Date</label>
                <input type="date" id="book-date" class="form-control" required>
              </div>
              
              <div class="form-group">
                <label for="book-passengers">Number of Passengers</label>
                <div class="passengers-counter-wrapper">
                  <button type="button" class="counter-btn minus" id="count-minus">-</button>
                  <input type="number" id="book-passengers" class="counter-input" min="1" max="50" value="2" required readonly>
                  <button type="button" class="counter-btn plus" id="count-plus">+</button>
                </div>
              </div>
              
              <div class="form-group">
                <label for="book-requests">Special Requests</label>
                <textarea id="book-requests" class="form-control" rows="2" placeholder="Ship name, dietary needs, etc."></textarea>
              </div>
              
              <div class="booking-calc-box">
                <div class="calc-row">
                  <span>Price per Person:</span>
                  <span>€${tour.price}.00</span>
                </div>
                <div class="calc-row">
                  <span>Passengers:</span>
                  <span id="calc-passengers-qty">x2</span>
                </div>
                <div class="calc-row calc-total">
                  <span>Total Estimated Cost:</span>
                  <span id="calc-total-cost">€${tour.price * 2}.00</span>
                </div>
              </div>
              
              <button type="submit" class="btn btn-primary btn-submit-wa" style="width: 100%; margin-top: 1.5rem;">
                Confirm on WhatsApp <i data-lucide="message-circle" size="18"></i>
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="../../logo.webp" alt="Agadir Cruise Tours" class="footer-logo-img" width="386" height="64">
          <p class="footer-about">Providing the finest shore excursions and activities for cruise ship travelers visiting the port of Agadir, Morocco.</p>
          <div class="footer-social-links">
            <a href="https://www.facebook.com/p/Agadir-Samia-Tours-100091429973161/" class="footer-social-icon" target="_blank" aria-label="Facebook">
              <i data-lucide="facebook"></i>
            </a>
            <a href="https://www.instagram.com/agadir_samia_tours/" class="footer-social-icon" target="_blank" aria-label="Instagram">
              <i data-lucide="instagram"></i>
            </a>
            <a href="mailto:contact@agadircruisetours.com" class="footer-social-icon"><i data-lucide="mail"></i></a>
            <a href="https://wa.me/212661444189" class="footer-social-icon" target="_blank"><i data-lucide="phone"></i></a>
          </div>
        </div>
        
        <div class="footer-column">
          <h4>Our Excursions</h4>
          <ul>
            <li><a href="../../tours">Paradise Valley Tour</a></li>
            <li><a href="../../tours">Essaouira Day Trip</a></li>
            <li><a href="../../tours">Sahara Desert 4x4 Tour</a></li>
            <li><a href="../../tours">Guided City Tour</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h4>Navigation</h4>
          <ul>
            <li><a href="../../index">Home</a></li>
            <li><a href="../../tours">Excursions & Tours</a></li>
            <li><a href="../../activities">Local Activities</a></li>
            <li><a href="../../cruises">Cruise Schedule</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h4>Contact Info</h4>
          <ul>
            <li style="display: flex; gap: 0.5rem; align-items: flex-start;"><i data-lucide="map-pin" size="18" style="color: var(--primary); flex-shrink:0;"></i> N° 76 Chemin des dunes, Agadir 80000, Morocco</li>
            <li style="display: flex; gap: 0.5rem; align-items: center;"><i data-lucide="phone" size="18" style="color: var(--primary);"></i> +212 661-199394</li>
            <li style="display: flex; gap: 0.5rem; align-items: center;"><i data-lucide="mail" size="18" style="color: var(--primary);"></i> contact@agadircruisetours.com</li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2026 Agadir Cruise Tours. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <!-- Page Interactivity Logic -->
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Mobile Nav Toggle
      const navToggle = document.getElementById('nav-toggle');
      const navLinks = document.getElementById('nav-links');
      if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
          navLinks.classList.toggle('active');
        });
      }

      // Initialize icons
      lucide.createIcons();

      // Booking Calculations
      const basePrice = ${tour.price};
      const minusBtn = document.getElementById('count-minus');
      const plusBtn = document.getElementById('count-plus');
      const passInput = document.getElementById('book-passengers');
      const calcQty = document.getElementById('calc-passengers-qty');
      const calcTotal = document.getElementById('calc-total-cost');
      
      const updateCost = () => {
        const qty = parseInt(passInput.value) || 2;
        calcQty.textContent = 'x' + qty;
        calcTotal.textContent = '€' + (basePrice * qty) + '.00';
      };

      if (minusBtn && plusBtn && passInput) {
        minusBtn.addEventListener('click', () => {
          let val = parseInt(passInput.value) || 2;
          if (val > 1) {
            passInput.value = val - 1;
            updateCost();
          }
        });
        plusBtn.addEventListener('click', () => {
          let val = parseInt(passInput.value) || 2;
          if (val < 50) {
            passInput.value = val + 1;
            updateCost();
          }
        });
      }

      // WhatsApp Submit Redirection
      const bookingForm = document.getElementById('tour-booking-form');
      if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('book-name').value;
          const email = document.getElementById('book-email').value;
          const phone = document.getElementById('book-phone').value;
          const date = document.getElementById('book-date').value;
          const passengers = passInput.value;
          const requests = document.getElementById('book-requests').value || 'None';
          const totalCost = basePrice * passengers;

          const message = '*New Reservation Request - Agadir Cruise Tours*\\n\\n' +
            '👋 Hello Samia Tours, I\\'d like to book a tour:\\n' +
            '• *Tour:* ${tour.title.replace(/'/g, "\\'")}\\n' +
            '• *Name:* ' + name + '\\n' +
            '• *Email:* ' + email + '\\n' +
            '• *Phone:* ' + phone + '\\n' +
            '• *Date:* ' + date + '\\n' +
            '• *Passengers:* ' + passengers + '\\n' +
            '• *Estimated Cost:* €' + totalCost + '.00\\n' +
            '• *Requests:* ' + requests + '\\n\\n' +
            'Thank you!';

          const encoded = encodeURIComponent(message);
          window.open('https://wa.me/212661444189?text=' + encoded, '_blank');
        });
      }
    });
  <!-- Premium Gallery Lightbox Overlay -->
  <div class="lightbox-overlay" id="lightbox-overlay">
    <div class="lightbox-header">
      <div class="lightbox-counter" id="lightbox-counter">1 / 1</div>
      <div class="lightbox-tools">
        <button class="lightbox-tool-btn" id="lightbox-zoom" aria-label="Zoom Image">
          <i data-lucide="zoom-in" style="width:18px; height:18px;"></i>
        </button>
        <button class="lightbox-tool-btn" id="lightbox-play" aria-label="Play Slideshow">
          <i data-lucide="play" id="lightbox-play-icon" style="width:18px; height:18px;"></i>
        </button>
        <button class="lightbox-tool-btn" id="lightbox-fullscreen" aria-label="Toggle Fullscreen">
          <i data-lucide="maximize" style="width:18px; height:18px;"></i>
        </button>
        <button class="lightbox-tool-btn close" id="lightbox-close-btn" aria-label="Close Lightbox">
          <i data-lucide="x" style="width:20px; height:20px;"></i>
        </button>
      </div>
    </div>
    
    <button class="lightbox-nav-btn prev" id="lightbox-prev-btn" aria-label="Previous Image">
      <i data-lucide="arrow-left" style="width:20px; height:20px;"></i>
    </button>
    
    <div class="lightbox-main">
      <img src="" id="lightbox-active-img" alt="Gallery Preview">
    </div>
    
    <button class="lightbox-nav-btn next" id="lightbox-next-btn" aria-label="Next Image">
      <i data-lucide="arrow-right" style="width:20px; height:20px;"></i>
    </button>
  </div>

  <script type="text/javascript">
    document.addEventListener('DOMContentLoaded', () => {
      // --- Gallery Switcher & Lightbox Preview Logic ---
      const featuredContainer = document.getElementById('gallery-featured');
      const featuredImg = document.getElementById('featured-main-img');
      const galleryOpenBtn = document.getElementById('gallery-open-btn');
      const thumbItems = document.querySelectorAll('.gallery-thumb-item');
      
      const lightbox = document.getElementById('lightbox-overlay');
      const lightboxImg = document.getElementById('lightbox-active-img');
      const lightboxCounter = document.getElementById('lightbox-counter');
      const lightboxClose = document.getElementById('lightbox-close-btn');
      const lightboxPrev = document.getElementById('lightbox-prev-btn');
      const lightboxNext = document.getElementById('lightbox-next-btn');
      const lightboxZoom = document.getElementById('lightbox-zoom');
      const lightboxPlay = document.getElementById('lightbox-play');
      const lightboxFullscreen = document.getElementById('lightbox-fullscreen');
      
      if (!lightbox) return;

      let currentIdx = 0;
      let slideshowInterval = null;
      
      const tourImages = ${JSON.stringify(images)};
      const imagesList = tourImages.map(img => '../../' + img);
      
      function updateFeaturedImage(index) {
        currentIdx = index;
        if (featuredImg) {
          featuredImg.src = imagesList[currentIdx];
        }
        
        thumbItems.forEach((thumb, i) => {
          if (i === index) {
            thumb.classList.add('active');
          } else {
            thumb.classList.remove('active');
          }
        });
      }
      
      thumbItems.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
          updateFeaturedImage(idx);
        });
      });
      
      function updateLightbox() {
        if (lightboxImg) {
          lightboxImg.src = imagesList[currentIdx];
        }
        if (lightboxCounter) {
          lightboxCounter.textContent = (currentIdx + 1) + ' / ' + imagesList.length;
        }
      }
      
      function openLightbox(index) {
        currentIdx = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      
      function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        stopSlideshow();
        if (lightboxImg) {
          lightboxImg.classList.remove('zoomed');
        }
      }
      
      function nextImage() {
        currentIdx = (currentIdx + 1) % imagesList.length;
        updateLightbox();
      }
      
      function prevImage() {
        currentIdx = (currentIdx - 1 + imagesList.length) % imagesList.length;
        updateLightbox();
      }
      
      if (lightboxZoom && lightboxImg) {
        lightboxZoom.addEventListener('click', () => {
          lightboxImg.classList.toggle('zoomed');
        });
        lightboxImg.addEventListener('click', () => {
          lightboxImg.classList.toggle('zoomed');
        });
      }
      
      function startSlideshow() {
        const playIcon = document.getElementById('lightbox-play-icon');
        if (playIcon) {
          playIcon.setAttribute('data-lucide', 'pause');
        }
        lucide.createIcons();
        slideshowInterval = setInterval(nextImage, 3000);
      }
      
      function stopSlideshow() {
        if (slideshowInterval) {
          clearInterval(slideshowInterval);
          slideshowInterval = null;
        }
        const playIcon = document.getElementById('lightbox-play-icon');
        if (playIcon) {
          playIcon.setAttribute('data-lucide', 'play');
        }
        lucide.createIcons();
      }
      
      if (lightboxPlay) {
        lightboxPlay.addEventListener('click', () => {
          if (slideshowInterval) {
            stopSlideshow();
          } else {
            startSlideshow();
          }
        });
      }
      
      if (lightboxFullscreen) {
        lightboxFullscreen.addEventListener('click', () => {
          if (!document.fullscreenElement) {
            lightbox.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen();
          }
        });
      }
      
      if (featuredContainer) {
        featuredContainer.addEventListener('click', (e) => {
          if (e.target.closest('#gallery-open-btn')) return;
          openLightbox(currentIdx);
        });
      }
      
      if (galleryOpenBtn) {
        galleryOpenBtn.addEventListener('click', () => {
          openLightbox(currentIdx);
        });
      }
      
      if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
      if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
      if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
      
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-main')) {
          closeLightbox();
        }
      });
      
      document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      });
    });
  </script>

  <!-- Google Translate Integration -->
  <div id="google_translate_element" style="display:none;"></div>
  <script type="text/javascript">
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,de,fr,es,it',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    }
    window.addEventListener('load', () => {
      setTimeout(() => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.body.appendChild(script);
      }, 1000); // Wait 1 second after page load to fetch translation resources
    });
  </script>

</body>
</html>
`;
}

// Generate the directories and files
tours.forEach(tour => {
  const dirPath = path.join(__dirname, 'tour', tour.slug);
  
  // Create folders recursively if they don't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
  
  // Write index.html template inside each folder
  const filePath = path.join(dirPath, 'index.html');
  const htmlContent = getTemplate(tour);
  
  fs.writeFileSync(filePath, htmlContent, 'utf-8');
  console.log(`Generated page: ${filePath}`);
});

console.log('All tour pages generated successfully!');
