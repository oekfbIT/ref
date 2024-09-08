import React, { useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import styles from '../styles.module.scss';

const RedCardModal = ({ open, onClose, onConfirm, players = [] }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    // Filter players who do not have a red card or red-yellow card
    const availablePlayers = players.filter(
        player => player.red_card === 0 && player.red_yellow_card === 0
    );

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

    return (
        <Modal open={open} onClose={onClose}>
            <Box className={styles.modalContent}>
                <div style={{backgroundColor: "black"}}>
                    {/*// CLOSING */}
                    <button style={{marginBottom: "30px"}} onClick={onClose}>Schließen</button>
                </div>

                <div className={styles.playerList}>
                    {availablePlayers.length > 0 ? availablePlayers.map((player) => (
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
                    )) : <p>Keine Spieler Zur auswahl</p>}
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
