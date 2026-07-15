export class ContragentsTable {
    constructor(root, { onDelete, onEdit }) {
        this.root = root;
        this.onDelete = onDelete;
        this.onEdit = onEdit;
        this.tbody = null;
    }

    async init() {
        const response = await fetch('contragents/table/table.html');
        this.root.innerHTML = await response.text();
        this.tbody = this.root.querySelector('#contragents-tbody');
    }

    render(contragents) {
        this.tbody.innerHTML = contragents.map((item) => `
            <tr class="bg-white border-b" data-id="${item.id}">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    ${escapeHtml(item.name)}
                </th>
                <td class="px-6 py-4">${escapeHtml(item.inn)}</td>
                <td class="px-6 py-4">${escapeHtml(item.address)}</td>
                <td class="px-6 py-4">${escapeHtml(item.kpp)}</td>
                <td class="px-6 py-4">
                    <button type="button" class="delete-btn font-medium text-red-600 hover:underline">
                        Удалить
                    </button>
                </td>
            </tr>
        `).join('');

        this.tbody.querySelectorAll('tr').forEach((row) => {
            const id = row.dataset.id;

            row.addEventListener('dblclick', () => {
                this.onEdit(id);
            });

            row.querySelector('.delete-btn').addEventListener('click', (event) => {
                event.stopPropagation();
                this.onDelete(id);
            });
        });
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
}
