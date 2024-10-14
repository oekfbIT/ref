import React, { useState, useMemo } from 'react';
import { Modal, Box } from '@mui/material';
import styles from '../styles.module.scss';

const GoalModal = ({ open, onClose, onConfirm, players = [], match }) => {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);  // 'home' or 'away'
    const [ownGoal, setOwnGoal] = useState(false);  // Own goal checkbox
    const [step, setStep] = useState(1);  // 1: Player Selection, 2: Team Selection

    // Memoized filter to exclude players with red or yellow-red cards
    const availablePlayers = useMemo(() => {
        return players.filter(player => {
            const redCard = Number(player.red_card) || 0;
            const redYellowCard = Number(player.red_yellow_card) || 0;
            return redCard === 0 && redYellowCard === 0;
        });
    }, [players]);

    const handlePlayerSelect = (player) => {
        if (player) {
            setSelectedPlayer(player);
            setStep(2);  // Proceed to team selection
        } else {
            console.error("Invalid player selection. Player is undefined.");
        }
    };

    const handleTeamSelect = (teamType) => {
        // Toggle team selection
        if (selectedTeam === teamType) {
            setSelectedTeam(null);  // Unselect if the same team is clicked again
        } else {
            setSelectedTeam(teamType);  // Select the new team
        }
    };

    const handleOwnGoalChange = (event) => {
        setOwnGoal(event.target.checked);
    };

    const handleConfirm = () => {
        if (selectedPlayer && selectedTeam) {
            onConfirm(selectedPlayer, selectedTeam, ownGoal);  // Pass player, team, and ownGoal status
            handleReset();
            onClose();
        } else {
            console.error("Unable to confirm, player or team is missing.");
        }
    };

    const handleBack = () => {
        setStep(1);  // Return to player selection
        setSelectedTeam(null);  // Reset selected team
    };

    const handleReset = () => {
        setSelectedPlayer(null);
        setSelectedTeam(null);
        setOwnGoal(false);
        setStep(1);
    };

    const handleModalClose = () => {
        handleReset();
        onClose();  // Invoke the original onClose callback
    };

    return (
        <Modal open={open} onClose={handleModalClose}>
            <Box className={styles.modalContent}>
                {step === 1 && (
                    <>
                        <div style={{ backgroundColor: "black", padding: '10px' }}>
                            {/* Closing Button */}
                            <button
                                style={{ marginBottom: "30px", color: 'white', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                onClick={handleModalClose}
                                aria-label="Close modal"
                            >
                                Schließen
                            </button>
                        </div>

                        <div className={styles.playerList}>
                            {availablePlayers.length > 0 ? availablePlayers.map((player) => (
                                <div
                                    key={player.id}  // Ensure player and id are defined
                                    className={`${styles.playerRow} ${selectedPlayer?.id === player.id ? styles.selected : ''}`}
                                    onClick={() => handlePlayerSelect(player)}
                                >
                                    <img
                                        src={player.image || '/path/to/default/image.png'}  // Fallback image
                                        alt={player.name}
                                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                    />
                                    <span>{player.name}</span>
                                    <span>({player.number})</span>
                                </div>
                            )) : <p>No players available</p>}
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div style={{ backgroundColor: "black", padding: '10px' }}>
                            {/* Back Button */}
                            <button
                                style={{ marginBottom: "30px", textDecoration: "underline", color: "orange", background: 'transparent', border: 'none', cursor: 'pointer' }}
                                onClick={handleBack}
                                aria-label="Back to player selection"
                            >
                                Zurück zur Spielerauswahl
                            </button>
                        </div>

                        <h3 style={{ fontSize: "24px", color: "white" }}>Wer bekommt das Tor?</h3>


                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '50px', width: "70%" }}>
                            {/* Home Team Selection */}
                            <div
                                style={{
                                    width: '80px',
                                    cursor: 'pointer',
                                    border: selectedTeam === 'home' ? '2px solid orange' : '2px solid transparent',
                                    backgroundColor: selectedTeam === 'home' ? 'orange' : 'transparent',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onClick={() => handleTeamSelect('home')}
                            >
                                <img
                                    className={styles.logo}
                                    src={match?.home_blanket?.logo || '/path/to/default/team/logo.png'}
                                    alt={match?.home_blanket?.name || 'Home Team'}
                                    style={{ width: '100%', height: '80%' }}
                                />
                                <span style={{ textAlign: 'center', marginTop: "15px" }}>{match?.home_blanket?.name || 'Home Team'}</span>
                            </div>

                            {/* Away Team Selection */}
                            <div
                                style={{
                                    width: '80px',
                                    cursor: 'pointer',
                                    border: selectedTeam === 'away' ? '2px solid orange' : '2px solid transparent',
                                    backgroundColor: selectedTeam === 'away' ? 'orange' : 'transparent',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onClick={() => handleTeamSelect('away')}
                            >
                                <img
                                    className={styles.logo}
                                    src={match?.away_blanket?.logo || '/path/to/default/team/logo.png'}
                                    alt={match?.away_blanket?.name || 'Away Team'}
                                    style={{ width: '100%', height: '80%' }}
                                />
                                <span style={{ textAlign: 'center', marginTop: "15px" }}>{match?.away_blanket?.name || 'Away Team'}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            {/* Checkbox for own goal */}
                            <label style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={ownGoal}
                                    onChange={handleOwnGoalChange}
                                    style={{ marginRight: '10px' }}
                                />
                                Eigentor
                            </label>
                        </div>

                        <button
                            className={styles.btnOrange}
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
