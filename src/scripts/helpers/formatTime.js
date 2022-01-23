const formatTime = (time) => {
    const hours = Math.floor(time / 60);
    const minutes = Math.floor(time % 60);
    if (hours === 0) return `${minutes}m`
    return `${hours}h ${minutes}m`
}

export { formatTime }