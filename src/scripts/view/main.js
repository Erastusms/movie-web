import moment from "moment";
import axios from "axios";
import { API_KEY, BASE_URL, STAR_ICON, IMAGE_NOT_FOUND, IMG_URL, SEARCH_URL, LIST_GENRE_URL, UPCOMING_URL, NOW_PLAYING_URL } from "../constant/constURL";
import {
    listMovies,
    dropdownGenre,
    inputSearch,
    btnSearch,
    totalResult,
    genreName,
    itemHome,
    itemNP,
    itemUP,
    prevBtn,
    nextBtn,
    current,
    mainTag,
    arrStyleDisplay
} from "../constant/constInitElement";
import { formatNumber, formatTime, randomNumbers, changeStyleDisplay, showErrorMessage } from "../helpers"

let currentPage = 1;
let totalPages = 0;
let lastUrl = '';
let idDetailsForBackBtn = []

const maxTotalPages = 500;
const API_URL = `${BASE_URL}/discover/movie?${API_KEY}&page=${currentPage}`;

const main = () => {

    const getGenre = async (url) => {
        try {
            const result = await axios.get(url);
            const responseJson = result.data.genres;
            responseJson.map(genre =>
                dropdownGenre.innerHTML += `<li id=${genre.id} class="dropdown-item">${genre.name}</li>`
            )
        } catch (error) {
            showErrorMessage(error, mainTag);
        }
    }

    const getMovies = async (url) => {
        lastUrl = url;
        try {
            const result = await axios.get(url);
            const responseJson = result.data;
            if (responseJson.results.length !== 0) {
                renderAllMovies(responseJson.results);
                currentPage = responseJson.page;
                current.innerText = currentPage;
                const resultTotal = formatNumber(responseJson.total_results)

                totalResult.innerHTML = `<small class="text-light">Sekitar ${resultTotal} hasil ditemukan<small>`
                totalPages = responseJson.total_pages;
                if (totalPages > maxTotalPages) totalPages = maxTotalPages;
                if (totalPages === 1) {
                    prevBtn.classList.add('not-allowed');
                    nextBtn.classList.add('not-allowed')
                } else {
                    if (currentPage <= 1) {
                        prevBtn.classList.add('not-allowed');
                        nextBtn.classList.remove('not-allowed')
                    } else if (currentPage >= totalPages) {
                        prevBtn.classList.remove('not-allowed');
                        nextBtn.classList.add('not-allowed')
                    } else {
                        prevBtn.classList.remove('not-allowed');
                        nextBtn.classList.remove('not-allowed')
                    }
                }
            } else {
                changeStyleDisplay(arrStyleDisplay, "none")
                listMovies.innerHTML = `<h1 class="text-md-center text-uppercase py-2">No Results Found</h1>`
            }
        } catch (error) {
            showErrorMessage(error, mainTag);
        }
    }

    const renderAllMovies = (movies) => {
        itemHome.scrollIntoView({ behavior: 'smooth' })
        listMovies.innerHTML = "";
        const idMovies = []

        changeStyleDisplay(arrStyleDisplay, "block")
        mainTag.classList.add("container")
        templateHTML(movies, movies.length, idMovies, listMovies, false)
        idMovies.map(idMov => {
            document.getElementById(idMov).addEventListener('click', () => {
                idDetailsForBackBtn.push(idMov)
                inputSearch.value = "";
                getDetails(movies, idMov)
            })
        })
    };

    const getDetails = async (movies, id) => {
        itemHome.scrollIntoView({ behavior: 'smooth' })

        const DETAIL_MOVIE_URL = `${BASE_URL}/movie/${id}?${API_KEY}`
        const CAST_MOVIE_URL = `${BASE_URL}/movie/${id}/credits?${API_KEY}`
        const SIMILAR_MOVIE_URL = `${BASE_URL}/movie/${id}/similar?${API_KEY}`
        try {
            const result = await axios.get(DETAIL_MOVIE_URL);
            const moviesJson = result.data;
            const { id, vote_average, title, poster_path, overview, backdrop_path, runtime, release_date, genres, production_countries } = moviesJson

            let textGenre = '';
            let yearRelease = '';
            let countries = production_countries.length != 0 ? `(${production_countries[0].iso_3166_1})` : "";

            if (genres.length != 0 && release_date) {
                for (let i = 0; i < genres.length; i++) {
                    i === genres.length - 1 ? textGenre += `${genres[i].name}` : textGenre += `${genres[i].name}, `
                }
                yearRelease = release_date.split("-")[0]
            }

            mainTag.classList.remove("container")

            listMovies.innerHTML = `
                <style>
                .detail-class {
                    background: linear-gradient(to top,
                        rgba(0, 0, 0, 0) 0%,
                        rgb(26, 55, 77) 100%),
                        url("${backdrop_path ? IMG_URL + backdrop_path : IMAGE_NOT_FOUND}");
                    background-position: center;
                    background-size: cover;
                }
                </style>
                <div class="detail-class text-white">
                    <div class="row justify-content-between">
                        <div class="col-10 text-sm-start">
                            <span class="fw-bolder fs-2">${title}</span>
                            ${yearRelease ? yearRelease : ""}
                        </div>
                        <div class="col-2 text-sm-end text-end">
                            <span class="bg-secondary-color rounded fs-5 px-2">
                                ${vote_average} <img src="${STAR_ICON}" alt=${STAR_ICON} style="width:16px;" class="pb-1" />
                            </span>
                        </div>
                    </div>
                    <div class="row justify-content-start py-5">
                        <div class="${yearRelease ? "card col-4 p-0 border-0 h-100" : "card col-12 p-0 m-0 h-100"}">
                            <img src="${poster_path ? IMG_URL + poster_path : IMAGE_NOT_FOUND}" class="rounded-3 shadow-sm" alt=${title}" />
                        </div>
                        <div class="col-8">
                            <div class="${yearRelease ? "row justify-content-between fs-5" : "d-none"}">
                                <div class="row-col-12">
                                    ${moment(release_date).format("L")} ${countries} &#9679; ${textGenre} &#9679; ${formatTime(runtime)}
                                </div>
                                <div class="row col-md-12 py-2 fs-6">
                                    <p class="lh-sm">
                                        ${overview}
                                    </p>
                                </div>
                                <div class="row-cols-12">
                                    <div class="border-bottom border-3"></div>
                                </div>
                                <div class="row py-2">
                                    <span>Stars: </span>
                                </div>
                                <div class="row row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-2" id="castCard"></div>
                            </div>
                        </div>
                    </div>
                    <div class="row py-3 border-top border-5">
                        <h4>Similar Movies: </h4>
                        <br />
                        <div id="similarMovies"></div>
                    </div>
                    <div class="row justify-content-between">
                        <div class="col-4">
                            <button class="btn btn-danger" id="btnBack">Back</button>
                        </div>
                        <div class="col-4 text-end">
                            <button class="btn btn-warning text-end text-white" id="btnBackToList">Back to List</button>
                        </div>
                    </div>
                </div>
                    `;

            const btnBack = document.getElementById("btnBack")
            const btnBackToList = document.getElementById("btnBackToList")
            if (idDetailsForBackBtn.length === 1) btnBackToList.classList.add("d-none");

            getCast(CAST_MOVIE_URL);
            getSimilarMovies(SIMILAR_MOVIE_URL, movies)
            changeStyleDisplay(arrStyleDisplay, "none")

            btnBack.addEventListener('click', () => {
                if (id === idDetailsForBackBtn[0]) {
                    idDetailsForBackBtn = []
                    return renderAllMovies(movies)
                }

                idDetailsForBackBtn.pop()
                let indexBack = idDetailsForBackBtn.length;
                return getDetails(movies, idDetailsForBackBtn[indexBack - 1])
            })

            btnBackToList.addEventListener('click', () => {
                idDetailsForBackBtn = []
                renderAllMovies(movies)
            })
        } catch (error) {
            showErrorMessage(error, mainTag);
        }
    }

    const getCast = async (url) => {
        try {
            const castCard = document.getElementById("castCard")
            const castResult = await axios.get(url);
            const castJson = castResult.data.cast;
            let maxCastCard = 5;

            if (castJson.length <= maxCastCard) maxCastCard = castJson.length;
            if (castJson.length === 0) {
                castCard.classList.remove("row-cols-sm-2", "row-cols-md-3", "row-cols-lg-5")
                castCard.innerHTML += `<h2 class="text-center">Cast List Not Found</h2>`
            } else {
                for (let i = 0; i < maxCastCard; i++) {
                    const { profile_path, name, character } = castJson[i];
                    castCard.innerHTML += `
                    <div class="col">
                        <div class="card bg-dark h-100">
                            <img src="${profile_path ? IMG_URL + profile_path : IMAGE_NOT_FOUND}" class="card-img-top rounded-top h-85" alt="${name}" />
                            <div class="font-size-cast p-1 h-15">
                                <small class="fw-bolder text-white">${name}</small><br />
                                <small class="text-muted">${character}</small>
                            </div>
                        </div>
                  </div>
                `
                }
            }
        } catch (error) {
            showErrorMessage(error, mainTag);
        }
    }

    const getSimilarMovies = async (url, movies) => {
        try {
            const similarMovies = document.getElementById("similarMovies")
            const similarResult = await axios.get(url);
            const similarJson = similarResult.data.results;
            const idMovies = []

            if (similarJson.length === 0) return similarMovies.innerHTML = `<h2 class="text-center text-dark">Similar Movies Not Found</h2>`

            let randomCountNumber = 5;
            let maxNumber = 20;
            if (randomCountNumber > similarJson.length) {
                maxNumber = similarJson.length
                randomCountNumber = similarJson.length
            }
            let randNumbers = randomNumbers(randomCountNumber, 0, maxNumber)

            templateHTML(similarJson, randomCountNumber, idMovies, similarMovies, randNumbers)
            idMovies.map(idMov => {
                document.getElementById(idMov).addEventListener('click', () => {
                    idDetailsForBackBtn.push(idMov)
                    inputSearch.value = "";
                    getDetails(movies, idMov)
                })
            })
        } catch (error) {
            showErrorMessage(error, mainTag);
        }
    }

    const templateHTML = (movies, arrLength, idMovies, parentElement, randNumbers) => {
        const movieList = document.createElement('div');
        movieList.className = "row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4"

        for (let i = 0; i < arrLength; i++) {
            let cardMovieList = randNumbers ? movies[randNumbers[i]] : movies[i];
            const { id, vote_average, title, poster_path } = cardMovieList;
            idMovies.push(id)
            movieList.innerHTML += `
                <div class="col">
                    <div class="card details shadow-lg border-0 rounded-3 h-100 p-0 text-white" id="${id}">
                        <img src="${poster_path ? IMG_URL + poster_path : IMAGE_NOT_FOUND}" class="card-img-top rounded-top" alt="${title}" style="height: 100%"/>
                        <div class="card-img-overlay">
                            <div class="bg-secondary-color rounded p-1 d-inline">
                                <img src="${STAR_ICON}" alt=${STAR_ICON} style="width:16px;" class="pb-1" />
                                <span class="fw-bold" style="width: 16px;">${vote_average.toFixed(1)}</span>
                            </div>
                        </div>
                        <div class="card-footer rounded-bottom p-2 h-15 text-center text-truncate text-uppercase fw-bold small">
                            ${title}
                        </div>
                    </div>
                </div>`;
        }
        parentElement.appendChild(movieList);
    }

    const pageCall = (currentPage, prevBtn, nextBtn) => {
        if (currentPage > 1 && prevBtn) {
            currentPage--;
        }
        if (currentPage < totalPages && nextBtn) {
            currentPage++;
        }

        let urlSplit = lastUrl.split('&page=');
        let urlJoin = `${urlSplit[0]}&page=${currentPage}`
        getMovies(urlJoin);
    }

    const getDefaultEvent = (e, url, genreText, inputValue) => {
        e.preventDefault();
        idDetailsForBackBtn = []
        genreName.innerHTML = genreText || "";
        inputSearch.value = inputValue || "";
        getMovies(url);
    }

    document.addEventListener("DOMContentLoaded", () => {
        getMovies(API_URL);
        getGenre(LIST_GENRE_URL);

        prevBtn.addEventListener('click', () => pageCall(currentPage, true, false));
        nextBtn.addEventListener('click', () => pageCall(currentPage, false, true));

        itemHome.addEventListener('click', (e) => getDefaultEvent(e, API_URL))
        itemNP.addEventListener('click', (e) => getDefaultEvent(e, NOW_PLAYING_URL))
        itemUP.addEventListener('click', (e) => getDefaultEvent(e, UPCOMING_URL))

        btnSearch.addEventListener('submit', (e) => {
            const searchText = inputSearch.value;
            const titleText = `<h2 class="text-center text-white text-capitalize py-2">Search Result for "${searchText}"</h2>`;
            const SEARCH_QUERY_URL = `${SEARCH_URL}&query=${searchText}`;
            searchText ? getDefaultEvent(e, SEARCH_QUERY_URL, titleText, searchText) : getDefaultEvent(e, API_URL);
        })

        dropdownGenre.addEventListener('click', (e) => {
            const GENRE_URL = `${BASE_URL}/discover/movie?${API_KEY}&with_genres=${e.target.id}`
            const titleText = `<h2 class="text-center text-white text-capitalize py-2">${e.target.innerText} movies</h2>`
            getDefaultEvent(e, GENRE_URL, titleText)
        })
    });
}

export default main;