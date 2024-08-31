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
                const teamID = authService.getRefID();
                const authToken = authService.getAuthToken();

                if (teamID && authToken) {
                    const response = await apiService.get(`teams/${teamID}/rechungen`);
                    setRechnungen(response.rechnungen);
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

            <div style={{backgroundColor: "#24292B", padding: "25px", marginBottom: "20px"}}>
                <div className={styles.lightH}>
                    Kontonummer des Bundes:
                </div>

                <div className={styles.infoText}>
                    IBAN: AT26 2011 1829 7052 4200
                </div>

                <div className={styles.sub}>
                    (Bei Überweisungen immer den Mannschaftsnamen angeben!)
                </div>
            </div>

            {team && (
                <div style={{backgroundColor: "#24292B", padding: "25px", marginBottom: "20px"}}>
                    <div className={styles.guthaben}>
                        Guthaben: {team.balance} €
                        <div className={styles.sub}>
                            (Bitte 2 Werktage für die bearbeitung in betracht nehmen)
                        </div>
                    </div>
                </div>
            )}

            <table className={styles.table}>
                <thead>
                <tr>
                    <th className={styles.header}>Datum</th>
                    <th className={styles.header}>Beschreibung</th>
                    <th className={styles.header}>€ Betrag</th>
                </tr>
                </thead>
                <tbody>
                {rechnungen.map((rechnung) => (
                    <tr key={rechnung.id} className={styles.row}>
                        <td className={styles.cell}>{new Date(rechnung.created).toLocaleDateString()}</td>
                        <td className={styles.cell}>{rechnung.kennzeichen}</td>
                        <td className={styles.cell}>€ {rechnung.summ}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default RechnungList;
