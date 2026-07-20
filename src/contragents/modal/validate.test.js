import validate from './validate';

describe('validate', () => {
  it('returns errors for empty and invalid fields', () => {
    expect(
      validate({
        name: '',
        inn: '123',
        address: '',
        kpp: '12',
      }),
    ).toEqual({
      name: 'Введите наименование',
      address: 'Введите адрес',
      inn: 'ИНН должен содержать 11 цифр',
      kpp: 'КПП должен содержать 9 цифр',
    });
  });

  it('returns no errors for valid values', () => {
    expect(
      validate({
        name: 'ООО Тест',
        inn: '77012345678',
        address: 'Москва',
        kpp: '770101001',
      }),
    ).toEqual({});
  });
});
