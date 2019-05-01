import { Component, OnInit, Output } from '@angular/core';
import { isFuture, isPast } from 'date-fns';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
    @Output()
    load = new EventEmitter();
    events: any;
    constructor() {}

    async ngOnInit() {
        const icsUrl =
            'https://calendar.google.com/calendar/ical/ae81d9nt77nvqae5r6a006mivg%40group.calendar.google.com/public/basic.ics';
        const rawContent = await fetch(
            `https://www.atelieropwielen.com/proxy.php?url=${encodeURIComponent(icsUrl)}`
        ).then(content => content.text());
        const rawEvents = rawContent.split('END:VEVENT').filter(item => item.indexOf('BEGIN:VEVENT') > -1);

        const getRawProperty = (rawEventItems, prop) => {
            const item = rawEventItems.find(rawEventItem => rawEventItem.indexOf(prop) === 0);
            if (item) {
                return item.replace(prop + ':', '');
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
            return 'future';

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

        console.log(rawEvents);

        this.events = rawEvents
            .map(rawEvent => {
                const rawEventItems = rawEvent.replace(/\r/g, '').split('\n');
                const location = getRawProperty(rawEventItems, 'LOCATION');
                const timeStart = strToDate(getRawProperty(rawEventItems, 'DTSTART'));
                const timeEnd = strToDate(getRawProperty(rawEventItems, 'DTEND'));
                const timeState = getTimeState(timeStart, timeEnd);
                if (location && timeState !== 'past') {
                    return {
                        location,
                        description: getRawProperty(rawEventItems, 'DESCRIPTION'),
                        summary: getRawProperty(rawEventItems, 'SUMMARY'),
                        timeStart,
                        timeEnd,
                        timeState,
                        fullItem: rawEvent
                    };
                }
            })
            .filter(item => item !== undefined).sort((a, b) => a.timeStart > b.timeStart ? 1 : -1);

        // this.events = [
        //     {
        //         location: 'Rotterdam\\, Vroesenpark\\, 3039 CP Rotterdam\\, Nederland',
        //         description: 'Vandaag gaan we kleuren mengen',
        //         summary: 'Tekenen in vroesenpark',
        //         timeStart: '20190222T100000Z',
        //         timeEnd: '20190222T121500Z',
        //         timeState: 'future',
        //         fullItem:
        //             '\r\nBEGIN:VEVENT\r\nDTSTART:20190222T100000Z\r\nDTEND:20190222T121500Z\r\nDTSTAMP:20190224T211704Z\r\nUID:3rsf90nam2296piird0ng7dsj5@google.com\r\nCREATED:20190220T200109Z\r\nDESCRIPTION:\r\nLAST-MODIFIED:20190220T200208Z\r\nLOCATION:Rotterdam\\, Vroesenpark\\, 3039 CP Rotterdam\\, Nederland\r\nSEQUENCE:0\r\nSTATUS:CONFIRMED\r\nSUMMARY:Tekenen in vroesenpark\r\nTRANSP:OPAQUE\r\n'
        //     },
        //     {
        //         location: 'Rotterdam\\, Vroesenpark\\, 3039 CP Rotterdam\\, Nederland',
        //         description: 'Vandaag gaan we kleuren mengen',
        //         summary: 'Tekenen in Vroesenpark',
        //         timeStart: '20190222T100000Z',
        //         timeEnd: '20190222T121500Z',
        //         timeState: 'future',
        //         fullItem:
        //             '\r\nBEGIN:VEVENT\r\nDTSTART:20190222T100000Z\r\nDTEND:20190222T121500Z\r\nDTSTAMP:20190224T211704Z\r\nUID:3rsf90nam2296piird0ng7dsj5@google.com\r\nCREATED:20190220T200109Z\r\nDESCRIPTION:\r\nLAST-MODIFIED:20190220T200208Z\r\nLOCATION:Rotterdam\\, Vroesenpark\\, 3039 CP Rotterdam\\, Nederland\r\nSEQUENCE:0\r\nSTATUS:CONFIRMED\r\nSUMMARY:Tekenen in vroesenpark\r\nTRANSP:OPAQUE\r\n'
        //     },
        //     {
        //         location: 'Rotterdam\\, Statensingel\\, 3039 CP Rotterdam\\, Nederland',
        //         description: 'Vandaag gaan we kleuren mengen',
        //         summary: 'Tekenen in vroesenpark',
        //         timeStart: '20190222T100000Z',
        //         timeEnd: '20190222T121500Z',
        //         timeState: 'now',
        //         fullItem:
        //             '\r\nBEGIN:VEVENT\r\nDTSTART:20190222T100000Z\r\nDTEND:20190222T121500Z\r\nDTSTAMP:20190224T211704Z\r\nUID:3rsf90nam2296piird0ng7dsj5@google.com\r\nCREATED:20190220T200109Z\r\nDESCRIPTION:\r\nLAST-MODIFIED:20190220T200208Z\r\nLOCATION:Rotterdam\\, Vroesenpark\\, 3039 CP Rotterdam\\, Nederland\r\nSEQUENCE:0\r\nSTATUS:CONFIRMED\r\nSUMMARY:Tekenen in vroesenpark\r\nTRANSP:OPAQUE\r\n'
        //     },
        //     {
        //         location: 'Rotterdam\\, Speeldernis\\, 3039 CP Rotterdam\\, Nederland',
        //         description: 'Vandaag gaan we kleuren mengen',
        //         summary: 'Tekenen in Speeldernis',
        //         timeStart: '20190222T100000Z',
        //         timeEnd: '20190222T121500Z',
        //         timeState: 'past',
        //         fullItem:
        //             '\r\nBEGIN:VEVENT\r\nDTSTART:20190222T100000Z\r\nDTEND:20190222T121500Z\r\nDTSTAMP:20190224T211704Z\r\nUID:3rsf90nam2296piird0ng7dsj5@google.com\r\nCREATED:20190220T200109Z\r\nDESCRIPTION:\r\nLAST-MODIFIED:20190220T200208Z\r\nLOCATION:Rotterdam\\, Vroesenpark\\, 3039 CP Rotterdam\\, Nederland\r\nSEQUENCE:0\r\nSTATUS:CONFIRMED\r\nSUMMARY:Tekenen in vroesenpark\r\nTRANSP:OPAQUE\r\n'
        //     },
        //     {
        //         location: 'Rotterdam\\, noorderhavenkade\\, 3039 CP Rotterdam\\, Nederland',
        //         description: 'Vandaag gaan we kleuren mengen',
        //         summary: 'Tekenen in noorderhavenkade',
        //         timeStart: '20190222T100000Z',
        //         timeEnd: '20190222T121500Z',
        //         timeState: 'past',
        //         fullItem:
        //             '\r\nBEGIN:VEVENT\r\nDTSTART:20190222T100000Z\r\nDTEND:20190222T121500Z\r\nDTSTAMP:20190224T211704Z\r\nUID:3rsf90nam2296piird0ng7dsj5@google.com\r\nCREATED:20190220T200109Z\r\nDESCRIPTION:\r\nLAST-MODIFIED:20190220T200208Z\r\nLOCATION:Rotterdam\\, Vroesenpark\\, 3039 CP Rotterdam\\, Nederland\r\nSEQUENCE:0\r\nSTATUS:CONFIRMED\r\nSUMMARY:Tekenen in vroesenpark\r\nTRANSP:OPAQUE\r\n'
        //     },
        //     {
        //         location: 'Rotterdam\\, noorderhavenkade\\, 3039 CP Rotterdam\\, Nederland',
        //         description: 'Vandaag gaan we kleuren mengen',
        //         summary: 'Tekenen in noorderhavenkade',
        //         timeStart: '20190222T100000Z',
        //         timeEnd: '20190222T121500Z',
        //         timeState: 'future',
        //         fullItem:
        //             '\r\nBEGIN:VEVENT\r\nDTSTART:20190222T100000Z\r\nDTEND:20190222T121500Z\r\nDTSTAMP:20190224T211704Z\r\nUID:3rsf90nam2296piird0ng7dsj5@google.com\r\nCREATED:20190220T200109Z\r\nDESCRIPTION:\r\nLAST-MODIFIED:20190220T200208Z\r\nLOCATION:Rotterdam\\, Vroesenpark\\, 3039 CP Rotterdam\\, Nederland\r\nSEQUENCE:0\r\nSTATUS:CONFIRMED\r\nSUMMARY:Tekenen in vroesenpark\r\nTRANSP:OPAQUE\r\n'
        //     }
        // ];

        const locationNameRegExp = new RegExp(Object.keys(lngLats).join('|'), 'i');
        const extractLocationName = (location): string => {
            const matches = location.match(locationNameRegExp);

            return matches ? matches[0] : undefined;
        };
        this.events = this.events
            .map(event => {
                const locationName = extractLocationName(event.location);
                if (locationName) {
                    event.lngLat = lngLats[locationName.toLowerCase()];
                    return event;
                }
            })
            .filter(event => event);

        console.log(this.events);
        this.load.emit(this.events);
    }
}
