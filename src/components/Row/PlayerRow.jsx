import React from 'react';
import PropTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// components
import Spring from '@components/Spring';
import { StyledRow } from '@components/TeamScoreRow';
import { ReactComponent as SubstitutionIcon } from '@assets/icons/substitution.svg';
// hooks
import { useThemeProvider } from '@contexts/themeContext';
// styling
import styled from 'styled-components/macro';
import styles from './styles.module.scss';

// Styled component for PlayerRow
const StyledPlayerRow = styled(StyledRow)`
    /* Image styling for both LTR and RTL directions */
    &.ltr .media img,
    &.rtl .media img {
        height: 30px;
        width: auto;
        margin-right: 3px;
    }

    /* Captain-specific border color */
    .media img[data-captain="true"] {
        border-color: var(--turquoise);
    }

    /* Main content styling */
    .main {
        display: flex;
        align-items: center;
        padding: 0 8px;
        border: 1px solid var(--border);
        background: transparent;
    }

    /* Icon styling */
    .icon {
        animation: rotate-center 3s ease-in-out infinite;
    }
`;

// PlayerRow component
const PlayerRow = ({ player, index, onClick }) => {
    const { direction } = useThemeProvider();

    const handleClick = () => {
        console.log(`PlayerRow clicked: ${player.name}`); // Debugging
        onClick(); // Trigger the click event
    };

    return (
        <Spring index={index} type="slideUp">
            <StyledPlayerRow className={`${direction} reverse label h5`} onClick={handleClick} style={{ cursor: 'pointer' }}>
                <div className="media">
                    <LazyLoadImage
                        className={styles.playerImg}
                        src={player.image}
                        alt={player.name}
                        data-captain={player.isCaptain}
                    />
                </div>
                <div className="main d-flex align-items-center justify-content-between">
                    {player.name} ({player.number})

                    <div>
                        {player.yellow_card >=  1 && (
                            <span key={player.id} className={`${styles.karte} ${styles.yellow} ${styles[direction]}`} />
                        )}

                        {player.red_card >=  1 && (
                            <span key={player.id} className={`${styles.karte} ${styles.red} ${styles[direction]}`} />
                        )}

                        {player.red_yellow_card == 1 && (
                            <span key={player.id} className={`${styles.karte} ${styles.red} ${styles[direction]}`} />
                        )}

                    </div>

                    {/*{player.substitutes && <SubstitutionIcon className="icon" />}*/}
                </div>
            </StyledPlayerRow>
        </Spring>
    );
};

PlayerRow.propTypes = {
    player: PropTypes.shape({
        name: PropTypes.string.isRequired,
        number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        image: PropTypes.string.isRequired,
        isCaptain: PropTypes.bool,
        yellow_card: PropTypes.bool,
        substitutes: PropTypes.bool, // assuming this is a boolean
    }).isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired, // Ensure onClick is passed as a required function
};

export default PlayerRow;
