import { AreaDefinition } from "./areas";

export interface ActorIdentity {
    readonly id: string;
    readonly name: string;
}

export default interface GameEvent {
    readonly name: string;
    readonly areaId: string;
    readonly actor: ActorIdentity;

    readonly area?: AreaDefinition;
    readonly nearby?: ActorIdentity[];
}