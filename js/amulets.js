// Данные об амулетах
const amulets = [
  {
    id: 1,
    name: "Soul Catcher",
    description: "Один из первых амулетов, встречающихся игроку. Он увеличивает количество души, получаемой при ударе по врагам. Благодаря этому рыцарь может чаще использовать способности и лечиться. Идеально подходит для начала приключения.",
    image: "images/amulet1.png"
  },
  {
    id: 2,
    name: "Quick Focus",
    description: "Делает процесс лечения значительно быстрее. В напряжённом бою этот амулет способен спасти жизнь — достаточно мгновения, чтобы восполнить здоровье, пока враг отступает.",
    image: "images/amulet2.png"
  },
  {
    id: 3,
    name: "Shaman Stone",
    description: "Усиливает силу заклинаний. Подходит игрокам, предпочитающим магический стиль боя. Визуально камень испускает мягкое голубое сияние, отражающее древнюю энергию Hallownest.",
    image: "images/amulet3.png"
  },
  {
    id: 4,
    name: "Grubsong",
    description: "Этот амулет даёт душу при получении урона. Он вдохновлён заботой о спасённых гусеницах и символизирует благодарность и взаимопомощь — частую тему Hollow Knight.",
    image: "images/amulet4.png"
  }
];

// Генерация HTML-карточек
function renderAmulets() {
  const container = document.querySelector('.amulets-grid');
  if (!container) return;

  const cardsHTML = amulets.map(amulet => {
    const imgTag = amulet.image
      ? `<img src="${amulet.image}" alt="${amulet.name}">`
      : '';

    return `
      <article class="amulet-card">
        ${imgTag}
        <h2>${amulet.name}</h2>
        <p>${amulet.description}</p>
      </article>
    `;
  }).join('');

  container.innerHTML = cardsHTML;
}


// ---------- Анимация при прокрутке ----------
function initScrollAnimation() {
  const elements = document.querySelectorAll('.amulet-card, .intro-text, .summary, h1');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}


document.addEventListener('DOMContentLoaded', () => {
  renderAmulets();
  initScrollAnimation();
});
