import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';
import styles from '../styles.module.scss';

const GoalModal = ({ open, onClose, onConfirm, players = [], match }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);  // home or away
    const [step, setStep] = useState(1);  // 1 for player selection, 2 for team selection

    const handlePlayerSelect = (player) => {
        console.log("Player selected:", player);  // Debugging log
        if (player) {
            setSelectedPlayer(player);
            setStep(2);  // Move to team selection
        } else {
            console.error("Invalid player selection. Player is undefined.");
        }
    };

    const handleTeamSelect = (teamType) => {
        // Toggle the selection of the team ("home" or "away")
        if (selectedTeam === teamType) {
            console.log(`Team unselected: ${teamType}`);
            setSelectedTeam(null);  // Unselect if the same team is clicked again
        } else {
            console.log(`Team selected: ${teamType}`);
            setSelectedTeam(teamType);  // Select the new team
        }
    };

    const handleConfirm = () => {
        if (selectedPlayer && selectedTeam) {
            console.log("Confirming selection:", { player: selectedPlayer, team: selectedTeam });
            onConfirm(selectedPlayer, selectedTeam);  // Pass "home" or "away"
            onClose();
        } else {
            console.error("Unable to confirm, player or team is missing.");
        }
    };

    const handleBack = () => {
        setStep(1);  // Go back to player selection
        setSelectedTeam(null);  // Reset selected team
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box className={styles.modalContent}>
                {step === 1 && (
                    <>
                        <div style={{ backgroundColor: "black" }}>
                            <button style={{ marginBottom: "30px" }} onClick={onClose}>Schließen</button>
                        </div>

                        <div className={styles.playerList}>
                            {players.length > 0 ? players.map((player) => (
                                <div
                                    key={player?.id}  // Ensure player and id are defined
                                    className={`${styles.playerRow} ${selectedPlayer?.id === player?.id ? styles.selected : ''}`}
                                    onClick={() => handlePlayerSelect(player)}
                                >
                                    <img src={player?.image} alt={player?.name}
                                         style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                    <span>{player?.name}</span>
                                    <span>({player?.number})</span>
                                </div>
                            )) : <p>No players available</p>}
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div style={{ backgroundColor: "black" }}>
                            <button style={{ marginBottom: "30px" }} onClick={handleBack}>Zur Spielerauswahl</button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '50px' }}>
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    cursor: 'pointer',
                                    border: selectedTeam === 'home' ? '2px solid orange' : '2px solid transparent',
                                    backgroundColor: selectedTeam === 'home' ? 'orange' : 'transparent',  // Background color when selected
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onClick={() => handleTeamSelect('home')}>
                                <img src={match?.home_blanket?.logo} alt={match?.home_blanket?.name} style={{ width: '100%', height: '80%' }} />
                                <span style={{ textAlign: 'center' }}>{match?.home_blanket?.name}</span>
                            </div>

                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    cursor: 'pointer',
                                    border: selectedTeam === 'away' ? '2px solid orange' : '2px solid transparent',
                                    backgroundColor: selectedTeam === 'away' ? 'orange' : 'transparent',  // Background color when selected
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onClick={() => handleTeamSelect('away')}>
                                <img src={match?.away_blanket?.logo} alt={match?.away_blanket?.name} style={{ width: '100%', height: '80%' }} />
                                <span style={{ textAlign: 'center' }}>{match?.away_blanket?.name}</span>
                            </div>
                        </div>

                        <button className={styles.btnOrange}
                                onClick={handleConfirm}
                                disabled={!selectedTeam}
                        >
                            Auswahl Bestätigen
                        </button>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default GoalModal;
