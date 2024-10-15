import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.module.scss';
import Spring from '@components/Spring';
import Score from '@ui/Score';

// Helper function to format the date
const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    return date.toISOString().split('T')[0];
};

const RefereeMatchCard = ({ match, index, variant = 'basic' }) => {
    const homeTeam = match?.home_blanket || {};
    const awayTeam = match?.away_blanket || {};

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
                style={{ paddingBottom: variant !== 'extended' ? 'var(--card-padding)' : 10, cursor: 'pointer' }}
                onClick={() => (window.location.href = `/matches/${match.id}`)}
            >
                {/* Team Logos and Score */}
                <div className="d-flex align-items-center justify-content-between p-relative">
                    <img className="club-logo" src={homeTeam.logo || ''} alt={homeTeam.name || 'Home Team'} />
                    <Score team1={match?.score?.home || 0} team2={match?.score?.away || 0} variant="alt" />
                    <img className="club-logo" src={awayTeam.logo || ''} alt={awayTeam.name || 'Away Team'} />
                </div>

                {/* Team Names and Match Status */}
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

                {/* Team Dress and Match Date/Location */}
                <div className="d-flex justify-content-center g-30">
                    <img className="club-dress" src={homeTeam?.dress || ''} alt={homeTeam.name || 'Home Team'} />

                    <div className="d-flex flex-column justify-content-center g-5">
                        <h4 style={{ color: "orange", textAlign: "center" }} className="text-12 text-overflow">Spielplatz:</h4>
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
