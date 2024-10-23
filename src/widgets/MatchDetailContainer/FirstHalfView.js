import React, { useState } from 'react';
import styles from './styles.module.scss';
import RedCardModal from './modals/red';
import YellowCardModal from './modals/yellow';
import YellowRedCardModal from './modals/yellowRed';
import GoalModal from './modals/goal';
import PregameView from "@widgets/MatchDetailContainer/PregameView";
import MatchController from "../../network/MatchController";
import { useMinute } from './MinuteContext';  // Import minute context

const FirstHalfView = ({ match, activeTab, setActiveTab, teamID, refetch, onPlayerClick }) => {
    const [redCardOpen, setRedCardOpen] = useState(false);
    const [yellowCardOpen, setYellowCardOpen] = useState(false);
    const [yellowRedCardOpen, setYellowRedCardOpen] = useState(false);
    const [goalOpen, setGoalOpen] = useState(false);
    const matchController = new MatchController();
    const { minute } = useMinute();  // Get the current minute from the context

    const handleOpenRedCard = () => setRedCardOpen(true);
    const handleOpenYellowCard = () => setYellowCardOpen(true);
    const handleOpenYellowRedCard = () => setYellowRedCardOpen(true);
    const handleOpenGoal = () => setGoalOpen(true);

    const handleGoalConfirm = async (selectedPlayer, scoreTeam, ownGoal) => {
        try {
            await matchController.addGoal(
                match.id,
                selectedPlayer.id,
                scoreTeam,    // "home" or "away"
                minute,
                selectedPlayer.name,
                selectedPlayer.image,
                selectedPlayer.number.toString(),
                ownGoal       // Pass the ownGoal value
            );

            console.log('Goal assigned to:', selectedPlayer.name);

            await refetch();  // Refetch data after successful event
            setGoalOpen(false);
        } catch (error) {
            console.error('Failed to assign goal:', error);
        }
    };

    const handleRedCardConfirm = async (selectedPlayer) => {
        try {
            await matchController.addRedCard(
                match.id,
                selectedPlayer.id,
                teamID,
                minute,
                selectedPlayer.name,
                selectedPlayer.image,
                selectedPlayer.number.toString(),
                activeTab

            );

            console.log('Red card assigned to:', selectedPlayer.name);

            await refetch();  // Refetch data after successful event
            setRedCardOpen(false);
        } catch (error) {
            console.error('Failed to assign red card:', error);
        }
    };

    const handleYellowRedCardConfirm = async (selectedPlayer) => {
        try {
            await matchController.addYellowRedCard(
                match.id,
                selectedPlayer.id,
                teamID,
                minute,
                selectedPlayer.name,
                selectedPlayer.image,
                selectedPlayer.number.toString(),
                activeTab
            );

            console.log('Yellow-Red card assigned to:', selectedPlayer.name);

            await refetch();  // Refetch data after successful event
            setYellowRedCardOpen(false);
        } catch (error) {
            console.error('Failed to assign yellow-red card:', error);
        }
    };

    const handleYellowConfirm = async (selectedPlayer) => {
        try {
            await matchController.addYellowCard(
                match.id,
                selectedPlayer.id,
                teamID,
                minute,
                selectedPlayer.name,
                selectedPlayer.image,
                selectedPlayer.number.toString(),
                activeTab
            );

            console.log('Yellow card assigned to:', selectedPlayer.name);

            await refetch();  // Refetch data after successful event
            setYellowCardOpen(false);
        } catch (error) {
            console.error('Failed to assign yellow card:', error);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await matchController.deleteEvent(eventId);
            await refetch();  // Refetch after event deletion
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    };

    const players = activeTab === 'home'
        ? match?.home_blanket?.players || []
        : match?.away_blanket?.players || [];

    return (
        <div className={styles.actions}>
            <div className={styles.grid3}>
                <div className={styles.gridItem} onClick={handleOpenRedCard}>
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/oekfbbucket.appspot.com/o/adminfiles%2Ficons%2Frot.png?alt=media&token=bdd39008-c39d-4928-a9ed-74c4fe764c2f"
                        alt="Red Card"/>
                    <p>Rote Karte</p>
                </div>
                <div className={styles.gridItem} onClick={handleOpenYellowCard}>
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/oekfbbucket.appspot.com/o/adminfiles%2Ficons%2Fgeld.png?alt=media&token=ff324f73-1e7e-4dba-aca9-735944a33869"
                        alt="Yellow Card"/>
                    <p>Gelbe Karte</p>
                </div>
                <div className={styles.gridItem} onClick={handleOpenYellowRedCard}>
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/oekfbbucket.appspot.com/o/adminfiles%2Ficons%2Fgeldrot.png?alt=media&token=c9044e5e-0357-46a3-8931-b89c58d45b33"
                        alt="Yellow-Red Card"/>
                    <p>Gelb-Rote Karte</p>
                </div>
                <div className={styles.gridItem} onClick={handleOpenGoal}>
                    <img
                        src="https://firebasestorage.googleapis.com/v0/b/oekfbbucket.appspot.com/o/adminfiles%2Ficons%2Ftor.png?alt=media&token=cd8e26a5-bdd8-41a4-a47a-f1a2a22a84bd"
                        alt="Add Goal"/>
                    <p>Tor</p>
                </div>
            </div>

            <PregameView
                match={match}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onPlayerClick={ onPlayerClick }
            />

            {/* Modals */}
            <RedCardModal
                open={redCardOpen}
                onClose={() => setRedCardOpen(false)}
                onConfirm={handleRedCardConfirm}
                players={players}
            />
            <YellowCardModal
                open={yellowCardOpen}
                onClose={() => setYellowCardOpen(false)}
                onConfirm={handleYellowConfirm}
                players={players}
            />
            <YellowRedCardModal
                open={yellowRedCardOpen}
                onClose={() => setYellowRedCardOpen(false)}
                onConfirm={handleYellowRedCardConfirm}
                players={players}
            />
            <GoalModal
                match={match}
                open={goalOpen}
                onConfirm={handleGoalConfirm}
                onClose={() => setGoalOpen(false)}
                players={players}
            />
        </div>
    );
};

export default FirstHalfView;
