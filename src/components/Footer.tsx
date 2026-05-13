import { Trans } from 'react-i18next'
import styles from './Footer.module.css'

const Footer = () => (
  <footer className={styles.wrapper}>
    <Trans i18nKey="footer.copyright">Copyright © 2018 by</Trans>{' '}
    <a href="https://github.com/paulo-raoni">Paulo Raoni</a>
  </footer>
)

export default Footer
