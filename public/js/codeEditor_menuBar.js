let menuBtn = document.querySelector('.menu-btn');
let nav = document.querySelector('nav');
let lineOne = document.querySelector('nav .menu-btn .line--1');
let lineTwo = document.querySelector('nav .menu-btn .line--2');
let lineThree = document.querySelector('nav .menu-btn .line--3');
let link = document.querySelector('nav .nav-links');
        
menuBtn.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
            lineOne.classList.toggle('line-cross');
            lineTwo.classList.toggle('line-fade-out');
            lineThree.classList.toggle('line-cross');
            link.classList.toggle('fade-in');
})