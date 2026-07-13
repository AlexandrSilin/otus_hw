import { useState } from 'react';
import Modal from './contragents/modal/Modal';
import Table from './contragents/table/Table';
import logo from './assets/logo.png';
import styles from './App.module.css';

const initialContragents = [
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

export default function App() {
  const [contragents, setContragents] = useState(initialContragents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContragent, setEditingContragent] = useState(null);
  const [nextId, setNextId] = useState(4);

  const handleAdd = () => {
    setEditingContragent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    const contragent = contragents.find((item) => item.id === id) ?? null;
    setEditingContragent(contragent);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingContragent(null);
  };

  const handleSave = (data) => {
    if (data.id) {
      setContragents((prev) =>
        prev.map((item) => (item.id === data.id ? { ...data } : item)),
      );
    } else {
      setContragents((prev) => [...prev, { ...data, id: String(nextId) }]);
      setNextId((prev) => prev + 1);
    }

    setIsModalOpen(false);
    setEditingContragent(null);
  };

  const handleDelete = (id) => {
    setContragents((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <a href="#" className={styles.logoLink}>
            <img src={logo} className={styles.logo} alt="МойСклад" />
          </a>
          <button type="button" className={styles.addButton} onClick={handleAdd}>
            <span className={styles.addIcon} aria-hidden="true">
              +
            </span>
            Добавить
          </button>
        </nav>
      </header>

      <main className={styles.main}>
        <Table
          contragents={contragents}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </main>

      <Modal
        isOpen={isModalOpen}
        contragent={editingContragent}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
