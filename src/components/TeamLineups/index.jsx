// components/TeamLineups.js

import React from 'react';
import ElementTooltip from '@ui/ElementTooltip';
import styles from './styles.module.scss';
import field from '@assets/field.png';

const assignRole = (index) => {
    const roles = [
        'keeper',
        'center-back-left',
        'center-back-right',
        'center-midfielder-left',
        'center-midfielder-right',
        'center-forward'
    ];
    return roles[index] || 'center-forward'; // Fallback to center-forward if index exceeds the roles array length
};

const TeamLineups = ({ team, wrapperClass, withField, isCompact }) => {
    return (
        <div className={`${styles.container} ${wrapperClass || ''}`}>
            {
                withField && <img className={styles.field} src={field} alt="field" />
            }
            <div className={styles.overlay}>
                {
                    team.players.slice(0, 6).map((player, index) => { // Assuming you're using the first 6 players as starters
                        const role = assignRole(index);
                        return (
                            <ElementTooltip key={index} title={player.name}>
                                <div className={`${styles.player} ${isCompact ? styles.compact : ''}`} data-role={role}>
                                    <img className={styles.player_img} src={player.image} alt="avatar" />
                                    <span className={`${styles.player_num} h6`}>{player.number}</span>
                                </div>
                            </ElementTooltip>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default TeamLineups;
