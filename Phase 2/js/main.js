const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

hamburger.addEventListener('click', () => navLinks.classList.toggle("open"));

if (savedTheme=='light') {
    document.body.classList.add('light');
    themeToggle.textContent = '☀️';
}


themeToggle.addEventListener('click', () => {
    const isLightMode = document.body.classList.toggle('light');

    if(isLightMode){
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    }
});
