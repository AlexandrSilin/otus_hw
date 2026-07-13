import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Table from './Table';

const contragents = [
  {
    id: '1',
    name: 'ООО Ромашка',
    inn: '77012345678',
    address: 'Москва',
    kpp: '770101001',
  },
  {
    id: '2',
    name: 'АО ТехноПром',
    inn: '50098765432',
    address: 'Химки',
    kpp: '500901001',
  },
];

describe('Table', () => {
  it('renders columns and contragent rows', () => {
    render(<Table contragents={contragents} onDelete={jest.fn()} onEdit={jest.fn()} />);

    expect(screen.getByText('Наименование')).toBeInTheDocument();
    expect(screen.getByText('ИНН')).toBeInTheDocument();
    expect(screen.getByText('Адрес')).toBeInTheDocument();
    expect(screen.getByText('КПП')).toBeInTheDocument();
    expect(screen.getByText('ООО Ромашка')).toBeInTheDocument();
    expect(screen.getByText('АО ТехноПром')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Удалить' })).toHaveLength(2);
  });

  it('calls onDelete with row id', async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(<Table contragents={contragents} onDelete={onDelete} onEdit={jest.fn()} />);
    await user.click(screen.getAllByRole('button', { name: 'Удалить' })[0]);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('calls onEdit with row id on double click', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();

    const { container } = render(
      <Table contragents={contragents} onDelete={jest.fn()} onEdit={onEdit} />,
    );
    await user.dblClick(container.querySelector('tbody tr'));

    expect(onEdit).toHaveBeenCalledWith('1');
  });
});
