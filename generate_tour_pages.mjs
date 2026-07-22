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

  // Generate gallery HTML
  const galleryHTML = (tour.images || [tour.image]).map((img, idx) => `
    <div class="gallery-item-wrapper" data-index="${idx}">
      <img src="../../${img}" alt="${tour.title} Gallery ${idx + 1}" class="gallery-thumb" loading="lazy">
    </div>
  `).join('\n');

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
  <link rel="icon" type="image/png" href="../../favicon.png">
  <title>${tour.title} - Agadir Shore Excursions</title>
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="${tour.description}">
  <meta name="keywords" content="${tour.title}, Agadir shore excursions, cruise port tours, Agadir excursions, private tours Agadir">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://agadircruisetours.com/tour/${tour.slug}/">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${tour.title} - Agadir Cruise Tours">
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
        <img src="../../logo.png" alt="Agadir Cruise Tours" class="logo-img" width="200" height="36">
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
            <div class="tour-gallery-grid">
              ${galleryHTML}
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
          <img src="../../logo.png" alt="Agadir Cruise Tours" class="footer-logo-img" width="356" height="64">
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
        <p>&copy; 2026 Agadir Cruise Tours. Operated by Samia Tours. All rights reserved.</p>
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
  <!-- Lightbox Gallery Modal -->
  <div class="lightbox-modal" id="lightbox-modal">
    <button class="lightbox-close" id="lightbox-close" aria-label="Close Preview">&times;</button>
    <button class="lightbox-arrow lightbox-prev" id="lightbox-prev-btn" aria-label="Previous Image">&#10094;</button>
    <button class="lightbox-arrow lightbox-next" id="lightbox-next-btn" aria-label="Next Image">&#10095;</button>
    <div class="lightbox-content">
      <img src="" id="lightbox-img" alt="Gallery Preview">
    </div>
  </div>

  <script type="text/javascript">
    document.addEventListener('DOMContentLoaded', () => {
      const galleryItems = document.querySelectorAll('.gallery-item-wrapper');
      const lightbox = document.getElementById('lightbox-modal');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxClose = document.getElementById('lightbox-close');
      const lightboxPrev = document.getElementById('lightbox-prev-btn');
      const lightboxNext = document.getElementById('lightbox-next-btn');
      
      if (!galleryItems.length || !lightbox) return;
      
      let currentImgIdx = 0;
      const imagesList = Array.from(galleryItems).map(item => item.querySelector('img').src);
      
      function openLightbox(index) {
        currentImgIdx = index;
        lightboxImg.src = imagesList[currentImgIdx];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      
      function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      function nextImage() {
        currentImgIdx = (currentImgIdx + 1) % imagesList.length;
        lightboxImg.src = imagesList[currentImgIdx];
      }
      
      function prevImage() {
        currentImgIdx = (currentImgIdx - 1 + imagesList.length) % imagesList.length;
        lightboxImg.src = imagesList[currentImgIdx];
      }
      
      galleryItems.forEach((item, idx) => {
        item.addEventListener('click', () => openLightbox(idx));
      });
      
      if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
      if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
      if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
      
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
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
  </script>
  <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

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
