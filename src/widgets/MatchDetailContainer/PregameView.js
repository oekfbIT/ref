import React, { useState } from 'react';
import Spring from "@components/Spring";
import { Tabs } from "@mui/base/Tabs";
import { TabsList } from "@mui/base/TabsList";
import TabButton from "@ui/TabButton";
import { TabPanel } from "@mui/base/TabPanel";
import Fade from "@mui/material/Fade";
import PlayerRow from "@components/Row/PlayerRow";

const PregameView = ({ match, onPlayerClick, activeTab, setActiveTab }) => {
    const getNonLineupPlayers = (team) => {
        const lineupPlayers = team.starters || [];
        return team.players.filter(player => !lineupPlayers.includes(player.id));
    };

    const homeNonLineupPlayers = getNonLineupPlayers(match.home_blanket);
    const awayNonLineupPlayers = getNonLineupPlayers(match.away_blanket);

    return (
        <Spring className="card h-2 card w-100">
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
                                        // Add Trainer
                                        <PlayerRow
                                            key={player.id}
                                            player={player}
                                            index={index}
                                            onClick={() => onPlayerClick(player)}
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
                                            onClick={() => onPlayerClick(player)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </Fade>
                    </TabPanel>
                </div>
            </Tabs>
        </Spring>
    );
};

export default PregameView;
