// Animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animation on Scroll)
    // This is a simplified version of AOS functionality
    const animateElements = document.querySelectorAll('[data-aos]');
    
    function checkAnimation() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                const animationType = element.getAttribute('data-aos');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                
                if (animationType === 'fade-up') {
                    element.style.transform = 'translateY(0)';
                } else if (animationType === 'fade-left') {
                    element.style.transform = 'translateX(0)';
                } else if (animationType === 'fade-right') {
                    element.style.transform = 'translateX(0)';
                } else if (animationType === 'zoom-in') {
                    element.style.transform = 'scale(1)';
                }
            }
        });
    }
    
    // Set initial state for animated elements
    animateElements.forEach(element => {
        const animationType = element.getAttribute('data-aos');
        element.style.opacity = '0';
        element.style.transition = 'all 0.6s ease-out';
        
        if (animationType === 'fade-up') {
            element.style.transform = 'translateY(30px)';
        } else if (animationType === 'fade-left') {
            element.style.transform = 'translateX(-30px)';
        } else if (animationType === 'fade-right') {
            element.style.transform = 'translateX(30px)';
        } else if (animationType === 'zoom-in') {
            element.style.transform = 'scale(0.9)';
        }
    });
    
    // Check animation on load and scroll
    window.addEventListener('load', checkAnimation);
    window.addEventListener('scroll', checkAnimation);
    
    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating-server, .floating-database, .floating-shield');
    
    floatingElements.forEach((element, index) => {
        // Randomize initial position and animation delay
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        const randomDelay = Math.random() * 2;
        
        element.style.transform = `translate(${randomX}px, ${randomY}px)`;
        element.style.animationDelay = `${randomDelay}s`;
    });
    
    // Feature cards hover effect
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.feature-icon');
            icon.style.transform = 'rotateY(180deg)';
            setTimeout(() => {
                icon.style.transform = 'rotateY(360deg)';
            }, 300);
        });
    });
    
    // Pricing card hover effect
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('popular')) return;
            
            const badge = this.querySelector('.popular-badge');
            badge.style.transform = 'rotate(5deg) scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('popular')) return;
            
            const badge = this.querySelector('.popular-badge');
            badge.style.transform = 'rotate(0) scale(1)';
        });
    });
});
//adding later components 




// animations.js

document.addEventListener('DOMContentLoaded', function() {
  //
  // 1) SIMPLE AOS‐LIKE SCROLL ANIMATIONS
  //
  const animateElements = document.querySelectorAll('[data-aos]');

  function checkAnimation() {
    animateElements.forEach(el => {
      const rect = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // If the top of the element is within view minus 100px, animate it in
      if (rect < windowHeight - 100) {
        const animationType = el.getAttribute('data-aos');
        el.style.opacity = '1';
        el.style.transform = 'none';

        // If you want slightly different transforms per type, you already set initial inlined styles below.
        // E.g. fade-left/fade-right/zoom-in all end up at transform: none or scale(1).
      }
    });
  }

  // Set initial state on all [data-aos] elements
  animateElements.forEach(el => {
    const animationType = el.getAttribute('data-aos');
    el.style.opacity = '0';
    el.style.transition = 'all 0.6s ease-out';

    switch (animationType) {
      case 'fade-up':
        el.style.transform = 'translateY(30px)';
        break;
      case 'fade-left':
        el.style.transform = 'translateX(-30px)';
        break;
      case 'fade-right':
        el.style.transform = 'translateX(30px)';
        break;
      case 'zoom-in':
        el.style.transform = 'scale(0.9)';
        break;
      default:
        // no extra transform
        break;
    }
  });

  // Run on load and scroll
  window.addEventListener('load', checkAnimation);
  window.addEventListener('scroll', checkAnimation);



  //
  // 2) FLOATING ELEMENTS RANDOM OFFSET & DELAY
  //
  const floatingElements = document.querySelectorAll('.floating-server, .floating-database, .floating-shield');

  floatingElements.forEach((el) => {
    // random small X/Y offset so they aren’t perfectly aligned
    const randomX = Math.random() * 20 - 10;   // between -10px to +10px
    const randomY = Math.random() * 20 - 10;   // between -10px to +10px
    const randomDelay = Math.random() * 2;     // 0s to 2s

    el.style.transform = `translate(${randomX}px, ${randomY}px)`;
    el.style.animationDelay = `${randomDelay}s`;
  });



  //
  // 3) FEATURE CARD HOVER ROTATION
  //
  const featureCards = document.querySelectorAll('.feature-card');

  featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      const icon = this.querySelector('.feature-icon');
      if (!icon) return;
      icon.style.transform = 'rotateY(180deg)';
      setTimeout(() => {
        icon.style.transform = 'rotateY(360deg)';
      }, 300);
    });
    // You can also reset on mouseleave if you want
    card.addEventListener('mouseleave', function() {
      const icon = this.querySelector('.feature-icon');
      if (!icon) return;
      icon.style.transform = 'none';
    });
  });



  //
  // 4) PRICING CARD POPULAR BADGE HOVER
  //
  const pricingCards = document.querySelectorAll('.pricing-card');

  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!this.classList.contains('popular')) return;
      const badge = this.querySelector('.popular-badge');
      if (!badge) return;
      badge.style.transform = 'rotate(5deg) scale(1.1)';
    });
    card.addEventListener('mouseleave', function() {
      if (!this.classList.contains('popular')) return;
      const badge = this.querySelector('.popular-badge');
      if (!badge) return;
      badge.style.transform = 'rotate(0) scale(1)';
    });
  });



  //
  // 5) HEADER / BACK‐TO‐TOP SCROLL BEHAVIORS
  //
  const header = document.querySelector('.header');
  const backToTop = document.querySelector('.back-to-top');

  function handleScrollEffects() {
    const scrollY = window.scrollY || window.pageYOffset;

    // a) Toggle header.scrolled once past 50px
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // b) Toggle back-to-top button once past 300px
    if (backToTop) {
      if (scrollY > 300) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    }
  }

  window.addEventListener('scroll', handleScrollEffects);
  // Also run on load in case user reloads further down
  window.addEventListener('load', handleScrollEffects);



  //
  // 6) MOBILE NAV TOGGLE
  //
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');

  if (mobileBtn && navLinksContainer) {
    mobileBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
    });
  }
});
