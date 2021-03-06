import { filter } from "rxjs/operators";

class Area {
    actorsInArea = new Map();
    itemsInArea = new Map();

    constructor(info) {
        this.areaInfo = info;
    }

    subscribe = (subject, broadcastEvent) => {
        // FIXME: how do we get access to this better?
        this.broadcastEvent = broadcastEvent;
        const subscription = subject.pipe(filter(this.isAreaEvent))
            .subscribe(this.onAreaEvent);
        this.dropInitialItems();
        return subscription;
    }

    dropInitialItems = () => {
        if (!this.areaInfo.items) {
            return;
        }

        this.areaInfo.items
            .map(item => ({
                name: 'item-dropped',
                areaId: this.areaInfo.id,
                item
            }))
            .forEach(this.broadcastEvent);
    }

    isAreaEvent = (event) =>
        event.areaId === this.areaInfo.id &&
        ['entered-area', 'exited-area', 'item-dropped', 'item-obtained'].includes(event.name);

    onAreaEvent = ({name, actor, item}) => {
        switch (name) {
            case 'entered-area':
                this.actorsInArea.set(actor.id, actor);

                this.broadcastEvent({
                    name: 'observed-area',
                    actor,
                    areaId: this.areaInfo.id,
                    area: {
                        ...this.areaInfo,
                        items: undefined
                    },
                    nearby: [...this.actorsInArea.values()],
                    items: [...this.itemsInArea.values()]
                });
                break;
            case 'exited-area':
                this.actorsInArea.delete(actor.id);
                break;
            case 'item-dropped':
                this.itemsInArea.set(item.id, item);
                break;
            case 'item-obtained':
                this.itemsInArea.delete(item.id)
                break;
            default:
                break;
        }
    }
}

export default function getAreas() {
    return [
        new Area({
            id: 'start',
            title: 'Prison Cell',
            description: `You are located in a prison cell.
                On one wall there is a barred window near the ceiling.
                Below it is a shelf sticking out from the wall close to the ground to be used as a bed.
                The oppisite wall is made up of bars with an open door.`,
            exits: [
                {
                    to: 'prison-hallway',
                    label: 'Open Cell Door'
                }
            ],
            items: [
                {
                    id: 'nails-001',
                    name: 'Rusty Nails'
                }
            ]
        }),
        new Area({
            id: 'prison-hallway',
            title: 'Underground Hallway',
            description: `You are located in what appears to a be a prison hallway.
                There are eight cells. Four on each side.
                One of the cell doors is open.
                At the far end is a barred window near the ceiling.
                There are stairs at the near end leading up`,
            exits: [
                {
                    to: 'start',
                    label: 'Open Cell Door'
                },
                {
                    to: 'the-void',
                    label: 'Stairs leading up'
                }
            ]
        }),
        new Area({
            id: 'the-void',
            title: 'The Void',
            description: 'You are in a void',
            exits: [
                {
                    to: 'prison-hallway',
                    label: 'Go Back'
                }
            ]
        })
    ];
}