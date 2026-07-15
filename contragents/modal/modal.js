export class ContragentsModal {
    constructor(root, { onSave }) {
        this.root = root;
        this.onSave = onSave;
        this.modal = null;
        this.form = null;
        this.fields = {};
        this.errors = {};
    }

    async init() {
        const response = await fetch('contragents/modal/modal.html');
        this.root.innerHTML = await response.text();

        this.modal = this.root.querySelector('#contragent-modal');
        this.form = this.root.querySelector('#contragent-form');
        this.fields = {
            id: this.root.querySelector('#contragent-id'),
            name: this.root.querySelector('#contragent-name'),
            inn: this.root.querySelector('#contragent-inn'),
            address: this.root.querySelector('#contragent-address'),
            kpp: this.root.querySelector('#contragent-kpp'),
        };
        this.errors = {
            inn: this.root.querySelector('#inn-error'),
            kpp: this.root.querySelector('#kpp-error'),
        };

        this.root.querySelectorAll('[data-modal-cancel]').forEach((element) => {
            element.addEventListener('click', () => this.close());
        });

        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });
    }

    open(contragent = null) {
        this.clearErrors();
        this.form.reset();

        if (contragent) {
            this.fields.id.value = contragent.id;
            this.fields.name.value = contragent.name;
            this.fields.inn.value = contragent.inn;
            this.fields.address.value = contragent.address;
            this.fields.kpp.value = contragent.kpp;
        } else {
            this.fields.id.value = '';
        }

        this.modal.classList.remove('hidden');
        this.fields.name.focus();
    }

    close() {
        this.modal.classList.add('hidden');
        this.clearErrors();
        this.form.reset();
    }

    handleSubmit() {
        const data = {
            id: this.fields.id.value || null,
            name: this.fields.name.value.trim(),
            inn: this.fields.inn.value.trim(),
            address: this.fields.address.value.trim(),
            kpp: this.fields.kpp.value.trim(),
        };

        if (!this.validate(data)) {
            return;
        }

        this.onSave(data);
        this.close();
    }

    validate(data) {
        this.clearErrors();
        let isValid = true;

        if (!data.name) {
            this.fields.name.classList.add('invalid');
            isValid = false;
        }

        if (!data.address) {
            this.fields.address.classList.add('invalid');
            isValid = false;
        }

        if (!/^\d{11}$/.test(data.inn)) {
            this.showError('inn', 'ИНН должен содержать 11 цифр');
            isValid = false;
        }

        if (!/^\d{9}$/.test(data.kpp)) {
            this.showError('kpp', 'КПП должен содержать 9 цифр');
            isValid = false;
        }

        return isValid;
    }

    showError(field, message) {
        this.errors[field].textContent = message;
        this.errors[field].classList.remove('hidden');
        this.fields[field].classList.add('invalid');
    }

    clearErrors() {
        Object.keys(this.errors).forEach((field) => {
            this.errors[field].textContent = '';
            this.errors[field].classList.add('hidden');
        });

        Object.values(this.fields).forEach((field) => {
            field.classList.remove('invalid');
        });
    }
}
