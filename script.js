
document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', function () {
        const openIcon = document.getElementById('menu-open-icon');
        const closeIcon = document.getElementById('menu-close-icon');

        mobileMenu.classList.toggle('hidden');

        if (openIcon && closeIcon) {
            openIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        }
    });

    // New Mobile Header Trigger
    const mobileTrigger = document.getElementById('mobile-menu-trigger');
    if (mobileTrigger) {
        mobileTrigger.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
            const iconBars = document.getElementById('menu-icon-bars');
            const iconClose = document.getElementById('menu-icon-close');

            if (iconBars && iconClose) {
                iconBars.classList.toggle('hidden');
                iconClose.classList.toggle('hidden');
            }
        });
    }

    // Initialize testimonial swiper
    const testimonialSwiper = new Swiper('.testimonialSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });




    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.slide-in, .fade-in, .scale-in-animation').forEach(element => {
        observer.observe(element);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (!mobileMenu.classList.contains('-translate-y-full')) {
                    mobileMenu.classList.add('-translate-y-full');
                    mobileMenu.classList.remove('translate-y-0');
                }
            }
        });
    });
});
// Make available globally
window.togglePropertyMenu = function (event, dropdownId) {
    if (event) event.stopPropagation();

    // If a specific ID is provided (e.g. for mobile), toggle that
    if (dropdownId) {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) dropdown.classList.toggle("show");
    } else {
        // Fallback or default behavior (e.g. for desktop if no ID passed)
        // Try finding the dropdown within the same container or a default ID
        // For compatibility with existing onclick="togglePropertyMenu(event)"
        const dropdown = document.getElementById("propertyDropdown");
        if (dropdown) dropdown.classList.toggle("show");
    }
}

// Close dropdowns when clicking outside
document.addEventListener("click", function (e) {
    if (!e.target.closest(".mobile-dropdown")) {
        const dropdowns = document.querySelectorAll(".dropdown-menu");
        dropdowns.forEach(d => d.classList.remove("show"));
    }
});
