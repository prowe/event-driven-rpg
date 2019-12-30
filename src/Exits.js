import React, { useEffect, useState } from 'react';
import { useEventBus } from './EventContext.tsx';
import { filter } from 'rxjs/operators';

function ExitRow({areaId, exit, player}) {
    const {broadcastEvent} = useEventBus();

    function onClick() {
        broadcastEvent({
            name: 'entered-area',
            areaId: exit.to,
            actor: {
                id: player.id,
                name: player.name
            }
        });

        broadcastEvent({
            name: 'exited-area',
            areaId,
            actor: {
                id: player.id,
                name: player.name
            }
        });
    }

    return <li><button onClick={onClick}>{exit.label}</button></li>;
}

export default function Exits({player}) {
    const {subject} = useEventBus();
    const [exitState, setExitState] = useState({exits: []});

    useEffect(() => {
        function isObserveAreaEvent(event) {
            return event.name === 'observed-area' &&
                event.actor.id === player.id;
        }

        function onObserveArea(event) {
            const {exits, id} = event.area;
            setExitState({
                areaId: id,
                exits
            });
        }

        const subscription = subject.pipe(filter(isObserveAreaEvent))
            .subscribe({next: onObserveArea});
        return () => subscription.unsubscribe();
    }, [subject, setExitState, player]);

    return (
        <div style={{gridArea: 'Exits'}}>
            <h3>Exits</h3>
            <ul>
                {exitState.exits.map((exit, index) => <ExitRow key={index} areaId={exitState.areaId} exit={exit} player={player} />)}
            </ul>
        </div>
    )
}