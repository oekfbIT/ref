import React from 'react';
import styles from './styles.module.scss';
import Spring from '@components/Spring';
import Score from '@ui/Score';
import PropTypes from 'prop-types';

const RefereeMatchCard = ({ match, index, variant = 'basic' }) => {
    const homeTeam = match?.home_blanket || {};  // Adjusted to match the API response structure
    const awayTeam = match?.away_blanket || {};  // Adjusted to match the API response structure

    // Function to format the date
    const formatDate = (dateString) => {
        if (!dateString) return 'Nicht Zugeornet';

        const datePart = dateString.split('T')[0]; // "2024-11-17"
        const timePart = dateString.split('T')[1]?.replace('Z', ''); // Safely handle cases where time might be missing

        if (!datePart || !timePart) return 'Invalid Date'; // Fallback in case of missing parts

        // Split the date part into year, month, and day
        const [year, month, day] = datePart.split('-');

        // Extract the hours and minutes from the time part
        const [hour, minute] = timePart.split(':');

        // Format the date and time in 'dd.mm.yyyy hh:mm' format
        return `${day}.${month}.${year} ${hour}:${minute}`;
    };

    // Match status logic
    const matchStatus = (matchData) => {
        if (!matchData) return 'Status Unbekannt';
        const { status } = matchData;

        switch (status) {
            case 'pending':
                return "Spielvorschau";
            case 'first':
                return "1. Halbzeit";
            case 'halftime':
                return "Halbzeit";
            case 'second':
                return "2. Halbzeit";
            case 'completed':
                return "Spielbericht Offen";
            case 'submitted':
                return "Spiel Eingereicht";
            case 'done':
                return "Spiel Abgeschlossen und Verrechnet";
            default:
                return "Status Unbekannt";
        }
    };

    return (
        <Spring className={`${styles.container}`} type="slideUp" index={index}>
            <div
                className={"card-padded d-flex flex-column g-20"}
                style={{ paddingBottom: variant !== 'extended' ? 'var(--card-padding)' : 10, cursor: 'pointer' }} // Added cursor style here
                onClick={() => (window.location.href = `/matches/${match.id}`)}
            >
                <div className="d-flex align-items-center justify-content-between p-relative">
                    <img className="club-logo" src={homeTeam.logo || ''} alt={homeTeam.name || 'Home Team'} />
                    <Score team1={match?.score?.home || 0} team2={match?.score?.away || 0} variant="alt" />
                    <img className="club-logo" src={awayTeam.logo || ''} alt={awayTeam.name || 'Away Team'} />
                </div>
                <div className="d-flex justify-content-between g-30">
                    <div style={{ minWidth: 0, maxWidth: "100px" }}>
                        <h5 className={styles.h5}>{homeTeam.name || 'Home Team'}</h5>
                    </div>

                    <div>
                        <h4 style={{ color: "orange", textAlign: "center" }} className="text-12 text-overflow">Status:</h4>
                        <h2 style={{ textAlign: "center", maxWidth: "150px", height: "auto" }} className="text-12 text-overflow">
                            {matchStatus(match)}
                        </h2>
                    </div>

                    <div className="text-right" style={{ minWidth: 0, maxWidth: "100px", textAlign: "right" }}>
                        <h5 className={styles.h5}>{awayTeam.name || 'Away Team'}</h5>
                    </div>
                </div>

                <div className="d-flex justify-content-center g-30">
                    <img className="club-dress" src={homeTeam?.dress || ''} alt={homeTeam.name || 'Home Team'} />

                    <div className="d-flex flex-column justify-content-center g-5">
                        <h4 style={{ color: "orange", textAlign: "center" }} className="text-12 text-overflow">Spielplatzt:</h4>

                        <h2 style={{ textAlign: "center", maxWidth: "150px", height: "auto" }} className="text-12 text-overflow">
                            {match?.details?.location || 'Nicht Zugeornet'}, {formatDate(match?.details?.date) || 'Nicht Zugeornet'}
                        </h2>
                    </div>

                    <img className="club-dress" src={awayTeam?.dress || ''} alt={awayTeam.name || 'Away Team'} />
                </div>
            </div>
            {variant === 'extended' && (
                <div className="border-top">
                    {/* Add additional extended view details if required */}
                </div>
            )}
        </Spring>
    );
};

RefereeMatchCard.propTypes = {
    match: PropTypes.object.isRequired,
    index: PropTypes.number,
    variant: PropTypes.oneOf(['basic', 'extended']),
};

export default RefereeMatchCard;
