const ACCESS_PASSWORD = "geom2026";

const facts = [
    "Две прямые на плоскости называются параллельными, если они не пересекаются.",
    "Две прямые называются перпендикулярными, если угол между ними равен 90°.",
    "Через точку, не лежащую на данной прямой, можно провести только одну прямую, параллельную данной.",
    "Если две прямые параллельны третьей, то они параллельны между собой.",
    "Если прямая пересекает одну из параллельных прямых, то она пересекает и другую.",
    "Вертикальные углы равны.",
    "Сумма смежных углов при пересечении двух прямых равна 180°.",
    "Если две прямые перпендикулярны третьей, то они параллельны между собой."
];

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const storedTheme = localStorage.getItem('site-theme') || 'light';

    document.documentElement.setAttribute('data-theme', storedTheme);

    if (themeToggle) {
        updateThemeToggle(themeToggle, storedTheme);

        themeToggle.addEventListener('click', function () {
            const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('site-theme', next);
            updateThemeToggle(themeToggle, next);
        });
    }
}

function updateThemeToggle(button, theme) {
    const icon = button.querySelector('.theme-toggle-icon');
    const text = button.querySelector('.theme-toggle-text');

    if (theme === 'dark') {
        icon.textContent = '☀️';
        text.textContent = 'Дневная тема';
    } else {
        icon.textContent = '🌙';
        text.textContent = 'Ночная тема';
    }
}

function generateQRCode() {
    const qrCanvas = document.getElementById('qrcode');
    const qrUrlElement = document.getElementById('qrUrl');

    if (!qrCanvas) {
        return;
    }

    let currentUrl;
    if (window.location.protocol === 'file:') {
        currentUrl = window.location.href.replace('index.html', 'index.html');
    } else {
        currentUrl = window.location.origin + '/index.html';
    }

    if (qrUrlElement) {
        qrUrlElement.textContent = currentUrl;
    }

    if (typeof QRCode !== 'undefined') {
        QRCode.toCanvas(qrCanvas, currentUrl, {
            width: 240,
            margin: 2,
            color: {
                dark: '#1e1b4b',
                light: '#ffffff'
            }
        });
    }
}

function setupAuth() {
    const authForm = document.getElementById('authForm');

    if (!authForm) {
        return;
    }

    authForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const passwordInput = document.getElementById('password');
        const password = passwordInput.value.trim();

        if (password === ACCESS_PASSWORD) {
            sessionStorage.setItem('authenticated', 'true');
            sessionStorage.setItem('authTime', Date.now().toString());
            window.location.href = 'trainer.html';
        } else {
            alert('Неверный пароль! Попробуйте ещё раз.');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
}

function setupInteractive() {
    const factBtn = document.getElementById('factBtn');
    const factText = document.getElementById('factText');
    const confettiBtn = document.getElementById('confettiBtn');

    if (factBtn && factText) {
        factBtn.addEventListener('click', function () {
            const randomIndex = Math.floor(Math.random() * facts.length);
            factText.textContent = facts[randomIndex];
            factText.style.opacity = '0.6';
            setTimeout(function () {
                factText.style.opacity = '1';
            }, 150);
        });
    }

    if (confettiBtn && typeof confetti === 'function') {
        confettiBtn.addEventListener('click', function () {
            const duration = 900;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 4,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
                confetti({
                    particleCount: 4,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    generateQRCode();
    setupAuth();
    setupInteractive();
});
