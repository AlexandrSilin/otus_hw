export default function validate(values) {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = 'Введите наименование';
  }

  if (!values.address?.trim()) {
    errors.address = 'Введите адрес';
  }

  if (!/^\d{11}$/.test((values.inn || '').trim())) {
    errors.inn = 'ИНН должен содержать 11 цифр';
  }

  if (!/^\d{9}$/.test((values.kpp || '').trim())) {
    errors.kpp = 'КПП должен содержать 9 цифр';
  }

  return errors;
}
