document.addEventListener('DOMContentLoaded', () => {
  const classic = document.querySelector('.classic');
  const slider = document.querySelector('.slider');
  const slidesContainer = document.getElementById('slides');
  const fixedSwipeHint = document.getElementById('fixedSwipeHint');
  const themeToggle = document.getElementById('themeToggle');
  let currentIndex = 0;

  function buildSlides() {
    const sections = classic.querySelectorAll('section');
    slidesContainer.innerHTML = '';

    sections.forEach((sec) => {
      const slide = document.createElement('section');
      slide.className = 'slide';

      const headerElem = sec.querySelector('.header');
      const footerElem = sec.querySelector('.footer');

      if (headerElem) {
        const header = document.createElement('header');
        header.className = 'slide-header';
        header.appendChild(headerElem.cloneNode(true));
        slide.appendChild(header);
      }

      const body = document.createElement('div');
      body.className = 'slide-body';
      Array.from(sec.children).forEach(child => {
        if (child !== headerElem && child !== footerElem) {
          body.appendChild(child.cloneNode(true));
        }
      });
      slide.appendChild(body);

      if (footerElem) {
        const footer = document.createElement('footer');
        footer.className = 'slide-footer';
        footer.appendChild(footerElem.cloneNode(true));
        slide.appendChild(footer);
      }

      slidesContainer.appendChild(slide);
    });
  }

  function showSlide(index) {
    if (index < 0) index = 0;
    if (index >= slidesContainer.children.length) index = slidesContainer.children.length - 1;
    currentIndex = index;
    slidesContainer.style.transform = `translateX(-${index * 100}vw)`;
    updateSwipeHintVisibility();
  }

  function updateSwipeHintVisibility() {
    if (currentIndex === slidesContainer.children.length - 1) {
      fixedSwipeHint.style.display = 'none';
    } else {
      fixedSwipeHint.style.display = 'block';
    }
  }

  let startX = 0, endX = 0;
  slidesContainer.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  slidesContainer.addEventListener('touchmove', e => endX = e.touches[0].clientX);
  slidesContainer.addEventListener('touchend', () => {
    const diff = startX - endX;
    if (diff > 50 && currentIndex < slidesContainer.children.length - 1) showSlide(currentIndex + 1);
    else if (diff < -50 && currentIndex > 0) showSlide(currentIndex - 1);
  });

  fixedSwipeHint.addEventListener('click', () => {
    if (currentIndex < slidesContainer.children.length - 1) showSlide(currentIndex + 1);
  });

  function setTheme(dark) {
    if (dark) {
      document.body.classList.add('dark-theme');
      themeToggle.setAttribute('aria-checked', 'true');
    } else {
      document.body.classList.remove('dark-theme');
      themeToggle.setAttribute('aria-checked', 'false');
    }
    localStorage.setItem('darkTheme', dark);
  }

  const savedTheme = localStorage.getItem('darkTheme') === 'true';
  setTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    setTheme(!isDark);
  });

  themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      themeToggle.click();
    }
  });

  buildSlides();

  function handleResize() {
    if (window.innerWidth <= 768) {
      classic.style.display = 'none';
      slider.style.display = 'flex';
      showSlide(0);
    } else {
      classic.style.display = 'block';
      slider.style.display = 'none';
    }
  }
  window.addEventListener('resize', handleResize);
  handleResize();
});

const miniSlides = document.querySelector('.mini-slides');
const totalMiniSlides = miniSlides.children.length;
let miniCurrentIndex = 0;

function showMiniSlide(index) {
  if(index < 0) index = 0;
  if(index >= totalMiniSlides) index = totalMiniSlides -1;
  miniCurrentIndex = index;
  miniSlides.style.transform = `translateX(-${index * 100}%)`;
}

// Пример автолистания каждые 3 секунды
setInterval(() => {
  miniCurrentIndex++;
  if(miniCurrentIndex >= totalMiniSlides) miniCurrentIndex = 0;
  showMiniSlide(miniCurrentIndex);
}, 3000);
