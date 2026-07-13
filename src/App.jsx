import { useState } from 'react';
import Modal from './contragents/modal/Modal';
import Table from './contragents/table/Table';
import { useContragents } from './context/ContragentsContext';
import logo from './assets/logo.png';
import styles from './App.module.css';

export default function App() {
  const {
    contragents,
    loading,
    error,
    addContragent,
    editContragent,
    removeContragent,
  } = useContragents();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContragent, setEditingContragent] = useState(null);

  const handleAdd = () => {
    setEditingContragent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    const contragent = contragents.find((item) => String(item.id) === String(id)) ?? null;
    setEditingContragent(contragent);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingContragent(null);
  };

  const handleSave = async (data) => {
    if (data.id) {
      await editContragent(data);
    } else {
      await addContragent(data);
    }

    setIsModalOpen(false);
    setEditingContragent(null);
  };

  const handleDelete = async (id) => {
    await removeContragent(id);
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
        {loading && <p>Загрузка...</p>}
        {error && <p>Ошибка: {error}</p>}
        {!loading && !error && (
          <Table
            contragents={contragents}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
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
