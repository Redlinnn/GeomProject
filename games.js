function initThemeOnGames() {
    const themeToggle = document.getElementById('themeToggle');
    const storedTheme = localStorage.getItem('site-theme') || 'light';

    document.documentElement.setAttribute('data-theme', storedTheme);

    if (themeToggle) {
        updateThemeToggleGames(themeToggle, storedTheme);

        themeToggle.addEventListener('click', function () {
            const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('site-theme', next);
            updateThemeToggleGames(themeToggle, next);
        });
    }
}

function updateThemeToggleGames(button, theme) {
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

function initCatchGame() {
    const startBtn = document.getElementById('catchStart');
    const restartBtn = document.getElementById('catchRestart');
    const field = document.getElementById('catchField');
    const overlay = document.getElementById('catchOverlay');
    const scoreEl = document.getElementById('catchScore');
    const timeEl = document.getElementById('catchTime');

    if (!field || !startBtn) {
        return;
    }

    let score = 0;
    let timeLeft = 30;
    let timer = null;
    let spawner = null;
    let active = false;

    function clearShapes() {
        const shapes = field.querySelectorAll('.catch-shape');
        shapes.forEach(function (shape) {
            shape.remove();
        });
    }

    function spawnShape() {
        if (!active) {
            return;
        }

        clearShapes();
        const shape = document.createElement('div');
        shape.className = 'catch-shape';

        const types = ['circle', 'square', 'triangle'];
        const type = types[Math.floor(Math.random() * types.length)];
        shape.classList.add(type);

        const size = 60 + Math.random() * 40;
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';

        const maxX = field.clientWidth - size;
        const maxY = field.clientHeight - size;
        shape.style.left = Math.random() * maxX + 'px';
        shape.style.top = Math.random() * maxY + 'px';

        const colors = ['linear-gradient(135deg, #818cf8, #4f46e5)', 'linear-gradient(135deg, #22d3ee, #2563eb)', 'linear-gradient(135deg, #a78bfa, #ec4899)'];
        shape.style.background = colors[Math.floor(Math.random() * colors.length)];

        shape.addEventListener('click', function () {
            if (!active) {
                return;
            }
            score += 1;
            if (scoreEl) {
                scoreEl.textContent = score;
            }
            spawnShape();
        });

        field.appendChild(shape);
    }

    startBtn.addEventListener('click', function () {
        if (active) {
            return;
        }

        score = 0;
        timeLeft = 30;
        if (scoreEl) {
            scoreEl.textContent = score;
        }
        if (timeEl) {
            timeEl.textContent = timeLeft;
        }
        if (overlay) {
            overlay.classList.add('hidden');
        }

        active = true;
        clearShapes();
        spawnShape();

        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(function () {
            timeLeft -= 1;
            if (timeEl) {
                timeEl.textContent = timeLeft;
            }
            if (timeLeft <= 0) {
                timeLeft = 0;
                if (timeEl) {
                    timeEl.textContent = 0;
                }
                endGame();
            }
        }, 1000);

        if (spawner) {
            clearInterval(spawner);
        }
    });

    if (restartBtn) {
        restartBtn.addEventListener('click', function () {
            if (timer) {
                clearInterval(timer);
            }
            if (spawner) {
                clearInterval(spawner);
            }
            active = false;
            score = 0;
            timeLeft = 30;
            if (scoreEl) {
                scoreEl.textContent = 0;
            }
            if (timeEl) {
                timeEl.textContent = 30;
            }
            clearShapes();
            if (overlay) {
                overlay.classList.remove('hidden');
            }
            const overlayText = overlay.querySelector('.catch-overlay-text');
            if (overlayText) {
                overlayText.textContent = 'Нажми «Старт», чтобы начать игру';
            }
        });
    }

    function endGame() {
        active = false;
        if (timer) {
            clearInterval(timer);
        }
        clearShapes();
        if (overlay) {
            overlay.classList.remove('hidden');
            const overlayText = overlay.querySelector('.catch-overlay-text');
            if (overlayText) {
                overlayText.textContent = 'Игра окончена! Твой счёт: ' + score;
            }
        }
    }
}

function initFindGame() {
    const startBtn = document.getElementById('findStart');
    const restartBtn = document.getElementById('findRestart');
    const grid = document.getElementById('findGrid');
    const triesEl = document.getElementById('findTries');
    const timeEl = document.getElementById('findTime');
    const messageEl = document.getElementById('findMessage');

    if (!grid || !startBtn) {
        return;
    }

    let tries = 0;
    let starIndex = -1;
    let found = false;
    let timeLeft = 0;
    let timer = null;
    let startedAt = 0;

    function clearGrid() {
        grid.innerHTML = '';
    }

    startBtn.addEventListener('click', function () {
        clearGrid();
        tries = 0;
        found = false;
        if (triesEl) {
            triesEl.textContent = tries;
        }
        if (messageEl) {
            messageEl.textContent = 'Найди спрятанную звезду ⭐ среди всех фигур.';
        }

        const total = 36;
        starIndex = Math.floor(Math.random() * total);

        const icons = ['●', '■', '▲', '◆'];

        for (let i = 0; i < total; i++) {
            const cell = document.createElement('button');
            cell.className = 'find-cell';
            cell.type = 'button';

            const content = document.createElement('span');
            content.className = 'find-cell-content';
            content.textContent = icons[Math.floor(Math.random() * icons.length)];
            cell.appendChild(content);

            cell.addEventListener('click', function () {
                if (found) {
                    return;
                }
                tries += 1;
                if (triesEl) {
                    triesEl.textContent = tries;
                }
                cell.classList.add('revealed');

                if (i === starIndex) {
                    cell.classList.add('correct');
                    content.textContent = '⭐';
                    found = true;
                    if (timer) {
                        clearInterval(timer);
                    }
                    const elapsed = Math.round((Date.now() - startedAt) / 1000);
                    const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
                    const s = (elapsed % 60).toString().padStart(2, '0');
                    if (messageEl) {
                        messageEl.textContent = 'Ура! Звезда найдена за ' + m + ':' + s + ' с ' + tries + ' попыток.';
                    }
                } else {
                    cell.classList.add('wrong');
                    content.textContent = '✖';
                }
            });

            grid.appendChild(cell);
        }

        startedAt = Date.now();
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(function () {
            if (found) {
                clearInterval(timer);
                return;
            }
            const elapsed = Math.round((Date.now() - startedAt) / 1000);
            const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const s = (elapsed % 60).toString().padStart(2, '0');
            if (timeEl) {
                timeEl.textContent = m + ':' + s;
            }
        }, 1000);
    });

    if (restartBtn) {
        restartBtn.addEventListener('click', function () {
            if (timer) {
                clearInterval(timer);
            }
            clearGrid();
            tries = 0;
            found = false;
            if (triesEl) {
                triesEl.textContent = 0;
            }
            if (timeEl) {
                timeEl.textContent = '00:00';
            }
            if (messageEl) {
                messageEl.textContent = 'Нажми «Старт», чтобы сгенерировать поле.';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initThemeOnGames();
    initCatchGame();
    initFindGame();
});
