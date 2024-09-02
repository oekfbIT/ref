import React, { useEffect, useState } from 'react';
import MatchController from '../../network/MatchController';
import Spring from '@components/Spring';
import styles from './styles.module.scss';
import PregameView from './PregameView';
import FirstHalfView from './FirstHalfView';
import HalfTimeView from './HalfTimeView';
import SecondHalfView from './SecondHalfView';
import Score from "@ui/Score";
import { Button } from "antd";
import { getElapsedTime } from '../../utils/time'; // Updated time utility

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
    const matchController = new MatchController();

    useEffect(() => {
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

        fetchMatch();
    }, [id]);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                if (match) {
                    updateStopwatch(match);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, match]);

    const updateStopwatch = (matchData) => {
        if (!matchData) return;

        const { status, first_half_start_date, second_half_start_date, first_half_end_date } = matchData;

        switch (status) {
            case 'pending':
                setStopwatch('00:00:00');
                setIsRunning(false); // Stop the stopwatch for pending
                break;
            case 'first':
                if (first_half_start_date) {
                    const elapsedSeconds = getElapsedTime(first_half_start_date);
                    setStopwatch(formatTime(elapsedSeconds));
                    setIsRunning(true); // Start the stopwatch for the first half
                } else {
                    setStopwatch('00:00:00');
                    setIsRunning(false);
                }
                break;
            case 'halftime':
                const elapsedSeconds = getElapsedTime(first_half_end_date);
                setStopwatch(formatTime(elapsedSeconds));
                setIsRunning(true);
                break;
            case 'second':
                if (second_half_start_date) {
                    const elapsedSeconds = getElapsedTime(second_half_start_date);
                    const totalSeconds = 25 * 60 + elapsedSeconds; // Start at 25 minutes and add elapsed time
                    setStopwatch(formatTime(totalSeconds));
                    setIsRunning(true); // Start the stopwatch for the second half
                } else {
                    console.error('Missing start date for second half');
                    setStopwatch('25:00');
                    setIsRunning(false);
                }
                break;
            case 'completed':
                setStopwatch('Spiel Abgeschlossen');
                setIsRunning(false); // Stop the stopwatch when the match is completed
                break;
            default:
                setStopwatch('00:00:00');
                setIsRunning(false); // Default case to stop stopwatch
                break;
        }
    };

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
            // Refetch match data and reset the counter
            const updatedMatch = await matchController.getMatchById(id);
            setMatch(updatedMatch);
            updateStopwatch(updatedMatch);
        } catch (error) {
            console.error('Failed to perform action:', error);
        }
    };

    if (!match) return <div>Loading...</div>;

    const homeTeam = match.home_blanket || {};
    const awayTeam = match.away_blanket || {};

    const renderView = () => {
        switch (match.status) {
            case 'pending':
                return <PregameView match={match} />;
            case 'first':
                return <FirstHalfView match={match} />;
            case 'halftime':
                return <HalfTimeView match={match} />;
            case 'second':
                return <SecondHalfView match={match} />;
            default:
                return <div>Invalid match status</div>;
        }
    };

    // Determine button text and action based on match status
    const buttonText = () => {
        switch (match.status) {
            case 'pending':
                return 'Spiel Starten';
            case 'first':
                return '1. Halbzeit Beenden';
            case 'second':
                return 'Spiel Beenden';
            case 'halftime':
                return '2. Halbzeit Starten';
            case 'completed':
                return 'Spiel Abschließen';
            case 'submitted':
                return match.report === 'cancelled' ? 'Dieses Match wurde Abgesagt' : 'Dieses Match ist abgeschlossen';
            default:
                return '';
        }
    };

    const statusDisplayName = () => {
        switch (match.status) {
            case 'pending':
                return 'Spiel noch nicht begonnen';
            case 'first':
                return '1. Halbzeit';
            case 'second':
                return '2. Halbzeit';
            case 'halftime':
                return 'Halbzeit';
            case 'completed':
                return 'Spiel Abgeschlossen';
            case 'submitted':
                return match.report === 'cancelled' ? 'Dieses Match wurde Abgesagt' : 'Dieses Match ist abgeschlossen';
            default:
                return '';
        }
    };
    return (
        <Spring>
            {/* Main card displaying teams and score */}
            <div className={styles.card}>
                <div className={styles.grid}>
                    <TeamCard team={homeTeam} isHome={true} />
                    <div className={styles.middleCol}>
                        <Score team1={match.score?.home || 0} team2={match.score?.away || 0} variant="alt" />
                    </div>
                    <TeamCard team={awayTeam} isHome={false} />
                </div>
            </div>

            {/* Stopwatch Card */}
            <div className={styles.card}>
                <div className={styles.stopwatchContainer}>
                    <p className={styles.counterLbl}>
                        {statusDisplayName()}
                    </p>
                    <p className={styles.counter}>
                        {stopwatch}
                    </p>
                </div>
            </div>


            {/* Action buttons */}
            <div className={styles.card}>
                <div className="d-flex justify-content-center p-2">
                    <button className={styles.btnGreen} onClick={handleAction} disabled={['completed', 'submitted'].includes(match.status)}>
                        {buttonText()}
                    </button>
                </div>
            </div>

            {/* Match-specific view */}
            <div className={styles.card}>
                {renderView()}
            </div>
        </Spring>
    );
};

export default RefDetailContainer;
