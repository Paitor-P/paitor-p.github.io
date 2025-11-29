// Массив с вопросами и ответами
const questions = [
    {
        question: "А голос у него был не такой, как у почтальона Печкина, дохленький. У Гаврюши голосище был, как у электрички. Он _____ _____ на ноги поднимал.",
        answers: [
            { text: "Пол деревни, за раз", correct: false },
            { text: "Полдеревни, зараз", correct: true, explanation: "Раздельно существительное будет писаться в случае наличия дополнительного слова между существительным и частицей. Правильный ответ: полдеревни пишется слитно. Зараз (ударение на второй слог) — это обстоятельственное наречие, пишется слитно. Означает быстро, одним махом." },
            { text: "Пол-деревни, за раз", correct: false }
        ]
    },
    {
        question: "А эти слова как пишутся?",
        answers: [
            { text: "Капуччино и эспрессо", correct: false },
            { text: "Каппуччино и экспресо", correct: false },
            { text: "Капучино и эспрессо", correct: true, explanation: "По орфографическим нормам русского языка единственно верным написанием будут «капучино» и «эспрессо»." }
        ]
    },
    {
        question: "Как нужно писать?",
        answers: [
            { text: "Черезчур", correct: false },
            { text: "Черес-чур", correct: false },
            { text: "Чересчур", correct: true, explanation: "Это слово появилось от соединения предлога «через» и древнего слова «чур», которое означает «граница», «край». Но слово претерпело изменения, так что правильное написание учим наизусть — «чересчур»." }
        ]
    },
    {
        question: "Где допущена ошибка?",
        answers: [
            { text: "Аккордеон", correct: false },
            { text: "Белиберда", correct: false },
            { text: "Эпелепсия", correct: true, explanation: "Это слово пишется так: «эпИлепсия»." }
        ]
    }
];

// Перемешиваем вопросы
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Перемешиваем ответы в каждом вопросе
questions.forEach(q => shuffleArray(q.answers));

let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let isAnswering = false;

function renderQuestion(index) {
    if (index >= questions.length) {
        document.getElementById('endMessage').style.display = 'block';
        document.getElementById('stats').textContent = `Вы ответили правильно на ${correctAnswersCount} из ${questions.length} вопросов`;
        document.getElementById('stats').style.display = 'block';
        showFinalAnswers();
        return;
    }

    const questionData = questions[index];
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    const questionBlock = document.createElement('div');
    questionBlock.className = 'question-block';

    const questionNumber = document.createElement('div');
    questionNumber.className = 'question-number';
    questionNumber.textContent = `Вопрос ${index + 1}`;
    questionBlock.appendChild(questionNumber);

    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = questionData.question;
    questionBlock.appendChild(questionText);

    const answersContainer = document.createElement('div');
    answersContainer.className = 'answers-container';

    questionData.answers.forEach((answer, answerIndex) => {
        const answerBlock = document.createElement('div');
        answerBlock.className = 'answer-block';
        answerBlock.textContent = answer.text;
        answerBlock.dataset.index = answerIndex;

        answerBlock.addEventListener('click', () => handleAnswerClick(index, answerIndex, answerBlock, answersContainer, questionNumber));
        answerBlock.addEventListener('mouseenter', () => {
            if (!answerBlock.classList.contains('selected')) {
                answerBlock.style.backgroundColor = '#e0e0e0';
            }
        });
        answerBlock.addEventListener('mouseleave', () => {
            if (!answerBlock.classList.contains('selected')) {
                answerBlock.style.backgroundColor = '#f9f9f9';
            }
        });
        answerBlock.addEventListener('mousedown', () => {
            answerBlock.classList.add('selected');
        });

        answersContainer.appendChild(answerBlock);
    });

    questionBlock.appendChild(answersContainer);
    container.appendChild(questionBlock);
}

function handleAnswerClick(questionIndex, answerIndex, answerBlock, answersContainer, questionNumber) {
    if (isAnswering) return;
    isAnswering = true;

    const questionData = questions[questionIndex];
    const selectedAnswer = questionData.answers[answerIndex];
    const allAnswerBlocks = Array.from(answersContainer.children);

    // Убираем обработчики кликов
    allAnswerBlocks.forEach(block => {
        block.style.pointerEvents = 'none';
    });

    if (selectedAnswer.correct) {
        // Правильный ответ
        answerBlock.classList.add('correct');
        correctAnswersCount++;

        // Добавляем маркер
        const marker = document.createElement('span');
        marker.className = 'marker correct-marker';
        marker.textContent = '✓';
        questionNumber.appendChild(marker);

        // Увеличиваем блок
        answerBlock.style.transform = 'scale(1.05)';
        answerBlock.style.transition = 'all 0.4s ease';

        // Показываем пояснение с анимацией
        if (selectedAnswer.explanation) {
            const explanation = document.createElement('div');
            explanation.className = 'explanation';
            explanation.textContent = selectedAnswer.explanation;
            answerBlock.parentNode.insertBefore(explanation, answerBlock.nextSibling);
            
            setTimeout(() => {
                explanation.classList.add('show-explanation');
            }, 100);
        }

        // Задержка для просмотра результата
        setTimeout(() => {
            // Последовательно опускаем каждый блок вниз с растворением
            dropAndFadeBlocks(allAnswerBlocks, 0, 200, () => {
                setTimeout(() => {
                    isAnswering = false;
                    currentQuestionIndex++;
                    renderQuestion(currentQuestionIndex);
                }, 300);
            });
        }, 2500); // Даем 2.5 секунды на просмотр результата

    } else {
        // Неправильный ответ
        answerBlock.classList.add('incorrect');

        // Добавляем маркер
        const marker = document.createElement('span');
        marker.className = 'marker incorrect-marker';
        marker.textContent = '✗';
        questionNumber.appendChild(marker);

        // Задержка для просмотра результата
        setTimeout(() => {
            // Последовательно опускаем каждый блок вниз с растворением
            dropAndFadeBlocks(allAnswerBlocks, 0, 150, () => {
                setTimeout(() => {
                    isAnswering = false;
                    currentQuestionIndex++;
                    renderQuestion(currentQuestionIndex);
                }, 300);
            });
        }, 2000); // Даем 2 секунды на просмотр результата
    }
}

function dropAndFadeBlocks(blocks, index, delay, callback) {
    if (index >= blocks.length) {
        callback();
        return;
    }

    const block = blocks[index];
    
    // Анимация падения и исчезновения
    block.style.transition = 'all 0.6s ease-out';
    block.style.transform = `translateY(${window.innerHeight / 2}px)`;
    block.style.opacity = '0';
    block.style.height = '0';
    block.style.padding = '0';
    block.style.margin = '0';
    block.style.overflow = 'hidden';

    setTimeout(() => {
        dropAndFadeBlocks(blocks, index + 1, delay, callback);
    }, delay);
}

function showFinalAnswers() {
    const finalContainer = document.getElementById('finalAnswers');
    finalContainer.style.display = 'block';

    questions.forEach((q, idx) => {
        const block = document.createElement('div');
        block.className = 'final-answer-block';

        const qText = document.createElement('div');
        qText.className = 'final-question';
        qText.textContent = `Вопрос ${idx + 1}: ${q.question}`;
        block.appendChild(qText);

        const correctAnswer = q.answers.find(a => a.correct);
        if (correctAnswer) {
            const correctAns = document.createElement('div');
            correctAns.className = 'final-correct-answer';
            correctAns.textContent = `Правильный ответ: ${correctAnswer.text}`;
            block.appendChild(correctAns);

            if (correctAnswer.explanation) {
                const explanation = document.createElement('div');
                explanation.className = 'final-explanation';
                explanation.textContent = correctAnswer.explanation;
                block.appendChild(explanation);
            }
        }

        finalContainer.appendChild(block);
    });
}

// Запуск теста
shuffleArray(questions);
renderQuestion(currentQuestionIndex);