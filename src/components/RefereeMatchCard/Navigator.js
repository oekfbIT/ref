import React, { useEffect, useRef, useState, useMemo } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { useThemeProvider } from '@contexts/themeContext';

// Helper function to format the date safely
const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    return date.toISOString().split('T')[0]; // Return 'YYYY-MM-DD'
};

const Navigator = ({ active, setActive, assignments }) => {
    const { theme, direction } = useThemeProvider();
    const containerRef = useRef(null);
    const [closestDate, setClosestDate] = useState(null);

    // Extract unique dates from the assignments
    const uniqueDates = useMemo(() => {
        const dateStrings = assignments.map(assignment => {
            return formatDate(assignment.details.date);
        });
        return [...new Set(dateStrings)].map(dateString => new Date(dateString));
    }, [assignments]);

    // Scroll to the active date
    useEffect(() => {
        const container = containerRef.current;
        const activeElement = container?.querySelector(`.${styles.active}`);
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
        if (!closestDate) {
            const today = new Date();
            const upcomingDates = uniqueDates.filter(date => date >= today);
            const closestUpcomingDate = upcomingDates.sort((a, b) => a - b)[0];

            if (closestUpcomingDate) {
                setClosestDate(closestUpcomingDate);
                if (closestUpcomingDate.getDate() !== active) {
                    setActive(closestUpcomingDate.getDate());
                }
            }
        }
    }, [uniqueDates, closestDate, active, setActive]);

    // Handle date click
    const handleDateClick = (date) => {
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
                justifyContent: 'center',
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
                        textAlign: 'center',
                        backgroundColor: active === date.getDate() ? 'black' : 'transparent',
                        color: active === date.getDate() ? 'white' : 'inherit',
                    }}
                >
                    {/* Ensure date.getDate() doesn't return NaN */}
                    <h4 className={styles.day}>{!isNaN(date.getDate()) ? date.getDate() : 'Invalid Date'}</h4>
                    <span className="label h6">{!isNaN(date.getDate()) ? date.toLocaleString('default', { month: 'short' }) : ''}</span>
                </div>
            ))}
        </div>
    );
};

export default Navigator;
