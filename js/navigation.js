// ---------- Burger Menu ----------
const burger = document.querySelector('.burger');
const navMenu = document.querySelector('nav ul');
const overlay = document.querySelector('.overlay');

if (burger && navMenu) {
  burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navMenu.classList.toggle('active');
  overlay.classList.toggle('active');
});

// Закрытие при клике на ссылку
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
  });
});

// Закрытие при клике на фон
overlay.addEventListener('click', () => {
  burger.classList.remove('active');
  navMenu.classList.remove('active');
  overlay.classList.remove('active');
});
}
