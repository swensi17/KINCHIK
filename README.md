# 🎬 Swensi - Современный кинопортал

[![GitHub stars](https://img.shields.io/github/stars/swensi17/KINCHIK.svg)](https://github.com/swensi17/KINCHIK/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/swensi17/KINCHIK.svg)](https://github.com/swensi17/KINCHIK/network)
[![GitHub issues](https://img.shields.io/github/issues/swensi17/KINCHIK.svg)](https://github.com/swensi17/KINCHIK/issues)
[![GitHub license](https://img.shields.io/github/license/swensi17/KINCHIK.svg)](https://github.com/swensi17/KINCHIK/blob/master/LICENSE)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://swensi17.github.io/KINCHIK/)
[![Made with Love](https://img.shields.io/badge/Made%20with-Love-pink.svg)](https://github.com/swensi17/KINCHIK)

Современный веб-сайт для просмотра информации о фильмах, сериалах и аниме с богатым функционалом и стильным дизайном. Проект использует API The Movie Database (TMDB) для получения актуальных данных о кинопроектах.

## ⭐ Ключевые особенности

### 🎥 Фильмы и сериалы
- Просмотр трендовых и популярных фильмов
- Рейтинги и оценки от пользователей
- Подробная информация о каждом проекте
- Трейлеры и видеоматериалы
- Рекомендации похожих фильмов
- Информация об актерах и создателях

### 🔍 Умный поиск
- Мгновенный поиск по названию
- Фильтрация по жанрам
- Сортировка по рейтингу и дате
- История поиска
- Умные рекомендации

### 📱 Адаптивность
- Поддержка всех устройств
- Оптимизация для мобильных
- Адаптивные изображения
- Отзывчивый интерфейс
- Touch-friendly элементы

### 🎨 Дизайн
- Современный интерфейс
- Темная тема
- Плавные анимации
- Красивые градиенты
- Удобная навигация

### 📺 Категории контента
- Новинки кино
- Популярные фильмы
- Топ рейтинга
- Сериалы
- Аниме
- Мультфильмы
- Предстоящие премьеры

## 🛠 Технологии

### Frontend
- HTML5 (Семантическая разметка)
- CSS3 (Modern CSS Features)
  - Flexbox
  - Grid Layout
  - Custom Properties
  - Animations
  - Media Queries
  - Transforms & Transitions
- JavaScript (ES6+)
  - Async/Await
  - Fetch API
  - DOM Manipulation
  - Event Handling
  - Local Storage

### API & Интеграции
- TMDB API v3
- YouTube API (трейлеры)
- Dynamic Routing
- RESTful Services

### Оптимизация
- Lazy Loading
- Image Optimization
- CSS Minification
- JS Compression
- Browser Caching
- Responsive Images

## 📦 Установка и запуск

### Быстрый старт
1. Клонируйте репозиторий:
```bash
git clone https://github.com/swensi17/KINCHIK.git
```

2. Перейдите в директорию проекта:
```bash
cd KINCHIK
```

3. Откройте `index.html` в браузере

### Разработка
```bash
# Установка зависимостей
npm install

# Запуск сервера разработки
npm run dev

# Сборка проекта
npm run build
```

## 📂 Структура проекта

```
KINCHIK/
├── index.html              # Главная страница
├── movie.html             # Страница фильма
├── static/                # Статические ресурсы
│   ├── css/              # Стили
│   │   ├── style.css     # Основные стили
│   │   ├── movie.css     # Стили страницы фильма
│   │   └── animations.css # Анимации
│   ├── js/               # JavaScript файлы
│   │   ├── script.js     # Основной JS
│   │   ├── movie.js      # JS страницы фильма
│   │   ├── api.js        # API интеграции
│   │   └── utils.js      # Утилиты
│   └── assets/           # Медиа файлы
├── docs/                  # Документация
└── README.md             # Описание проекта
```

## 🚀 Функциональность

### Главная страница
- Динамическая загрузка контента
- Бесконечная прокрутка
- Категории фильмов
- Поиск и фильтрация
- Трендовые разделы

### Страница фильма
- Подробная информация
- Рейтинги и отзывы
- Трейлеры и видео
- Актерский состав
- Похожие фильмы
- Рекомендации

### Поиск
- Мгновенный поиск
- Автодополнение
- Фильтры и сортировка
- История поиска
- Умные подсказки

## 🔄 API Интеграция

### TMDB API
- Получение списков фильмов
- Детальная информация
- Поиск по базе данных
- Рейтинги и обзоры
- Изображения и постеры

### Endpoints
- `/movie/popular` - Популярные фильмы
- `/movie/{id}` - Детали фильма
- `/search/movie` - Поиск фильмов
- `/trending/all/day` - Тренды
- `/genre/movie/list` - Список жанров

## 🎯 Особенности реализации

### Производительность
- Оптимизация изображений
- Ленивая загрузка
- Кэширование данных
- Минификация ресурсов
- Gzip компрессия

### UX/UI
- Интуитивная навигация
- Отзывчивый интерфейс
- Плавные переходы
- Информативные сообщения
- Состояния загрузки

### Безопасность
- API Key защита
- XSS prevention
- CORS политики
- Secure Headers
- Error Handling

## 📈 Масштабируемость

### Будущие улучшения
- Авторизация пользователей
- Личные списки фильмов
- Комментарии и обзоры
- Уведомления о премьерах
- Интеграция с соцсетями
- PWA функциональность

## 🌐 Браузерная поддержка

- Chrome (последние 2 версии)
- Firefox (последние 2 версии)
- Safari (последние 2 версии)
- Edge (последние 2 версии)
- Opera (последние 2 версии)

## 📄 Лицензия

Проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE).

## 🔑 Настройка API

1. Получите API ключ на сайте [TMDB](https://www.themoviedb.org/settings/api)
2. Скопируйте файл `static/js/config.example.js` в `static/js/config.js`
3. Замените значения `API_KEY` и `API_TOKEN` на ваши ключи

```javascript
const CONFIG = {
    API_KEY: 'your_api_key_here',
    API_TOKEN: 'your_api_token_here',
    // ... остальные настройки
};
```

⚠️ Никогда не публикуйте ваши API ключи в публичных репозиториях! 