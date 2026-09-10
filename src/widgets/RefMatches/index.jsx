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
const VISIBLE_STATUSES = new Set(['pending', 'first', 'halftime', 'second']);

const getDateKey = (dateString) => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

const getTodayDateKey = () => new Date().toISOString().slice(0, 10);

const RefMatches = () => {
    const { direction } = useThemeProvider();
    const [selectedDate, setSelectedDate] = useState(getTodayDateKey);
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

    // A referee sees only scheduled or live matches on today or a future date.
    // This single list supplies both the date navigator and the cards.
    const visibleMatches = matches.filter(match => {
        const dateKey = getDateKey(match?.details?.date);
        return dateKey !== null && dateKey >= getTodayDateKey() && VISIBLE_STATUSES.has(match.status);
    });

    const filteredMatches = visibleMatches
        .filter(match => {
            return getDateKey(match?.details?.date) === selectedDate;
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
                    assignments={visibleMatches}
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
