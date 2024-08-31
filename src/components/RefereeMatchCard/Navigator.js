import React, { useEffect, useRef, useState, useMemo } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { useThemeProvider } from '@contexts/themeContext';

const Navigator = ({ active, setActive, assignments }) => {
    const { theme, direction } = useThemeProvider();
    const containerRef = useRef(null);
    const [closestDate, setClosestDate] = useState(null);

    // Extract unique dates from the assignments using useMemo to avoid recalculations on every render
    const uniqueDates = useMemo(() => {
        // Extract dates in 'YYYY-MM-DD' format to ignore time and get unique dates
        const dateStrings = assignments.map(assignment => {
            const date = new Date(assignment.details.date);
            return date.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'
        });

        // Create a Set to remove duplicates and convert back to Date objects
        return [...new Set(dateStrings)].map(dateString => new Date(dateString));
    }, [assignments]);

    // Scroll to the active date
    useEffect(() => {
        const container = containerRef.current;
        const activeElement = container.querySelector(`.${styles.active}`);
        if (activeElement && container) {
            const offsetLeft = activeElement.offsetLeft - container.offsetWidth / 2 + activeElement.offsetWidth / 2;
            container.scrollTo({
                left: offsetLeft,
                behavior: 'smooth',
            });
        }
    }, [active]);

    // Set the closest upcoming date on initial load
    useEffect(() => {
        if (!closestDate) { // Run this only if closestDate hasn't been set yet
            const today = new Date();
            const upcomingDates = uniqueDates.filter(date => date >= today);
            const closestUpcomingDate = upcomingDates.sort((a, b) => a - b)[0];

            if (closestUpcomingDate) {
                setClosestDate(closestUpcomingDate);
                if (closestUpcomingDate.getDate() !== active) { // Prevent unnecessary state update
                    setActive(closestUpcomingDate.getDate());
                }
            }
        }
    }, [uniqueDates, closestDate, active, setActive]);

    // Function to handle click and log the date
    const handleDateClick = (date) => {
        console.log(`Date clicked: ${date}`); // Log the clicked date
        setActive(parseInt(date)); // Update active state
    };

    return (
        <div
            className={`${styles.navigator} ${theme === 'light' ? styles.light : styles.dark}`}
            ref={containerRef}
            style={{
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '30px',
                padding: '10px',
                scrollSnapType: 'x mandatory',
                justifyContent: 'center' // Center align the entire navigator content
            }}
        >
            {uniqueDates.map((date, index) => (
                <div
                    key={index}
                    className={classNames(styles.slide, styles.navigator_item, styles[direction], {
                        [styles.active]: active === date.getDate(),
                    })}
                    onClick={() => handleDateClick(date.getDate())}
                    style={{
                        display: 'inline-block',
                        scrollSnapAlign: 'center',
                        padding: '10px',
                        cursor: 'pointer',
                        textAlign: 'center', // Center-align the text inside the item
                        backgroundColor: active === date.getDate() ? 'black' : 'transparent', // Set background to black if active
                        color: active === date.getDate() ? 'white' : 'inherit' // Set text color to white if active for contrast
                    }}
                >
                    <h4 className={styles.day}>{date.getDate()}</h4>
                    <span className="label h6">{date.toLocaleString('default', { month: 'short' })}</span>
                </div>
            ))}
        </div>
    );
};

export default Navigator;
