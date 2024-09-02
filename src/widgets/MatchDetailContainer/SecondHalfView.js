
// views/SecondHalfView.js
import React from 'react';
import styles from './styles.module.scss'; // Ensure this file exists
const SecondHalfView = ({ match}) => {
    return (
        <div className={styles.viewContainer}>
            <h3>Second Half View</h3>
        </div>
    );
};

export default SecondHalfView;
