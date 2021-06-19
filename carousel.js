// carousel
const track = document.querySelector('.carousel__track');
const slides = Array.from(track.children);
const previousButton = document.querySelector('.carousel__button--left')
const nextButton = document.querySelector('.carousel__button--right')
const dotsNav = document.querySelector('.carousel__nav');
const dots = Array.from(dotsNav.children);

currentIndex = 0;

const slideWidth = slides[0].getBoundingClientRect().width;

//arrange slides next to one another
const setSlidePosition = (slide, index) => {
    slide.style.left = slideWidth * index + 'px';
}

slides.forEach(setSlidePosition);

const moveToSlide = (track, currentSlide, targetSlide) => {
    track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
    update(currentSlide, targetSlide);
}

const update = (current, target) => {
    current.classList.remove('current-slide');
    target.classList.add('current-slide');
}

const hideShowArrows = (slides, previousButton, nextButton, targetIndex) => {
    if (targetIndex === 0) {
        previousButton.classList.add('is-hidden');
        nextButton.classList.remove('is-hidden');
    } else if (targetIndex === slides.length - 1) {
        nextButton.classList.add('is-hidden');
        previousButton.classList.remove('is-hidden');
    } else {
        previousButton.classList.remove('is-hidden');
        nextButton.classList.remove('is-hidden');
    }
}

// when previous arrow is clicked, move slides left
previousButton.addEventListener('click', e => {
    currentIndex -= 1;
    const currentSlide = track.querySelector('.current-slide');
    const previousSlide = currentSlide.previousElementSibling;
    const currentDot = dotsNav.querySelector('.current-slide');
    const previousDot = currentDot.previousElementSibling;
    const amountToMove = previousSlide.style.left;
    const previousIndex = slides.findIndex(slide => slide === previousSlide);

    moveToSlide(track, currentSlide, previousSlide);
    update(currentDot, previousDot);
    hideShowArrows(slides, previousButton, nextButton, previousIndex);
})


// when next arrow is clicked, move slides right
nextButton.addEventListener('click', e => {
    currentIndex += 1;
    const currentSlide = track.querySelector('.current-slide');
    const nextSlide = currentSlide.nextElementSibling;
    const currentDot = dotsNav.querySelector('.current-slide');
    const nextDot = currentDot.nextElementSibling;
    const amountToMove = nextSlide.style.left;
    const nextIndex = slides.findIndex(slide => slide === nextSlide);

    moveToSlide(track, currentSlide, nextSlide);
    update(currentDot, nextDot);
    hideShowArrows(slides, previousButton, nextButton, nextIndex);
})

// when i click nav indicator, move to that slide
dotsNav.addEventListener('click', e => {
    // determine which dot was clicked
    const targetDot = e.target.closest('button');
    
    if (!targetDot) return;
    
    const currentSlide = track.querySelector('.current-slide');
    const currentDot = dotsNav.querySelector('.current-slide');
    const targetIndex = dots.findIndex(dot => dot === targetDot);
    const targetSlide = slides[targetIndex];
    currentIndex = targetIndex;

    moveToSlide(track, currentSlide, targetSlide);
    update(currentDot, targetDot); 
    hideShowArrows(slides, previousButton, nextButton, targetIndex);
})










// responsiveness for swipe
let isDragging = false,
    startPos = 0,
    currentTranslate = 0,
    previousTranslate = 0,
    animationID = 0;

slides.forEach((slide, index) => {
    const slideImage = slide.querySelector('img');
    slideImage.addEventListener('dragstart', e => e.preventDefault());

    // touch events
    slide.addEventListener('touchstart', touchStart(index));
    slide.addEventListener('touchend', touchEnd);
    slide.addEventListener('touchmove', touchMove);

    // mouse events
    slide.addEventListener('mousedown', touchStart(index));
    slide.addEventListener('mouseup', touchEnd);
    slide.addEventListener('mouseleave', touchEnd);
    slide.addEventListener('mousemove', touchMove);
})

// window.oncontextmenu = function(event) {
//     // disable context menu
//     event.preventDefault();
//     event.stopPropagation();
//     return false
// }

function touchStart(index) {
    return function(event) {
        currentIndex = index;       
        startPos = getPositionX(event);
        isDragging = true;

        animationID = requestAnimationFrame(animation);
        track.classList.add('grabbing');
    }
}

function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - previousTranslate;

    if(movedBy < -100 && currentIndex < slides.length - 1) {
        currentIndex += 1;
    }
    if (movedBy > 100 && currentIndex > 0) {
        currentIndex -= 1;
    }

    setPostionByIndex();

    track.classList.remove('grabbing');
}

function touchMove(event) {
    if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = previousTranslate + currentPosition - startPos;
    }
}

function getPositionX(event) {
    // get x position of touch inside element
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
    setSliderPostion();
    if(isDragging) requestAnimationFrame(animation);
}

function setSliderPostion() {
    track.style.transform = `translateX(${currentTranslate}px)`;
}

function setPostionByIndex() {
    currentDot = dotsNav.querySelector('.current-slide');
    targetDot = dots[currentIndex];
    currentSlide = track.querySelector('.current-slide');
    targetSlide = slides[currentIndex];

    currentTranslate = -slideWidth * currentIndex;

    update(currentDot, targetDot); 
    hideShowArrows(slides, previousButton, nextButton, currentIndex);

    previousTranslate = currentTranslate;

    moveToSlide(track, currentSlide, targetSlide);
}