import { List, Map } from 'immutable';

export interface EventInterface {
    id: any;
    location: string;
    description: string;
    summary: string;
    timeStart: Date;
    timeEnd: Date;
    timeState: string;
    lngLat: number[];
    fullItem: string;
}
export interface EventMap extends Map<any, EventInterface> {}
export interface EventList extends List<Map<any, EventInterface>> {}
