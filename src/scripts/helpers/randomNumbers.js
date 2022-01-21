const randomNumbers = (jmlhAngka, min, max) => {
    let res = [];
    while (res.length < jmlhAngka) {
        let rand = Math.floor(Math.random() * (max - min) + min)
        while (res.indexOf(rand) != -1) {
            rand = Math.floor(Math.random() * (max - min) + min)
        }
        res.push(rand);
    };
    return res;
}

export { randomNumbers }