/**
 * FAQ System - Universal Toggle Function
 * Compatible with both onclick and event listener approaches
 */

// Main toggle function for onclick attributes
function toggleFAQ(index) {
    console.log('toggleFAQ called with index:', index);

    const items = document.querySelectorAll('.faq-section .faq-item');
    console.log('Found FAQ items:', items.length);

    if (!items || items.length === 0) {
        console.error('No FAQ items found');
        return;
    }

    if (!items[index]) {
        console.error('FAQ item not found at index:', index);
        return;
    }

    const item = items[index];
    const wasActive = item.classList.contains('active');

    console.log('Item', index, 'was active:', wasActive);

    // Close all FAQs
    items.forEach((faq, i) => {
        faq.classList.remove('active');
        const btn = faq.querySelector('.faq-question');
        if (btn) {
            btn.setAttribute('aria-expanded', 'false');
        }
        console.log('Closed FAQ item', i);
    });

    // Open clicked one if it wasn't already open
    if (!wasActive) {
        item.classList.add('active');
        const btn = item.querySelector('.faq-question');
        if (btn) {
            btn.setAttribute('aria-expanded', 'true');
        }
        console.log('Opened FAQ item', index);
    }
}

// Alternative: Event delegation approach (runs automatically)
document.addEventListener('DOMContentLoaded', function () {
    console.log('FAQ system initializing...');

    // Add click handlers to all FAQ questions
    const faqQuestions = document.querySelectorAll('.faq-question');
    console.log('Found', faqQuestions.length, 'FAQ questions');

    faqQuestions.forEach((button, index) => {
        // Only add event listener if no onclick attribute
        if (!button.hasAttribute('onclick')) {
            console.log('Adding click listener to FAQ', index);
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('FAQ button clicked (event listener):', index);
                toggleFAQ(index);
            });
        } else {
            console.log('FAQ', index, 'already has onclick attribute');
        }
    });

    // Also handle clicks on the entire FAQ item (failsafe)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        if (question) {
            // Remove any existing inline onclick and add proper event listener
            question.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Direct click on FAQ question:', index);
                toggleFAQ(index);
            }, true); // Use capture phase
        }
    });

    console.log('FAQ system initialized successfully');
});

// Handle clicks on FAQ items (backup method)
document.addEventListener('click', function (e) {
    const faqQuestion = e.target.closest('.faq-question');
    if (faqQuestion) {
        console.log('Click detected on FAQ question element');

        // Find the index
        const item = faqQuestion.closest('.faq-item');
        const allItems = document.querySelectorAll('.faq-section .faq-item');
        const index = Array.from(allItems).indexOf(item);

        if (index !== -1) {
            console.log('Handling click for FAQ at index:', index);
            e.preventDefault();
            e.stopPropagation();
            toggleFAQ(index);
        }
    }
}, true); // Use capture to get the event first

console.log('FAQ toggle script loaded');
