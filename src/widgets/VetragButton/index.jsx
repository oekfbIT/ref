// styling
import styles from './styles.module.scss';

// components
import Spring from '@components/Spring';
import LazyImage from '@components/LazyImage';

// hooks
import {useThemeProvider} from '@contexts/themeContext';

// assets
import logo from '@assets/logo.svg';

const VetragButton = () => {
    const {direction} = useThemeProvider();

    return (
        <Spring className={`${styles.wrapper} card h-1`}>
            <div className={`${styles.main} ${styles[direction]}`}>
                <div className="d-flex flex-column g-8">
                    <span className="text-12">Administrations Kopie</span>
                    <h3 className={styles.main_title}>Bitte Laden sie ihre Kopie des unterzeichneten Vetrags herunterladen.</h3>
                </div>
                <button className="btn btn--sm">Download</button>
            </div>
            <LazyImage style={{ objectFit: 'contain' }} className={styles.media} src={logo} alt="Logo" />

        </Spring>
    )
}

export default VetragButton