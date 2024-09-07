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

const RefMatches = () => {
    const { direction } = useThemeProvider();
    const [selectedDay, setSelectedDay] = useState(parseInt(dayjs().format('DD')));
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

    // Filter matches based on the selected day and exclude completed or cancelled matches
    const filteredMatches = matches
        .filter(match => {
            const matchDate = new Date(match.details.date);
            return (
                matchDate.getDate() === selectedDay &&
                match.status !== 'submitted' &&
                match.status !== 'cancelled'
            );
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
                <Navigator active={selectedDay} setActive={setSelectedDay} assignments={matches} />
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
