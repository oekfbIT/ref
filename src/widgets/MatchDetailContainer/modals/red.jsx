import React, { useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import styles from '../styles.module.scss';

const RedCardModal = ({ open, onClose, onConfirm, players = [] }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const handlePlayerSelect = (player) => {
        setSelectedPlayer(player);
    };

    const handleConfirm = () => {
        if (selectedPlayer) {
            onConfirm(selectedPlayer);
            onClose();
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box className={styles.modalContent}>
                <div style={{backgroundColor: "black"}}>
                    {/*// CLOSING */}
                    <button style={{marginBottom: "30px"}} onClick={onClose}>Schließen</button>
                </div>

                <div className={styles.playerList}>
                    {players.length > 0 ? players.map((player) => (
                        <div
                            key={player.id}
                            className={`${styles.playerRow} ${selectedPlayer?.id === player.id ? styles.selected : ''}`}
                            onClick={() => handlePlayerSelect(player)}
                        >
                            <img src={player.image} alt={player.name}
                                 style={{width: '50px', height: '50px', marginRight: '10px'}}/>
                            <span>{player.name}</span>
                            <span>({player.number})</span>

                        </div>
                    )) : <p>No players available</p>}
                </div>

                <button className={styles.btnOrange}
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
