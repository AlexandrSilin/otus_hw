import styles from './Table.module.css';

export default function Table({ contragents, onDelete, onEdit }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Наименование</th>
            <th>ИНН</th>
            <th>Адрес</th>
            <th>КПП</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {contragents.map((item) => (
            <tr key={item.id} onDoubleClick={() => onEdit(item.id)}>
              <th scope="row">{item.name}</th>
              <td>{item.inn}</td>
              <td>{item.address}</td>
              <td>{item.kpp}</td>
              <td>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(item.id);
                  }}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
