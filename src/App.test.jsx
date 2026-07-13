import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { ContragentsProvider } from './context/ContragentsContext';

const initialData = [
  {
    id: '1',
    name: 'ООО «Ромашка»',
    inn: '77012345678',
    address: 'г. Москва, ул. Ленина, д. 1',
    kpp: '770101001',
  },
  {
    id: '2',
    name: 'АО «ТехноПром»',
    inn: '50098765432',
    address: 'г. Химки, ул. Заводская, д. 15',
    kpp: '500901001',
  },
  {
    id: '3',
    name: 'ИП Иванов И.И.',
    inn: '77234567890',
    address: 'г. Москва, пр-т Мира, д. 10',
    kpp: '772301001',
  },
];

function createFetchMock(seed = initialData) {
  let data = seed.map((item) => ({ ...item }));
  let nextId = 4;

  return jest.fn(async (url, options = {}) => {
    const method = (options.method || 'GET').toUpperCase();
    const path = String(url);

    if (method === 'GET' && path === '/contragents') {
      return {
        ok: true,
        status: 200,
        json: async () => data.map((item) => ({ ...item })),
      };
    }

    if (method === 'POST' && path === '/contragents') {
      const body = JSON.parse(options.body);
      const created = { ...body, id: String(nextId++) };
      data = [...data, created];
      return {
        ok: true,
        status: 201,
        json: async () => created,
      };
    }

    const match = path.match(/^\/contragents\/(.+)$/);
    if (match) {
      const id = match[1];

      if (method === 'PUT') {
        const body = JSON.parse(options.body);
        data = data.map((item) => (String(item.id) === String(id) ? body : item));
        return {
          ok: true,
          status: 200,
          json: async () => body,
        };
      }

      if (method === 'DELETE') {
        data = data.filter((item) => String(item.id) !== String(id));
        return {
          ok: true,
          status: 200,
          json: async () => ({}),
        };
      }
    }

    return {
      ok: false,
      status: 404,
      json: async () => ({}),
    };
  });
}

function renderApp() {
  return render(
    <ContragentsProvider>
      <App />
    </ContragentsProvider>,
  );
}

describe('App', () => {
  beforeEach(() => {
    global.fetch = createFetchMock();
  });

  it('renders logo and add button', async () => {
    renderApp();

    expect(screen.getByAltText('МойСклад')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Добавить/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('ООО «Ромашка»')).toBeInTheDocument();
    });
  });

  it('shows initial contragents in the table', async () => {
    renderApp();

    await waitFor(() => {
      expect(screen.getByText('ООО «Ромашка»')).toBeInTheDocument();
    });
    expect(screen.getByText('АО «ТехноПром»')).toBeInTheDocument();
    expect(screen.getByText('ИП Иванов И.И.')).toBeInTheDocument();
  });

  it('adds a contragent through the modal', async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText('ООО «Ромашка»')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Добавить/i }));
    await user.type(screen.getByLabelText('Наименование'), 'ООО Новый');
    await user.type(screen.getByLabelText('ИНН'), '12345678901');
    await user.type(screen.getByLabelText('Адрес'), 'Санкт-Петербург');
    await user.type(screen.getByLabelText('КПП'), '123456789');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() => {
      expect(screen.getByText('ООО Новый')).toBeInTheDocument();
    });
    expect(screen.queryByRole('heading', { name: 'Контрагент' })).not.toBeInTheDocument();
  });

  it('edits a contragent on row double click', async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText('ООО «Ромашка»')).toBeInTheDocument();
    });

    await user.dblClick(screen.getByText('ООО «Ромашка»').closest('tr'));
    const nameInput = screen.getByLabelText('Наименование');
    await user.clear(nameInput);
    await user.type(nameInput, 'ООО Ромашка Обновлённая');
    await user.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() => {
      expect(screen.getByText('ООО Ромашка Обновлённая')).toBeInTheDocument();
    });
    expect(screen.queryByText('ООО «Ромашка»')).not.toBeInTheDocument();
  });

  it('does not change data when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText('ООО «Ромашка»')).toBeInTheDocument();
    });

    await user.dblClick(screen.getByText('ООО «Ромашка»').closest('tr'));
    await user.clear(screen.getByLabelText('Наименование'));
    await user.type(screen.getByLabelText('Наименование'), 'Не должно сохраниться');
    await user.click(screen.getByRole('button', { name: 'Отменить' }));

    expect(screen.getByText('ООО «Ромашка»')).toBeInTheDocument();
    expect(screen.queryByText('Не должно сохраниться')).not.toBeInTheDocument();
  });

  it('deletes a contragent from the table', async () => {
    const user = userEvent.setup();
    renderApp();

    await waitFor(() => {
      expect(screen.getByText('ООО «Ромашка»')).toBeInTheDocument();
    });

    const row = screen.getByText('ООО «Ромашка»').closest('tr');
    await user.click(within(row).getByRole('button', { name: 'Удалить' }));

    await waitFor(() => {
      expect(screen.queryByText('ООО «Ромашка»')).not.toBeInTheDocument();
    });
  });
});
