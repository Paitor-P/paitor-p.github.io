// Глобальные переменные
let associativeArray = {};
let clickCounts = {}; // Для подсчета кликов по элементам

// Функция для генерации случайного цвета
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Функция для сортировки слов
function sortWords(words) {
    const lowercase = [];
    const uppercase = [];
    const numbers = [];

    words.forEach(word => {
        if (!word.trim()) return; // Пропускаем пустые строки

        const trimmedWord = word.trim();

        if (/^[a-zа-я]/.test(trimmedWord)) {
            lowercase.push(trimmedWord);
        } else if (/^[A-ZА-Я]/.test(trimmedWord)) {
            uppercase.push(trimmedWord);
        } else if (/^\d/.test(trimmedWord)) {
            numbers.push(trimmedWord);
        } else {
            lowercase.push(trimmedWord); // По умолчанию в нижний регистр
        }
    });

    // Сортируем каждую группу
    lowercase.sort();
    uppercase.sort();
    numbers.sort((a, b) => parseFloat(a) - parseFloat(b));

    // Создаем ассоциативный массив
    const result = {};

    let aIndex = 1, bIndex = 1, nIndex = 1;

    // Добавляем слова со строчной буквы
    lowercase.forEach(word => {
        const key = `a${aIndex}`;
        result[key] = word;
        aIndex++;
    });

    // Добавляем слова с заглавной буквы
    uppercase.forEach(word => {
        const key = `b${bIndex}`;
        result[key] = word;
        bIndex++;
    });

    // Добавляем числа
    numbers.forEach(word => {
        const key = `n${nIndex}`;
        result[key] = word;
        nIndex++;
    });

    return result;
}

// Глобальные переменные для хранения состояния перетаскивания
let draggedElement = null;
let draggedFromBlockId = null;
let draggedFromIndex = -1; // Индекс элемента в его исходном родителе

// Функция для отображения элементов в блоке 2
function displayItemsInBlock2() {
    const itemsContainer = document.getElementById('itemsBlock2');
    itemsContainer.innerHTML = '';

    // Сортируем ключи по алфавиту (a, b, n)
    const sortedKeys = Object.keys(associativeArray).sort();

    sortedKeys.forEach(key => {
        const word = associativeArray[key];
        const item = document.createElement('div');
        item.className = 'item-block2';
        item.textContent = `${key} ${word}`;
        item.dataset.key = key;
        item.dataset.word = word;
        item.draggable = true;

        // Добавляем обработчики событий
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);

        itemsContainer.appendChild(item);
    });
}

// Обработчик начала перетаскивания
function handleDragStart(e) {
    draggedElement = e.target;
    draggedFromBlockId = draggedElement.parentElement.id;
    // Находим индекс элемента в его родителе на момент начала перетаскивания
    draggedFromIndex = Array.from(draggedElement.parentElement.children).indexOf(draggedElement);

    e.dataTransfer.setData('text/plain', draggedElement.dataset.key);
    e.dataTransfer.effectAllowed = 'move';

    // Добавляем визуальный эффект
    draggedElement.classList.add('dragging');
}

// Обработчик окончания перетаскивания
function handleDragEnd(e) {
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
        // Сброс состояния
        draggedElement = null;
        draggedFromBlockId = null;
        draggedFromIndex = -1; // Сброс индекса
    }
}

// Обработчик события drop для блока 1
function handleDropBlock1(e) {
    e.preventDefault();
    const key = e.dataTransfer.getData('text/plain');

    // Проверяем, действительный ли элемент перетаскивается и был ли он из другого блока
    if (!key || !associativeArray[key] || draggedFromBlockId === 'itemsBlock1') {
        return; // Ничего не делаем, если данные некорректны или перетаскивание внутри блока 1
    }

    // Проверяем, был ли элемент перетащен из блока 2
    if (draggedFromBlockId === 'itemsBlock2') {
        // Удаляем элемент из DOM блока 2 (он останется в ассоциативном массиве)
        if (draggedElement && draggedElement.parentElement.id === 'itemsBlock2') {
            draggedElement.remove(); // Это перемещает элемент из родителя
        }
    }

    const word = associativeArray[key];
    const itemsContainer = document.getElementById('itemsBlock1');

    // Вычисляем позицию внутри контейнера
    const containerRect = itemsContainer.getBoundingClientRect();
    let x = e.clientX - containerRect.left;
    let y = e.clientY - containerRect.top;
    console.log(y)
    // (Опционально) Ограничиваем координаты, чтобы элемент не выходил за границы
    // Предположим, ширина и высота элемента примерно 100px, можно сделать точнее
    const elementWidth = 100; // Примерная ширина, можно вычислить через getBoundingClientRect()
    const elementHeight = 20; // Примерная высота

    x = Math.max(0, Math.min(x, containerRect.width - elementWidth));
    y = Math.max(0, Math.min(y, containerRect.height - elementHeight));

    console.log(y)
    console.log('Container:', containerRect.width, containerRect.height)
    // Создаем новый элемент для блока 1
    const item = document.createElement('div');
    item.className = 'item-block1'; // Убедитесь, что этот класс добавлен в CSS
    item.textContent = `${key} ${word}`;
    item.dataset.key = key;
    item.dataset.word = word;
    item.style.backgroundColor = getRandomColor();
    item.draggable = true;
    // Устанавливаем позицию
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;

    // Добавляем обработчики событий
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('click', handleItemClick);

    itemsContainer.appendChild(item);
}

// Обработчик события drop для блока 2
function handleDropBlock2(e) {
    e.preventDefault();
    const key = e.dataTransfer.getData('text/plain');

    if (!key || !associativeArray[key]) {
        return; // Ничего не делаем, если данные некорректны
    }

    const itemsContainer = document.getElementById('itemsBlock2');

    // Проверяем, был ли элемент перетащен из другого блока (например, из блока 1)
    if (draggedFromBlockId !== 'itemsBlock2') {
        // Это перемещение из другого блока в блок 2

        // Удаляем элемент из старого блока (если он там еще есть в DOM)
        if (draggedFromBlockId === 'itemsBlock1') {
            removeItemFromBlock1(key);
        }

        const word = associativeArray[key];

        // Создаем новый элемент для блока 2
        const item = document.createElement('div');
        item.className = 'item-block2';
        item.textContent = `${key} ${word}`;
        item.dataset.key = key;
        item.dataset.word = word;
        item.style.backgroundColor = '#4CAF50'; // Зеленый цвет
        item.draggable = true;

        // Добавляем обработчики событий
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);

        // Вставляем элемент на правильное место в блоке 2 согласно сортировке ключей
        const sortedKeys = Object.keys(associativeArray).sort();
        const index = sortedKeys.indexOf(key);

        if (index === 0) {
            itemsContainer.insertBefore(item, itemsContainer.firstChild);
        } else {
            const nextKey = sortedKeys[index + 1];
            const nextElement = Array.from(itemsContainer.children).find(el => el.dataset.key === nextKey);
            if (nextElement) {
                itemsContainer.insertBefore(item, nextElement);
            } else {
                itemsContainer.appendChild(item); // Если элемент с следующим ключом не найден, добавляем в конец
            }
        }
    } else {
        // Это перемещение ВНУТРИ блока 2
        // draggedElement уже находится в itemsContainer, но возможно не на нужной позиции
        // Нам нужно определить, куда его нужно вставить относительно других элементов.

        // Находим элемент, над которым произошло drop (или ближайший предыдущий/следующий)
        // Используем e.target или e.relatedTarget, но лучше использовать e.clientX/Y и elementFromPoint
        // Однако, для упрощения, часто используют вспомогательную логику на dragover элементов.
        // Но мы можем попытаться определить это на этапе drop.

        // Найдем элемент, который находится "под" курсором в момент drop
        // Это может быть сам элемент или его дочерний элемент
        let dropTarget = e.target;
        while (dropTarget && dropTarget !== itemsContainer && !dropTarget.classList.contains('item-block2')) {
            dropTarget = dropTarget.parentElement;
        }

        if (dropTarget && dropTarget.classList.contains('item-block2') && dropTarget !== draggedElement) {
            // Определяем, до или после dropTarget нужно вставить draggedElement
            const rect = dropTarget.getBoundingClientRect();
            const nextTo = (e.clientY > rect.top + rect.height / 2);

            if (nextTo) {
                itemsContainer.insertBefore(draggedElement, dropTarget.nextSibling);
            } else {
                itemsContainer.insertBefore(draggedElement, dropTarget);
            }
        } else {
            // Если dropTarget не найден или совпадает с draggedElement, просто оставляем как есть или вставляем в конец
            // Но лучше вернуть на исходную позицию, если это возможно.
            // Однако, если элемент был просто перетащен и отпущен, браузер обычно сам оставляет его на месте.
            // Проверим индекс и при необходимости вернем на место.
            // Проще всего - не делать ничего, если dropTarget не подходит.
            // Но для точности, если dropTarget === draggedElement или не найден, возвращаем на исходную позицию.
            if (!dropTarget || dropTarget === draggedElement) {
                const originalChildren = Array.from(itemsContainer.children);
                if (draggedFromIndex >= 0 && draggedFromIndex < originalChildren.length) {
                    const elementAtOriginalIndex = originalChildren[draggedFromIndex];
                    if (elementAtOriginalIndex && elementAtOriginalIndex !== draggedElement) {
                        // Вставляем перед элементом, который был на исходной позиции
                        itemsContainer.insertBefore(draggedElement, elementAtOriginalIndex);
                    } else if (elementAtOriginalIndex === draggedElement) {
                        // Уже на месте, ничего не делаем
                    } else {
                        // Если индекс оказался за пределами после перемещения, вставляем в конец
                        itemsContainer.appendChild(draggedElement);
                    }
                } else {
                    // Если индекс некорректен, вставляем в конец
                    itemsContainer.appendChild(draggedElement);
                }
            }
        }
        // ВАЖНО: Не вызываем removeItemFromBlock2, потому что элемент остается в том же блоке.
    }
}

// Функция для удаления элемента из блока 2 (по-прежнему используется при перемещении в другой блок)
function removeItemFromBlock2(key) {
    const itemsContainer = document.getElementById('itemsBlock2');
    const element = Array.from(itemsContainer.children).find(el => el.dataset.key === key);
    if (element) {
        itemsContainer.removeChild(element);
    }
}

// Функция для удаления элемента из блока 1 (по-прежнему используется при перемещении в другой блок)
function removeItemFromBlock1(key) {
    const itemsContainer = document.getElementById('itemsBlock1');
    const element = Array.from(itemsContainer.children).find(el => el.dataset.key === key);
    if (element) {
        itemsContainer.removeChild(element);
    }
}

// Обработчик клика по элементу в блоке 1
function handleItemClick(e) {
    const word = e.target.dataset.word;
    const block3 = document.getElementById('block3');
    if (Object.keys(clickCounts).length === 0) {
        block3.textContent = word;
    } else {
        block3.textContent = block3.textContent + ' ' + word;
    }


    // Увеличиваем счетчик кликов
    const key = e.target.dataset.key;
    if (!clickCounts[key]) {
        clickCounts[key] = 0;
    }
    clickCounts[key]++;

    // Показываем подсказку
    showClickInfo(key, clickCounts[key]);
}

// Функция для показа информации о кликах
function showClickInfo(key, count) {
    const itemsContainer = document.getElementById('itemsBlock1');
    const element = Array.from(itemsContainer.children).find(el => el.dataset.key === key);

    if (itemsContainer) {
        // Удаляем предыдущие подсказки
        const previousInfo = itemsContainer.querySelector('.click-info');
        if (previousInfo) {
            itemsContainer.removeChild(previousInfo);
        }

        // Получаем ключи в порядке возрастания и формируем текст
        const sortedKeys = Object.keys(clickCounts).sort();
        const infoText = sortedKeys.map(key => {
            const count = clickCounts[key];
            return `Нажали ${count} раз${count === 1 ? '' : 'а'} на элемент "${key}"`;
        }).join('\n');

        // Создаем новую подсказку
        const info = document.createElement('div');
        info.className = 'click-info';
        info.textContent = infoText;
        itemsContainer.appendChild(info);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Настройка drag and drop для блоков
    const block1 = document.getElementById('block1');
    const block2 = document.getElementById('block2');

    block1.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    block1.addEventListener('drop', handleDropBlock1);

    block2.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    block2.addEventListener('drop', handleDropBlock2);

    // Обработчик кнопки "Разобрать"
    document.getElementById('parseButton').addEventListener('click', () => {
        const input = document.getElementById('inputField').value;
        if (!input.trim()) {
            alert('Пожалуйста, введите слова, разделенные тире.');
            return;
        }

        const words = input.split('-');
        associativeArray = sortWords(words);
        clickCounts = {}; // Сбрасываем счетчики кликов

        displayItemsInBlock2();
        document.getElementById('itemsBlock1').innerHTML = '';
    });
});