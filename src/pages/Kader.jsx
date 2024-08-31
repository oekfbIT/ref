import React, { useEffect, useState } from 'react';
import ApiService from './../network/ApiService';
import PageHeader from '@layout/PageHeader';
import styles from '@widgets/PlayerKaderInfo/Kader.module.scss';
import PlayerKaderInfo from "@widgets/PlayerKaderInfo/PlayerKaderInfo";
import AuthService from "../network/AuthService";
import styles2 from './Kader.module.css';

const Kader = () => {
    const [players, setPlayers] = useState([]);
    const [teamID, setTeamID] = useState("");

    useEffect(() => {
        const apiService = new ApiService();
        const authService = new AuthService();

        const fetchTeamData = async () => {
            if (authService.isAuthenticated()) {
                const storedTeamID = authService.getTeamID();
                setTeamID(storedTeamID);

                if (storedTeamID) {
                    try {
                        const data = await apiService.get(`teams/${storedTeamID}/players`);
                        setPlayers(data.players);
                    } catch (error) {
                        console.error('Error fetching team data:', error);
                    }
                } else {
                    console.error('No teamID found in cookies.');
                }
            }
        };

        fetchTeamData();
    }, []);

    return (
        <>
            <PageHeader title="Kader"/>
            <div style={{backgroundColor: "#24292B", padding: "25px", marginBottom: "10px"}}>
                <div className={styles2.lightH}>
                    Bei den Spielern müssen folgende punkte noch erledigt werden:
                </div>

                <div className={styles2.infoText}>
                    Bitte die Email Adresse der Spieler Aktualisieren
                </div>

                <div className={styles2.sub}>
                    Spielberechtigung wird am nächsten Werktag überprüft.
                </div>
            </div>

            <div className={styles.kaderGrid}>
                {players.map((player) => (
                    <PlayerKaderInfo key={player.id} player={player}/>
                ))}
            </div>
        </>
    );
};

export default Kader;
