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

document.addEventListener('DOMContentLoaded', function () {
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
        slideInterval = setInterval(nextSlide, 5000);
    }

    function highlightCurrentDay() {
        const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        const today = new Date().getDay(); 
        const currentDayName = days[today];

        document.querySelectorAll('.day').forEach(day => {
            day.style.backgroundColor = '';
            day.querySelector('h4').style.color = '#7e1c40';

            const badge = day.querySelector('.current-badge');
            if (badge) {
                badge.remove();
            }
        });

        // Destacar o dia atual
        const currentDayElement = document.querySelector(`.day[data-day="${currentDayName}"]`);
        if (currentDayElement) {
            currentDayElement.style.backgroundColor = 'rgba(248, 187, 208, 0.3)';
            currentDayElement.querySelector('h4').style.color = '#ec407a';

            // Adicionar badge "Hoje"
            const badge = document.createElement('span');
            badge.className = 'current-badge';
            badge.textContent = 'Hoje';
            badge.style.position = 'absolute';
            badge.style.top = '5px';
            badge.style.right = '5px';
            badge.style.backgroundColor = '#ec407a';
            badge.style.color = 'white';
            badge.style.fontSize = '0.7rem';
            badge.style.padding = '3px 8px';
            badge.style.borderRadius = '10px';
            currentDayElement.style.position = 'relative';
            currentDayElement.appendChild(badge);
        }

        const daySpecial = currentDayElement.querySelector('h5').textContent;
        document.getElementById('current-day-name').textContent = getDayName(today);
        document.getElementById('today-special').textContent = daySpecial;
    }

    function getDayName(dayIndex) {
        const days = [
            'Domingo', 'Segunda-feira', 'Terça-feira',
            'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
        ];
        return days[dayIndex];
    }

    document.addEventListener('DOMContentLoaded', highlightCurrentDay);

    document.getElementById('cartIcon').addEventListener('click', function() {
    window.location.href = 'cart.html';

    document.querySelector('.user-icon').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'login.html';
});
});
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