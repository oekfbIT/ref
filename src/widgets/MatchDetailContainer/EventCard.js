import React, { useState } from 'react';
import styles from './styles.module.scss';
import MatchController from "../../network/MatchController";
import { FaTrash } from 'react-icons/fa'; // Import the trash icon from react-icons
import { Modal, Box } from '@mui/material'; // Use MUI modal

const EventCard = ({ events, matchId, refetch }) => {
    const matchController = new MatchController();
    const [deleteEventId, setDeleteEventId] = useState(null); // To store event ID for deletion
    const [modalOpen, setModalOpen] = useState(false); // Modal open state

    // Open the modal and store the event ID
    const handleOpenModal = (eventId) => {
        setDeleteEventId(eventId);
        setModalOpen(true);
    };

    // Close the modal
    const handleCloseModal = () => {
        setDeleteEventId(null);
        setModalOpen(false);
    };

    // Confirm and delete the event
    const handleConfirmDelete = async () => {
        if (deleteEventId) {
            try {
                await matchController.deleteEvent(deleteEventId);  // Use matchId
                await refetch();  // Refetch match data after deleting the event
                handleCloseModal(); // Close the modal after success
            } catch (error) {
                console.error('Failed to delete event:', error);
            }
        }
    };

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

    const renderEventMinute = (event) => {
        const isOwnGoal = event.own_goal === true;
        return (
            <span className={styles.eventMinute}>
                {event.minute}' {isOwnGoal ? '(Eigentor) ' : ''}
            </span>
        );
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
                                {renderEventMinute(event)}
                                {renderCardType(event)}
                            </div>
                        </div>
                        <button
                            className={`${styles.deleteButton} orgbtn`}  // Apply orgbtn styling
                            onClick={() => handleOpenModal(event.id)}
                            aria-label={`Delete event ${event.id}`}
                        >
                            <FaTrash color="red" /> {/* Trash icon colored red */}
                        </button>
                    </div>
                ))}
            </div>

            {/* Modal for confirming deletion */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="confirm-delete-title"
                aria-describedby="confirm-delete-description"
            >
                <Box className={styles.modalContent}>
                    <h2 id="confirm-delete-title">Löschen</h2>
                    <p id="confirm-delete-description">Möchten Sie dieses Ereignis wirklich löschen?</p>
                    <div className={styles.buttonGroup}>
                        <button
                            className={`${styles.btnGreen} orgbtn`}  // Use orgbtn style for confirm button
                            onClick={handleConfirmDelete}
                        >
                            Bestätigen
                        </button>
                        <button
                            className={`${styles.btnOrange} orgbtn`}  // Use orgbtn style for cancel button
                            onClick={handleCloseModal}
                        >
                            Abbrechen
                        </button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default EventCard;
