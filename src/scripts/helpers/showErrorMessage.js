import Swal from 'sweetalert2';

const showErrorMessage = (message, mainTag) => {
    mainTag.classList.add("container")
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: message
    })
};

export { showErrorMessage }