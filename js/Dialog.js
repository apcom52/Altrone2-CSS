class Dialog {
    /**
	 * Constructor of Dialog
     * @param {Object} props
     */
	constructor(props = {}) {
		let target = this;

		target.__title = props.title || 'Empty title';
		target.__message = props.message || 'Empty message';
		target.__successLabel = props.successLabel || 'OK';
		target.__failLabel = props.failLabel || 'Cancel';
		target.__invert = props.invert || false;
		target.onSuccessCallback = props.__onSuccess || null;
		target.onFailCallback = props.onFail || null;
		target.onShowCallback = props.onShow || null;
		target.onHideCallback = props.onHide || null;
	}

    /**
	 * Return the title of Dialog
     * @returns {String}
     */
	get title() {
		return this.__title;
	}

    /**
	 * Return the message of Dialog
     * @returns {String}
     */
	get message() {
		return this.__message;
	}

    /**
	 * Return the value of property 'invert'
     * @returns {bool}
     */
	get invert() {
		return this.__invert;
	}

    /**
	 * Return the caption of success button
     * @returns {String}
     */
	get successLabel() {
		return this.__successLabel;
	}

    /**
	 * Return the caption of failed button
     * @returns {String}
     */
	get failLabel() {
		return this.__failLabel;
	}

    /**
	 * Set new title of Dialog
     * @param {String} value
     */
	set title(value) {
		this.__title = value || 'Empty title';
	}

    /**
     * Set new message of Dialog
     * @param {String} value
     */
	set message(value) {
		this.__message = value || 'Empty message';
	}

    /**
     * Set new value of property 'invert'
     * @param {bool} value
     */
	set invert(value) {
		this.__invert = Boolean(value) || false;
	}

    /**
     * Set new caption of success button
     * @param {String} value
     */
	set successLabel(value) {
		this.__successLabel = value || 'OK';
	}

    /**
     * Set new caption of fail button
     * @param {String} value
     */
	set failLabel(value) {
		this.__failLabel = value || 'Cancel';
	}

    /**
     * Set new callback for onSuccessButtonPress Event
     * @param {Function} func
     */
	set onSuccess(func) {
		this.onSuccessCallback = func || null;
	}

    /**
     * Set new callback for onFailButtonPress Event
     * @param {Function} func
     */
	set onFail(func) {
		this.onFailCallback = func || null;
	}

    /**
     * Set new callback for onModalShow Event
     * @param {Function} func
     */
	set onShow(func) {
		this.onShowCallback = func || null;
	}

    /**
     * Set new callback for onModalHide Event
     * @param {Function} func
     */
	set onHide(func) {
		this.onHideCallback = func || null;
	}

    /**
	 * Show dialog
     */
	show() {
		let target = this;
		
		target.modal_body = createElement('div', 'modal');

		if (target.__invert) {
			target.modal_body.classList.add('modal--invert');
		}

		target.modal = new Modal(target.modal_body, {
			onShow: target.onShowCallback,
			onHide: () => target.hide()
		});

		let modal_header = createElement('div', 'modal__header');
        modal_header.append(createElement('div', 'modal__title', '', {}, target.__title));

		let modal_content = createElement('div', 'modal__content', '', {}, target.__message);

		let modal_footer = createElement('div', 'modal__footer align-center');

		let modal_cancelButton = createElement('button', 'button modal__discard', '', {}, target.__failLabel);
		if (target.__invert) {
			modal_cancelButton.classList.add('button--color-black', 'modal__discard');
		} else {
			modal_cancelButton.classList.add('modal__discard');
		}

		if (target.onSuccessCallback) {
			let modal_okButton = createElement('button', 'button button--color-green modal__discard', '', {}, target.__successLabel);
			modal_okButton.onclick = function() {
				target.onSuccessCallback(target);
			};

			modal_footer.appendChild(modal_okButton);
		} else {
			modal_cancelButton.classList = 'button button--color-green modal__discard';
		}

		modal_footer.appendChild(modal_cancelButton);

		target.modal_body.appendChild(modal_header);
		target.modal_body.appendChild(modal_content);
		target.modal_body.appendChild(modal_footer);

		document.body.appendChild(target.modal_body);		

		modal_cancelButton.onclick = function() {
			if (target.onFailCallback) {
				target.onFailCallback(target);		
			}
		};

		target.modal.show();
	}

    /**
	 * Hide dialog
     */
	hide() {
		let target = this;

		if (target.onHideCallback) {
			target.onHideCallback(target);
		}

		setTimeout(() => {target.modal_body.remove();}, 300);
	}
}