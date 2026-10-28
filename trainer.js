function checkAuth() {
    if (sessionStorage.getItem('authenticated') !== 'true') {
        alert('Необходима авторизация! Перенаправляем на главную страницу.');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

const tasks = [
    {
        id: 1,
        type: "Теоретическое",
        question: "Как называются две прямые на плоскости, если они не пересекаются?",
        description: "Выбери правильный вариант ответа.",
        answerType: "options",
        options: [
            { letter: "А", text: "Пересекающиеся прямые" },
            { letter: "Б", text: "Параллельные прямые" },
            { letter: "В", text: "Перпендикулярные прямые" },
            { letter: "Г", text: "Скрещивающиеся прямые" }
        ],
        correctAnswer: 1,
        explanation: "Верно! Две прямые называются параллельными, если они не пересекаются."
    },
    {
        id: 2,
        type: "Теоретическое",
        question: "Если две прямые перпендикулярны третьей прямой, то они:",
        description: "Выбери правильное утверждение.",
        answerType: "options",
        options: [
            { letter: "А", text: "Пересекаются" },
            { letter: "Б", text: "Параллельны друг другу" },
            { letter: "В", text: "Скрещиваются" },
            { letter: "Г", text: "Перпендикулярны друг другу" }
        ],
        correctAnswer: 1,
        explanation: "Правильно! Если две прямые перпендикулярны третьей, то они параллельны между собой."
    },
    {
        id: 3,
        type: "Практическое",
        question: "Сколько прямых, параллельных данной, можно провести через точку, не лежащую на данной прямой?",
        description: "Ответь одним словом или числом.",
        answerType: "text",
        correctAnswer: ["1", "одну"],
        explanation: "Верно! Через точку, не лежащую на данной прямой, можно провести только одну прямую, параллельную данной."
    },
    {
        id: 4,
        type: "Теоретическое",
        question: "Две прямые называются перпендикулярными, если угол между ними равен:",
        description: "Выбери правильный вариант ответа.",
        answerType: "options",
        options: [
            { letter: "А", text: "45°" },
            { letter: "Б", text: "60°" },
            { letter: "В", text: "90°" },
            { letter: "Г", text: "180°" }
        ],
        correctAnswer: 2,
        explanation: "Правильно! Две прямые перпендикулярны, если угол между ними равен 90°."
    },
    {
        id: 5,
        type: "Практическое",
        question: "При пересечении двух прямых один из углов равен 40°. Найди величину вертикального угла.",
        description: "Ответ дай в градусах.",
        answerType: "text",
        correctAnswer: ["40", "40°"],
        explanation: "Верно! Вертикальные углы равны, вертикальный угол равен 40°."
    },
    {
        id: 6,
        type: "Теоретическое",
        question: "Если прямая пересекает одну из двух параллельных прямых, то она:",
        description: "Выбери правильное утверждение.",
        answerType: "options",
        options: [
            { letter: "А", text: "Параллельна второй прямой" },
            { letter: "Б", text: "Перпендикулярна второй прямой" },
            { letter: "В", text: "Пересекает и вторую прямую" },
            { letter: "Г", text: "Не пересекает вторую прямую" }
        ],
        correctAnswer: 2,
        explanation: "Правильно! Если прямая пересекает одну из параллельных прямых, то она пересекает и другую."
    },
    {
        id: 7,
        type: "Практическое",
        question: "Сумма смежных углов при пересечении двух прямых равна:",
        description: "Выбери правильный вариант ответа.",
        answerType: "options",
        options: [
            { letter: "А", text: "90°" },
            { letter: "Б", text: "180°" },
            { letter: "В", text: "360°" },
            { letter: "Г", text: "45°" }
        ],
        correctAnswer: 1,
        explanation: "Верно! Сумма смежных углов равна 180°."
    },
    {
        id: 8,
        type: "Теоретическое",
        question: "Сколько прямых, перпендикулярных данной, можно провести через точку на данной прямой?",
        description: "Ответь одним словом или числом.",
        answerType: "text",
        correctAnswer: ["1", "одну"],
        explanation: "Правильно! Через точку на данной прямой можно провести только одну прямую, перпендикулярную данной."
    },
    {
        id: 9,
        type: "Практическое",
        question: "Один из смежных углов равен 75°. Найди второй смежный угол.",
        description: "Ответ дай в градусах.",
        answerType: "text",
        correctAnswer: ["105", "105°"],
        explanation: "Верно! 180° - 75° = 105°."
    },
    {
        id: 10,
        type: "Теоретическое",
        question: "Если две прямые параллельны третьей, то они:",
        description: "Выбери правильное утверждение.",
        answerType: "options",
        options: [
            { letter: "А", text: "Пересекаются" },
            { letter: "Б", text: "Перпендикулярны" },
            { letter: "В", text: "Параллельны между собой" },
            { letter: "Г", text: "Образуют угол 45°" }
        ],
        correctAnswer: 2,
        explanation: "Правильно! Если две прямые параллельны третьей, то они параллельны между собой."
    }
];

let currentTaskIndex = 0;
let correctAnswersCount = 0;
let answeredTasks = new Set();
let timerInterval = null;
let timeLeft = 600;
let timeStarted = Date.now();

function initTrainer() {
    if (!checkAuth()) {
        return;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem('authenticated');
            sessionStorage.removeItem('authTime');
            window.location.href = 'index.html';
        });
    }

    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', restartTrainer);
    }

    document.getElementById('totalTasks').textContent = tasks.length;
    timeStarted = Date.now();

    document.getElementById('prevTask').addEventListener('click', function () {
        if (currentTaskIndex > 0) {
            currentTaskIndex--;
            loadTask(currentTaskIndex);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    document.getElementById('nextTask').addEventListener('click', function () {
        if (currentTaskIndex < tasks.length - 1) {
            currentTaskIndex++;
            loadTask(currentTaskIndex);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const task = tasks[currentTaskIndex];
            if (answeredTasks.has(task.id)) {
                finishTest();
            } else {
                alert('Сначала ответь на текущее задание, чтобы завершить тест.');
            }
        }
    });

    startTimer();
    loadTask(currentTaskIndex);
}

function startTimer() {
    const timerValue = document.getElementById('timerValue');
    const timerBar = document.getElementById('timerBar');
    timeLeft = 600;

    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(function () {
        timeLeft--;
        if (timeLeft < 0) {
            timeLeft = 0;
        }

        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        if (timerValue) {
            timerValue.textContent = minutes + ':' + seconds;
        }
        if (timerBar) {
            timerBar.style.width = (timeLeft / 600) * 100 + '%';
        }

        if (timeLeft === 0) {
            clearInterval(timerInterval);
            alert('Время вышло! Тест будет автоматически завершён.');
            finishTest();
        }
    }, 1000);
}

function loadTask(index) {
    const task = tasks[index];

    document.getElementById('currentTask').textContent = index + 1;
    document.getElementById('taskNumber').textContent = task.id;
    document.getElementById('progressBar').style.width = ((index + 1) / tasks.length) * 100 + '%';

    document.getElementById('taskType').textContent = task.type;
    document.getElementById('taskQuestion').textContent = task.question;
    document.getElementById('taskDescription').textContent = task.description;

    const feedbackEl = document.getElementById('feedback');
    feedbackEl.style.display = 'none';
    feedbackEl.className = 'feedback';

    const answerOptionsEl = document.getElementById('answerOptions');
    answerOptionsEl.innerHTML = '';

    const textAnswerSection = document.getElementById('textAnswerSection');
    textAnswerSection.style.display = 'none';

    if (task.answerType === 'options') {
        task.options.forEach(function (option, optIndex) {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'answer-option';
            optionBtn.type = 'button';
            optionBtn.innerHTML = '<span class="option-letter">' + option.letter + '</span><span>' + option.text + '</span>';
            optionBtn.addEventListener('click', function () {
                selectOption(this, optIndex, task);
            });
            answerOptionsEl.appendChild(optionBtn);
        });
    } else if (task.answerType === 'text') {
        textAnswerSection.style.display = 'flex';
        const textInput = document.getElementById('textAnswer');
        textInput.value = '';
        textInput.disabled = false;
        textInput.focus();

        const checkBtn = document.getElementById('checkTextAnswer');
        checkBtn.disabled = false;
        checkBtn.style.opacity = '1';
        checkBtn.style.cursor = 'pointer';
        checkBtn.onclick = function () {
            checkTextAnswer(textInput.value, task);
        };

        textInput.onkeydown = function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkTextAnswer(textInput.value, task);
            }
        };
    }

    const prevBtn = document.getElementById('prevTask');
    const nextBtn = document.getElementById('nextTask');

    prevBtn.disabled = index === 0;
    prevBtn.style.opacity = index === 0 ? '0.5' : '1';
    prevBtn.style.cursor = index === 0 ? 'not-allowed' : 'pointer';

    if (index === tasks.length - 1) {
        nextBtn.textContent = 'Завершить тест';
    } else {
        nextBtn.textContent = 'Следующее →';
    }

    nextBtn.disabled = false;
    nextBtn.style.opacity = '1';
    nextBtn.style.cursor = 'pointer';
}

function selectOption(button, selectedIndex, task) {
    if (answeredTasks.has(task.id)) {
        return;
    }

    const allOptions = document.querySelectorAll('.answer-option');
    allOptions.forEach(function (btn) {
        btn.disabled = true;
    });

    button.classList.add('selected');

    if (selectedIndex === task.correctAnswer) {
        button.classList.add('correct');
        correctAnswersCount++;
        document.getElementById('correctAnswers').textContent = correctAnswersCount;
        showFeedback(true, task.explanation);
    } else {
        button.classList.add('incorrect');
        allOptions[task.correctAnswer].classList.add('correct');
        showFeedback(false, 'Неверно. ' + task.explanation);
    }

    answeredTasks.add(task.id);
}

function checkTextAnswer(userAnswer, task) {
    if (answeredTasks.has(task.id)) {
        return;
    }

    const normalizedAnswer = userAnswer.trim().toLowerCase();
    if (normalizedAnswer === '') {
        alert('Введи ответ, прежде чем проверять.');
        return;
    }

    let isCorrect = false;
    for (let i = 0; i < task.correctAnswer.length; i++) {
        if (normalizedAnswer === task.correctAnswer[i].toLowerCase()) {
            isCorrect = true;
            break;
        }
    }

    const checkBtn = document.getElementById('checkTextAnswer');
    checkBtn.disabled = true;
    checkBtn.style.opacity = '0.5';
    checkBtn.style.cursor = 'not-allowed';

    document.getElementById('textAnswer').disabled = true;

    if (isCorrect) {
        correctAnswersCount++;
        document.getElementById('correctAnswers').textContent = correctAnswersCount;
        showFeedback(true, task.explanation);
    } else {
        showFeedback(false, 'Неверно. Правильный ответ: ' + task.correctAnswer[0] + '. ' + task.explanation);
    }

    answeredTasks.add(task.id);
}

function showFeedback(isCorrect, message) {
    const feedbackEl = document.getElementById('feedback');
    feedbackEl.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
    feedbackEl.innerHTML = isCorrect ? '✅ Правильно! ' + message : '❌ Неправильно. ' + message;
    feedbackEl.style.display = 'block';
    feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function finishTest() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    showResult();
}

function showResult() {
    const total = tasks.length;
    const correct = correctAnswersCount;
    const percent = Math.round((correct / total) * 100);

    const elapsedSeconds = Math.max(0, Math.round((Date.now() - timeStarted) / 1000));
    const elapsedMinutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const elapsedSecs = (elapsedSeconds % 60).toString().padStart(2, '0');

    document.getElementById('resultCorrect').textContent = correct;
    document.getElementById('resultPercent').textContent = percent + '%';
    document.getElementById('resultTime').textContent = elapsedMinutes + ':' + elapsedSecs;

    let grade = '-';
    if (percent >= 90) grade = '5';
    else if (percent >= 75) grade = '4';
    else if (percent >= 60) grade = '3';
    else grade = '2';
    document.getElementById('resultGrade').textContent = grade;

    let message = '';
    if (percent === 100) {
        message = 'Отличный результат! Ты блестяще усвоил свойства прямых.';
    } else if (percent >= 80) {
        message = 'Хороший результат! Осталось совсем немного до отличного.';
    } else if (percent >= 60) {
        message = 'Неплохо! Стоит ещё раз повторить теорию для уверенности.';
    } else {
        message = 'Рекомендуется внимательнее проработать свойства прямых и пройти тест повторно.';
    }
    document.getElementById('resultMessage').textContent = message;

    document.getElementById('resultModal').classList.add('active');
    document.body.style.overflow = 'hidden';

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function restartTrainer() {
    currentTaskIndex = 0;
    correctAnswersCount = 0;
    answeredTasks.clear();

    document.getElementById('correctAnswers').textContent = 0;
    document.getElementById('resultModal').classList.remove('active');
    document.body.style.overflow = '';

    timeStarted = Date.now();
    startTimer();
    loadTask(currentTaskIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initTrainer();
});
