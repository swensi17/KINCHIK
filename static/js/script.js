const API_KEY = 'f07fe1ef73590e66585c2260c45f60b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const ITEMS_PER_SECTION = 18;

// Конфигурация для fetch запросов
const fetchOptions = {
    method: 'GET',
    headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDdmZTFlZjczNTkwZTY2NTg1OGMyMjYwYzQ1ZjYwYiIsIm5iZiI6MTczMjEyNDAxNy41ODYsInN1YiI6IjY3M2UxZDcxMDRjNmIyMGM3NDZmMDY4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.c7leSyPfcpenR82ViQ29ETTA3fmNo5xaOrplBaaSuAE'
    }
};

// Функция для форматирования даты
function formatDate(dateStr) {
    if (!dateStr) return 'Дата не указана';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Функция для форматирования длительности
function formatRuntime(minutes) {
    if (!minutes) return 'Длительность не указана';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч ${mins}мин`;
}

// Функция для загрузки данных по URL
async function fetchData(url) {
    try {
        const response = await fetch(url, fetchOptions);
        const data = await response.json();
        return data.results.slice(0, ITEMS_PER_SECTION);
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return [];
    }
}

// Функции для загрузки разных категорий
async function loadTrendingNow() {
    const data = await fetchData(`${BASE_URL}/trending/movie/day?language=ru`);
    displayMovies(data, 'trendingNowContainer');
}

async function loadPopularMovies() {
    const data = await fetchData(`${BASE_URL}/movie/popular?language=ru`);
    displayMovies(data, 'popularMoviesContainer');
}

async function loadNowPlaying() {
    const data = await fetchData(`${BASE_URL}/movie/now_playing?language=ru`);
    displayMovies(data, 'nowPlayingContainer');
}

async function loadTopTVShows() {
    const data = await fetchData(`${BASE_URL}/tv/top_rated?language=ru`);
    displayMovies(data, 'topTVShowsContainer');
}

async function loadAnimatedMovies() {
    const data = await fetchData(`${BASE_URL}/discover/movie?language=ru&with_genres=16`);
    displayMovies(data, 'animatedMoviesContainer');
}

async function loadNewAnime() {
    const data = await fetchData(`${BASE_URL}/discover/movie?language=ru&with_genres=16&with_keywords=210024`);
    displayMovies(data, 'animeContainer');
}

async function loadTop2024() {
    try {
        const response = await fetch(
            `${BASE_URL}/discover/movie?language=ru&primary_release_year=2024&sort_by=vote_average.desc&vote_count.gte=100&vote_average.gte=7`,
            fetchOptions
        );
        const data = await response.json();
        
        // Фильтруем и сортируем результаты
        const filteredMovies = data.results
            .filter(movie => movie.vote_count >= 100 && movie.vote_average >= 7)
            .sort((a, b) => b.vote_average - a.vote_average)
            .slice(0, ITEMS_PER_SECTION);

        // Добавляем специальный класс для высокого рейтинга
        const moviesWithHighlight = filteredMovies.map(movie => ({
            ...movie,
            isHighRated: movie.vote_average >= 8
        }));

        displayMovies(moviesWithHighlight, 'top2024Container');
    } catch (error) {
        console.error('Ошибка при загрузке топ фильмов 2024:', error);
        showError('top2024Container', 'Не удалось загрузить топ фильмов 2024');
    }
}

async function loadTop2025() {
    const data = await fetchData(`${BASE_URL}/discover/movie?language=ru&primary_release_year=2025&sort_by=popularity.desc`);
    displayMovies(data, 'top2025Container');
}

// Функция для отображения ошибок
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="error-message">
            <p>😕 ${message}</p>
            <button onclick="location.reload()">Попробовать снова</button>
        </div>
    `;
}

// Функция для отображения фильмов
function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!movies || movies.length === 0) {
        container.innerHTML = '<p class="no-results">Фильмы не найдены</p>';
        return;
    }

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        container.appendChild(movieCard);
    });
}

// Функция для создания карточки фильма
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = `movie-card ${movie.isHighRated ? 'high-rated' : ''}`;

    const posterPath = movie.poster_path
        ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=Нет+постера';

    const ratingClass = movie.vote_average >= 8 ? 'rating-high' : 
                       movie.vote_average >= 7 ? 'rating-good' : '';

    card.innerHTML = `
        <img src="${posterPath}" alt="${movie.title || movie.name}" class="movie-poster" loading="lazy">
        <div class="movie-info">
            <h3 class="movie-title">${movie.title || movie.name}</h3>
            <div class="movie-rating ${ratingClass}">
                ${movie.vote_average.toFixed(1)}
                ${movie.isHighRated ? '<span class="rating-badge">TOP</span>' : ''}
            </div>
        </div>
    `;

    // Добавляем обработчик клика для перехода на страницу фильма
    card.addEventListener('click', () => {
        window.location.href = `/movie/${movie.id}`;
    });

    return card;
}

// Функция для отображения деталей фильма
async function showMovieDetails(movie) {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movie.id}?append_to_response=videos,credits&language=ru`,
            fetchOptions
        );
        const movieDetails = await response.json();

        const modal = document.getElementById('movieModal');
        const modalContent = document.getElementById('modalContent');

        const trailer = movieDetails.videos.results.find(video => 
            video.type === 'Trailer' && (video.site === 'YouTube' || video.site === 'Vimeo')
        );

        const trailerEmbed = trailer
            ? `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`
            : '<p class="no-trailer">К сожалению, трейлер недоступен</p>';

        const director = movieDetails.credits?.crew?.find(person => person.job === 'Director');
        const cast = movieDetails.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', ');

        modalContent.innerHTML = `
            <h2>${movieDetails.title}</h2>
            <div class="movie-meta">
                <span class="release-date">${formatDate(movieDetails.release_date)}</span>
                <span class="runtime">${formatRuntime(movieDetails.runtime)}</span>
                <span class="rating">★ ${movieDetails.vote_average.toFixed(1)}</span>
            </div>
            <p class="overview">${movieDetails.overview || 'Описание отсутствует'}</p>
            <div class="trailer-container">
                <h3>Трейлер</h3>
                ${trailerEmbed}
            </div>
            <div class="movie-details">
                <p><strong>Жанры:</strong> ${movieDetails.genres.map(genre => genre.name).join(', ')}</p>
                ${director ? `<p><strong>Режиссёр:</strong> ${director.name}</p>` : ''}
                ${cast ? `<p><strong>В главных ролях:</strong> ${cast}</p>` : ''}
                <p><strong>Страна:</strong> ${movieDetails.production_countries.map(country => country.name).join(', ') || 'Не указано'}</p>
                ${movieDetails.budget > 0 ? `<p><strong>Бюджет:</strong> $${movieDetails.budget.toLocaleString('ru-RU')}</p>` : ''}
            </div>
        `;

        modal.style.display = 'block';

        // Закрытие модального окна
        const closeBtn = document.getElementsByClassName('close')[0];
        closeBtn.onclick = () => modal.style.display = 'none';
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    } catch (error) {
        console.error('Ошибка при загрузке деталей фильма:', error);
    }
}

// Функция поиска фильмов
async function searchMovies(query) {
    try {
        // Создаем секцию для результатов поиска, если её нет
        let searchSection = document.querySelector('.search-results');
        if (!searchSection) {
            searchSection = document.createElement('section');
            searchSection.className = 'content-section search-results';
            searchSection.innerHTML = `
                <h2>Результаты поиска</h2>
                <div class="movies-grid" id="searchResultsContainer">
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Поиск фильмов...</p>
                    </div>
                </div>
            `;
            // Вставляем секцию поиска первой в main
            const mainContent = document.querySelector('main');
            mainContent.insertBefore(searchSection, mainContent.firstChild);
        }

        const searchContainer = document.getElementById('searchResultsContainer');
        searchContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Поиск фильмов...</p>
            </div>
        `;

        const response = await fetch(
            `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=ru`,
            fetchOptions
        );
        const data = await response.json();
        
        // Обновляем заголовок раздела
        const heading = document.querySelector('.search-results h2');
        heading.textContent = `Результаты поиска: "${query}"`;
        
        // Отображаем результаты
        if (data.results && data.results.length > 0) {
            displayMovies(data.results.slice(0, ITEMS_PER_SECTION), 'searchResultsContainer');
        } else {
            searchContainer.innerHTML = '<p class="no-results">По вашему запросу ничего не найдено</p>';
        }

        // Плавно прокручиваем к результатам поиска
        searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        console.error('Ошибка при поиске фильмов:', error);
        const searchContainer = document.getElementById('searchResultsContainer');
        searchContainer.innerHTML = `
            <div class="error-message">
                <p>😕 Не удалось выполнить поиск</p>
                <button onclick="handleSearch()">Попробовать снова</button>
            </div>
        `;
    }
}

// Функция обработки поиска
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        // Скрываем клавиатуру на мобильных устройствах
        searchInput.blur();
        
        // Выполняем поиск
        searchMovies(query);
    }
}

// Обработчики событий для поиска
document.getElementById('searchButton').addEventListener('click', handleSearch);

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Обработчик фокуса для поискового поля
document.getElementById('searchInput').addEventListener('focus', function() {
    if (window.innerWidth <= 768) {
        // На мобильных устройствах прокручиваем к полю поиска
        this.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// Обработчик потери фокуса для поискового поля
document.getElementById('searchInput').addEventListener('blur', function() {
    // Даем небольшую задержку перед прокруткой, чтобы успела сработать кнопка поиска
    setTimeout(() => {
        if (window.innerWidth <= 768 && !this.value.trim()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, 150);
});

// Загрузка всех категорий при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadTrendingNow();
    loadPopularMovies();
    loadNowPlaying();
    loadTopTVShows();
    loadAnimatedMovies();
    loadNewAnime();
    loadTop2024();
    loadTop2025();
}); 