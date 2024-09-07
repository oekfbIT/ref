import React from 'react';
import styles from './styles.module.scss';

const EventCard = ({ events }) => {
    const renderCardType = (event) => {
        switch (event.type) {
            case 'yellowCard':
                return <span key={event.id} className={`${styles.karte} ${styles.yellow}`} />;
            case 'redCard':
                return <span key={event.id} className={`${styles.karte} ${styles.red}`} />;
            case 'yellowRedCard':
                return (
                    <>
                        <span key={event.id} className={`${styles.karte} ${styles.yellow}`} />
                        <span key={event.id} className={`${styles.karte} ${styles.red}`} />
                    </>
                );
            case 'goal':
                return <i className="icon icon-ball text-12 text-header" />;
            default:
                return null;
        }
    };

    // Sort events by minute
    const sortedEvents = events.sort((a, b) => a.minute - b.minute);

    return (
        <div className={styles.eventCard}>
            <div className={styles.eventList}>
                {sortedEvents.map((event) => (
                    <div key={event.id} className={styles.eventRow}>
                        <div className={styles.eventDetailsWrapper}>
                            <div className={styles.eventDetails}>
                                <span className={styles.playerNumber}>{event.number}</span>
                                <img
                                    src={event.image || 'https://via.placeholder.com/40'}
                                    alt={event.name}
                                    className={styles.eventImage}
                                />
                                <span className={styles.playerName}>{event.name}</span>
                                <span className={styles.eventMinute}>{event.minute}'</span>
                                {renderCardType(event)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventCard;
