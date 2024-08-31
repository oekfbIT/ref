// styling
import styles from './styles.module.scss';

// hooks
import {useThemeProvider} from '@contexts/themeContext';

const Search = () => {
    const {theme} = useThemeProvider();

    return (
        <form className={`${styles.search} ${styles[theme]}`}>
            <input className="text-12" type="search" id="globalSearch" placeholder="Search …"/>
            <label htmlFor="globalSearch">
                <i className="icon-search"/>
            </label>
        </form>
    )
}

export default Search