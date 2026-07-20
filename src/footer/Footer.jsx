import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>
          © {new Date().getFullYear()} МойСклад. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}
