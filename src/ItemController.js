import { useRef, useEffect } from 'react';
import { useEventBus } from './EventContext';
import { filter } from 'rxjs/operators';

export default function ItemController() {
    const itemStatusById = useRef(new Map());
    const {subject, broadcastEvent} = useEventBus();

    useEffect(() => {
        function onItemEvent(event) {
            const {actor, item, areaId} = event;

            switch(event.name) {
                case 'item-dropped':
                    itemStatusById.current.set(item.id, {
                        id: item.id,
                        name: item.name,
                        currentOwner: undefined,
                        currentAreaId: areaId
                    });
                    break;
                case 'try-pickup-item':
                    const itemStatus = itemStatusById.current.get(item.id);
                    if (itemStatus && itemStatus.currentOwner === undefined) {
                        itemStatusById.current.set(item.id, {
                            id: item.id,
                            name: item.name,
                            currentOwner: actor,
                            currentAreaId: areaId
                        });
                        broadcastEvent({
                            name: 'item-obtained',
                            areaId,
                            actor,
                            item
                        });
                    }
                    break;
                default:
                    break;
            }
        }

        function isItemEvent(event) {
            return ['item-dropped', 'try-pickup-item'].includes(event.name);
        }
        subject.pipe(filter(isItemEvent))
            .subscribe({next: onItemEvent})
    })

    return null;
}