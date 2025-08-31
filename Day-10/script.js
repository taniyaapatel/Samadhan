// Product Card Interactions
document.addEventListener('DOMContentLoaded', function() {

    // Buy Now Button Functionality
    const buyButtons = document.querySelectorAll('.buy-btn');

    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productTitle = this.closest('.product-card').querySelector('.product-title').textContent;
            alert(`Added ${productTitle} to cart!`);

            // Add visual feedback
            this.style.background = '#28a745';
            this.style.color = 'white';
            this.style.border = '1px solid #28a745';
            this.textContent = 'Added!';

            // Reset button after 2 seconds
            setTimeout(() => {
                this.style.background = '#ffffff';
                this.style.color = '#333';
                this.style.border = '1px solid #333';
                this.textContent = 'Buy now';
            }, 2000);
        });
    });

    // Store Selection Functionality
    const storeRadios = document.querySelectorAll('input[type="radio"]');

    storeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Uncheck other radios in the same group
            const name = this.name;
            document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
                if (r !== this) {
                    r.checked = false;
                }
            });

            // Show store selection feedback
            if (this.checked) {
                const productCard = this.closest('.product-card');
                const productTitle = productCard.querySelector('.product-title').textContent;

                // Create feedback message
                let feedback = document.createElement('div');
                feedback.className = 'store-feedback';
                feedback.style.cssText = `
                    background: #e8f5e8;
                    color: #28a745;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    margin-top: 8px;
                    text-align: center;
                `;
                feedback.textContent = `Store selected for ${productTitle}`;

                // Remove existing feedback if any
                const existingFeedback = productCard.querySelector('.store-feedback');
                if (existingFeedback) {
                    existingFeedback.remove();
                }

                // Add new feedback
                productCard.querySelector('.availability').appendChild(feedback);
            }
        });
    });

    // Product Card Hover Effects
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Navigation Link Interactions
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Add click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            // Show placeholder alert
            const linkText = this.textContent.trim();
            if (linkText !== 'Categories') {
                alert(`${linkText} page coming soon!`);
            }
        });
    });

    // Store and Delivery Section Interactions
    const storeLink = document.querySelector('.store-link');
    const deliveryLink = document.querySelector('.delivery-link');

    if (storeLink) {
        storeLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Store selection feature coming soon!');
        });
    }

    if (deliveryLink) {
        deliveryLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Delivery estimates feature coming soon!');
        });
    }

    // View All Products Link
    const viewAllLink = document.querySelector('.view-all');

    if (viewAllLink) {
        viewAllLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Full product catalog coming soon!');
        });
    }

    // Add loading animation to images
    const productImages = document.querySelectorAll('.product-image img');

    productImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });

        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.style.filter = 'grayscale(100%)';
        });

        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';

    // Console welcome message
    console.log('🎉 Welcome to the Styled Product Card List!');
    console.log('✨ Features: Interactive cards, store selection, responsive design');
    console.log('🚀 Built with HTML, CSS, and JavaScript');
});

// Utility function to format prices
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Utility function to add to cart (placeholder)
function addToCart(productId, productName, price) {
    console.log(`Adding to cart: ${productName} - ${formatPrice(price)}`);
    // This would typically integrate with a shopping cart system
    return true;
}

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatPrice,
        addToCart
    };
}


