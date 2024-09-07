import React, { useEffect, useState } from 'react';
import AuthService from '../../network/AuthService';
import ApiService from '../../network/ApiService';
import styles from './FianzenList.module.css';

const RechnungList = () => {
    const [rechnungen, setRechnungen] = useState([]);
    const [team, setTeam] = useState(null);
    const authService = new AuthService();
    const apiService = new ApiService();

    useEffect(() => {
        const fetchRechnungen = async () => {
            try {
                const refID = authService.getRefID();
                const authToken = authService.getAuthToken();

                if (refID && authToken) {
                    const response = await apiService.get(`referees/${refID}`);
                    setTeam(response);
                } else {
                    console.error('TeamID or AuthToken is missing.');
                }
            } catch (error) {
                console.error('Error fetching rechnungen:', error);
            }
        };

        fetchRechnungen();
    }, []);

    return (
        <div className={styles.rechnungenList}>
            {team && (
                <div style={{backgroundColor: "#24292B", padding: "25px", marginBottom: "20px"}}>
                    <div className={styles.guthaben}>
                        Offener Betrag: {team.balance} €
                        <div className={styles.sub}>
                            (Die Administration sorgt dafür Wöchentlich die offenen Beträge zu Überweisen)
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RechnungList;
