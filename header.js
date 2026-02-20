const slides = document.querySelectorAll('.bg-slider .slide');
if (slides.length > 0) {
    let currentSlide = 0;
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    setInterval(nextSlide, 5000); // Change image every 5 seconds
}

// ===== Main Nav Toggle =====
function toggleMainNav() {
    const panel = document.getElementById('mainNavPanel');
    const icon = document.getElementById('mainNavIcon');
    const openIcon = document.getElementById('menu-open-icon');
    const closeIcon = document.getElementById('menu-close-icon');

    if (panel) {
        const isOpen = panel.classList.toggle('open');
        if (icon) icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';

        // Sync with navbar mobile button if it exists
        if (openIcon && closeIcon) {
            openIcon.classList.toggle('hidden', isOpen);
            closeIcon.classList.toggle('hidden', !isOpen);
        }
    }
}

// Close panel when clicking outside
document.addEventListener('click', function (e) {
    const panel = document.getElementById('mainNavPanel');
    const toggle = document.getElementById('mainNavToggle');
    const mobileBtn = document.getElementById('mobile-menu-button');

    if (panel && !panel.contains(e.target) &&
        (!toggle || !toggle.contains(e.target)) &&
        (!mobileBtn || !mobileBtn.contains(e.target))) {

        if (panel.classList.contains('open')) {
            toggleMainNav();
        }
    }
});

// ===== Property Dropdown Toggle =====
function togglePropertyMenu(event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('propertyDropdown');
    const panelDropdown = document.getElementById('panelPropertyDropdown');
    if (dropdown) dropdown.classList.toggle('show');
    if (panelDropdown) panelDropdown.classList.toggle('show');
}

// ===== Post Property Modal Logic =====
function openPostModal() {
    const modal = document.getElementById('postPropertyModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }
}

function closePostModal() {
    const modal = document.getElementById('postPropertyModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scroll
    }
}

// Close modal on click outside content
window.onclick = function (event) {
    const modal = document.getElementById('postPropertyModal');
    if (modal && event.target == modal) {
        closePostModal();
    }
}

// Form submission (prevention for now)
const postForm = document.getElementById('postPropertyForm');
if (postForm) {
    postForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you! We have received your details and will contact you shortly.');
        closePostModal();
    });
}

// ===== Mobile Responsive Enhancements (Pagination & Animations) =====
document.addEventListener('DOMContentLoaded', () => {
    const scrollRows = document.querySelectorAll('.mobile-scroll-row');

    scrollRows.forEach(row => {
        // Create pagination dots
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'mobile-pagination';
        const cards = row.querySelectorAll('.property-card');

        cards.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = 'dot' + (idx === 0 ? ' active' : '');
            dotsContainer.appendChild(dot);
        });

        row.parentNode.insertBefore(dotsContainer, row.nextSibling);

        // Scroll Animation & Pagination sync
        const observerOptions = {
            root: row,
            threshold: 0.6
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add animation class
                    entry.target.classList.add('in-view');

                    // Sync dots
                    const index = Array.from(cards).indexOf(entry.target);
                    const dots = dotsContainer.querySelectorAll('.dot');
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, observerOptions);

        cards.forEach(card => observer.observe(card));

        // Auto-pagination logic
        let autoScrollTimer;
        let currentIndex = 0;
        let isUserInteracting = false;

        const startAutoScroll = () => {
            if (autoScrollTimer) clearInterval(autoScrollTimer);
            autoScrollTimer = setInterval(() => {
                if (!isUserInteracting && window.innerWidth <= 768) {
                    currentIndex = (currentIndex + 1) % cards.length;
                    const cardToScroll = cards[currentIndex];
                    row.scrollTo({
                        left: cardToScroll.offsetLeft - (row.offsetWidth - cardToScroll.offsetWidth) / 2,
                        behavior: 'smooth'
                    });
                }
            }, 4000); // Scroll every 4 seconds
        };

        const stopAutoScroll = () => {
            if (autoScrollTimer) clearInterval(autoScrollTimer);
        };

        // Reset timer on user interaction
        const handleInteraction = () => {
            isUserInteracting = true;
            stopAutoScroll();
            // Resume after 10 seconds of no interaction
            clearTimeout(window.interactionTimeout);
            window.interactionTimeout = setTimeout(() => {
                isUserInteracting = false;
                startAutoScroll();
            }, 10000);
        };

        row.addEventListener('touchstart', handleInteraction, { passive: true });
        row.addEventListener('mousedown', handleInteraction);
        row.addEventListener('scroll', () => {
            // Sync currentIndex with centered card
            const rowCenter = row.scrollLeft + row.offsetWidth / 2;
            let bestIndex = 0;
            let minDiff = Infinity;

            cards.forEach((card, i) => {
                const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                const diff = Math.abs(rowCenter - cardCenter);
                if (diff < minDiff) {
                    minDiff = diff;
                    bestIndex = i;
                }
            });
            currentIndex = bestIndex;
        }, { passive: true });

        // Initial start
        startAutoScroll();
    });
});