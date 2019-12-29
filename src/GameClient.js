import React from 'react';

export default function GameClient({player}) {
    return (
        <div>
            <h2>{player.name} ({player.id})</h2>
        </div>
    );
}