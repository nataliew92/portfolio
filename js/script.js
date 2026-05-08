(function () {
  'use strict';

  const clockEl = document.getElementById('clock');
  const dateEl  = document.getElementById('date');

  function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}`;
  }

  function updateDate() {
    const now = new Date();
    dateEl.textContent = new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      day:     'numeric',
      month:   'short',
      year:    'numeric'
    }).format(now);
  }

  updateClock();
  updateDate();
  setInterval(updateClock, 30000);
  setInterval(updateDate,  60 * 60 * 1000);


  const revealEls = document.querySelectorAll('.reveal, .stagger');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => revealObserver.observe(el));


  document.querySelectorAll('[data-carousel]').forEach(setupCarousel);

  function setupCarousel(carousel) {
    const track    = carousel.querySelector('.carousel__track');
    const slides   = carousel.querySelectorAll('.carousel__slide');
    const prevBtn  = carousel.querySelector('[data-carousel-prev]');
    const nextBtn  = carousel.querySelector('[data-carousel-next]');
    const counter  = carousel.querySelector('[data-carousel-counter]');
    const total    = slides.length;

    let index = 0;

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (counter) counter.textContent = `${index + 1} / ${total}`;
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === total - 1;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
      if (index > 0) { index--; update(); }
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
      if (index < total - 1) { index++; update(); }
    });

    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft'  && index > 0)         { index--; update(); }
      if (e.key === 'ArrowRight' && index < total - 1) { index++; update(); }
    });

    update();
  }


  const WEATHER_CITY = 'Liverpool';
  const WEATHER_LAT  = 53.41;
  const WEATHER_LON  = -2.99;

  async function updateWeather() {
    const url = 'https://api.open-meteo.com/v1/forecast'
      + `?latitude=${WEATHER_LAT}`
      + `&longitude=${WEATHER_LON}`
      + '&current=temperature_2m,weather_code';

    try {
      const response = await fetch(url);
      if (!response.ok) return;

      const data  = await response.json();
      const temp  = Math.round(data.current.temperature_2m);
      const code  = data.current.weather_code;
      const emoji = weatherEmoji(code);

      const el = document.querySelector('.hero__statusbar-weather');
      if (el) el.textContent = `${WEATHER_CITY} · ${temp}°C ${emoji}`;
    } catch (err) {
      console.warn('Weather fetch failed:', err);
    }
  }

  function weatherEmoji(code) {
    if (code === 0)               return '☀';
    if (code >= 1  && code <= 3)  return '☁';
    if (code >= 45 && code <= 48) return '🌫';
    if (code >= 51 && code <= 67) return '🌧';
    if (code >= 71 && code <= 77) return '❄';
    if (code >= 80 && code <= 82) return '🌦';
    if (code >= 85 && code <= 86) return '🌨';
    if (code >= 95 && code <= 99) return '⛈';
    return '☁';
  }

  updateWeather();
  setInterval(updateWeather, 15 * 60 * 1000);

})();