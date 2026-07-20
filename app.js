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
            <button class="btn btn-secondary btn-card-details" data-id="${item.id}">View Details</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Attach Details Button Handlers
    container.querySelectorAll('.btn-card-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        openDetails(id);
      });
    });
  }

  // --- Render Cruise Schedule Table ---
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

    filteredCruises.forEach(item => {
      const row = document.createElement('tr');
      const arrivalTimeStr = item.times.replace('a ', 'Arrival ').replace(' d ', ', Departure ').replace(/(\d{2})(\d{2})/g, '$1:$2');
      
      row.innerHTML = `
        <td style="font-weight: 600; white-space: nowrap;">
          <div style="font-size: 0.95rem; color: var(--primary);">${item.day}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${item.month} ${item.year}</div>
        </td>
        <td>
          <div class="ship-name">${item.ship}</div>
          <div class="ship-line">${item.cruiseLine}</div>
        </td>
        <td>
          <span class="time-badge">
            <i data-lucide="clock" size="14"></i>
            ${arrivalTimeStr}
          </span>
        </td>
        <td class="passenger-count">${parseInt(item.passengers).toLocaleString()} pax</td>
        <td>
          <a href="contact.html?ship=${encodeURIComponent(item.ship)}&date=${item.year}-${getMonthNumber(item.month)}-${getDateNumber(item.day)}" class="btn btn-secondary btn-schedule-book">
            Book Match
          </a>
        </td>
      `;
      scheduleTbody.appendChild(row);
    });

    lucide.createIcons();
  }

  // Schedule filters event listeners
  if (shipSearch) {
    shipSearch.addEventListener('input', (e) => {
      renderSchedules(e.target.value, monthFilter.value);
    });
  }

  if (monthFilter) {
    monthFilter.addEventListener('change', (e) => {
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
        // Redirect to contact page with pre-filled parameter
        window.location.href = `contact.html?tour=${selectedTour.id}`;
      }
    });
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

  // Render top 3 featured excursions on index.html
  if (featuredGrid) {
    const topTours = tours.slice(0, 2);
    const topActivities = activities.slice(0, 1);
    renderGrid(featuredGrid, [...topTours, ...topActivities]);
  }
  
  // Render cruise list on cruises.html or home page if present
  renderSchedules();
  
  // Render reviews if present
  renderReviews();
  
  // Initialize Booking Form
  initBookingForm();

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
