// views/FirstHalfView.js
import React from 'react';
import styles from './styles.module.scss'; // Ensure this file exists
const FirstHalfView = ({ match}) => {
    return (
        <div className={styles.viewContainer}>
            <h3>First Half View</h3>
        </div>
    );
};

export default FirstHalfView;
