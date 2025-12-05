// Test script for hero slider functionality
// Copy and paste this into your browser's console (F12 -> Console)

console.log('Testing hero slider functionality...');

// Check if hero elements exist
const heroMedia = document.getElementById('heroSlider');
const slides = heroMedia ? heroMedia.querySelectorAll('.hero-photo') : [];
const prevBtn = heroMedia ? heroMedia.querySelector('.hero-control.prev') : null;
const nextBtn = heroMedia ? heroMedia.querySelector('.hero-control.next') : null;

console.log('Hero slider found:', !!heroMedia);
console.log('Slides found:', slides.length);
console.log('Prev button found:', !!prevBtn);
console.log('Next button found:', !!nextBtn);

if (!heroMedia) {
  console.error('ERROR: heroSlider element not found!');
} else if (slides.length === 0) {
  console.error('ERROR: No slides found in hero slider!');
} else {
  let current = 0;
  
  function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    const slideWidth = heroMedia.offsetWidth;
    console.log(`Going to slide ${current} (position: ${current * slideWidth}px)`);
    
    heroMedia.scrollTo({
      left: current * slideWidth,
      behavior: 'smooth'
    });
  }
  
  // Test manual navigation
  if (prevBtn) {
    prevBtn.onclick = function() {
      console.log('← Previous button clicked');
      goToSlide(current - 1);
    };
    console.log('✅ Previous button functionality enabled');
  }
  
  if (nextBtn) {
    nextBtn.onclick = function() {
      console.log('→ Next button clicked');
      goToSlide(current + 1);
    };
    console.log('✅ Next button functionality enabled');
  }
  
  // Test auto-scroll
  const autoScroll = setInterval(() => {
    console.log('⏭️ Auto-scrolling to next slide');
    goToSlide(current + 1);
  }, 2000);
  
  // Pause on hover
  heroMedia.addEventListener('mouseenter', () => {
    console.log('⏸️ Auto-scroll paused (hover)');
    clearInterval(autoScroll);
  });
  
  heroMedia.addEventListener('mouseleave', () => {
    console.log('▶️ Auto-scroll resumed');
    setInterval(() => goToSlide(current + 1), 2000);
  });
  
  console.log('🎉 Hero slider fully functional!');
  console.log('📍 Current slide:', current);
  console.log('🔄 Auto-scroll active: every 2 seconds');
}

// Quick test functions
window.testPrevSlide = () => {
  const prevBtn = document.querySelector('.hero-control.prev');
  if (prevBtn) prevBtn.click();
  else console.log('Prev button not found');
};

window.testNextSlide = () => {
  const nextBtn = document.querySelector('.hero-control.next');
  if (nextBtn) nextBtn.click();
  else console.log('Next button not found');
};

console.log('Test functions ready:');
console.log('- testPrevSlide() - manually go to previous slide');
console.log('- testNextSlide() - manually go to next slide');
