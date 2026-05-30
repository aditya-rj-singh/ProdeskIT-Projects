const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');


function opennav(){
    navLinks.classList.add('open');
    document.body.style.overflow='hidden';
}

function closenav(){
    navLinks.classList.remove('open');
    document.body.style.overflow='';
}

hamburger.addEventListener('click', (e) =>{
    e.stopPropagation();
    if (navLinks.classList.contains('open')){
        closenav();
    }else{
        opennav();
    }
});

document.addEventListener('click',(e)=>{
    if(
        navLinks.classList.contains('open')&& !navLinks.contains(e.target)&& e.target !== hamburger
    ){
        closenav();
    }
});



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
