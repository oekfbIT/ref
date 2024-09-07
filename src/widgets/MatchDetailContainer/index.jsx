import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MatchController from '../../network/MatchController';
import Spring from '@components/Spring';
import styles from './styles.module.scss';
import PregameView from './PregameView';
import FirstHalfView from './FirstHalfView';
import HalfTimeView from './HalfTimeView';
import SecondHalfView from './SecondHalfView';
import Score from "@ui/Score";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { getElapsedTime } from '../../utils/time';
import { useMinute } from './MinuteContext';
import EventCard from "@widgets/MatchDetailContainer/EventCard";
import CompleteEndView from "@widgets/MatchDetailContainer/CompleteEndView";  // Import the custom hook

const TeamCard = ({ team, isHome }) => (
    <div className={styles.cardColumn}>
        <img className={styles.clubLogo} src={team.logo || ''} alt={team.name || (isHome ? 'Home Team' : 'Away Team')} />
        <div className={styles.teamName}>
            <h5>{team.name || (isHome ? 'Home Team' : 'Away Team')}</h5>
        </div>
        <img className={styles.clubDress} src={team.dress || ''} alt={team.name || (isHome ? 'Home Team' : 'Away Team')} />
    </div>
);

const RefDetailContainer = ({ id }) => {
    const [match, setMatch] = useState(null);
    const [stopwatch, setStopwatch] = useState('00:00:00');
    const [isRunning, setIsRunning] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [selectedData, setSelectedData] = useState(null);
    const [noShowModalOpen, setNoShowModalOpen] = useState(false);
    const [abbruchModalOpen, setAbbruchModal] = useState(false);
    const [selectedWinner, setSelectedWinner] = useState(null);
    const { setMinute } = useMinute();  // Get the setter for the minute context
    const [activeTab, setActiveTab] = useState("home");

    const matchController = new MatchController();
    const navigate = useNavigate();

    const fetchMatch = async () => {
        try {
            const response = await matchController.getMatchById(id);
            if (response) {
                setMatch(response);
                updateStopwatch(response);
            }
        } catch (error) {
            console.error('Failed to fetch match:', error);
        }
    };

    const refetchMatch = async () => {
        await fetchMatch(); // Refetches the match data and triggers a rerender
    };

    useEffect(() => {
        fetchMatch();
    }, [id]);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                if (match) {
                    updateStopwatch(match);
                    const currentMinute = getMinuteFromStopwatch(stopwatch);  // Get the current minute
                    setMinute(currentMinute);  // Update the context with the current minute
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, match, stopwatch, setMinute]);

    const matchStatusText = (status) => {
        switch (status) {
            case 'pending':
                return "Spiel Starten";
            case 'first':
                return "1. Halbzeit Beenden";
            case 'halftime':
                return "2. Halbzeit Starten";
            case 'second':
                return "Spiel Beenden";
            case 'completed':
                return "Spiel Abschließen";
            case 'abbgebrochen':
                return "Spiel Abschließen ";
            default:
                return "Status Unbekannt";
        }
    };

    const matchStatus = (matchData) => {
        if (!matchData) return;
        const { status } = matchData;

        switch (status) {
            case 'pending':
                return "Spielvorschau";
            case 'first':
                return "1. Halbzeit";
            case 'halftime':
                return "Halbzeit";
            case 'second':
                return "2. Halbzeit";
            case 'completed':
                return "Spiel Beendet";
            case 'abbgebrochen':
                return 'Spiel Abbgebrochen';
            default:
                return "Status Unbekannt";
        }
    };

    const updateStopwatch = (matchData) => {
        if (!matchData) return;
        const { status, first_half_start_date, second_half_start_date, first_half_end_date } = matchData;
        let elapsedSeconds;
        switch (status) {
            case 'pending':
                setStopwatch('00:00:00');
                setIsRunning(false);
                break;
            case 'first':
                if (first_half_start_date) {
                    elapsedSeconds = getElapsedTime(first_half_start_date);
                    setStopwatch(formatTime(elapsedSeconds));
                    setIsRunning(true);
                } else {
                    setStopwatch('00:00:00');
                    setIsRunning(false);
                }
                break;
            case 'halftime':
                elapsedSeconds = getElapsedTime(first_half_end_date);
                setStopwatch(formatTime(elapsedSeconds));
                setIsRunning(true);
                break;
            case 'second':
                if (second_half_start_date) {
                    elapsedSeconds = getElapsedTime(second_half_start_date);
                    const totalSeconds = 25 * 60 + elapsedSeconds;
                    setStopwatch(formatTime(totalSeconds));
                    setIsRunning(true);
                } else {
                    setStopwatch('25:00');
                    setIsRunning(false);
                }
                break;
            case 'completed':
                setStopwatch('Spiel Abgeschlossen');
                setIsRunning(false);
                break;
            default:
                setStopwatch('00:00:00');
                setIsRunning(false);
                break;
        }
    };

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const getMinuteFromStopwatch = (time) => {
        const parts = time.split(':');
        return parseInt(parts.length === 3 ? parts[1] : parts[0], 10);
    };

    const handleItemClick = (data, type) => {
        setSelectedData(data);
        setModalType(type);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedData(null);
    };

    const getActiveTeamId = () => {
        if (!match) return null;
        return activeTab === 'home' ? match.home_team?.id : match.away_team?.id;
    };

    const handleAction = async () => {
        if (!match) return;

        try {
            switch (match.status) {
                case 'pending':
                    await matchController.startGame(match.id);
                    break;
                case 'first':
                    await matchController.endFirstHalf(match.id);
                    break;
                case 'halftime':
                    await matchController.startSecondHalf(match.id);
                    break;
                case 'second':
                    await matchController.endGame(match.id);
                    break;
                default:
                    break;
            }

            await refetchMatch(); // Refetch the match after an action is performed
        } catch (error) {
            console.error('Failed to perform action:', error);
        }
    };

    const handleCancel = () => {
        setNoShowModalOpen(true);
    };

    const handleAbbruch = () => {
        setAbbruchModal(true);
    };

    const cancelHandleAbbruch = () => {
        setAbbruchModal(false);
    };
    const executeAbbruch = async () => {
        try {
            await matchController.spielAbbruch(match.id);
            fetchMatch()
            setAbbruchModal(false)
        } catch (error) {
            console.error('Failed to Spielabrruch:', error);
        }
    }

    const handleNoShow = async () => {
        if (!selectedWinner) return;

        try {
            await matchController.noShowGame(match.id, selectedWinner);
            navigate('/matches');
        } catch (error) {
            console.error('Failed to mark no-show:', error);
        }
    };

    const renderView = () => {
        switch (match?.status) {
            case 'pending': return <PregameView match={match} onPlayerClick={(player) => handleItemClick(player, 'player')} activeTab={activeTab} setActiveTab={setActiveTab} />;
            case 'first': return <FirstHalfView match={match} onPlayerClick={(player) => handleItemClick(player, 'player')} onGoalClick={(goal) => handleItemClick(goal, 'goal')} activeTab={activeTab} setActiveTab={setActiveTab} teamID={getActiveTeamId()} refetch={fetchMatch} />;
            case 'halftime': return <HalfTimeView match={match} onPlayerClick={(player) => handleItemClick(player, 'player')} onGoalClick={(goal) => handleItemClick(goal, 'goal')} />;
            case 'second': return <SecondHalfView  match={match} onPlayerClick={(player) => handleItemClick(player, 'player')} onGoalClick={(goal) => handleItemClick(goal, 'goal')} activeTab={activeTab} setActiveTab={setActiveTab} teamID={getActiveTeamId()} refetch={fetchMatch} />;
            case 'completed': return <CompleteEndView match={match} onPlayerClick={(player) => handleItemClick(player, 'player')} activeTab={activeTab} setActiveTab={setActiveTab} />;
            case 'submitted': return <CompleteEndView match={match} onPlayerClick={(player) => handleItemClick(player, 'player')} activeTab={activeTab} setActiveTab={setActiveTab} />;
            case 'abbgebrochen': return <CompleteEndView match={match} onPlayerClick={(player) => handleItemClick(player, 'player')} activeTab={activeTab} setActiveTab={setActiveTab} />;
            default: return <div>Invalid match status</div>;
        }
    };

    if (!match) return <div>Loading...</div>;

    const homeTeam = match.home_blanket || {};
    const awayTeam = match.away_blanket || {};

    return (
        <Spring>
            <div className={styles.card}>
                <div className={styles.grid}>
                    <TeamCard team={homeTeam} isHome={true}/>
                    <div className={styles.middleCol}>
                        <Score team1={match.score?.home || 0} team2={match.score?.away || 0} variant="alt"/>
                        <p className={styles.location}>{match.details.location}</p>
                    </div>
                    <TeamCard team={awayTeam} isHome={false}/>
                </div>
            </div>

            {/* Insert EventCard here */}
            <div className={styles.card}>
                <p className={styles.title}>Spiel Events</p>
                <EventCard events={match.events || []} />  {/* Pass the match events as props */}
            </div>

            <div className={styles.card}>
                <div className={styles.stopwatchContainer}>
                    <p className={styles.counterLbl}>
                        {matchStatus(match)}
                    </p>
                    <p className={styles.counter}>
                        {stopwatch}
                    </p>
                </div>
            </div>

            <div className={styles.card}>
                <div className="d-flex justify-content-center p-2">
                    <button
                        className={styles.btnGreen}
                        onClick={handleAction}
                        disabled={['completed', 'submitted'].includes(match.status)}>
                        {matchStatusText(match.status)}
                    </button>

                    {match.status !== "pending" || "abbgebrochen"  && (
                        <button
                            className={styles.btnOrange}
                            onClick={handleCancel}
                            disabled={['completed', 'submitted'].includes(match.status)}>
                            Spiel Absagen
                        </button>
                    )}

                    {(match.status !== "pending" && match.status !== "completed" && match.status !== "abbgebrochen") && (
                        <button
                            className={styles.btnOrange}
                            onClick={handleAbbruch}
                            disabled={['completed', 'submitted'].includes(match.status)}>
                            Spiel Abbruch
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.card}>
                {renderView()}
            </div>

            <Modal open={noShowModalOpen} onClose={() => setNoShowModalOpen(false)}>
                <Box className={styles.modalContent}>
                    <h4>Welche Mannschaft hat das Spiel Gewonnen?</h4>
                    <div className={styles.grid2}>
                        <div>
                            <img className={styles.clubLogo} src={homeTeam.logo || ''} alt={homeTeam.name || 'Home Team'} style={{ maxWidth: '150px' }} />
                            <h4 className={styles.teamName}>{homeTeam.name || 'Home Team'}</h4>
                            <button
                                className={styles.btnOrange}
                                onClick={() => setSelectedWinner('home')}
                            >
                                HEIM TEAM Gewinnt
                            </button>
                        </div>
                        <div>
                            <img className={styles.clubLogo} src={awayTeam.logo || ''} alt={awayTeam.name || 'Away Team'} style={{ maxWidth: '150px' }} />
                            <h4 className={styles.teamName}>{awayTeam.name || 'Away Team'}</h4>
                            <button
                                className={styles.btnOrange}
                                onClick={() => setSelectedWinner('away')}
                            >
                                AUßWÄRTS TEAM Gewinnt
                            </button>
                        </div>
                    </div>
                    <button
                        className={styles.btnOrange}
                        onClick={handleNoShow}
                        disabled={!['home', 'away'].includes(selectedWinner)}
                    >
                        Spiel Absagen
                    </button>
                </Box>
            </Modal>

            <Modal open={abbruchModalOpen} onClose={() => setNoShowModalOpen(false)}>
                <Box className={styles.modalContent}>

                    <h4>Bestätigen sie das sie dieses Spiel Abbrechen wollen?</h4>
                    <p>Diese Aktion kann nicht wieder hergestellt werden!</p>

                    <div className={styles.grid}>
                        <button
                            className={styles.btnOrange}
                            onClick={executeAbbruch}
                        >
                            Spiel Abbrechen
                        </button>
                        <button
                            className={styles.btnGreen}
                            onClick={cancelHandleAbbruch}
                        >
                            Spiel Fortsetzen
                        </button>
                    </div>
                </Box>
            </Modal>


            <Modal open={!!modalType} onClose={handleCloseModal}>
                <Box className="modal-content">
                    {modalType === 'player' && selectedData ? (
                        <div className={styles.playerModalContainer}>
                            <img src={selectedData.image || 'https://via.placeholder.com/150'} alt={selectedData.name}
                                 style={{maxWidth: '400px'}}/>
                            <h3 className={styles.playerModalContainerName}>{selectedData.name}</h3>
                            <p className={styles.playerModalContainerNumber}>SPIELER NUMMER: {selectedData.number}</p>
                        </div>
                    ) : modalType === 'goal' && selectedData ? (
                        <div>
                            <h3>Goal Scored by {selectedData.scorer}</h3>
                            <p>Time: {selectedData.time}</p>
                        </div>
                    ) : (
                        <p>No data available</p>
                    )}
                </Box>
            </Modal>
        </Spring>
    );
};

export default RefDetailContainer;
