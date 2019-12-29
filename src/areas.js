
export default [
    {
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
        ]
    },
    {
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
    },
    {
        id: 'the-void',
        title: 'The Void',
        description: 'You are in a void',
        exits: [
            {
                to: 'prison-hallway',
                label: 'Go Back'
            }
        ]
    }
];