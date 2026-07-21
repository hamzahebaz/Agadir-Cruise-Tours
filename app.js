// Agadir Cruise & Samia Tours - Web Application Logic
import { tours, activities, cruises, reviews } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Grids
  const toursGrid = document.getElementById('tours-grid');
  const activitiesGrid = document.getElementById('activities-grid');
  const featuredGrid = document.getElementById('featured-grid');
  
  // Navigation & Scroll
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  
  // Schedule filters
  const shipSearch = document.getElementById('ship-search');
  const monthFilter = document.getElementById('month-filter');
  const scheduleTbody = document.getElementById('schedule-tbody');
  
  // Reviews Grid
  const reviewsGrid = document.getElementById('reviews-grid');
  
  // Details Modal
  const detailsModal = document.getElementById('details-modal');
  const closeDetailsBtn = document.getElementById('close-details-btn');
  const modalDetailsBookBtn = document.getElementById('modal-details-book-btn');
  
  // Inline Booking Form inside contact.html
  const bookingForm = document.getElementById('booking-form');
  const successView = document.getElementById('booking-success-view');
  const successCloseBtn = document.getElementById('success-close-btn');
  
  const bookTourSelect = document.getElementById('book-tour');
  const bookCruiseSelect = document.getElementById('book-cruise');
  const bookPassengers = document.getElementById('book-passengers');
  const summaryBasePrice = document.getElementById('summary-base-price');
  const summaryPassengers = document.getElementById('summary-passengers');
  const summaryTotalCost = document.getElementById('summary-total-cost');
  
  // Tab triggers inside Details Modal
  const detailsTabTriggers = document.querySelectorAll('.details-tab-trigger');
  const detailsTabContents = document.querySelectorAll('.details-tab-content');

  // --- Initial Setup ---
  let selectedTour = null;

  // --- Hero Slideshow ---
  const heroBg = document.getElementById('hero-bg');
  const heroImages = [
    'hero-images/agadir-1.jpg',
    'hero-images/agadir-2.jpg',
    'hero-images/agadir-3.avif',
    'hero-images/agadir-4.jpg',
    'hero-images/agadir-5.webp',
    'hero-images/agadir-6.jpg',
    'hero-images/agadir-7.jpg'
  ];

  if (heroBg && heroImages.length > 0) {
    const layer1 = document.createElement('div');
    const layer2 = document.createElement('div');
    
    layer1.className = 'hero-bg-layer active';
    layer2.className = 'hero-bg-layer';
    
    const overlayGrad = 'linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85))';
    
    layer1.style.backgroundImage = `${overlayGrad}, url('${heroImages[0]}')`;
    layer2.style.backgroundImage = `${overlayGrad}, url('${heroImages[1]}')`;
    
    heroBg.appendChild(layer1);
    heroBg.appendChild(layer2);
    
    let activeLayer = layer1;
    let nextLayer = layer2;
    let imgIndex = 0;
    
    setInterval(() => {
      imgIndex = (imgIndex + 1) % heroImages.length;
      nextLayer.style.backgroundImage = `${overlayGrad}, url('${heroImages[imgIndex]}')`;
      
      nextLayer.style.opacity = '1';
      activeLayer.style.opacity = '0';
      
      const temp = activeLayer;
      activeLayer = nextLayer;
      nextLayer = temp;
    }, 6500);
  }

  // Initialize Navbar Scroll styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile Navigation Toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Close Mobile Menu on Link Click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.classList.remove('active');
      }
    });
  });

  // FAQ Accordion Handlers
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const content = item.querySelector('.faq-content');
      const isActive = item.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-content').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // --- Render Excursions & Activities Grid ---
  function renderGrid(container, items) {
    if (!container) return;
    container.innerHTML = '';
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      
      const isTour = tours.some(t => t.id === item.id);
      const actionButton = isTour 
        ? `<a href="tour/${item.slug}/" class="btn btn-secondary">View Excursion</a>`
        : `<a href="activity/${item.slug}/" class="btn btn-secondary">View Details</a>`;

      card.innerHTML = `
        <div class="card-image-wrapper">
          <img src="${item.image}" alt="${item.title}" class="card-image" loading="lazy">
          <span class="card-badge">${item.type}</span>
        </div>
        <div class="card-content">
          <div class="card-header-meta">
            <div class="card-meta-item">
              <i data-lucide="clock" size="14"></i>
              <span>${item.duration}</span>
            </div>
            <div class="card-rating">
              <i data-lucide="star" size="12" fill="#f59e0b"></i>
              <span>${item.rating} (${item.reviewCount})</span>
            </div>
          </div>
          <h3>${item.title}</h3>
          <p class="card-description">${item.description}</p>
          <div class="card-footer">
            <div class="card-price">
              <span class="card-price-label">From</span>
              <span class="card-price-value">€${item.price}</span>
            </div>
            ${actionButton}
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Attach Details Button Handlers (no longer needed since they are links, but we keep it empty or remove it)
  }

  // --- Render Cruise Schedule Table ---
  let currentSchedulePage = 1;
  const itemsPerPage = 10;

  function renderSchedules(searchQuery = '', filterMonth = '') {
    if (!scheduleTbody) return;
    scheduleTbody.innerHTML = '';
    const search = searchQuery.toLowerCase().trim();
    
    const filteredCruises = cruises.filter(item => {
      const matchSearch = item.ship.toLowerCase().includes(search) || item.cruiseLine.toLowerCase().includes(search);
      
      let matchMonth = true;
      if (filterMonth) {
        const [mName, yNum] = filterMonth.split('-');
        matchMonth = item.month.toLowerCase() === mName.toLowerCase() && item.year.toString() === yNum;
      }
      
      return matchSearch && matchMonth;
    });

    const totalPages = Math.ceil(filteredCruises.length / itemsPerPage);
    if (currentSchedulePage > totalPages) {
      currentSchedulePage = Math.max(1, totalPages);
    }

    const paginationContainer = document.getElementById('schedule-pagination');
    if (paginationContainer) {
      paginationContainer.innerHTML = '';
    }

    if (filteredCruises.length === 0) {
      scheduleTbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 3rem 0;">
            <i data-lucide="info" style="margin-bottom: 0.5rem; display: block; margin-left: auto; margin-right: auto;"></i>
            No cruise ship arrivals matching filters found.
          </td>
        </tr>
      `;
      lucide.createIcons();
      return;
    }

    // Slice for pagination
    const paginatedCruises = filteredCruises.slice(
      (currentSchedulePage - 1) * itemsPerPage,
      currentSchedulePage * itemsPerPage
    );

    paginatedCruises.forEach(item => {
      const row = document.createElement('tr');
      const arrivalTimeStr = item.times.replace('a ', 'Arrival ').replace(' d ', ', Departure ').replace(/(\d{2})(\d{2})/g, '$1:$2');
      
      row.innerHTML = `
        <td data-label="Arrival Date" style="font-weight: 600; white-space: nowrap;">
          <div style="font-size: 0.95rem; color: var(--primary);">${item.day}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${item.month} ${item.year}</div>
        </td>
        <td data-label="Cruise Ship">
          <div class="ship-name">${item.ship}</div>
          <div class="ship-line">${item.cruiseLine}</div>
        </td>
        <td data-label="Times in Port">
          <span class="time-badge">
            <i data-lucide="clock" size="14"></i>
            ${arrivalTimeStr}
          </span>
        </td>
        <td data-label="Passenger Capacity" class="passenger-count">${parseInt(item.passengers).toLocaleString()} pax</td>
      `;
      scheduleTbody.appendChild(row);
    });

    // Render pagination controls if container is present and there are multiple pages
    if (paginationContainer && totalPages > 1) {
      // Prev Button
      const prevBtn = document.createElement('button');
      prevBtn.className = 'pagination-btn pagination-btn-arrow';
      prevBtn.innerHTML = '<i data-lucide="chevron-left" size="16"></i> Prev';
      prevBtn.disabled = currentSchedulePage === 1;
      prevBtn.addEventListener('click', () => {
        if (currentSchedulePage > 1) {
          currentSchedulePage--;
          renderSchedules(searchQuery, filterMonth);
          window.scrollTo({ top: document.getElementById('cruises').offsetTop - 100, behavior: 'smooth' });
        }
      });
      paginationContainer.appendChild(prevBtn);

      // Page Numbers
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentSchedulePage ? 'active' : ''}`;
        pageBtn.innerText = i;
        pageBtn.addEventListener('click', () => {
          if (currentSchedulePage !== i) {
            currentSchedulePage = i;
            renderSchedules(searchQuery, filterMonth);
            window.scrollTo({ top: document.getElementById('cruises').offsetTop - 100, behavior: 'smooth' });
          }
        });
        paginationContainer.appendChild(pageBtn);
      }

      // Next Button
      const nextBtn = document.createElement('button');
      nextBtn.className = 'pagination-btn pagination-btn-arrow';
      nextBtn.innerHTML = 'Next <i data-lucide="chevron-right" size="16"></i>';
      nextBtn.disabled = currentSchedulePage === totalPages;
      nextBtn.addEventListener('click', () => {
        if (currentSchedulePage < totalPages) {
          currentSchedulePage++;
          renderSchedules(searchQuery, filterMonth);
          window.scrollTo({ top: document.getElementById('cruises').offsetTop - 100, behavior: 'smooth' });
        }
      });
      paginationContainer.appendChild(nextBtn);
    }

    lucide.createIcons();
  }

  // Schedule filters event listeners
  if (shipSearch) {
    shipSearch.addEventListener('input', (e) => {
      currentSchedulePage = 1;
      renderSchedules(e.target.value, monthFilter.value);
    });
  }

  if (monthFilter) {
    monthFilter.addEventListener('change', (e) => {
      currentSchedulePage = 1;
      renderSchedules(shipSearch.value, e.target.value);
    });
  }

  // Date converters
  function getMonthNumber(monthName) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const idx = months.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
    const num = idx !== -1 ? idx + 1 : 1;
    return num.toString().padStart(2, '0');
  }

  // Date number converter
  function getDateNumber(dayStr) {
    const match = dayStr.match(/\d+/);
    const num = match ? parseInt(match[0]) : 1;
    return num.toString().padStart(2, '0');
  }

  // --- Render Reviews ---
  // --- Render Reviews Carousel ---
  let currentReviewIndex = 0;

  function renderReviews() {
    if (!reviewsGrid) return;
    reviewsGrid.innerHTML = '';

    reviews.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = `review-card glass-panel ${index === currentReviewIndex ? 'active-slide' : ''}`;
      
      const taLogoHtml = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;">
          <path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9z" fill="#00AF87" stroke="#00AF87" />
          <circle cx="9" cy="12" r="2.5" fill="#fff" stroke="#000" stroke-width="1.2" />
          <circle cx="9" cy="12" r="0.8" fill="#00AF87" />
          <circle cx="15" cy="12" r="2.5" fill="#fff" stroke="#000" stroke-width="1.2" />
          <circle cx="15" cy="12" r="0.8" fill="#000" />
          <path d="M12 14l-0.8-1.2h1.6z" fill="#000" />
        </svg>
      `;

      card.innerHTML = `
        <div class="review-header">
          <div class="reviewer-info">
            <div>
              <div class="reviewer-name">${item.name}</div>
              <div class="reviewer-date">${item.date}</div>
            </div>
          </div>
          <span class="review-source-icon" style="color: #00af87; font-weight:700; gap:0.35rem; display:flex; align-items:center;">
            ${taLogoHtml} TripAdvisor
          </span>
        </div>
        <div class="stars-row">
          ${[...Array(5)].map((_, i) => `
            <i data-lucide="star" fill="${i < item.rating ? '#f59e0b' : 'none'}" size="14" style="color: #f59e0b;"></i>
          `).join('')}
        </div>
        <p class="review-text">"${item.text}"</p>
      `;
      reviewsGrid.appendChild(card);
    });

    updateCarousel();
    renderDots();
  }

  function updateCarousel() {
    if (!reviewsGrid) return;
    const cards = reviewsGrid.children;
    if (cards.length === 0) return;

    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

    const visibleCards = isMobile ? 1 : (isTablet ? 2 : 3);
    const maxIndex = Math.max(0, reviews.length - visibleCards);

    if (currentReviewIndex > maxIndex) {
      currentReviewIndex = maxIndex;
    }

    // Use requestAnimationFrame to ensure the browser has finished layout reflow
    requestAnimationFrame(() => {
      const cardWidth = cards[0].offsetWidth;
      const computedStyle = window.getComputedStyle(reviewsGrid);
      const gap = parseFloat(computedStyle.gap) || 0;

      const translateAmount = currentReviewIndex * (cardWidth + gap);
      reviewsGrid.style.transform = `translateX(-${translateAmount}px)`;
    });

    Array.from(cards).forEach((card, idx) => {
      card.classList.remove('active-slide');
      if (idx === currentReviewIndex) {
        card.classList.add('active-slide');
      }
    });
  }

  function renderDots() {
    const dotsContainer = document.getElementById('reviews-dots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';

    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const visibleCards = isMobile ? 1 : (isTablet ? 2 : 3);
    const numDots = Math.max(1, reviews.length - visibleCards + 1);

    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${i === currentReviewIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        currentReviewIndex = i;
        updateCarousel();
        renderDots();
      });
      dotsContainer.appendChild(dot);
    }
  }

  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentReviewIndex > 0) {
        currentReviewIndex--;
        updateCarousel();
        renderDots();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const visibleCards = isMobile ? 1 : (isTablet ? 2 : 3);
      const maxIndex = reviews.length - visibleCards;

      if (currentReviewIndex < maxIndex) {
        currentReviewIndex++;
        updateCarousel();
        renderDots();
      }
    });
  }

  window.addEventListener('resize', () => {
    updateCarousel();
    renderDots();
  });

  // --- Drag to Scroll (Mouse & Touch Swipe Interactivity) ---
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let dragOffset = 0;

  if (reviewsGrid) {
    reviewsGrid.style.cursor = 'grab';

    const getDragX = (e) => {
      return e.type.includes('touch') ? e.touches[0].clientX : e.pageX;
    };

    const dragStart = (e) => {
      if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-dot')) return;
      isDragging = true;
      startX = getDragX(e);
      reviewsGrid.style.cursor = 'grabbing';
      reviewsGrid.style.transition = 'none';

      const cards = reviewsGrid.children;
      if (cards.length > 0) {
        const cardWidth = cards[0].offsetWidth;
        const computedStyle = window.getComputedStyle(reviewsGrid);
        const gap = parseFloat(computedStyle.gap) || 0;
        currentTranslate = -currentReviewIndex * (cardWidth + gap);
      }
    };

    const dragMove = (e) => {
      if (!isDragging) return;
      const currentX = getDragX(e);
      dragOffset = currentX - startX;
      reviewsGrid.style.transform = `translateX(${currentTranslate + dragOffset}px)`;
    };

    const dragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      reviewsGrid.style.cursor = 'grab';
      reviewsGrid.style.transition = 'transform var(--transition-normal)';

      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
      const visibleCards = isMobile ? 1 : (isTablet ? 2 : 3);
      const maxIndex = Math.max(0, reviews.length - visibleCards);

      if (dragOffset < -100 && currentReviewIndex < maxIndex) {
        currentReviewIndex++;
      } else if (dragOffset > 100 && currentReviewIndex > 0) {
        currentReviewIndex--;
      }

      updateCarousel();
      renderDots();
      dragOffset = 0;
    };

    reviewsGrid.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);

    reviewsGrid.addEventListener('touchstart', dragStart, { passive: true });
    reviewsGrid.addEventListener('touchmove', dragMove, { passive: true });
    reviewsGrid.addEventListener('touchend', dragEnd);
  }

  // --- Details Modal Display Logic ---
  function openDetails(itemId) {
    if (!detailsModal) return;
    const allItems = [...tours, ...activities];
    selectedTour = allItems.find(item => item.id === itemId);
    if (!selectedTour) return;

    // Populate modal components
    document.getElementById('modal-details-hero').style.backgroundImage = `linear-gradient(to bottom, rgba(255, 255, 255, 0.4), var(--bg-main)), url('${selectedTour.image}')`;
    document.getElementById('modal-details-title').textContent = selectedTour.title;
    document.getElementById('modal-details-duration').textContent = selectedTour.duration;
    document.getElementById('modal-details-type').textContent = selectedTour.type;
    document.getElementById('modal-details-desc').textContent = selectedTour.fullDescription || selectedTour.description;
    document.getElementById('modal-details-price').textContent = `€${selectedTour.price}`;

    // Populate Highlights
    const highlightsUl = document.getElementById('modal-details-highlights');
    highlightsUl.innerHTML = '';
    selectedTour.highlights.forEach(h => {
      const li = document.createElement('li');
      li.className = 'info-list-item included';
      li.innerHTML = `<i data-lucide="check-circle" size="16"></i> <span>${h}</span>`;
      highlightsUl.appendChild(li);
    });

    // Populate Inclusions
    const inclusionsUl = document.getElementById('modal-details-inclusions');
    inclusionsUl.innerHTML = '';
    selectedTour.included.forEach(inc => {
      const li = document.createElement('li');
      li.className = 'info-list-item included';
      li.innerHTML = `<i data-lucide="check" size="16"></i> <span>${inc}</span>`;
      inclusionsUl.appendChild(li);
    });

    // Populate Important Info
    const infoUl = document.getElementById('modal-details-info');
    infoUl.innerHTML = '';
    selectedTour.importantInfo.forEach(info => {
      const li = document.createElement('li');
      li.className = 'info-list-item important-info';
      li.innerHTML = `<i data-lucide="alert-circle" size="16"></i> <span>${info}</span>`;
      infoUl.appendChild(li);
    });

    // Reset Tabs
    detailsTabTriggers.forEach(t => t.classList.remove('active'));
    detailsTabContents.forEach(c => c.classList.remove('active'));
    detailsTabTriggers[0].classList.add('active');
    detailsTabContents[0].classList.add('active');

    // Show Modal
    detailsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    lucide.createIcons();
  }

  // Tab switching inside Details Modal
  detailsTabTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-target');
      
      detailsTabTriggers.forEach(t => t.classList.remove('active'));
      detailsTabContents.forEach(c => c.classList.remove('active'));
      
      trigger.classList.add('active');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Close details modal event listeners
  if (closeDetailsBtn) {
    closeDetailsBtn.addEventListener('click', () => {
      detailsModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  if (detailsModal) {
    detailsModal.addEventListener('click', (e) => {
      if (e.target === detailsModal) {
        detailsModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Booking Form Select Options & Operations ---
  function initBookingForm() {
    if (!bookingForm) return;
    bookTourSelect.innerHTML = '';
    const allItems = [...tours, ...activities];
    
    // Populate Tours list
    allItems.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.title} (€${t.price}/person)`;
      bookTourSelect.appendChild(opt);
    });

    // Populate unique Cruise Ships list
    bookCruiseSelect.innerHTML = '<option value="">Select your cruise ship (if applicable)</option>';
    const uniqueShips = [...new Set(cruises.map(c => c.ship))].sort();
    uniqueShips.forEach(ship => {
      const opt = document.createElement('option');
      opt.value = ship;
      opt.textContent = ship;
      bookCruiseSelect.appendChild(opt);
    });

    // Set default date to tomorrow
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    document.getElementById('book-date').value = nextDay.toISOString().split('T')[0];

    // Parse URL parameters for pre-filling values
    parseUrlParams();

    updateCostSummary();
  }

  // Parse query parameters
  function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const tourParam = params.get('tour');
    const shipParam = params.get('ship');
    const dateParam = params.get('date');

    if (tourParam) {
      bookTourSelect.value = tourParam;
    }
    if (shipParam) {
      bookCruiseSelect.value = shipParam;
    }
    if (dateParam) {
      document.getElementById('book-date').value = dateParam;
    }
  }

  // Cost calculations
  function updateCostSummary() {
    if (!bookingForm) return;
    const tourId = parseInt(bookTourSelect.value);
    const count = parseInt(bookPassengers.value) || 1;
    const allItems = [...tours, ...activities];
    const tour = allItems.find(t => t.id === tourId);
    
    if (tour) {
      const basePrice = tour.price;
      const total = basePrice * count;
      
      summaryBasePrice.textContent = `€${basePrice}.00`;
      summaryPassengers.textContent = `x${count}`;
      summaryTotalCost.textContent = `€${total}.00`;
    }
  }

  if (bookTourSelect) bookTourSelect.addEventListener('change', updateCostSummary);
  if (bookPassengers) bookPassengers.addEventListener('input', updateCostSummary);

  // Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const tourId = parseInt(bookTourSelect.value);
      const name = document.getElementById('book-name').value;
      const email = document.getElementById('book-email').value;
      const phone = document.getElementById('book-phone').value;
      const date = document.getElementById('book-date').value;
      const cruiseShip = bookCruiseSelect.value || 'Not specified';
      const numPeople = bookPassengers.value;
      const requests = document.getElementById('book-requests').value || 'None';
      
      const allItems = [...tours, ...activities];
      const tour = allItems.find(t => t.id === tourId);
      
      if (tour) {
        console.log("=== Booking request submitted ===");
        console.log(`Tour: ${tour.title}`);
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Phone: ${phone}`);
        console.log(`Date: ${date}`);
        console.log(`Ship: ${cruiseShip}`);
        console.log(`Passengers: ${numPeople}`);
        console.log(`Special requests: ${requests}`);
        
        document.getElementById('success-tour-title').textContent = tour.title;
        document.getElementById('success-email').textContent = email;
        
        // Construct and open WhatsApp reservation message
        const totalCost = tour.price * numPeople;
        const message = `*New Reservation Request - Agadir Cruise Tours*

👋 Hello Samia Tours, I'd like to book a tour:
• *Tour:* ${tour.title}
• *Name:* ${name}
• *Email:* ${email}
• *Phone:* ${phone}
• *Date:* ${date}
• *Cruise Ship:* ${cruiseShip}
• *Passengers:* ${numPeople}
• *Estimated Cost:* €${totalCost}.00
• *Requests:* ${requests}

Thank you!`;

        const encodedText = encodeURIComponent(message);
        const waUrl = `https://wa.me/212661444189?text=${encodedText}`;
        window.open(waUrl, '_blank');

        // Toggle views
        bookingForm.style.display = 'none';
        successView.style.display = 'block';
        lucide.createIcons();
      }
    });
  }

  // Success view reset button
  if (successCloseBtn) {
    successCloseBtn.addEventListener('click', () => {
      bookingForm.reset();
      initBookingForm();
      bookingForm.style.display = 'block';
      successView.style.display = 'none';
      lucide.createIcons();
    });
  }

  // Details Modal Book Trigger
  if (modalDetailsBookBtn) {
    modalDetailsBookBtn.addEventListener('click', () => {
      if (selectedTour) {
        // Redirect to tour/activity single page
        const isTour = tours.some(t => t.id === selectedTour.id);
        window.location.href = isTour 
          ? `tour/${selectedTour.slug}/` 
          : `activity/${selectedTour.slug}/`;
      }
    });
  }

  // --- Contact Form Logic ---
  const contactForm = document.getElementById('contact-form');
  const contactSuccessView = document.getElementById('contact-success-view');
  const contactSuccessCloseBtn = document.getElementById('contact-success-close-btn');

  function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const phone = document.getElementById('contact-phone').value;
      const subject = document.getElementById('contact-subject').value;
      const messageText = document.getElementById('contact-message').value;

      const message = `*New Contact Inquiry - Agadir Cruise Tours*

👋 Hello Samia Tours, I have an inquiry:
• *Name:* ${name}
• *Email:* ${email}
• *Phone:* ${phone}
• *Subject:* ${subject}
• *Message:* ${messageText}

Thank you!`;

      const encodedText = encodeURIComponent(message);
      const waUrl = `https://wa.me/212661444189?text=${encodedText}`;
      window.open(waUrl, '_blank');

      // Toggle views
      contactForm.style.display = 'none';
      if (contactSuccessView) {
        contactSuccessView.style.display = 'block';
      }
      lucide.createIcons();
    });

    if (contactSuccessCloseBtn) {
      contactSuccessCloseBtn.addEventListener('click', () => {
        contactForm.reset();
        contactForm.style.display = 'block';
        if (contactSuccessView) {
          contactSuccessView.style.display = 'none';
        }
        lucide.createIcons();
      });
    }
  }

  // Tours Slider Control logic
  function initToursSlider() {
    const track = document.getElementById('tours-slider-track');
    const prevBtn = document.getElementById('tours-prev');
    const nextBtn = document.getElementById('tours-next');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    
    const getVisibleCount = () => {
      const width = window.innerWidth;
      if (width <= 600) return 1;
      if (width <= 1200) return 2;
      return 3;
    };

    const updateSlider = () => {
      const cards = track.querySelectorAll('.card');
      if (cards.length === 0) return;
      
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
      const step = cardWidth + gap;
      
      track.style.transform = `translateX(-${currentIndex * step}px)`;
      
      const maxSlides = cards.length - getVisibleCount();
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxSlides || maxSlides <= 0;
    };
    
    prevBtn.addEventListener('click', () => {
      currentIndex = Math.max(0, currentIndex - getVisibleCount());
      updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
      const cards = track.querySelectorAll('.card');
      const maxSlides = cards.length - getVisibleCount();
      currentIndex = Math.min(maxSlides, currentIndex + getVisibleCount());
      updateSlider();
    });
    
    window.addEventListener('resize', () => {
      const cards = track.querySelectorAll('.card');
      currentIndex = Math.min(currentIndex, Math.max(0, cards.length - getVisibleCount()));
      updateSlider();
    });
    
    // Slight delay to ensure elements are fully painted before getting dimensions
    setTimeout(updateSlider, 200);
  }

  // Activities Slider Control logic
  function initActivitiesSlider() {
    const track = document.getElementById('activities-slider-track');
    const prevBtn = document.getElementById('activities-prev');
    const nextBtn = document.getElementById('activities-next');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    let currentIndex = 0;
    
    const getVisibleCount = () => {
      const width = window.innerWidth;
      if (width <= 600) return 1;
      if (width <= 1200) return 2;
      return 3;
    };

    const updateSlider = () => {
      const cards = track.querySelectorAll('.card');
      if (cards.length === 0) return;
      
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
      const step = cardWidth + gap;
      
      track.style.transform = `translateX(-${currentIndex * step}px)`;
      
      const maxSlides = cards.length - getVisibleCount();
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxSlides || maxSlides <= 0;
    };
    
    prevBtn.addEventListener('click', () => {
      currentIndex = Math.max(0, currentIndex - getVisibleCount());
      updateSlider();
    });
    
    nextBtn.addEventListener('click', () => {
      const cards = track.querySelectorAll('.card');
      const maxSlides = cards.length - getVisibleCount();
      currentIndex = Math.min(maxSlides, currentIndex + getVisibleCount());
      updateSlider();
    });
    
    window.addEventListener('resize', () => {
      const cards = track.querySelectorAll('.card');
      currentIndex = Math.min(currentIndex, Math.max(0, cards.length - getVisibleCount()));
      updateSlider();
    });
    
    setTimeout(updateSlider, 200);
  }

  // --- Run Initializations ---
  
  // Render full tours on tours.html
  if (toursGrid) {
    renderGrid(toursGrid, tours);
  }
  
  // Render full activities on activities.html
  if (activitiesGrid) {
    renderGrid(activitiesGrid, activities);
  }

  // --- Cruise Showcase Interactive Logic ---
  function initCruiseShowcase() {
    const tabsList = document.getElementById('cruise-tabs-list');
    if (!tabsList) return;
    
    const tabs = tabsList.querySelectorAll('.cruise-tab-btn');
    const shipName = document.getElementById('showcase-ship-name');
    const shipTagline = document.getElementById('showcase-ship-tagline');
    const shipDesc = document.getElementById('showcase-ship-desc');
    const shipType = document.getElementById('showcase-ship-type');
    const shipLink = document.getElementById('showcase-ship-link');
    const shipImg = document.getElementById('showcase-ship-img');
    const prevBtn = document.getElementById('showcase-prev');
    const nextBtn = document.getElementById('showcase-next');
    
    const shipsData = [
      {
        name: "Oceania Allura",
        tagline: "The ultimate luxury explorer",
        desc: "Experience the ultimate luxury at sea. Oceania Allura combines refined style with warm, personal service and fine dining, making it the perfect gateway to Agadir's wonders.",
        type: "Premium Boutique, Mid-sized",
        images: [
          "cruises-images/Oceania-Allura.webp",
          "cruises-images/Oceania-Allura-1.webp",
          "cruises-images/Oceania-Allura-2.webp",
          "cruises-images/Oceania-Allura-3.webp"
        ]
      },
      {
        name: "Crystal Serenity",
        tagline: "Enriched luxury & modern elegance",
        desc: "Boasting exceptional passenger space and personalized service, Crystal Serenity brings a world of sophisticated refinement right to the shores of Agadir.",
        type: "Luxury Cruise Ship, Spacious",
        images: [
          "cruises-images/Crystal-Serenity.jpg",
          "cruises-images/Crystal-Serenity-1.jpg",
          "cruises-images/Crystal-Serenity-2.jpg",
          "cruises-images/Crystal-Serenity-3.jpg"
        ]
      },
      {
        name: "Amera",
        tagline: "Cozy explorer & classic charm",
        desc: "Phoenix Reisen's Amera offers a cozy, intimate feel with classic style, welcoming German-speaking and international cruise travelers to the beautiful port of Agadir.",
        type: "Classic Cruise Ship, Intimate",
        images: [
          "cruises-images/Amera.webp",
          "cruises-images/Amera-2.webp",
          "cruises-images/Amera-3.webp",
          "cruises-images/Amera-4.webp"
        ]
      },
      {
        name: "Azura",
        tagline: "The modern family-friendly giant",
        desc: "P&O Cruises' Azura is one of the largest ships in their fleet, bringing a lively atmosphere, family-friendly fun, and spectacular entertainment options to the Atlantic.",
        type: "Large Family Resort Ship",
        images: [
          "cruises-images/Azura.webp",
          "cruises-images/Azura-1.webp",
          "cruises-images/Azura-2.webp",
          "cruises-images/Azura-3.webp"
        ]
      },
      {
        name: "Norwegian Star",
        tagline: "Freestyle cruising & flexibility",
        desc: "Norwegian Star offers the ultimate freedom and flexibility of freestyle cruising, letting you shape your perfect shore excursion day in Agadir without strict timelines.",
        type: "Lively Resort Cruise Ship",
        images: [
          "cruises-images/Norwegian-Star.webp",
          "cruises-images/Norwegian-Star-1.webp",
          "cruises-images/Norwegian-Star-2.webp",
          "cruises-images/Norwegian-Star-3.webp"
        ]
      },
      {
        name: "Amadea",
        tagline: "The luxurious first-class flagship",
        desc: "The MS Amadea is Phoenix Reisen's elegant flagship, offering first-class comfort, exceptional privacy, and highly personalized service for premium voyages.",
        type: "Elegant Flagship, Premium Class",
        images: [
          "cruises-images/Amadea.jpg",
          "cruises-images/Amadea-1.webp",
          "cruises-images/Amadea-2.webp",
          "cruises-images/Amadea-3.webp"
        ]
      }
    ];
    
    let activeCompanyIndex = 0;
    let activeImageIndex = 0;
    
    const updateShowcase = (companyIdx, imgIdx = 0) => {
      activeCompanyIndex = companyIdx;
      activeImageIndex = imgIdx;
      
      const data = shipsData[activeCompanyIndex];
      
      // Update Active Tab
      tabs.forEach((tab, idx) => {
        if (idx === activeCompanyIndex) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
      
      // Fade out image
      shipImg.style.opacity = '0';
      
      setTimeout(() => {
        shipName.textContent = data.name;
        shipTagline.textContent = data.tagline;
        shipDesc.textContent = data.desc;
        shipType.textContent = data.type;
        shipImg.src = data.images[activeImageIndex];
        shipImg.alt = `${data.name} Cruise Ship (Photo ${activeImageIndex + 1})`;
        shipLink.href = `cruises.html?ship=${encodeURIComponent(data.name)}`;
        
        // Fade in image
        shipImg.style.opacity = '1';
      }, 300);
    };
    
    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        updateShowcase(idx, 0); // Reset to first image on company change
      });
    });
    
    prevBtn.addEventListener('click', () => {
      const data = shipsData[activeCompanyIndex];
      let imgIdx = activeImageIndex - 1;
      if (imgIdx < 0) imgIdx = data.images.length - 1;
      updateShowcase(activeCompanyIndex, imgIdx);
    });
    
    nextBtn.addEventListener('click', () => {
      const data = shipsData[activeCompanyIndex];
      let imgIdx = (activeImageIndex + 1) % data.images.length;
      updateShowcase(activeCompanyIndex, imgIdx);
    });
  }

  // Render tours in the homepage slider track
  const toursSliderTrack = document.getElementById('tours-slider-track');
  if (toursSliderTrack) {
    renderGrid(toursSliderTrack, tours);
    initToursSlider();
  }
  
  // Initialize Cruise Showcase
  initCruiseShowcase();
  
  // --- Render Home Page Cruise Schedule ---
  function renderHomeSchedule() {
    const homeScheduleTbody = document.getElementById('home-schedule-tbody');
    if (!homeScheduleTbody) return;
    homeScheduleTbody.innerHTML = '';
    
    // Select first 5 upcoming cruises from the cruises list
    const upcomingCruises = cruises.slice(0, 5);
    
    upcomingCruises.forEach(item => {
      const row = document.createElement('tr');
      const arrivalDateStr = `${item.day} ${item.month} ${item.year}`;
      
      row.innerHTML = `
        <td data-label="Arrival Date" style="font-weight: 600; color: var(--primary);">${arrivalDateStr}</td>
        <td data-label="Cruise Ship">
          <div style="font-weight: 700; color: var(--secondary);">${item.ship}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${item.cruiseLine}</div>
        </td>
        <td data-label="Times in Port">${item.times}</td>
        <td data-label="Excursions">
          <a href="cruises.html?ship=${encodeURIComponent(item.ship)}" class="btn btn-secondary btn-sm" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">Book Excursion</a>
        </td>
      `;
      homeScheduleTbody.appendChild(row);
    });
  }

  // Render cruise list on cruises.html or home page if present
  let initialShipQuery = '';
  if (window.location.pathname.includes('cruises.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const shipParam = urlParams.get('ship');
    if (shipParam) {
      initialShipQuery = shipParam;
      if (shipSearch) {
        shipSearch.value = shipParam;
      }
    }
  }
  renderSchedules(initialShipQuery);
  
  // Render home page schedule if container is present
  renderHomeSchedule();
  
  // Render reviews if present
  renderReviews();

  // Initialize Activities Slider if container is present
  initActivitiesSlider();
  
  // Initialize Booking & Contact Forms
  initBookingForm();
  initContactForm();

  // Highlight active page in navbar based on location path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  // Render icons
  lucide.createIcons();
});
