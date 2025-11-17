const elementHtml = document.querySelector('html');
const btnMode =  document.querySelector('#btnMode');
btnMode.addEventListener('click', () => {
    elementHtml.classList.toggle('dark');
});