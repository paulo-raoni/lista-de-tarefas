import { useTranslation } from 'react-i18next'
import styles from './Footer.module.css'

const START_YEAR = 2018

const Footer = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.wrapper}>
      {t('footer.copyright', { startYear: START_YEAR, currentYear })}{' '}
      <a href="https://github.com/paulo-raoni">Paulo Raoni</a>
    </footer>
  )
}

export default Footer
