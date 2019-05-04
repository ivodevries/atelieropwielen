import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { isFuture, isPast, format } from 'date-fns';
import * as nl from 'date-fns/locale/nl';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Map, List } from 'immutable';
import { EventInterface } from '../models/event';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {
    @Output()
    load = new EventEmitter();
    private routeSubscription: Subscription;
    @Output()
    eventSelected = new EventEmitter();

    events: List<Map<any, EventInterface>>;
    constructor(private route: ActivatedRoute) {}

    async ngOnInit() {
        const findEvent = eventId => this.events.find(event => event.get('id') === eventId);
        let pendingEventId;
        this.routeSubscription = this.route.fragment.subscribe((urlHash: any) => {
            if (this.events) {
                const event = findEvent(urlHash);
                console.log('emitting', urlHash);
                this.eventSelected.emit(event);
            } else {
                pendingEventId = urlHash;
            }
        });
        const icsUrl =
            'https://calendar.google.com/calendar/ical/ae81d9nt77nvqae5r6a006mivg%40group.calendar.google.com/public/basic.ics';
        const rawContent = await fetch(
            `https://www.atelieropwielen.com/proxy.php?url=${encodeURIComponent(icsUrl)}`
        ).then(content => content.text());
        const rawEvents = rawContent.split('END:VEVENT').filter(item => item.indexOf('BEGIN:VEVENT') > -1);

        const getRawProperty = (rawEventItems, prop) => {
            const item = rawEventItems.find(rawEventItem => rawEventItem.indexOf(prop) === 0);
            if (item) {
                return item.replace(prop + ':', '').replace(/\\,/g, ',');
            }
            return prop;
        };

        const strToDate = (str: string): Date => {
            return new Date(
                str.replace(/([0-9]{4})([0-9]{2})([0-9]{2})T([0-9]{2})([0-9]{2})([0-9]{2})/, '$1-$2-$3T$4:$5:$6')
            );
        };

        const getTimeState = (timeStart: Date, timeEnd: Date): string => {
            const startsInFuture = isFuture(timeStart);
            // return 'future';

            if (startsInFuture) {
                return 'future';
            }

            const endsInPast = isPast(timeEnd);

            if (endsInPast) {
                return 'past';
            }

            const startsInPast = isPast(timeStart);
            const endsInFuture = isFuture(timeEnd);

            if (startsInPast && endsInFuture) {
                return 'now';
            }
        };

        const lngLats = {
            vroesenpark: [4.452972, 51.930539],
            statensingel: [4.456556, 51.92698],
            speeldernis: [4.441196, 51.923301],
            noorderhavenkade: [4.460395, 51.933965]
        };
        const locationNameRegExp = new RegExp(Object.keys(lngLats).join('|'), 'i');
        const extractLocationName = (location): string => {
            const matches = location.match(locationNameRegExp);

            return matches ? matches[0] : undefined;
        };

        const defaultDescription = `
        Er rijdt sinds kort een wel een heel bijzonder voertuig door Rotterdam. Een bakfiets vol tekentafeltjes en de mooiste kunstmaterialen, zodat er overal en altijd getekend en geschilderd kan worden. En, met aan het stuur tekenjuf Sonja.

        Sonja van Dolron, kunstenaar en bevlogen kunstdocente, is de initiatiefnemer van het Atelier op wielen.  Met de bakfiets, gesteund door de wijkraad Blijdorp, rijdt ze door de wijk Blijdorp om workshops op locatie te verzorgen.

        Op vier vaste locaties in Blijdorp is het atelier met regelmaat te vinden en kan iedereen tegen vrijwillige bijdrage mee doen. `;
        this.events = List(rawEvents
            .map(rawEvent => {
                const rawEventItems = rawEvent.replace(/\r/g, '').split('\n');
                const location = getRawProperty(rawEventItems, 'LOCATION');
                const timeStart = strToDate(getRawProperty(rawEventItems, 'DTSTART'));
                const timeEnd = strToDate(getRawProperty(rawEventItems, 'DTEND'));
                const timeState = getTimeState(timeStart, timeEnd);
                const description = getRawProperty(rawEventItems, 'DESCRIPTION') || defaultDescription;
                const summary = getRawProperty(rawEventItems, 'SUMMARY');
                const locationName = extractLocationName(location);

                if (location && locationName && timeState !== 'past') {
                    const lngLat = lngLats[locationName.toLowerCase()];

                    const id = `${locationName.toLowerCase()}-${format(timeStart, 'dddd-D-MMMM-YYYY', { locale: nl })}`;
                    const event: EventInterface = {
                        id,
                        location,
                        description,
                        summary,
                        timeStart,
                        timeEnd,
                        timeState,
                        lngLat,
                        fullItem: rawEvent
                    };
                    return event;
                }
            })
            .filter(item => item !== undefined)
            .sort((a, b) => (a.timeStart > b.timeStart ? 1 : -1)).map(Map));

        if (pendingEventId) {
            const event = findEvent(pendingEventId);
            if (event) {
                console.log('emitting eventSelected with', event);
                this.eventSelected.emit(event);
            }
        }
        this.load.emit(this.events);
    }

    ngOnDestroy() {
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }
}
