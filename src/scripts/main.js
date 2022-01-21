import $ from "jquery";
import axios from "axios";
import { API_KEY, BASE_URL } from "./constant/constURL";
import { movieListConst, similarMovieConst } from "./constant/constCardMovie";
import { formatNumber } from "./helpers/formatNumbers";
import { randomNumbers } from "./helpers/randomNumbers";
import { changeStyleDisplay } from "./helpers/changeStyleDisplay";

const listMovies = document.querySelector("#listMovie");
const dropdownGenre = document.querySelector("#dropdownGenre");
const inputSearch = document.getElementById("searchText");
const btnSearch = document.getElementById("searchForm");
const totalResult = document.getElementById("totalResult");
const genreName = document.getElementById("genreName");

let currentPage = 1;
let totalPages = 0;
let indexBack;
let lastUrl = '';
let idDetailsForBackBtn = []

const maxTotalPages = 500;
const imageStar = "https://clipart.info/images/ccovers/1495916677round-star-png-image-yellow.png"
const imageNotFound = "https://via.placeholder.com/1080x1580?text=Image+Not+Found"

const API_URL = `${BASE_URL}/discover/movie?${API_KEY}&page=${currentPage}`;
const IMG_URL = 'https://image.tmdb.org/t/p/w500'
const SEARCH_URL = `${BASE_URL}/search/movie?${API_KEY}`
const LIST_GENRE_URL = `${BASE_URL}/genre/movie/list?${API_KEY}&language=en-US`

const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')
const current = document.getElementById('currentPageText')
const mainTag = document.getElementById('main')
// const btnHome = document.getElementById('btnHome')

const arrStyleDisplay = [totalResult, genreName, prevBtn, nextBtn, current]

function main() {

    const getGenre = async (url) => {
        try {
            const result = await axios.get(url);
            const responseJson = result.data.genres;
            responseJson.map(genre =>
                dropdownGenre.innerHTML += `<li id=${genre.id} class="dropdown-item">${genre.name}</li>`
            )
        } catch (error) {
            showResponseMessage(error);
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

                totalResult.innerHTML = `<small class="text-center">Sekitar ${resultTotal} hasil ditemukan<small>`
                totalPages = responseJson.total_pages;
                if (totalPages > maxTotalPages) totalPages = maxTotalPages;

                prevBtn.classList.add('not-allowed');
                console.log(totalPages)
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
            showResponseMessage(error);
        }
    }

    const renderAllMovies = (movies) => {
        listMovies.innerHTML = "";
        changeStyleDisplay(arrStyleDisplay, "block")
        console.log(movies.length)

        if (movies.length < 9) listMovies.style.display = "height: 1200px";

        mainTag.classList.add("container")
        const idMovies = []
        const movieList = document.createElement('div');
        movieList.className = "row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4"
        movies.map(movie => {
            const { id, vote_average, title, poster_path } = movie
            // const { id } = movie
            // yang asli

            // const movieList = document.createElement('div');
            // const moviesLists = htmlMovie(movie, movieList, movieListConst)
            movieList.innerHTML += `
            <div class="col">
                <div class="card details shadow-lg border-0 rounded-3 h-100 text-white" id="${id}">
                    <img src="${poster_path ? IMG_URL + poster_path : imageNotFound}" class="card-img-top rounded-top" alt="${title}" style="height: 100%"/>
                    <div class="card-img-overlay">
                        <div class="bg-primary rounded d-inline p-1">
                            <img src="${imageStar}" alt=${imageStar} style="width:16px;" class="pb-1" />
                            <span class="fs-5 fw-bold">${vote_average.toFixed(1)}</span>
                            <span class="fs-6">/10</span>
                        </div>
                    </div>
                    <div class="card-footer bg-secondary rounded-bottom p-2 h-15 text-center text-truncate text-uppercase fw-bold" id="hover-yellow">
                        ${title}
                    </div>
                </div>
            </div>
                `;
            // movieList.innerHtml += htmlMovie(movie, movieListConst)
            // htmlMovie(movies, movieList, movieListConst, idMovies)
            idMovies.push(id)
            listMovies.appendChild(movieList);
            // index++
            // console.log(index)
            // if (index === 5) {
            //     break;
            // }
        });
        // document.getElementById(id).addEventListener('click', () => getDetails(movies, id))
        for (let i in idMovies) {
            document.getElementById(idMovies[i]).addEventListener('click', () => {
                inputSearch.value = "";
                getDetails(movies, idMovies[i])
                idDetailsForBackBtn.push(idMovies[i])
            })
        }
    };

    const getDetails = async (movies, id) => {
        const DETAIL_MOVIE_URL = `${BASE_URL}/movie/${id}?${API_KEY}`
        const CAST_MOVIE_URL = `${BASE_URL}/movie/${id}/credits?${API_KEY}`
        const SIMILAR_MOVIE_URL = `${BASE_URL}/movie/${id}/similar?${API_KEY}&page=1`
        try {
            const result = await axios.get(DETAIL_MOVIE_URL);
            const moviesJson = result.data;
            console.log(moviesJson)
            const { id, vote_average, title, poster_path, overview, backdrop_path, runtime, release_date, genres } = moviesJson
            let textGenre = '';
            let yearRelease = '';
            if (genres.length != 0 && release_date) {
                for (let i = 0; i < genres.length; i++) {
                    i === genres.length - 1 ? textGenre += `${genres[i].name}` : textGenre += `${genres[i].name}, `
                }
                yearRelease = release_date.split("-")[0]
            }

            // const yearRelease = release_date.split("-")[0]
            mainTag.classList.remove("container")

            listMovies.innerHTML = `
            <style>
            .detail-class {
                width: 100%;
                height: auto;
                background: linear-gradient(to top,
                    rgba(0, 0, 0, 0) 0%,
                    rgb(0, 0, 25) 100%),
                    url("${backdrop_path ? IMG_URL + backdrop_path : imageNotFound}");
                background-position: center;
                background-size: cover;
                padding: 16px 168px;
            }
            .font-size-cast {
                font-size: 16px;
            }
            </style>
            <div class="detail-class text-white">
                <div class="row justify-content-between">
                    <div class="col-10">
                        <span class="fw-bolder fs-2">${title}</span>
                        ${yearRelease ? yearRelease : ""}
                    </div>
                    <div class="col-2 text-end">
                        <span class="bg-info rounded fs-5 px-2">
                            ${vote_average} <img src="${imageStar}" alt=${imageStar} style="width:16px;" class="pb-1" />
                        </span>
                    </div>
                </div>
                <div class="row justify-content-start py-5">
                    <div class="col-4">
                        <img src="${poster_path ? IMG_URL + poster_path : imageNotFound}" class="rounded-3 shadow-sm w-100" alt=${title}" />
                    </div>
                    <div class="col-8">
                        <div class="${yearRelease ? "row justify-content-between fs-5" : "d-none"}">
                            <div class="row-col-12">
                                ${release_date} &#9679; ${textGenre} &#9679; ${getTime(runtime)}
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
                            <div class="row">
                                <div id="castCard" class="card-group"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row py-3 border-top border-5">
                    <h1>Similar Movies: </h1>
                    <br/>
                    <div id="similarMovies"></div>
                </div>
                <button class="btn btn-success" id="btnBack">BACK</button>
                <button class="btn btn-warning" id="btnBackToList">BACK TO LIST</button>
            </div>
                `;

            const btnBack = document.getElementById("btnBack")
            const btnBackToList = document.getElementById("btnBackToList")
            if (idDetailsForBackBtn.length === 1) btnBackToList.classList.add("d-none");

            getCast(CAST_MOVIE_URL);
            getSimilarMovies(SIMILAR_MOVIE_URL, movies)
            changeStyleDisplay(arrStyleDisplay, "none")

            btnBack.addEventListener('click', () => {
                btnSearch.scrollIntoView({ behavior: 'smooth' })

                if (id === idDetailsForBackBtn[0]) {
                    idDetailsForBackBtn = []
                    return renderAllMovies(movies)
                }

                idDetailsForBackBtn.pop()
                indexBack = idDetailsForBackBtn.length;

                return getDetails(movies, idDetailsForBackBtn[indexBack - 1])
            })

            btnBackToList.addEventListener('click', () => {
                btnSearch.scrollIntoView({ behavior: 'smooth' })
                idDetailsForBackBtn = []
                renderAllMovies(movies)
            })

        } catch (error) {
            showResponseMessage(error);
        }
    }

    const getTime = (time) => {
        const hours = Math.floor(time / 60);
        const minutes = Math.floor(time % 60);
        return `${hours}h ${minutes}m`
    }

    const getCast = async (url) => {
        try {
            const castCard = document.getElementById("castCard")
            const castResult = await axios.get(url);
            const castJson = castResult.data.cast;

            let maxCastCard = 5;
            if (castJson.length <= maxCastCard) maxCastCard = castJson.length;
            if (castJson.length === 0) {
                castCard.innerHTML = `<h2 class="px-5 mx-5">Tidak ada daftar nama cast</h2>`
            } else {
                for (let i = 0; i < maxCastCard; i++) {
                    castCard.innerHTML += `
                <div class="card rounded-3 shadow-sm me-1 bg-dark" style="width: 450px;">
                    <img src="${castJson[i].profile_path ? IMG_URL + castJson[i].profile_path : imageNotFound}" class="card-img-top rounded-top" alt="${castJson[i].name}" />
                    <div class="font-size-cast p-1">
                        <small class="fw-bolder text-white">${castJson[i].name}</small><br />
                        <small class="text-muted">${castJson[i].character}</small>
                    </div>
                </div>
                `
                }
            }
        } catch (error) {
            showResponseMessage(error);
        }
    }


    const getSimilarMovies = async (url, movies) => {
        try {
            const similarMovies = document.getElementById("similarMovies")
            const moviesCard = document.createElement('div');
            moviesCard.className = "card-group"

            const similarResult = await axios.get(url);
            const similarJson = similarResult.data.results;
            console.log(similarJson.length);
            const idMovies = []
            let jmlhAngkaAcak = 5;
            if (jmlhAngkaAcak > similarJson.length) jmlhAngkaAcak = similarJson.length
            console.log(`jumlah angka acak: ${jmlhAngkaAcak}`)
            const randomAngka = randomNumbers(jmlhAngkaAcak, 0, 19)

            for (let i = 0; i < jmlhAngkaAcak; i++) {
                const { id, vote_average, title, poster_path } = similarJson[randomAngka[i]];

                moviesCard.innerHTML += `
                <div class="card details shadow-lg m-2 w-100 border-0 rounded-3" id="${id}">
                    <img src="${poster_path ? IMG_URL + poster_path : imageNotFound}" class="card-img-top rounded-top" alt="${title}" style="height: 100%;" />
                    <div class="card-img-overlay">
                        <div class="bg-primary rounded d-inline p-1 text-white">
                            <img src="${imageStar}" alt=${imageStar} style="width:12px;" class="pb-1" />
                            <span class="fw-bold">${vote_average.toFixed(1)}</span>
                            <span class="small">/10</span>
                        </div>
                    </div>
                    <div class="card-footer bg-secondary rounded-bottom p-0 text-white text-center">
                        <span class="d-inline-block text-truncate text-uppercase fw-bold" style="max-width: 150px;">
                            ${title}
                        </span>
                    </div>
                </div>
                    `;
                // htmlMovie(similarJson[randomAngka[i]], moviesCard, similarMovieConst)
                idMovies.push(id)
                similarMovies.appendChild(moviesCard);
            }

            for (let i in idMovies) {
                document.getElementById(idMovies[i]).addEventListener('click', () => {
                    btnSearch.scrollIntoView({ behavior: 'smooth' })

                    getDetails(movies, idMovies[i])
                    idDetailsForBackBtn.push(idMovies[i])
                })
            }
        } catch (error) {
            showResponseMessage(error);
        }
    }

    const htmlMovie = (movie, movieClass) => {

        const { cardClass, styleHeight, styleWidth, spanVote, spanMax, maxWidth } = movieClass
        const { id, vote_average, title, poster_path } = movie
        console.log(title);
        // console.log(cardClass)
        // movies.map((movie, index) => {
        //     const { id, vote_average, title, poster_path } = movie
        //     movieList.innerHtml += 
        return `<div class="${cardClass}" id="${id}">
                    <img src="${poster_path ? IMG_URL + poster_path : imageNotFound}" class="card-img-top rounded-top" alt="${title}" style="${styleHeight}" />
                    <div class="card-img-overlay">
                        <div class="bg-primary rounded d-inline p-1 text-white">
                            <img src="${imageStar}" alt=${imageStar} style="${styleWidth}" class="pb-1" />
                            <span class="${spanVote}">${vote_average}</span>
                            <span class="${spanMax}">/10</span>
                        </div>
                    </div>
                    <div class="card-footer bg-secondary rounded-bottom p-2 h-15 text-center text-truncate text-uppercase fw-bold" id="hover-yellow">
                        ${title}
                    </div>
            </div>`;
        // idMovies.push(id)
        // listMovies.appendChild(movieList);
        // })

        // return movieList
    }


    const showResponseMessage = (message = "Check your internet connection") => {
        alert(message);
    };

    const pageCall = (currentPage, prevBtn, nextBtn) => {
        if (currentPage > 1 && prevBtn) {
            currentPage--;
            btnSearch.scrollIntoView({ behavior: 'smooth' })
        }
        if (currentPage < totalPages && nextBtn) {
            currentPage++;
            btnSearch.scrollIntoView({ behavior: 'smooth' })
        }

        let urlSplit = lastUrl.split('&page=');
        let urlJoin = `${urlSplit[0]}&page=${currentPage}`
        getMovies(urlJoin);
    }

    document.addEventListener("DOMContentLoaded", () => {
        getMovies(API_URL);
        getGenre(LIST_GENRE_URL);

        // btnHome.addEventListener('click', () => getMovies(API_URL));

        prevBtn.addEventListener('click', () => pageCall(currentPage, true, false));

        nextBtn.addEventListener('click', () => pageCall(currentPage, false, true));

        btnSearch.addEventListener('submit', (e) => {
            e.preventDefault();
            idDetailsForBackBtn = []
            const searchText = inputSearch.value;
            genreName.innerHTML = `<h2 class="text-sm-center text-uppercase py-2">Search Result for "${searchText}"</h2>`
            if (searchText) return getMovies(`${SEARCH_URL}&query=${searchText}`);

            genreName.innerHTML = ""
            getMovies(API_URL);
        })

        // inputSearch.addEventListener("input", (e) => {
        //     e.preventDefault();
        //     const searchText = inputSearch.value;
        //     genreName.innerHTML = `<h2 class="text-sm-center">--- Search Result --- </h2>`
        //     if (searchText) return getMovies(`${SEARCH_URL}&query=${searchText}`);

        //     genreName.innerHTML = ""
        //     getMovies(API_URL);
        // }); 


        dropdownGenre.addEventListener('click', (e) => {
            e.preventDefault();
            inputSearch.value = "";
            idDetailsForBackBtn = []
            const GENRE_URL = `${BASE_URL}/discover/movie?${API_KEY}&with_genres=${e.target.id}`
            genreName.innerHTML = `<h2 class="text-sm-center text-uppercase py-2">${e.target.innerText} movies</h2>`
            getMovies(GENRE_URL);
        })
    });



    // console.log($("#searchForm"))
    // console.log($("#searchText"))

    // document.addEventListener("DOMContentLoaded", () => {
    //     $("#searchForm").on("click", (e) => {
    //         e.prevBtnentDefault();
    //         const searchText = $("#searchText").val();
    //         console.log(searchText)
    //         if (searchText) return getMovies(`${SEARCH_URL}&query=${searchText}`)
    //     })
    //     getMovies(API_URL);
    // });

    // $(() => {
    //     $("#searchForm").on("click", (e) => {
    //         e.prevBtnentDefault();
    //         const searchText = $("#searchText").val();
    //         console.log(searchText)
    //         if (searchText) return getMovies(`${SEARCH_URL}&query=${searchText}`)
    //     })
    //     getMovies(API_URL);
    // });
}



export default main;