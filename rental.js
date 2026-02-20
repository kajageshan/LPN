document.addEventListener('DOMContentLoaded', function () {
    // Configuration
    const ITEMS_PER_ROW = 3;
    const ROWS_PER_PAGE = 3; // User requested 3 rows
    const ITEMS_PER_PAGE = ITEMS_PER_ROW * ROWS_PER_PAGE;

    // Elements
    const grid = document.getElementById('rental-grid');
    const paginationContainer = document.getElementById('pagination');
    const priceFilter = document.getElementById('price-filter');
    const sortDropdown = document.getElementById('sort-dropdown');

    // Store original items to restore after filtering
    const allItems = Array.from(grid.children);
    let currentItems = [...allItems];
    let currentPage = 1;

    // Initialize
    init();

    function init() {
        setupEventListeners();
        renderPage(1);
    }

    function setupEventListeners() {
        priceFilter.addEventListener('change', handleFilter);
        sortDropdown.addEventListener('change', handleSort);
    }

    function handleFilter() {
        const selectedRange = priceFilter.value;

        if (selectedRange === 'all') {
            currentItems = [...allItems];
        } else {
            const [min, max] = selectedRange.split('-').map(Number);
            currentItems = allItems.filter(item => {
                const price = parseInt(item.dataset.price);
                if (max) {
                    return price >= min && price <= max;
                } else {
                    return price >= min;
                }
            });
        }

        // Re-sort if needed (maintain current sort)
        handleSort(null, false);

        // Reset to page 1 and render
        currentPage = 1;
        renderPage(1);
    }

    function handleSort(e, refresh = true) {
        const sortValue = sortDropdown.value;

        if (sortValue === 'price-low') {
            currentItems.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
        } else if (sortValue === 'price-high') {
            currentItems.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
        } else {
            // Default or Featured - randomly shuffle or revert to original index if tracked
            // For simplicity, we just keep current order or random
        }

        if (refresh) renderPage(1);
    }

    function renderPage(page) {
        currentPage = page;

        // Hide all first
        allItems.forEach(item => item.style.display = 'none');

        // Calculate slice
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageItems = currentItems.slice(start, end);

        // Show items for current page
        // We need to re-append them to the grid to ensure visual order matches sort order
        grid.innerHTML = '';
        pageItems.forEach(item => {
            item.style.display = 'flex'; // Restore display
            grid.appendChild(item);
        });

        // If no items found
        if (pageItems.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500">No properties found matching your criteria.</div>';
        }

        renderPagination();
    }

    function renderPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(currentItems.length / ITEMS_PER_PAGE);

        if (totalPages <= 1) return;

        // Prev Button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        if (currentPage === 1) prevBtn.style.opacity = '0.5';
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) renderPage(currentPage - 1);
        });
        paginationContainer.appendChild(prevBtn);

        // Number Buttons
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.innerText = i;
            btn.addEventListener('click', () => renderPage(i));
            paginationContainer.appendChild(btn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        if (currentPage === totalPages) nextBtn.style.opacity = '0.5';
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) renderPage(currentPage + 1);
        });
        paginationContainer.appendChild(nextBtn);
    }
});
