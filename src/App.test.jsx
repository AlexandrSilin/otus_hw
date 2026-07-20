import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders logo, add button and footer', () => {
    render(<App />);

    expect(screen.getByAltText('МойСклад')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Добавить/i })).toBeInTheDocument();
    expect(
      screen.getByText(`© ${new Date().getFullYear()} МойСклад. All Rights Reserved.`),
    ).toBeInTheDocument();
  });

  it('shows initial contragents in the table', () => {
    render(<App />);

    expect(screen.getByText('ООО «Ромашка»')).toBeInTheDocument();
    expect(screen.getByText('АО «ТехноПром»')).toBeInTheDocument();
    expect(screen.getByText('ИП Иванов И.И.')).toBeInTheDocument();
  });

  it('adds a contragent through the modal', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Добавить/i }));
    await user.type(screen.getByLabelText('Наименование'), 'ООО Новый');
    await user.type(screen.getByLabelText('ИНН'), '12345678901');
    await user.type(screen.getByLabelText('Адрес'), 'Санкт-Петербург');
    await user.type(screen.getByLabelText('КПП'), '123456789');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByText('ООО Новый')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Контрагент' })).not.toBeInTheDocument();
  });

  it('edits a contragent on row double click', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.dblClick(screen.getByText('ООО «Ромашка»').closest('tr'));
    const nameInput = screen.getByLabelText('Наименование');
    await user.clear(nameInput);
    await user.type(nameInput, 'ООО Ромашка Обновлённая');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(screen.getByText('ООО Ромашка Обновлённая')).toBeInTheDocument();
    expect(screen.queryByText('ООО «Ромашка»')).not.toBeInTheDocument();
  });

  it('does not change data when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.dblClick(screen.getByText('ООО «Ромашка»').closest('tr'));
    await user.clear(screen.getByLabelText('Наименование'));
    await user.type(screen.getByLabelText('Наименование'), 'Не должно сохраниться');
    await user.click(screen.getByRole('button', { name: 'Отменить' }));

    expect(screen.getByText('ООО «Ромашка»')).toBeInTheDocument();
    expect(screen.queryByText('Не должно сохраниться')).not.toBeInTheDocument();
  });

  it('deletes a contragent from the table', async () => {
    const user = userEvent.setup();
    render(<App />);

    const row = screen.getByText('ООО «Ромашка»').closest('tr');
    await user.click(within(row).getByRole('button', { name: 'Удалить' }));

    expect(screen.queryByText('ООО «Ромашка»')).not.toBeInTheDocument();
  });
});
