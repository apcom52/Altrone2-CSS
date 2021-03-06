class Carousel {
    /**
	 * Constructor of Carousel
     * @param {Node} element - the parent block
     * @param {object} props - options
     */
	constructor(element, props = {}) {
		if (element == null) {
			throw "Carousel: element is null or undefined";
		}

		let target = this;
		target.__element = element;
		target.__slides = element.querySelectorAll('.carousel__item');
		target.__data = [];
		target.__length = target.__slides.length;
		target.__currentIndex = props.currentIndex || 0;
		target.__time = props.time || 0;
		target.__loop = props.loop;
        target.__onSwipeStart = (e) => target.__onSwipeHandler(target, e);
        target.__onSwipeMove = (e) => target.__onSwipeMoveHandler(target, e);
        target.__onSwipeEnd = (e) => target.__onSwipeEndHandler(target, e);
		target.onChangeCallback = props.onChange || null;

		// Check every .carousel__item, get attributes and put them into target.__data
		[].forEach.call(target.__slides, function(slide) {
			target.__data.push({
				title: slide.dataset.title,
				description: slide.dataset.description,
				imageUrl: slide.dataset.imageUrl
			});
        });

		target.__carouselLeftButton = createElement('div', 'carousel__left');
		target.__carouselLeftButton.onclick = () => target.prev();

		target.__carouselRightButton = createElement('div', 'carousel__right');
        target.__carouselRightButton.onclick = () => target.next();

        target.__carouselInfoPanel = createElement('div', 'carousel__info');
        target.__carouselTitlePanel = createElement('div', 'carousel__info__title');

        target.__carouselContentPanel = createElement('div', 'carousel__info__content');

        target.__element.appendChild(target.__carouselLeftButton);
        target.__element.appendChild(target.__carouselRightButton);
        target.__element.appendChild(target.__carouselInfoPanel);
        target.__carouselInfoPanel.appendChild(target.__carouselTitlePanel);
        target.__carouselInfoPanel.appendChild(target.__carouselContentPanel);

		target.__render();
		target.__element.addEventListener('keydown', (e) => {
			if (e.keyCode === 37) target.prev();
			else if (e.keyCode === 39) target.next();
		});

		target.__element.addEventListener('touchstart', target.__onSwipeStart);

		if (target.__time > 0) {
			target.__loop = true;
			setInterval(function() {
				target.next();
			}, target.__time);
		}
	}

    /**
	 * Get the parent block
     * @returns {Node|*}
     */
	get element() {
		return this.__element;
	}

    /**
	 * Get the index of current slide
     * @returns {*}
     */
	get index() {
		return this.__currentIndex;
	}

    /**
	 * Get amount of slides in Carousel
     * @returns {*}
     */
	get length() {
		return this.__length;
	}

    /**
	 * Set current slide in Carousel (like a open())
     * @param {int} index - index of slide
     */
	set index(index) {
		this.open(index);
	}

    /**
	 * Set callback for onChange event
     * @param {Function} func - function
     */
	set onChange(func) {
		this.onChangeCallback = func || null;
	}

    /**
	 * Show previous slide
     * @returns {Carousel}
     */
	prev() {
		let target = this;
		target.open(target.__currentIndex - 1);

		return target;
	}

    /**
	 * Show next slide
     * @returns {Carousel}
     */
    next() {
        let target = this;
		target.open(target.__currentIndex + 1);

        return target;
    }

    /**
	 * Open selected slide
     * @param {int} index - index of slide
     * @returns {Carousel}
     */
    open(index = 0) {
		let target = this;
		if (index >= 0 && index < target.__length) {
			target.__currentIndex = index;
			target.__render();

			if (target.onChangeCallback) {
				target.onChangeCallback(target);
			}
		} else {
			if (target.__loop) {
				if (index >= target.__length)
					target.open(0);
				if (index < 0)
					target.open(target.__length - 1);
			}
		}

		return target;
	}

	__render() {
		let target = this;
		let currentData = target.__data[target.__currentIndex];

		target.__element.style.backgroundImage = 'url("' + currentData.imageUrl + '")';
		target.__carouselTitlePanel.innerHTML = currentData.title;
		target.__carouselContentPanel.innerHTML = currentData.description;
	}

    __onSwipeHandler(target, e) {
        target.__element.addEventListener('touchmove', target.__onSwipeMove, {passive: false});
        let touchObject = e.changedTouches[0];
        target.__touchStartX = touchObject.pageX;
        target.__touchStartY = touchObject.pageY;
        // e.preventDefault();
    }

    __onSwipeMoveHandler(target, e) {
        target.__element.addEventListener('touchend', target.__onSwipeEnd, {passive: false});
        e.preventDefault();
    }

    __onSwipeEndHandler(target, e) {
        target.__element.removeEventListener('touchmove', target.__onSwipeMove);
        target.__element.removeEventListener('touchend', target.__onSwipeEnd);

        let touchObject = e.changedTouches[0];
        let touchEndX = touchObject.pageX;
        let touchEndY = touchObject.pageY;
        let swipeSide = swipe(target.__touchStartX, target.__touchStartY, touchEndX, touchEndY);
        if (swipeSide === 'left') {
            target.prev();
        } else if (swipeSide === 'right') {
            target.next();
        }
        e.preventDefault();
    }
}