import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './PlayerKaderInfo.module.scss';
import Spring from '@components/Spring';
import { useThemeProvider } from '@contexts/themeContext';
import { LazyLoadImage } from "react-lazy-load-image-component";

// Function to format the nationality string for German characters
const formatNationality = (nationality) => {
    return nationality
        .toLowerCase() // Convert to lowercase
        .replace(/ä/g, 'ae') // Replace ä with ae
        .replace(/ö/g, 'oe') // Replace ö with oe
        .replace(/ü/g, 'ue') // Replace ü with ue
        .replace(/ß/g, 'ss') // Replace ß with ss
        .replace(/ /g, '') // Remove spaces
        .replace(/[^a-z]/g, ''); // Remove any non-alphabetical characters
};

const getEligibilityClass = (eligibility) => {
    switch (eligibility) {
        case 'Spielberechtigt':
            return styles.eligible;
        case 'Gesperrt':
            return styles.suspended;
        case 'Warten':
            return styles.waiting;
        default:
            return '';
    }
};

const PlayerKaderInfo = ({ player }) => {
    const { direction } = useThemeProvider();
    const formattedNationality = formatNationality(player.nationality);

    const getImageSrc = () => {
        if (player.eligibility === 'Warten') {
            return 'https://firebasestorage.googleapis.com/v0/b/oekfbbucket.appspot.com/o/adminfiles%2FpendingPlayer.png?alt=media&token=b504ecd3-3c5d-4f88-b629-e901c51f5bb4';
        }
        return player.image;
    };

    return (
        <Spring className={`card ${styles.card} ${styles[direction]}`}>
            <div className={styles.wrapper}>
                <div className={styles.textContent}>
                    <div className={styles.numberBox}>
                        <span className={styles.playerNumber}>{player.number ? player.number : '?'}</span>
                    </div>
                    <div className={styles.playerInfo}>
                        <h2 className={styles.playerName}>{player.name}</h2>
                        <div className={styles.nationalityRow}>
                            <img
                                src={`https://www.zeitzonen.de/templates/2014/dist/images/flags/${formattedNationality}.svg`}
                                alt={player.nationality}
                                className={styles.flagImage}
                            />
                            <span>{player.nationality}</span>
                        </div>
                        <p className={`${styles.playerPosition} ${getEligibilityClass(player.eligibility)}`}>
                            {player.eligibility}
                        </p>
                        <p className={styles.playerPosition}>{player.position}</p>
                        <Link
                            to={`/kader/spieler-detail/${player.id}`}
                            style={{ fontWeight: 500, textDecoration: 'underline' }}
                        >
                            Spieler Bearbeiten
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.imageWrapper}>
                <LazyLoadImage
                    className={styles.playerImage}
                    src={getImageSrc()}
                    alt={player.name}
                />
            </div>
        </Spring>
    );
};

PlayerKaderInfo.propTypes = {
    player: PropTypes.shape({
        number: PropTypes.string,
        name: PropTypes.string.isRequired,
        nationality: PropTypes.string.isRequired,
        eligibility: PropTypes.string.isRequired,
        position: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
};

export default PlayerKaderInfo;
