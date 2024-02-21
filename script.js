'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const sectionOne = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
/*//************************/
//*Adding smooth scrolling
/*//************************/
btnScrollTo.addEventListener('click', function (e) {
  //scrolling
  //!Deprecated
  /*window.scrollTo({
    left: s1coords.left + window.pageXOffset,
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });*/
  //*Use this!
  sectionOne.scrollIntoView({ behavior: 'smooth' });
});

//Event delegation -> listener to common parent

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/*//************************/
//*Adding tabbed component
/*//************************/

//Event delegation
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  //Remove active classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/*//************************/
//*Menu fade animation
/*//************************/
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');

    const logo = link.closest('nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/*//************************/
//*Sticky navigation
/*//************************/
/*
!Very ineffiecient, deprecated
const initialCoords = sectionOne.getBoundingClientRect();
window.addEventListener('scroll', function () {
  if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/
const navHeight = nav.getBoundingClientRect();
const stickyNav = function (entries) {
  const [entry] = entries;
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight.height}px`,
});
headerObserver.observe(document.querySelector('.header'));

/*//************************/
//*Reveal sections
/*//************************/
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

/*//************************/
//*Lazy loading images
/*//************************/
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  //You should only remove the lazy-img
  //on the load event listener
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

/*//************************/
//*Slider
/*//************************/

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnright = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach((_, i) =>
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    )
  );
};

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
  );
};
let currentSlide = 0;
const nextSlide = function () {
  //we only change the transform percentages
  //for all slides
  currentSlide = (currentSlide + 1) % slides.length;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};
const prevSlide = function () {
  //we only change the transform percentages
  //for all slides
  if (currentSlide === 0) currentSlide = slides.length - 1;
  else currentSlide = (currentSlide - 1) % slides.length;
  goToSlide(currentSlide);
  activateDot(currentSlide);
};
const init = function () {
  goToSlide(0);
  createDots();
  activateDot(0);
};

init();
//next slide
btnright.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  const slide = e.target.dataset.slide;
  goToSlide(slide);

  //Activating the dot
  activateDot(slide);
});


//!Lectures
/*
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('Loaded', e);
});

window.addEventListener('load', function (e) {
  console.log('page fully loaded', e);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
}); 
const randomInt = (min, max) =>
Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
  
  document.querySelector('.nav__link').addEventListener('click', function (e) {
    this.style.backgroundColor = randomColor();
    console.log('Link only');
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Nav links');
});
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Whole nav');
});
*/

/*
//*Adding cookies!
const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML = `We used cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>`;

document.querySelector('.header').append(message);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

//styles
message.style.backgroundColor = '#37383d';
message.style.width = `120%`;

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

//document.documentElement.style.setProperty('--color-primary','orange')

//attributes
const logo = document.querySelector('.nav__logo');

logo.alt = 'Beautiful minimalist logo';
*/
/*
const h1 = document.querySelector('h1');
console.log(h1.children);
console.log(h1.childNodes);

console.log(h1.parentElement);
console.log(h1.closest('.header'));
*/
