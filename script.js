const texts = [
    "Жажда крови вампира утолится лишь твоей смертью",
    "Секреты древнего дома смертельно опасны для любопытных",
    "Призраки прошлого вернутся за тобой",
    "В полночь они утащат тебя во тьму, откуда нет возврата",
    "Станцуй со своими демонами, и умри",
    "Паразиты проникнут в твою плоть и подчинят разум"
];

let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;
let deletingSpeed = 50;
let pauseBetweenTexts = 2000;

const typingElement = document.getElementById('typingElement');

function typeText() {
    const currentText = texts[currentTextIndex];
    
    if (!isDeleting) {
        // Печатаем текст
        typingElement.innerHTML = currentText.substring(0, currentCharIndex) + '<span class="cursor"></span>';
        currentCharIndex++;
        
        if (currentCharIndex > currentText.length) {
            // Текст напечатан, ждем и начинаем удалять
            isDeleting = true;
            setTimeout(typeText, pauseBetweenTexts);
            return;
        }
    } else {
        // Удаляем текст
        typingElement.innerHTML = currentText.substring(0, currentCharIndex) + '<span class="cursor"></span>';
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
            // Текст удален, переходим к следующему
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % texts.length;
        }
    }
    
    // Устанавливаем скорость в зависимости от направления
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(typeText, speed);
}

// Функция для воспроизведения аудио
function playHalloweenAudio() {
    const audio = document.getElementById('halloweenAudio');
    audio.volume = 0.9; // Устанавливаем громкость 0.7
    audio.play().catch(error => {
        console.log('Автовоспроизведение заблокировано:', error);
    });
}

// Добавляем обработчик клика на footer
document.getElementById('audioTrigger').addEventListener('click', function() {
    playHalloweenAudio();
});

// Запускаем анимацию
setTimeout(typeText, 1000);













// Массив с воспоминаниями
const memories = [
    {
        type: 'image',
        url: './assets/1.jpg',
        text: 'Тут ты хотела спать, когда уже нужно было собираться и ехать домой с ночевки'
    },
    {
        type: 'image', 
        url: './assets/2.jpg',
        text: 'Ты всегда ахуенно спишь'
    },
    {
        type: 'image',
        url: './assets/3.jpg',
        text: 'И тут тоже'
    },
    {
        type: 'image',
        url: './assets/4.jpg',
        text: '27.09'
    },
    {
        type: 'image',
        url: './assets/5.jpg',
        text: 'Илюша (купола)'
    },
    {
        type: 'image',
        url: './assets/6.jpg',
        text: 'Пазлы'
    },
    {
        type: 'image',
        url: './assets/7.jpg',
        text: 'Очень рад, что ты носишь мои подарки'
    },
    {
        type: 'image',
        url: './assets/8.jpg',
        text: 'Счпстлив за тебя, что у тебя есть такая лучшая подруга'
    },
    {
        type: 'image',
        url: './assets/9.jpg',
        text: 'Ты всегда прекрастна в моих глазах, даже если говришт, что (хуйня и не очень)'
    },
    {
        type: 'image',
        url: './assets/10.jpg',
        text: 'Спасибо за все <3'
    },
];

// Переменные для управления историями
let currentStoryIndex = 0;
let progressInterval;
let isPlaying = false;

// Элементы DOM
let storiesArchive;
let storiesContainer;

// Инициализация архива историй
function initStoriesArchive() {
    // Удаляем дублирующую структуру из HTML если она есть
    const existingArchive = document.querySelector('.stories-archive');
    if (existingArchive) {
        existingArchive.remove();
    }
    
    // Создаем новую структуру
    storiesArchive = document.createElement('div');
    storiesArchive.className = 'stories-archive';
    
    storiesArchive.innerHTML = `
        <div class="stories-container">
            <div class="story-content">
                <div class="story-progress"></div>
                <div class="story-counter"></div>
                <button class="story-close">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3"><path d="m291-240-51-51 189-189-189-189 51-51 189 189 189-189 51 51-189 189 189 189-51 51-189-189-189 189Z"/></svg>
                </button>
                <div class="story-media-container"></div>
                <div class="story-text"></div>
                <div class="story-nav story-prev"></div>
                <div class="story-nav story-next"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(storiesArchive);
    storiesContainer = storiesArchive.querySelector('.stories-container');
    
    // Обработчики событий
    storiesArchive.querySelector('.story-close').addEventListener('click', closeStories);
    storiesArchive.querySelector('.story-prev').addEventListener('click', showPrevStory);
    storiesArchive.querySelector('.story-next').addEventListener('click', showNextStory);
    
    // Закрытие по клику вне контента
    storiesArchive.addEventListener('click', function(e) {
        if (e.target === storiesArchive) {
            closeStories();
        }
    });
    
    // Управление клавиатурой
    document.addEventListener('keydown', handleKeyPress);
}

// Открытие архива историй
function openStoriesArchive() {
    if (!storiesArchive) {
        initStoriesArchive();
    }
    
    storiesArchive.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    currentStoryIndex = 0;
    showStory(currentStoryIndex);
    playHalloweenAudio();
}

// Закрытие архива историй
function closeStories() {
    if (storiesArchive) {
        storiesArchive.style.display = 'none';
        document.body.style.overflow = ''; // Восстанавливаем скролл
    }
    stopProgress();
    pauseCurrentVideo();
}

// Показать историю
function showStory(index) {
    if (index < 0 || index >= memories.length) return;
    
    currentStoryIndex = index;
    const memory = memories[index];
    
    // Обновляем счетчик
    document.querySelector('.story-counter').textContent = `${index + 1}/${memories.length}`;
    
    // Обновляем прогресс-бары
    updateProgressBars();
    
    // Обновляем медиа-контент
    const mediaContainer = document.querySelector('.story-media-container');
    mediaContainer.innerHTML = '';
    
    if (memory.type === 'image') {
        const img = document.createElement('img');
        img.className = 'story-media';
        img.src = memory.url;
        img.alt = 'Воспоминание';
        mediaContainer.appendChild(img);
        
        // Обработчик ошибки загрузки изображения
        img.onerror = function() {
            console.error('Ошибка загрузки изображения:', memory.url);
            img.src = 'https://via.placeholder.com/400x600/333/fff?text=Image+Not+Found';
        };
    } else if (memory.type === 'video') {
        const video = document.createElement('video');
        video.className = 'story-media';
        video.src = memory.url;
        video.controls = false;
        video.autoplay = true;
        video.muted = false;
        video.loop = false;
        video.playsInline = true;
        mediaContainer.appendChild(video);
        
        video.addEventListener('ended', function() {
            showNextStory();
        });
        
        video.addEventListener('error', function() {
            console.error('Ошибка загрузки видео:', memory.url);
        });
    }
    
    // Обновляем текст
    document.querySelector('.story-text').textContent = memory.text;
    
    // Запускаем прогресс
    startProgress();
}

// Показать следующую историю
function showNextStory() {
    if (currentStoryIndex < memories.length - 1) {
        showStory(currentStoryIndex + 1);
    } else {
        closeStories();
    }
}

// Показать предыдущую историю
function showPrevStory() {
    if (currentStoryIndex > 0) {
        showStory(currentStoryIndex - 1);
    }
}

// Прогресс-бар
function startProgress() {
    stopProgress();
    isPlaying = true;
    
    const progressBars = document.querySelectorAll('.progress-fill');
    if (progressBars[currentStoryIndex]) {
        let width = 0;
        const duration = 5500; // 5 секунд на историю
        
        progressInterval = setInterval(() => {
            if (isPlaying) {
                width += (100 / (duration / 50));
                progressBars[currentStoryIndex].style.width = width + '%';
                
                if (width >= 100) {
                    showNextStory();
                }
            }
        }, 50);
    }
}

function stopProgress() {
    isPlaying = false;
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

function updateProgressBars() {
    const progressContainer = document.querySelector('.story-progress');
    progressContainer.innerHTML = '';
    
    memories.forEach((_, index) => {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        if (index < currentStoryIndex) {
            progressFill.style.width = '100%';
        } else if (index === currentStoryIndex) {
            progressFill.style.width = '0%';
        }
        
        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressBar);
        
        // Клик на прогресс-бар для перехода к конкретной истории
        progressBar.addEventListener('click', () => {
            showStory(index);
        });
    });
}

// Пауза видео при переключении
function pauseCurrentVideo() {
    const video = document.querySelector('.story-media');
    if (video && video.tagName === 'VIDEO') {
        video.pause();
        video.currentTime = 0;
    }
}

// Управление клавишами
function handleKeyPress(e) {
    if (storiesArchive && storiesArchive.style.display === 'block') {
        switch(e.key) {
            case 'ArrowLeft':
                showPrevStory();
                break;
            case 'ArrowRight':
            case ' ':
                showNextStory();
                break;
            case 'Escape':
                closeStories();
                break;
        }
    }
}

// Аудио функции
function playHalloweenAudio() {
    const audio = document.getElementById('halloweenAudio');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Автовоспроизведение заблокировано:', e));
    }
}

// Добавляем обработчик для кнопки открытия архива
document.addEventListener('DOMContentLoaded', function() {
    // Удаляем дублирующую HTML структуру если она есть в основном документе
    const duplicateArchive = document.querySelector('main + .stories-archive');
    if (duplicateArchive) {
        duplicateArchive.remove();
    }
    
    const openArchiveBtn = document.querySelector('.butt-history');
    if (openArchiveBtn) {
        openArchiveBtn.addEventListener('click', openStoriesArchive);
    }
    
    // Обработчик для аудио в футере
    const audioTrigger = document.getElementById('audioTrigger');
    const halloweenAudio = document.getElementById('halloweenAudio');
    
    if (audioTrigger && halloweenAudio) {
        audioTrigger.addEventListener('click', function() {
            if (halloweenAudio.paused) {
                halloweenAudio.play();
            } else {
                halloweenAudio.pause();
            }
        });
    }
});