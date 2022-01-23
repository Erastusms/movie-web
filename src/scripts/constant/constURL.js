const API_KEY = "api_key=0a5b7905aa3cec1a8474690ac9f1e2f4";
const BASE_URL = 'https://api.themoviedb.org/3';
const STAR_ICON = "https://clipart.info/images/ccovers/1495916677round-star-png-image-yellow.png"
const IMAGE_NOT_FOUND = "https://via.placeholder.com/1080x1580?text=Image+Not+Found"
const IMG_URL = 'https://image.tmdb.org/t/p/w500'
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}`
const LIST_GENRE_URL = `${BASE_URL}/genre/movie/list?${API_KEY}`
const UPCOMING_URL = `${BASE_URL}/movie/upcoming?${API_KEY}&region=id`
const NOW_PLAYING_URL = `${BASE_URL}/movie/now_playing?${API_KEY}&region=id`
// const URL = {
//     API_URL: `${BASE_URL}/discover/movie?${API_KEY}`,
//     IMG_URL: 'https://image.tmdb.org/t/p/w500',
//     SEARCH_URL: `${BASE_URL}/search/movie?${API_KEY}`,
//     LIST_GENRE_URL: `${BASE_URL}/genre/movie/list?${API_KEY}&language=en-US`
// }

// const ELEMENTS = {
//     listMovies: document.querySelector("#listMovie"),
//     dropdownGenre: document.querySelector("#dropdownGenre"),
//     inputSearch: document.getElementById("searchText"),
//     btnSearch: document.getElementById("searchForm")
// }

export { API_KEY, BASE_URL, STAR_ICON, IMAGE_NOT_FOUND, IMG_URL, SEARCH_URL, LIST_GENRE_URL, UPCOMING_URL, NOW_PLAYING_URL };