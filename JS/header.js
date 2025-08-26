// Enhanced Header Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Header script loaded'); // Debug log
    
    // Get header elements
    const header = document.querySelector('.header');
    const searchBtn = document.getElementById('search-btn');
    const searchForm = document.getElementById('search-form');
    const cartBtn = document.getElementById('cart-btn');
    const cartDropdown = document.getElementById('cart-dropdown');
    const userBtn = document.getElementById('user-btn');
    const userDropdown = document.getElementById('user-dropdown');
    const mobileMenuBtn = document.getElementById('menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const cartCount = document.querySelector('.cart-count');

    // Debug: Log element existence
    console.log('Elements found:', {
        header: !!header,
        searchBtn: !!searchBtn,
        searchForm: !!searchForm,
        cartBtn: !!cartBtn,
        cartDropdown: !!cartDropdown,
        userBtn: !!userBtn,
        userDropdown: !!userDropdown,
        mobileMenuBtn: !!mobileMenuBtn,
        mobileNav: !!mobileNav
    });

    // Header scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Search functionality
    if (searchBtn && searchForm) {
        searchBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            searchForm.classList.toggle('active');
            if (cartDropdown) cartDropdown.classList.remove('active');
            if (userDropdown) userDropdown.classList.remove('active');
            
            if (searchForm.classList.contains('active')) {
                const searchInput = searchForm.querySelector('input');
                if (searchInput) searchInput.focus();
            }
        });

        // Search form submission
        const searchSubmit = document.querySelector('.search-submit');
        const searchBox = document.getElementById('search-box');
        
        if (searchSubmit && searchBox) {
            searchSubmit.addEventListener('click', function(e) {
                e.preventDefault();
                performSearch(searchBox.value);
            });
            
            searchBox.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performSearch(this.value);
                }
            });
        }
    }

    // Cart functionality
    if (cartBtn && cartDropdown) {
        cartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            cartDropdown.classList.toggle('active');
            if (searchForm) searchForm.classList.remove('active');
            if (userDropdown) userDropdown.classList.remove('active');
        });
    }

    // User dropdown functionality
    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
            if (searchForm) searchForm.classList.remove('active');
            if (cartDropdown) cartDropdown.classList.remove('active');
        });
    }

    // Mobile menu functionality
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenuBtn.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        if (searchForm) searchForm.classList.remove('active');
        if (cartDropdown) cartDropdown.classList.remove('active');
        if (userDropdown) userDropdown.classList.remove('active');
    });

    // Prevent dropdown close when clicking inside
    [searchForm, cartDropdown, userDropdown].forEach(dropdown => {
        if (dropdown) {
            dropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });

    // Search function
    function performSearch(query) {
        if (query.trim() === '') return;
        
        console.log('Searching for:', query);
        // Add your search logic here
        // For now, we'll just redirect to menu page with search parameter
        window.location.href = `menu.html?search=${encodeURIComponent(query)}`;
    }

    // Update cart count
    function updateCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        updateCartDropdown(cart);
    }

    // Update cart dropdown content
    function updateCartDropdown(cart) {
        const cartItemsContainer = document.querySelector('.cart-items-container');
        const cartTotal = document.querySelector('.cart-total');
        
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #ccc;">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.6rem;">Your cart is empty</p>
                    <a href="menu.html" class="btn" style="margin-top: 1rem;">Browse Menu</a>
                </div>
            `;
            if (cartTotal) cartTotal.textContent = 'Total: Rs 0';
            return;
        }

        let total = 0;
        cartItemsContainer.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            return `
                <div class="cart-item" data-name="${item.name}">
                    <img src="image/${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-controls">
                            <button class="quantity-btn minus" onclick="updateCartQuantity('${item.name}', -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" onclick="updateCartQuantity('${item.name}', 1)">+</button>
                        </div>
                        <div class="cart-item-price">Rs ${itemTotal}</div>
                    </div>
                    <button class="remove-item" onclick="removeFromCart('${item.name}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }).join('');

        if (cartTotal) cartTotal.textContent = `Total: Rs ${total}`;
    }

    // Helper functions for cart management
    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function setCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Global functions for cart operations
    window.updateCartQuantity = function(itemName, change) {
        const cart = getCart();
        const itemIndex = cart.findIndex(item => item.name === itemName);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            setCart(cart);
        }
    };

    window.removeFromCart = function(itemName) {
        const cart = getCart();
        const updatedCart = cart.filter(item => item.name !== itemName);
        setCart(updatedCart);
    };

    // Initialize cart count on page load
    updateCartCount();

    // Active navigation link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileMenuBtn.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Header animations on page load
    const headerElements = document.querySelectorAll('.logo, .nav-item, .header-actions > *');
    headerElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';
        element.style.animation = `fadeInDown 0.6s ease forwards ${index * 0.1}s`;
    });

    // Add fadeInDown animation if not exists
    if (!document.querySelector('#header-animations')) {
        const style = document.createElement('style');
        style.id = 'header-animations';
        style.textContent = `
            @keyframes fadeInDown {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .cart-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border-bottom: 1px solid rgba(211,173,127,0.1);
                position: relative;
            }
            
            .cart-item img {
                width: 50px;
                height: 50px;
                border-radius: 8px;
                object-fit: cover;
            }
            
            .cart-item-info {
                flex: 1;
            }
            
            .cart-item-info h4 {
                color: #fff;
                font-size: 1.4rem;
                margin: 0 0 0.5rem 0;
            }
            
            .cart-item-controls {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 0.5rem;
            }
            
            .quantity-btn {
                width: 25px;
                height: 25px;
                border: 1px solid var(--main-color);
                background: transparent;
                color: var(--main-color);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
            }
            
            .quantity-btn:hover {
                background: var(--main-color);
                color: #000;
            }
            
            .quantity {
                color: #fff;
                font-weight: 500;
                min-width: 20px;
                text-align: center;
            }
            
            .cart-item-price {
                color: var(--main-color);
                font-weight: 600;
                font-size: 1.3rem;
            }
            
            .remove-item {
                background: transparent;
                border: none;
                color: #ff4757;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .remove-item:hover {
                background: rgba(255, 71, 87, 0.1);
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);
    }
});
