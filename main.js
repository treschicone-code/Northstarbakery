
function createOrderButton() {
	const orderButton = document.createElement('a');

	orderButton.id = 'northstar-order-button';
	orderButton.href = 'contact.html';
	orderButton.textContent = 'Order Now';
	orderButton.setAttribute('aria-label', 'Go to the contact us form to place an order');
	applyOrderButtonStyles(orderButton);
	addOrderButtonHoverEffects(orderButton);

	return orderButton;
}

function applyOrderButtonStyles(orderButton) {
	orderButton.style.cssText = `
		position: fixed;
		right: 1.25rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1000;
		padding: 0.85rem 1.1rem;
		border-radius: 999px;
		background: #8b4513;
		color: #fff;
		font: 600 1rem/1.2 sans-serif;
		text-decoration: none;
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		transition: background 0.2s ease, transform 0.2s ease;
	`;
}

function addOrderButtonHoverEffects(orderButton) {
	orderButton.addEventListener('mouseenter', () => {
		orderButton.style.background = '#6f350f';
		orderButton.style.transform = 'translateY(-50%) scale(1.05)';
	});

	orderButton.addEventListener('mouseleave', () => {
		orderButton.style.background = '#8b4513';
		orderButton.style.transform = 'translateY(-50%)';
	});
}

function addOrderButtonToPage() {
	if (!document.body || document.getElementById('northstar-order-button')) return;
	document.body.appendChild(createOrderButton());
}

function addFormValidation() {
	const form = document.querySelector('form');
	if (!form) return;

	const savedFormValuesKey = 'northstarbakery-form-values';

	const fields = Array.from(form.querySelectorAll('input, textarea, select'))
		.filter((field) => field.type !== 'submit' && field.type !== 'button' && field.type !== 'hidden');

	try {
		const savedValues = JSON.parse(localStorage.getItem(savedFormValuesKey) || '{}');
		fields.forEach((field) => {
			if (field.name && savedValues[field.name] !== undefined && !field.value) {
				field.value = savedValues[field.name];
			}
		});
	} catch (error) {
		// Ignore unavailable or invalid saved form data.
	}

	const saveFormValues = () => {
		const values = {};
		fields.forEach((field) => {
			if (field.name) values[field.name] = field.value;
		});
		try {
			localStorage.setItem(savedFormValuesKey, JSON.stringify(values));
		} catch (error) {
			// Ignore unavailable browser storage.
		}
	};

	const getErrorMessage = (field) => {
		if (field.validity.valueMissing) return 'Please fill out this field.';
		if (field.validity.typeMismatch) return 'Please enter a valid email address.';
		if (field.validity.tooShort) return `Please enter at least ${field.minLength} characters.`;
		if (field.validity.patternMismatch) return 'Please use the requested format.';
		return 'Please check this field.';
	};

	const showFieldError = (field) => {
		let error = document.getElementById(`${field.id || field.name}-error`);
		if (!error) {
			error = document.createElement('div');
			error.id = `${field.id || field.name}-error`;
			error.className = 'field-error';
			error.setAttribute('role', 'alert');
			error.setAttribute('aria-live', 'polite');
			error.style.cssText = 'margin-top: 0.25rem; color: #b00020; font-size: 0.9rem;';
			field.insertAdjacentElement('afterend', error);
		}
		error.textContent = getErrorMessage(field);
		field.setAttribute('aria-invalid', 'true');
		field.setAttribute('aria-describedby', error.id);
	};

	const clearFieldError = (field) => {
		const error = document.getElementById(`${field.id || field.name}-error`);
		if (error) error.remove();
		field.removeAttribute('aria-invalid');
		field.removeAttribute('aria-describedby');
	};

	fields.forEach((field) => {
		field.addEventListener('input', () => {
			saveFormValues();
			if (field.checkValidity()) clearFieldError(field);
		});
		field.addEventListener('change', saveFormValues);
		field.addEventListener('blur', () => {
			if (!field.checkValidity()) showFieldError(field);
		});
	});

	form.addEventListener('submit', (event) => {
		let firstInvalidField = null;
		fields.forEach((field) => {
			if (!field.checkValidity()) {
				showFieldError(field);
				if (!firstInvalidField) firstInvalidField = field;
			} else {
				clearFieldError(field);
			}
		});

		if (firstInvalidField) {
			event.preventDefault();
			firstInvalidField.focus();
		}
	});
}

function initializePage() {
	try {
		addOrderButtonToPage();
	} catch (error) {
		// Keep the page usable if the optional order button cannot be created.
	}

	try {
		addFormValidation();
	} catch (error) {
		// Keep the page usable if optional form validation fails.
	}
}

if (typeof document !== 'undefined') {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initializePage, { once: true });
	} else {
		initializePage();
	}
}

