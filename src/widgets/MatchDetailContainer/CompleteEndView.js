import React, { useState, useEffect } from 'react';
import Spring from "@components/Spring";
import { Tabs } from "@mui/base/Tabs";
import { TabsList } from "@mui/base/TabsList";
import TabButton from "@ui/TabButton";
import { TabPanel } from "@mui/base/TabPanel";
import Fade from "@mui/material/Fade";
import PlayerRow from "@components/Row/PlayerRow";
import styles from "@widgets/MatchDetailContainer/styles.module.scss";
import MatchController from '../../network/MatchController'; // Import MatchController

const CompleteEndView = ({ match, onPlayerClick, activeTab, setActiveTab, onConfirm }) => {
    const [textareaContent, setTextareaContent] = useState('');
    const matchController = new MatchController(); // Instantiate MatchController

    // Populate textarea with match.bericht if it exists
    useEffect(() => {
        if (match.bericht) {
            setTextareaContent(match.bericht);
        }
    }, [match.bericht]);

    const getNonLineupPlayers = (team) => {
        const lineupPlayers = team.starters || [];
        return team.players.filter(player => !lineupPlayers.includes(player.id));
    };

    const homeNonLineupPlayers = getNonLineupPlayers(match.home_blanket);
    const awayNonLineupPlayers = getNonLineupPlayers(match.away_blanket);

    const handlePlayerClick = (player) => {
        const newContent = `${textareaContent}NR:  ${player.number}, SID: ${player.sid}, NAME: ${player.name} \n \n`;
        setTextareaContent(newContent);
    };

    const handleSubmit = async () => {
        try {
            await matchController.submitGame(match.id, textareaContent);
            alert("Match report submitted successfully!");

            if (typeof onConfirm === "function") {
                onConfirm();  // Ensure onConfirm is a valid function and call it after submission
            }
        } catch (error) {
            console.error("Error submitting the match report:", error);
            alert("Failed to submit match report.");
        }
    };

    return (
        <Spring className="card card w-100">
            <Tabs className="d-flex flex-column h-100 g-30" value={activeTab}>
                <TabsList className="tab-nav col-2">
                    <TabButton
                        title={"HEIM"}
                        onClick={() => setActiveTab('home')}
                        active={activeTab === 'home'}
                        type="color"
                        color="accent"
                    />
                    <TabButton
                        title={"AUSWÄRTS"}
                        onClick={() => setActiveTab('away')}
                        active={activeTab === 'away'}
                        type="color"
                        color="grass"
                    />
                </TabsList>
                <div className="flex-1 h-100">
                    <TabPanel className="h-100" value="home">
                        <Fade in={activeTab === 'home'} timeout={400}>
                            <div className="h-100" style={{ marginTop: 10 }}>
                                <div className="d-flex flex-column g-1">
                                    {homeNonLineupPlayers.map((player, index) => (
                                        <PlayerRow
                                            key={player.id}
                                            player={player}
                                            index={index}
                                            onClick={() => handlePlayerClick(player)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Fade>
                    </TabPanel>
                    <TabPanel className="h-100" value="away">
                        <Fade in={activeTab === 'away'} timeout={400}>
                            <div className="h-100" style={{ marginTop: 10 }}>
                                <div className="d-flex flex-column g-1">
                                    {awayNonLineupPlayers.map((player, index) => (
                                        <PlayerRow
                                            key={player.id}
                                            player={player}
                                            index={index}
                                            onClick={() => handlePlayerClick(player)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Fade>
                    </TabPanel>
                </div>
            </Tabs>
            <h3 className={styles.playerModalContainerName} style={{ marginTop: "40px" }}>Spielbereicht Abgeben</h3>
            <div className="d-flex flex-column flex-1 g-30">
                <textarea
                    className="field flex-1"
                    value={textareaContent}
                    onChange={(e) => setTextareaContent(e.target.value)} // Allow manual input updates
                />
                <div className="d-flex flex-column g-16">
                    <button
                        onClick={handleSubmit} // Call handleSubmit on click
                        className="btn">Spielbericht Absenden
                    </button>
                </div>
            </div>

        </Spring>
    );
};

export default CompleteEndView;
