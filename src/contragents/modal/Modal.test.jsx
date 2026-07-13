import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  it('renders title and form fields when open', () => {
    render(<Modal isOpen onSave={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.getByRole('heading', { name: 'Контрагент' })).toBeInTheDocument();
    expect(screen.getByLabelText('Наименование')).toBeInTheDocument();
    expect(screen.getByLabelText('ИНН')).toBeInTheDocument();
    expect(screen.getByLabelText('Адрес')).toBeInTheDocument();
    expect(screen.getByLabelText('КПП')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отменить' })).toBeInTheDocument();
  });

  it('does not render form when closed', () => {
    render(<Modal isOpen={false} onSave={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.queryByRole('heading', { name: 'Контрагент' })).not.toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();

    render(<Modal isOpen onSave={jest.fn()} onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: 'Отменить' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSave with form data for a new contragent', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(<Modal isOpen onSave={onSave} onCancel={jest.fn()} />);

    await user.type(screen.getByLabelText('Наименование'), 'ООО Тест');
    await user.type(screen.getByLabelText('ИНН'), '77012345678');
    await user.type(screen.getByLabelText('Адрес'), 'Москва');
    await user.type(screen.getByLabelText('КПП'), '770101001');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(onSave).toHaveBeenCalledWith({
      id: null,
      name: 'ООО Тест',
      inn: '77012345678',
      address: 'Москва',
      kpp: '770101001',
    });
  });

  it('fills fields when editing an existing contragent', () => {
    const contragent = {
      id: '1',
      name: 'ООО Ромашка',
      inn: '77012345678',
      address: 'Москва',
      kpp: '770101001',
    };

    render(
      <Modal isOpen contragent={contragent} onSave={jest.fn()} onCancel={jest.fn()} />,
    );

    expect(screen.getByLabelText('Наименование')).toHaveValue('ООО Ромашка');
    expect(screen.getByLabelText('ИНН')).toHaveValue('77012345678');
    expect(screen.getByLabelText('Адрес')).toHaveValue('Москва');
    expect(screen.getByLabelText('КПП')).toHaveValue('770101001');
  });

  it('shows validation errors for invalid inn and kpp', async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(<Modal isOpen onSave={onSave} onCancel={jest.fn()} />);

    await user.type(screen.getByLabelText('Наименование'), 'ООО Тест');
    await user.type(screen.getByLabelText('ИНН'), '123');
    await user.type(screen.getByLabelText('Адрес'), 'Москва');
    await user.type(screen.getByLabelText('КПП'), '12');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByText('ИНН должен содержать 11 цифр')).toBeInTheDocument();
    expect(screen.getByText('КПП должен содержать 9 цифр')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});
