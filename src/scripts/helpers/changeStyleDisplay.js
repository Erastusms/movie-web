const changeStyleDisplay = (arrStyleDisplay, displayName) => {
    for (let i in arrStyleDisplay) {
        arrStyleDisplay[i].style.display = displayName;
    }
}

export { changeStyleDisplay }