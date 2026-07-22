import fs from 'fs';
import path from 'path';
import { activities } from './data.js';

const __dirname = path.resolve();

// HTML Template function
function getTemplate(activity) {
  // Generate highlights HTML
  const highlightsHTML = activity.highlights.map(h => `<li><i data-lucide="check-circle" class="highlight-check-icon"></i> <span>${h}</span></li>`).join('\n');
  
  // Generate included HTML
  const includedHTML = activity.included.map(i => `<li><i data-lucide="check" class="included-check-icon"></i> <span>${i}</span></li>`).join('\n');
  
  // Generate important info HTML
  const importantInfoHTML = activity.importantInfo.map(info => `<li><i data-lucide="info" class="info-alert-icon"></i> <span>${info}</span></li>`).join('\n');

  // Generate languages HTML
  const languagesHTML = (activity.languages || ['English', 'French', 'Arabic']).map(l => `<span class="lang-tag">${l}</span>`).join(' ');

  // Generate gallery HTML
  const galleryHTML = (activity.images || [activity.image]).map((img, idx) => `
    <div class="gallery-item-wrapper" data-index="${idx}">
      <img src="../../${img}" alt="${activity.title} Gallery ${idx + 1}" class="gallery-thumb" loading="lazy">
    </div>
  `).join('\n');

  // Generate Recommended Activities HTML (first 3 other activities)
  const recommendedActivities = activities
    .filter(act => act.id !== activity.id)
    .slice(0, 3);

  const recommendedHTML = recommendedActivities.map(rec => `
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
          <a href="../${rec.slug}/" class="btn btn-secondary btn-sm">View Details</a>
        </div>
      </div>
    </div>
  `).join('\n');

  // Format schema lists
  const schemaHighlights = JSON.stringify(activity.highlights);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="../../favicon.png">
  <title>${activity.title} - Agadir Activities</title>
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="${activity.description}">
  <meta name="keywords" content="${activity.title}, Agadir activities, things to do in Agadir, camel ride Agadir, hammam Agadir, quad adventure Agadir">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://agadircruisetours.com/activity/${activity.slug}/">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${activity.title} - Agadir Cruise Tours">
  <meta property="og:description" content="${activity.description}">
  <meta property="og:image" content="https://agadircruisetours.com/${activity.image}">
  <meta property="og:url" content="https://agadircruisetours.com/activity/${activity.slug}/">
  <meta property="og:type" content="website">
  
  <!-- Stylesheets -->
  <link rel="stylesheet" href="../../style.css">
  
  <!-- Lucide Icons CDN -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- Schema.org JSON-LD Markup -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": "${activity.title}",
    "description": "${activity.description}",
    "image": "https://agadircruisetours.com/${activity.image}",
    "touristType": "Cruise Passengers & Travelers",
    "duration": "${activity.duration}",
    "offers": {
      "@type": "Offer",
      "price": "${activity.price}",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "url": "https://agadircruisetours.com/activity/${activity.slug}/"
    },
    "provider": {
      "@type": "TravelAgency",
      "name": "Agadir Cruise Tours",
      "url": "https://agadircruisetours.com/"
    },
    "itinerary": {
      "@type": "ItemList",
      "numberOfItems": ${activity.highlights.length},
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
        "name": "Activities",
        "item": "https://agadircruisetours.com/activities.html"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "${activity.title}",
        "item": "https://agadircruisetours.com/activity/${activity.slug}/"
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
        <img src="../../logo.png" alt="Agadir Cruise Tours" class="logo-img">
      </a>
      <ul class="nav-links" id="nav-links">
        <li><a href="../../index">Home</a></li>
        <li><a href="../../tours">Tours</a></li>
        <li><a href="../../activities" class="active">Activities</a></li>
        <li><a href="../../cruises">Cruises</a></li>
        <li><a href="../../blog">Blog</a></li>
        <li><a href="../../about">About</a></li>
        <li><a href="../../contact">Contact</a></li>
      </ul>
      <div class="nav-actions">
        <a href="../../contact" class="btn btn-secondary">Book Excursion</a>
        <button class="nav-toggle" id="nav-toggle">
          <i data-lucide="menu"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Activity Hero Banner -->
  <section class="tour-hero" style="background-image: linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.75)), url('../../${activity.image}');">
    <div class="container">
      <div class="tour-hero-content">
        <span class="tour-category-tag">${activity.type}</span>
        <h1 style="color: #ffffff;">${activity.title}</h1>
        
        <div class="tour-meta-row">
          <div class="meta-item">
            <i data-lucide="clock" size="16"></i>
            <span>${activity.duration}</span>
          </div>
          <div class="meta-item">
            <i data-lucide="star" size="16" fill="#f59e0b" style="color: #f59e0b;"></i>
            <span>${activity.rating} (${activity.reviewCount} reviews)</span>
          </div>
          <div class="meta-item">
            <i data-lucide="compass" size="16"></i>
            <span>Local Experience</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Main Activity Details Content -->
  <section class="section tour-details-section">
    <div class="container">
      <div class="tour-details-grid">
        
        <!-- Left details content column -->
        <div class="tour-details-left">
          
          <div class="detail-block">
            <h2>Overview & Description</h2>
            <p class="description-lead">${activity.fullDescription.replace(/\n\n/g, '</p><p class="description-lead">')}</p>
          </div>

          <div class="detail-block">
            <h2>Activity Gallery</h2>
            <div class="tour-gallery-grid">
              ${galleryHTML}
            </div>
          </div>
          
          <div class="detail-block">
            <h2>Activity Highlights</h2>
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
                  <h4>Pickup Location</h4>
                  <p>${activity.departureLocation || 'Agadir hotels or Cruise Port pickup'}</p>
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
            <h2>Recommended Activities</h2>
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
                <span class="booking-price-value">€${activity.price}</span>
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
                <label for="book-date">Activity Date</label>
                <input type="date" id="book-date" class="form-control" required>
              </div>
              
              <div class="form-group">
                <label for="book-passengers">Number of Participants</label>
                <div class="passengers-counter-wrapper">
                  <button type="button" class="counter-btn minus" id="count-minus">-</button>
                  <input type="number" id="book-passengers" class="counter-input" min="1" max="50" value="2" required readonly>
                  <button type="button" class="counter-btn plus" id="count-plus">+</button>
                </div>
              </div>
              
              <div class="form-group">
                <label for="book-requests">Special Requests</label>
                <textarea id="book-requests" class="form-control" rows="2" placeholder="Hotel name or pickup details..."></textarea>
              </div>
              
              <div class="booking-calc-box">
                <div class="calc-row">
                  <span>Price per Person:</span>
                  <span>€${activity.price}.00</span>
                </div>
                <div class="calc-row">
                  <span>Participants:</span>
                  <span id="calc-passengers-qty">x2</span>
                </div>
                <div class="calc-row calc-total">
                  <span>Total Estimated Cost:</span>
                  <span id="calc-total-cost">€${activity.price * 2}.00</span>
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
          <img src="../../logo.png" alt="Agadir Cruise Tours" class="footer-logo-img">
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
      const basePrice = ${activity.price};
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
            '👋 Hello Samia Tours, I\\'d like to book an activity:\\n' +
            '• *Activity:* ${activity.title.replace(/'/g, "\\'")}\\n' +
            '• *Name:* ' + name + '\\n' +
            '• *Email:* ' + email + '\\n' +
            '• *Phone:* ' + phone + '\\n' +
            '• *Date:* ' + date + '\\n' +
            '• *Participants:* ' + passengers + '\\n' +
            '• *Estimated Cost:* €' + totalCost + '.00\\n' +
            '• *Requests:* ' + requests + '\\n\\n' +
            'Thank you!';

          const encoded = encodeURIComponent(message);
          window.open('https://wa.me/212661444189?text=' + encoded, '_blank');
        });
      }
    });
  </script>
</body>
</html>
`;
}

// Generate the directories and files
activities.forEach(activity => {
  const dirPath = path.join(__dirname, 'activity', activity.slug);
  
  // Create folders recursively if they don't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
  
  // Write index.html template inside each folder
  const filePath = path.join(dirPath, 'index.html');
  const htmlContent = getTemplate(activity);
  
  fs.writeFileSync(filePath, htmlContent, 'utf-8');
  console.log(`Generated page: ${filePath}`);
});

console.log('All activity pages generated successfully!');
