// Данные о заданиях — легко расширять
const tasks = [
  {
    id: 2,
    title: "Задание 2: CSS-логотип",
    preview: "images/task2-preview.png",
    alt: "CSS логотип Hollow Knight",
    link: "tasks/task2.html"
  },
  {
    id: 5,
    title: "Задание 5: DOM-Тест",
    preview: "images/task5-preview.png",
    alt: "Интерактивный 3D-элемент",
    link: "tasks/task5.html"
  },
  {
    id: 6,
    title: "Задание 6",
    preview: "images/task6-preview.png",
    alt: "Анимация с перетаскиванием слов",
    link: "tasks/task6.html"
  }
  // Добавляйте новые задания сюда!
];

// Генерация HTML-карточек
function renderTaskCards() {
  const container = document.querySelector('.tasks-grid');
  if (!container) return;

  const cardsHTML = tasks.map(task => `
    <article class="task-card">
      <h2>${task.title}</h2>
      <div class="task-preview">
        <img src="${task.preview}" alt="${task.alt}">
      </div>
      <a href="${task.link}" class="btn small">Открыть</a>
    </article>
  `).join('');

  container.innerHTML = cardsHTML;
}

// Запуск после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  renderTaskCards();
});