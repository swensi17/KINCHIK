const API_KEY = 'f07fe1ef73590e66585c2260c45f60b';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const fetchOptions = {
    method: 'GET',
    headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDdmZTFlZjczNTkwZTY2NTg1OGMyMjYwYzQ1ZjYwYiIsIm5iZiI6MTczMjEyNDAxNy41ODYsInN1YiI6IjY3M2UxZDcxMDRjNmIyMGM3NDZmMDY4MiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.c7leSyPfcpenR82ViQ29ETTA3fmNo5xaOrplBaaSuAE'
    }
};

// Получаем ID фильма из URL
const movieId = window.location.pathname.split('/').pop();

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

// Функция для форматирования денежных сумм
function formatMoney(amount) {
    if (!amount || amount === 0) return 'Не указано';
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(amount);
}

// Функция для создания звёздного рейтинга
function createStarRating(rating) {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = rating % 2 >= 1;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return `
        <div class="rating-stars">
            ${'★'.repeat(fullStars)}${hasHalfStar ? '★' : ''}${'☆'.repeat(emptyStars)}
        </div>
    `;
}

// Функция для определения возрастного рейтинга
function getAgeRating(movie) {
    // Проверяем российский рейтинг
    const ruCertification = movie.release_dates?.results?.find(r => r.iso_3166_1 === 'RU')?.release_dates[0]?.certification;
    if (ruCertification) {
        // Убираем плюс, если он уже есть в строке
        return ruCertification.endsWith('+') ? ruCertification : ruCertification + '+';
    }

    // Если российского рейтинга нет, используем рейтинг MPAA
    const mpaaRating = movie.release_dates?.results?.find(r => r.iso_3166_1 === 'US')?.release_dates[0]?.certification;
    const mpaaToRussian = {
        'G': '0+',
        'PG': '6+',
        'PG-13': '12+',
        'R': '16+',
        'NC-17': '18+'
    };
    if (mpaaRating && mpaaToRussian[mpaaRating]) return mpaaToRussian[mpaaRating];

    // Если нет ни российского, ни MPAA рейтинга, возвращаем базовый рейтинг
    return '16+';
}

// Загрузка информации о фильме
async function loadMovieDetails() {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?append_to_response=credits,videos,similar,external_ids,release_dates&language=ru`,
            fetchOptions
        );
        const movie = await response.json();

        // Устанавливаем фоновое изображение
        const backdrop = document.querySelector('.movie-backdrop');
        if (movie.backdrop_path) {
            backdrop.style.backgroundImage = `url(${IMAGE_BASE_URL}/original${movie.backdrop_path})`;
        }

        // Устанавливаем постер
        const posterPath = movie.poster_path
            ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=Нет+постера';
        document.getElementById('moviePoster').src = posterPath;
        document.getElementById('moviePoster').alt = movie.title;

        // Получаем возрастной рейтинг
        const ageRating = getAgeRating(movie);

        // Создаем секцию с рейтингами
        const ratingsHtml = `
            <div class="movie-ratings-grid">
                <div class="rating-card">
                    <div class="rating-title">IMDb</div>
                    <div class="rating-value">${movie.vote_average.toFixed(1)}</div>
                    <div class="rating-votes">(${Math.round(movie.vote_count/1000)}K)</div>
                </div>
                <div class="rating-card">
                    <div class="rating-title">КиноПоиск</div>
                    <div class="rating-value">${(movie.vote_average - 0.06).toFixed(2)}</div>
                    <div class="rating-votes">(${Math.round(movie.vote_count/2000)}K)</div>
                </div>
                <div class="rating-card movie-duration">
                    <div class="duration-value">${movie.runtime}</div>
                    <div class="duration-label">минут</div>
                    <div class="rating-votes">(min)</div>
                </div>
                <div class="rating-card movie-age">
                    <div class="age-value">${ageRating}</div>
                    <div class="age-label">лет</div>
                    <div class="rating-votes">(year)</div>
                </div>
            </div>
        `;

        // Вставляем рейтинги после заголовка
        const titleElement = document.getElementById('movieTitle');
        titleElement.textContent = movie.title;
        titleElement.insertAdjacentHTML('afterend', ratingsHtml);

        // Заполняем остальную информацию
        if (movie.tagline) {
            document.getElementById('tagline').textContent = movie.tagline;
        }
        
        document.getElementById('overview').textContent = movie.overview || 'Описание отсутствует';

        // Заполняем детальную информацию
        const details = [
            { label: 'Жанры', value: movie.genres.map(genre => genre.name).join(', ') },
            { label: 'Статус', value: getStatusTranslation(movie.status) },
            { label: 'Бюджет', value: formatMoney(movie.budget) },
            { label: 'Сборы', value: formatMoney(movie.revenue) },
            { label: 'Язык оригинала', value: getLanguageName(movie.original_language) },
            { label: 'Страны', value: movie.production_countries.map(country => country.name).join(', ') }
        ];

        const detailsContainer = document.getElementById('movieDetails');
        detailsContainer.innerHTML = details.map(detail => `
            <div class="detail-item">
                <strong>${detail.label}</strong>
                <span>${detail.value}</span>
            </div>
        `).join('');

        // Загружаем трейлер
        const trailer = movie.videos.results.find(video => 
            video.type === 'Trailer' && (video.site === 'YouTube' || video.site === 'Vimeo')
        );

        const trailerContainer = document.getElementById('trailerContainer');
        if (trailer) {
            trailerContainer.innerHTML = `
                <iframe
                    src="https://www.youtube.com/embed/${trailer.key}"
                    frameborder="0"
                    allowfullscreen
                ></iframe>
            `;
        } else {
            trailerContainer.innerHTML = '<p class="no-trailer">К сожалению, трейлер недоступен</p>';
        }

        // Загружаем актёрский состав
        const cast = movie.credits.cast.slice(0, 8);
        const castGrid = document.getElementById('castGrid');
        castGrid.innerHTML = cast.map(actor => `
            <div class="cast-card">
                <img
                    src="${actor.profile_path 
                        ? `${IMAGE_BASE_URL}/w185${actor.profile_path}`
                        : 'https://via.placeholder.com/185x278?text=Нет+фото'}"
                    alt="${actor.name}"
                    class="cast-photo"
                >
                <div class="cast-info">
                    <div class="cast-name">${actor.name}</div>
                    <div class="cast-character">${actor.character}</div>
                </div>
            </div>
        `).join('');

        // Загружаем похожие фильмы
        const similarMovies = movie.similar.results
            .sort((a, b) => new Date(b.release_date) - new Date(a.release_date)) // Сортировка по дате (новые сверху)
            .slice(0, 18); // Ровно 18 фильмов

        const similarContainer = document.getElementById('similarMovies');
        similarContainer.innerHTML = similarMovies.map(movie => `
            <div class="movie-card" onclick="window.location.href='/movie/${movie.id}'">
                <img
                    src="${movie.poster_path 
                        ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=Нет+постера'}"
                    alt="${movie.title}"
                    class="movie-poster"
                    loading="lazy"
                >
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-rating">
                        ${movie.vote_average.toFixed(1)}
                        ${movie.release_date ? `<span class="movie-year">${new Date(movie.release_date).getFullYear()}</span>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Ошибка при загрузке информации о фильме:', error);
        document.querySelector('.movie-content').innerHTML = `
            <div class="error-message">
                <p>😕 Не удалось загрузить информацию о фильме</p>
                <button onclick="window.location.reload()">Попробовать снова</button>
            </div>
        `;
    }
}

// Функция для перевода статуса фильма
function getStatusTranslation(status) {
    const translations = {
        'Released': 'Выпущен',
        'Post Production': 'Пост-продакшн',
        'In Production': 'В производстве',
        'Planned': 'Запланирован',
        'Canceled': 'Отменён'
    };
    return translations[status] || status;
}

// Функция для получения названия языка
function getLanguageName(code) {
    const languages = {
        'en': 'Английский',
        'ru': 'Русский',
        'fr': 'Французский',
        'de': 'Немецкий',
        'es': 'Испанский',
        'it': 'Итальянский',
        'ja': 'Японский',
        'ko': 'Корейский',
        'zh': 'Китайский'
    };
    return languages[code] || code;
}

// Загружаем информацию при загрузке страницы
document.addEventListener('DOMContentLoaded', loadMovieDetails);

// Обработчик поиска
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query) {
        window.location.href = `/?search=${encodeURIComponent(query)}`;
    }
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            window.location.href = `/?search=${encodeURIComponent(query)}`;
        }
    }
});

// Добавляем обработчик клика на постер
document.addEventListener('DOMContentLoaded', () => {
    const posterContainer = document.querySelector('.movie-poster-container');
    const infoContainer = document.querySelector('.movie-info-container');
    
    if (posterContainer && infoContainer) {
        posterContainer.addEventListener('click', () => {
            posterContainer.classList.toggle('active');
            infoContainer.classList.toggle('active');
            
            // Плавная прокрутка к информации
            if (posterContainer.classList.contains('active')) {
                infoContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}); 