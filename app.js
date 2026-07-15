import { ContragentsTable } from './contragents/table/table.js';
import { ContragentsModal } from './contragents/modal/modal.js';

const contragents = [
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

let nextId = 4;

const table = new ContragentsTable(document.getElementById('table-root'), {
    onDelete: deleteContragent,
    onEdit: editContragent,
});

const modal = new ContragentsModal(document.getElementById('modal-root'), {
    onSave: saveContragent,
});

async function init() {
    await Promise.all([table.init(), modal.init()]);

    document.getElementById('add-contragent-btn').addEventListener('click', () => {
        modal.open();
    });

    table.render(contragents);
}

function saveContragent(data) {
    if (data.id) {
        const index = contragents.findIndex((item) => item.id === data.id);
        if (index !== -1) {
            contragents[index] = { ...data };
        }
    } else {
        contragents.push({
            ...data,
            id: String(nextId++),
        });
    }

    table.render(contragents);
}

function deleteContragent(id) {
    const index = contragents.findIndex((item) => item.id === id);
    if (index !== -1) {
        contragents.splice(index, 1);
        table.render(contragents);
    }
}

function editContragent(id) {
    const contragent = contragents.find((item) => item.id === id);
    if (contragent) {
        modal.open(contragent);
    }
}

init();
