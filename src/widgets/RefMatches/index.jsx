import React, { useEffect, useState } from 'react';
import ApiService from '../../network/ApiService';
import AuthService from '../../network/AuthService';
import Navigator from "@components/RefereeMatchCard/Navigator";

// Styling
import styles from './styles.module.scss';

// Components
import Spring from '@components/Spring';
import ScrollContainer from '@components/ScrollContainer';
import RefereeMatchCard from "@components/RefereeMatchCard";

// Hooks
import { useThemeProvider } from '@contexts/themeContext';

// Utils
import dayjs from 'dayjs';

const HIDDEN_STATUSES = new Set(['submitted', 'done']);

const getDateKey = (dateString) => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

const RefMatches = () => {
    const { direction } = useThemeProvider();
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const refID = new AuthService().getRefID();
                if (!refID) return;

                const response = await new ApiService().get(`referees/${refID}`);
                console.log('Fetched matches:', response);
                if (response && response.assignments) {
                    setMatches(response.assignments);
                }
            } catch (error) {
                console.error('Failed to fetch matches:', error);
            }
        };

        fetchMatches();
    }, []); // Empty dependency array ensures this effect runs once

    // Keep the navigator and the cards in sync: both use the full UTC date and
    // only include matches that have not been submitted or settled.
    const filteredMatches = matches
        .filter(match => {
            return getDateKey(match?.details?.date) === selectedDate && !HIDDEN_STATUSES.has(match.status);
        })
        .sort((a, b) => {
            // Sort by time (earliest to latest)
            const timeA = new Date(a.details.date).getTime();
            const timeB = new Date(b.details.date).getTime();
            return timeA - timeB;
        });

    return (
        <Spring className="card d-flex flex-column">
            <div className="card_header d-flex flex-column g-10" style={{ paddingBottom: 10}}>
                <Navigator
                    active={selectedDate}
                    setActive={setSelectedDate}
                    assignments={matches.filter(match => !HIDDEN_STATUSES.has(match.status))}
                />
            </div>
            <div className={styles.grid}>
                <div className={styles.scroll}>
                    <ScrollContainer height={0}>
                        <div className={`${styles.scroll_track} ${styles[direction]} track d-flex flex-column g-20`}>
                            {filteredMatches.map((match, index) => (
                                <RefereeMatchCard
                                    match={match}
                                    index={index}
                                    key={index} />
                            ))}
                        </div>
                    </ScrollContainer>
                </div>
            </div>
        </Spring>
    );
};

export default RefMatches;
