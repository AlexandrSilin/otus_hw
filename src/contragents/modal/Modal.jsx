import { useEffect, useState } from 'react';
import styles from './Modal.module.css';

const emptyForm = {
  id: null,
  name: '',
  inn: '',
  address: '',
  kpp: '',
};

function toFormState(contragent) {
  if (!contragent) {
    return emptyForm;
  }

  return {
    id: contragent.id,
    name: contragent.name,
    inn: contragent.inn,
    address: contragent.address,
    kpp: contragent.kpp,
  };
}

export default function Modal({ isOpen, contragent = null, onSave, onCancel }) {
  const [form, setForm] = useState(() => toFormState(contragent));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setErrors({});
    setForm(toFormState(contragent));
  }, [isOpen, contragent]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = true;
    }

    if (!form.address.trim()) {
      nextErrors.address = true;
    }

    if (!/^\d{11}$/.test(form.inn.trim())) {
      nextErrors.inn = 'ИНН должен содержать 11 цифр';
    }

    if (!/^\d{9}$/.test(form.kpp.trim())) {
      nextErrors.kpp = 'КПП должен содержать 9 цифр';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSave({
      id: form.id,
      name: form.name.trim(),
      inn: form.inn.trim(),
      address: form.address.trim(),
      kpp: form.kpp.trim(),
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onCancel} />
      <div className={styles.dialog} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h3 className={styles.title}>Контрагент</h3>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onCancel}
            aria-label="Закрыть"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="contragent-name">Наименование</label>
            <input
              id="contragent-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? styles.invalid : undefined}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="contragent-inn">ИНН</label>
            <input
              id="contragent-inn"
              name="inn"
              value={form.inn}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={11}
              className={errors.inn ? styles.invalid : undefined}
            />
            {errors.inn && <p className={styles.error}>{errors.inn}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="contragent-address">Адрес</label>
            <input
              id="contragent-address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className={errors.address ? styles.invalid : undefined}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="contragent-kpp">КПП</label>
            <input
              id="contragent-kpp"
              name="kpp"
              value={form.kpp}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={9}
              className={errors.kpp ? styles.invalid : undefined}
            />
            {errors.kpp && <p className={styles.error}>{errors.kpp}</p>}
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveButton}>
              Сохранить
            </button>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
