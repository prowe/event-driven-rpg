import React, {useState, useContext} from 'react';
import styles from './MovementControls.module.css';

export default function MovementControlls() {


    function onWillMove(deltaX, deltaY) {

    }

    return (
        <div className={styles.controls}>
            <button className={styles.northButton} onClick={() => onWillMove(0, 1)}>N</button>
            <button className={styles.eastButton} onClick={() => onWillMove(1, 0)}>E</button>
            <button className={styles.southButton} onClick={() => onWillMove(0, -1)}>S</button>
            <button className={styles.westButton} onClick={() => onWillMove(-1, 0)}>W</button>
            <div className={styles.currentPosition}></div>
        </div>
    );
}
