import { Form, Field } from 'react-final-form';
import validate from './validate';
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

function TextField({
  id,
  name,
  label,
  inputMode,
  maxLength,
}) {
  return (
    <Field name={name}>
      {({ input, meta }) => {
        const showError = meta.error && (meta.touched || meta.submitFailed);

        return (
          <div className={styles.field}>
            <label htmlFor={id}>{label}</label>
            <input
              {...input}
              id={id}
              inputMode={inputMode}
              maxLength={maxLength}
              className={showError ? styles.invalid : undefined}
            />
            {showError && <p className={styles.error}>{meta.error}</p>}
          </div>
        );
      }}
    </Field>
  );
}

export default function Modal({ isOpen, contragent = null, onSave, onCancel }) {
  if (!isOpen) {
    return null;
  }

  const handleSubmit = (values) => {
    onSave({
      id: values.id ?? null,
      name: values.name.trim(),
      inn: values.inn.trim(),
      address: values.address.trim(),
      kpp: values.kpp.trim(),
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

        <Form
          key={contragent?.id ?? 'new'}
          onSubmit={handleSubmit}
          initialValues={toFormState(contragent)}
          validate={validate}
          render={({ handleSubmit: submit }) => (
            <form className={styles.form} onSubmit={submit} noValidate>
              <Field name="id" render={({ input }) => <input {...input} type="hidden" />} />

              <TextField id="contragent-name" name="name" label="Наименование" />
              <TextField
                id="contragent-inn"
                name="inn"
                label="ИНН"
                inputMode="numeric"
                maxLength={11}
              />
              <TextField id="contragent-address" name="address" label="Адрес" />
              <TextField
                id="contragent-kpp"
                name="kpp"
                label="КПП"
                inputMode="numeric"
                maxLength={9}
              />

              <div className={styles.actions}>
                <button type="submit" className={styles.saveButton}>
                  Сохранить
                </button>
                <button type="button" className={styles.cancelButton} onClick={onCancel}>
                  Отменить
                </button>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  );
}
