// Enhanced Menu Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Menu items data
    const menuItems = [
        // Beverages
        {
            name: "Hot Mocha Latte",
            category: "beverages",
            price: 480,
            originalPrice: 600,
            image: "Hot Mocha Latte.webp",
            description: "Rich espresso with steamed milk and chocolate",
            rating: 4.8,
            size: "12oz",
            calories: 250,
            badge: "hot"
        },
        {
            name: "Salted Caramel Macchiato",
            category: "beverages",
            price: 520,
            originalPrice: 650,
            image: "Salted Caramel Macchiato.jpeg",
            description: "Espresso with caramel syrup and sea salt foam",
            rating: 4.9,
            size: "16oz",
            calories: 320,
            badge: "premium"
        },
        {
            name: "Iced Mocha",
            category: "beverages",
            price: 450,
            originalPrice: 550,
            image: "Iced Mocha.jpeg",
            description: "Chilled espresso with chocolate and ice",
            rating: 4.6,
            size: "16oz",
            calories: 280,
            badge: "cold"
        },
        {
            name: "Iced Americano",
            category: "beverages",
            price: 380,
            originalPrice: 450,
            image: "Iced Americano.jpeg",
            description: "Bold espresso shots over ice with water",
            rating: 4.2,
            size: "16oz",
            calories: 15,
            badge: "cold"
        },
        {
            name: "Cold Brew Coffee",
            category: "beverages",
            price: 420,
            originalPrice: 520,
            image: "Cold Brew Coffee.webp",
            description: "Smooth, cold-extracted coffee concentrate",
            rating: 4.5,
            size: "16oz",
            calories: 25,
            badge: "cold"
        },
        // Snacks
        {
            name: "Chocolate Chip Cookie",
            category: "snacks",
            price: 180,
            originalPrice: 220,
            image: "chocolate chip cookie.jpeg",
            description: "Freshly baked with premium chocolate chips",
            rating: 4.7,
            size: "80g",
            calories: 340,
            badge: "fresh"
        },
        {
            name: "Doughnuts",
            category: "snacks",
            price: 160,
            originalPrice: 200,
            image: "Doughnut.jpg",
            description: "Classic glazed doughnuts made fresh daily",
            rating: 4.4,
            size: "70g",
            calories: 280,
            badge: "fresh"
        },
        // Food Items
        {
            name: "Grilled Chicken Sandwich",
            category: "fooditems",
            price: 680,
            originalPrice: 850,
            image: "Grilled Chicken Sandwich.jpeg",
            description: "Tender grilled chicken with fresh vegetables",
            rating: 4.8,
            size: "250g",
            calories: 420,
            badge: "hot"
        },
        {
            name: "Black Forest Cake",
            category: "fooditems",
            price: 320,
            originalPrice: 400,
            image: "Black Forest cake.jpeg",
            description: "Rich chocolate cake with cherries and cream",
            rating: 4.9,
            size: "120g",
            calories: 450,
            badge: "premium"
        }
    ];

    // Initialize menu
    let currentCategory = 'all';
    let displayedItems = 6;
    const itemsPerLoad = 6;

    // Get DOM elements
    const categoryTabs = document.querySelectorAll('.category-tab');
    const menuGrid = document.getElementById('menu-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const quickViewModal = document.getElementById('quick-view-modal');
    const modalClose = document.getElementById('modal-close');
    const searchBox = document.getElementById('search-box');

    // Category management
    function updateCategoryCounts() {
        const counts = {
            all: menuItems.length,
            beverages: menuItems.filter(item => item.category === 'beverages').length,
            snacks: menuItems.filter(item => item.category === 'snacks').length,
            fooditems: menuItems.filter(item => item.category === 'fooditems').length,
            addons: menuItems.filter(item => item.category === 'addons').length,
            otheritems: menuItems.filter(item => item.category === 'otheritems').length
        };

        Object.keys(counts).forEach(category => {
            const countElement = document.getElementById(`count-${category}`);
            if (countElement) {
                countElement.textContent = counts[category];
            }
        });
    }

    // Filter items by category
    function filterItems(category) {
        currentCategory = category;
        displayedItems = itemsPerLoad;
        renderMenuItems();
        
        // Update active tab
        categoryTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            }
        });
    }

    // Get filtered items
    function getFilteredItems() {
        let filtered = currentCategory === 'all' 
            ? menuItems 
            : menuItems.filter(item => item.category === currentCategory);
        
        // Apply search filter
        const searchTerm = searchBox ? searchBox.value.toLowerCase() : '';
        if (searchTerm) {
            filtered = filtered.filter(item => 
                item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered;
    }

    // Generate stars HTML
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }

    // Get badge class
    function getBadgeClass(badge) {
        const badgeClasses = {
            'premium': 'premium',
            'cold': 'cold',
            'hot': '',
            'fresh': ''
        };
        return badgeClasses[badge] || '';
    }

    // Get badge icon
    function getBadgeIcon(badge) {
        const badgeIcons = {
            'premium': 'fas fa-crown',
            'cold': 'fas fa-snowflake',
            'hot': 'fas fa-fire',
            'fresh': 'fas fa-cookie-bite'
        };
        return badgeIcons[badge] || 'fas fa-star';
    }

    // Render menu items
    function renderMenuItems() {
        const filteredItems = getFilteredItems();
        const itemsToShow = filteredItems.slice(0, displayedItems);
        
        menuGrid.innerHTML = itemsToShow.map(item => {
            const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
            
            return `
                <div class="menu-item" data-category="${item.category}">
                    <div class="item-image">
                        <img src="image/${item.image}" alt="${item.name}">
                        <div class="item-badge ${getBadgeClass(item.badge)}">
                            <i class="${getBadgeIcon(item.badge)}"></i>
                            <span>${item.badge.charAt(0).toUpperCase() + item.badge.slice(1)}</span>
                        </div>
                        <div class="item-overlay">
                            <button class="quick-view-btn" data-item='${JSON.stringify(item)}'>
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="favorite-btn">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                    <div class="item-content">
                        <div class="item-rating">
                            ${generateStars(item.rating)}
                            <span class="rating-text">(${item.rating})</span>
                        </div>
                        <h3 class="item-name">${item.name}</h3>
                        <p class="item-description">${item.description}</p>
                        <div class="item-details">
                            <span class="item-size"><i class="fas fa-coffee"></i> ${item.size}</span>
                            <span class="item-calories"><i class="fas fa-fire"></i> ${item.calories} cal</span>
                        </div>
                        <div class="item-footer">
                            <div class="price-section">
                                <span class="current-price">Rs ${item.price}</span>
                                <span class="original-price">Rs ${item.originalPrice}</span>
                                <span class="discount">${discount}% OFF</span>
                            </div>
                            <button class="add-to-cart-btn" data-item="${item.name}" data-price="${item.price}" data-image="${item.image}">
                                <i class="fas fa-shopping-cart"></i>
                                <span>Add to Cart</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Show/hide load more button
        if (loadMoreBtn) {
            loadMoreBtn.style.display = displayedItems >= filteredItems.length ? 'none' : 'inline-flex';
        }

        // Add event listeners
        addEventListeners();
    }

    // Add event listeners to menu items
    function addEventListeners() {
        // Quick view buttons
        const quickViewBtns = document.querySelectorAll('.quick-view-btn');
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemData = JSON.parse(this.dataset.item);
                openQuickView(itemData);
            });
        });

        // Favorite buttons
        const favoriteBtns = document.querySelectorAll('.favorite-btn');
        favoriteBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                const icon = this.querySelector('i');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
            });
        });

        // Add to cart buttons
        const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const itemName = this.dataset.item;
                const itemPrice = parseInt(this.dataset.price);
                const itemImage = this.dataset.image;
                
                addToCart(itemName, itemPrice, itemImage);
                
                // Visual feedback
                this.innerHTML = '<i class="fas fa-check"></i><span>Added!</span>';
                this.style.background = '#27ae60';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-shopping-cart"></i><span>Add to Cart</span>';
                    this.style.background = '';
                }, 2000);
            });
        });
    }

    // Open quick view modal
    function openQuickView(item) {
        const modal = document.getElementById('quick-view-modal');
        const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
        
        // Populate modal content
        document.getElementById('modal-item-image').src = `image/${item.image}`;
        document.getElementById('modal-item-name').textContent = item.name;
        document.getElementById('modal-stars').innerHTML = generateStars(item.rating);
        document.getElementById('modal-rating-text').textContent = `(${item.rating})`;
        document.querySelector('#quick-view-modal p').textContent = item.description;
        document.getElementById('modal-calories').textContent = `${item.calories} cal`;
        document.getElementById('modal-size').textContent = item.size;
        document.getElementById('modal-current-price').textContent = `Rs ${item.price}`;
        document.getElementById('modal-original-price').textContent = `Rs ${item.originalPrice}`;
        
        // Set up modal add to cart button
        const modalAddToCart = document.getElementById('modal-add-to-cart');
        modalAddToCart.onclick = () => {
            addToCart(item.name, item.price, item.image);
            closeQuickView();
        };
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close quick view modal
    function closeQuickView() {
        const modal = document.getElementById('quick-view-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Add to cart function
    function addToCart(name, price, image) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count in header if function exists
        if (typeof updateCartCount === 'function') {
            updateCartCount();
        }
        
        // Dispatch custom event for cart update
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    // Search functionality
    if (searchBox) {
        let searchTimeout;
        searchBox.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                displayedItems = itemsPerLoad;
                renderMenuItems();
            }, 300);
        });
    }

    // Event listeners
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterItems(this.dataset.category);
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            displayedItems += itemsPerLoad;
            renderMenuItems();
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeQuickView);
    }

    // Close modal on outside click
    if (quickViewModal) {
        quickViewModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeQuickView();
            }
        });
    }

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && quickViewModal.classList.contains('active')) {
            closeQuickView();
        }
    });

    // Handle URL search parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam && searchBox) {
        searchBox.value = searchParam;
    }

    // Initialize
    updateCategoryCounts();
    renderMenuItems();

    // Animate menu items on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const menuObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                menuObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe menu items for animation
    function observeMenuItems() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            menuObserver.observe(item);
        });
    }

    // Add animation styles
    const animationStyles = document.createElement('style');
    animationStyles.textContent = `
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(animationStyles);

    // Observe items after rendering
    setTimeout(observeMenuItems, 100);

    // Re-observe items when new ones are added
    const originalRenderMenuItems = renderMenuItems;
    renderMenuItems = function() {
        originalRenderMenuItems();
        setTimeout(observeMenuItems, 100);
    };
});
