const formatNumber = (numbers) => {
    return numbers.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
}
export { formatNumber }
