const listMovies = document.querySelector("#listMovie");
const dropdownGenre = document.querySelector("#dropdownGenre");
const inputSearch = document.getElementById("searchText");
const btnSearch = document.getElementById("searchForm");
const totalResult = document.getElementById("totalResult");
const genreName = document.getElementById("genreName");
const itemHome = document.getElementById("itemHome");
const itemNP = document.getElementById("itemNP");
const itemUP = document.getElementById("itemUP");

const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')
const current = document.getElementById('currentPageText')
const mainTag = document.getElementById('main')

const arrStyleDisplay = [totalResult, genreName, prevBtn, nextBtn, current]

export {
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
}