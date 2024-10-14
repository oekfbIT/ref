import React, { useState, useMemo } from 'react';
import { Modal, Box } from '@mui/material';
import styles from '../styles.module.scss';

const RedCardModal = ({ open, onClose, onConfirm, players = [] }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    // Enhanced filter to exclude players with any type of red card
    const availablePlayers = useMemo(() => {
        return players.filter(player => {
            const redCard = Number(player.red_card) || 0;
            const redYellowCard = Number(player.red_yellow_card) || 0;
            return redCard === 0 && redYellowCard === 0;
        });
    }, [players]);

    const handlePlayerSelect = (player) => {
        setSelectedPlayer(player);
    };

    const handleConfirm = () => {
        if (selectedPlayer) {
            onConfirm(selectedPlayer);
            setSelectedPlayer(null);
            onClose();
        }
    };

    const handleClose = () => {
        setSelectedPlayer(null);
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box className={styles.modalContent}>
                <div style={{ backgroundColor: "black", padding: '10px' }}>
                    {/* Closing Button */}
                    <button
                        style={{ marginBottom: "30px", color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        onClick={handleClose}
                        aria-label="Close modal"
                    >
                        Schließen
                    </button>
                </div>

                <div className={styles.playerList}>
                    {availablePlayers.length > 0 ? (
                        availablePlayers.map((player) => (
                            <div
                                key={player.id}
                                className={`${styles.playerRow} ${selectedPlayer?.id === player.id ? styles.selected : ''}`}
                                onClick={() => handlePlayerSelect(player)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={player.image || '/path/to/default/image.png'}
                                    alt={player.name}
                                    style={{ width: '50px', height: '50px', marginRight: '10px', borderRadius: '50%' }}
                                />
                                <span>{player.name}</span>
                                <span>({player.number})</span>
                            </div>
                        ))
                    ) : (
                        <p>Keine Spieler zur Auswahl</p>
                    )}
                </div>

                <button
                    className={styles.btnOrange}
                    onClick={handleConfirm}
                    disabled={!selectedPlayer}
                >
                    Rote Karte Zuweisen
                </button>
            </Box>
        </Modal>
    );
};

export default RedCardModal;
