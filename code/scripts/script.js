const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');

menuToggle.addEventListener('click', () => {
    sideMenu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
});

function closeSideMenu() {
    sideMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

closeMenu.addEventListener('click', closeSideMenu);
overlay.addEventListener('click', closeSideMenu);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSideMenu();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('indicators');
    
    let currentIndex = 0;
    let slideInterval;
    
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    const indicators = document.querySelectorAll('.indicator');
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetInterval();
    }

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }
    
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000); // Avança a cada 5 segundos
    }

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
    });
    
    resetInterval();

    carousel.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    carousel.addEventListener('mouseleave', () => {
        resetInterval();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
            resetInterval();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            resetInterval();
        }
    });
});