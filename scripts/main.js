document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll Animations (Reveal Elements) ---
  const reveals = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 100;

    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Trigger on load

  // --- Flashcard Interaction ---
  const flashcards = document.querySelectorAll('.flashcard');
  flashcards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  // --- Try-it-out Module Demo ---
  const demoBtn = document.getElementById('demo-btn');
  const demoBar = document.getElementById('demo-bar');
  const demoText = document.getElementById('demo-text');

  if(demoBtn) {
    demoBtn.addEventListener('click', () => {
      if(demoBtn.disabled) return;
      
      demoBtn.disabled = true;
      demoBtn.textContent = 'Training Model...';
      demoBar.style.width = '0%';
      demoText.textContent = 'Initializing epoch 1...';

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if(progress > 100) progress = 100;
        
        demoBar.style.width = `${progress}%`;
        demoText.textContent = `Processing data: ${Math.floor(progress)}% complete`;

        if(progress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            demoText.textContent = 'Model trained successfully! Accuracy: 98.4%';
            demoText.style.color = '#00f2fe';
            demoBtn.textContent = 'Retrain Model';
            demoBtn.disabled = false;
          }, 500);
        }
      }, 300);
    });
  }

  // --- Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
