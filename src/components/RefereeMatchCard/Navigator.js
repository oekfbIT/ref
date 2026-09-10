import React, { useEffect, useRef, useMemo } from 'react';
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
    return date.toISOString().split('T')[0]; // Return a stable UTC YYYY-MM-DD key
};

const Navigator = ({ active, setActive, assignments }) => {
    const { theme, direction } = useThemeProvider();
    const containerRef = useRef(null);
    // Extract and order the unique full dates. Using the full date prevents a
    // 6 September from one year being grouped with 6 September from another.
    const uniqueDates = useMemo(() => {
        const dateStrings = assignments
            .map(assignment => formatDate(assignment?.details?.date))
            .filter(date => date !== 'Invalid Date');

        return [...new Set(dateStrings)].sort();
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

    // Select the closest actionable date. RefMatches supplies only today and
    // future assignments, so a past date can never be selected as a fallback.
    useEffect(() => {
        if (uniqueDates.length === 0 || uniqueDates.includes(active)) return;

        const nextDate = uniqueDates[0];
        if (nextDate !== active) {
            setActive(nextDate);
        }
    }, [uniqueDates, active, setActive]);

    // Handle date click
    const handleDateClick = (dateKey) => {
        setActive(dateKey);
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
            {uniqueDates.map((dateKey) => {
                const date = new Date(`${dateKey}T00:00:00Z`);
                const isActive = active === dateKey;

                return (
                <div
                    key={dateKey}
                    className={classNames(styles.slide, styles.navigator_item, styles[direction], {
                        [styles.active]: isActive,
                    })}
                    onClick={() => handleDateClick(dateKey)}
                    style={{
                        display: 'inline-block',
                        scrollSnapAlign: 'center',
                        padding: '10px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        backgroundColor: isActive ? 'black' : 'transparent',
                        color: isActive ? 'white' : 'inherit',
                    }}
                >
                    <h4 className={styles.day}>{date.getUTCDate()}</h4>
                    <span className="label h6">
                        {date.toLocaleString('default', { month: 'short', timeZone: 'UTC' })} {date.getUTCFullYear()}
                    </span>
                </div>
                );
            })}
        </div>
    );
};

export default Navigator;
