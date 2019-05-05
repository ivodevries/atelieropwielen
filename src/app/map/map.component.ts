import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { Map } from 'immutable';
import { EventInterface, EventList } from '../models/event';
declare const mapboxgl: any;

interface MaskLocationInterface {
    x: number;
    y: number;
}

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit {
    map: any;
    maskLocation: Map<any, MaskLocationInterface>;
    selectedEvent: any;
    @ViewChild('mapboxMap') private mapboxMap: ElementRef;

    constructor(private sanitizer: DomSanitizer, private cd: ChangeDetectorRef, private router: Router) {}

    ngOnInit() {
        const mapboxAccessToken =
            'pk.eyJ1IjoiaWt6aWUiLCJhIjoiY2pueXp0dGUwMGkwbjQwcW90ODhodmxrcyJ9.5zI_GjGaFLz4IJpriXfttQ';
        mapboxgl.accessToken = mapboxAccessToken;

        const mapElement = document.querySelector('.mapbox-map');
        const mapOptions: any = {
            container: mapElement,
            center: [4.4575, 51.932802],
            style: 'mapbox://styles/mapbox/streets-v10',
            zoom: 14
        };

        this.map = new mapboxgl.Map(mapOptions);
    }

    showEvent(event: Map<any, EventInterface>) {
        const timeout = this.maskLocation ? 500 : 0;
        delete this.selectedEvent;
        delete this.maskLocation;
        setTimeout(() => {
            this.selectedEvent = event;
            if (event) {
                const maskLocation = this.map.project(event.get('lngLat'));
                maskLocation.x = Math.round(maskLocation.x);
                maskLocation.y = Math.round(maskLocation.y);
                this.maskLocation = Map(maskLocation);
            }
            this.cd.markForCheck();
        }, timeout);
    }

    getClipPath(maskLocation) {
        return maskLocation
            ? this.sanitizer.bypassSecurityTrustStyle(
                  'circle(15% at ' + this.maskLocation.get('x') + 'px ' + this.maskLocation.get('y') + 'px)'
              )
            : '';
    }

    getDescriptionPosition(maskLocation: Map<any, MaskLocationInterface>, mask, description): string {
        const maskHeight = mask.clientHeight;
        const breakPoint = maskHeight / 2;
        const locationHeight = 80;

        if (maskLocation) {
            const y = (maskLocation.get('y') as unknown) as number;

            if (y > breakPoint) {
                return '20px';
            }
            return y + 80 - 14 + 'px';
        }

        return '0px';
    }

    addMarkers(events: EventList) {
        const bounds = new mapboxgl.LngLatBounds();

        events.forEach(event => {
            // todo only add markers for fist upcoming events
            const markerContainer = document.createElement('div');
            markerContainer.innerHTML = `<div class="pin pin-${event.get('timeState')}"></div>`;
            const eventId = event.get('id') as unknown as string;
            markerContainer.addEventListener('click', () => {
                this.router.navigate(['/map'], { fragment: eventId });
            });
            new mapboxgl.Marker(markerContainer).setLngLat(event.get('lngLat')).addTo(this.map);
            bounds.extend(event.get('lngLat'));
        });
        if (events.size > 1) {
            this.map.fitBounds(bounds, { padding: 50, duration: 0 });
        } else if (events.size === 1) {
            this.map.setCenter(events.get(0).get('lngLat'));
            this.map.setZoom(14);
        }
    }

    addMarkers2() {
        const lngLats = {
            vroesenpark: [4.452972, 51.930539],
            statensingel: [4.456556, 51.92698],
            speeldernis: [4.441196, 51.923301],
            noorderhavenkade: [4.460395, 51.933965]
        };

        Object.values(lngLats).forEach((lngLat, i) => {
            const markerContainer = document.createElement('div');
            markerContainer.innerHTML = `<div class="pin"></div>`;
            const marker = new mapboxgl.Marker(markerContainer).setLngLat(lngLat).addTo(this.map);
        });

        // lngLats.forEach(lngLat => {
        //   const markerContainer = document.createElement('div');
        //   const marker = new mapboxgl.Marker(markerContainer)
        //     .setLngLat(lngLat)
        //     .addTo(this.map);

        //   bounds.extend(lngLat);
        // })

        //   var markers = [
        //     'url-https%3A%2F%2Fcdn.sitly.com%2Fdesktop-frontend%2Fimages%2Fmaps-marker-invisible.png(' +
        //         minLng +
        //         ',' +
        //         minLat + ')',
        //     'url-https%3A%2F%2Fcdn.sitly.com%2Fdesktop-frontend%2Fimages%2Fmaps-marker-invisible.png(' +
        //         maxLng +
        //         ',' +
        //         maxLat + ')',        ];

        // var markersString = markers.join(',');
        // var staticGoogleMapsImage = [
        //     '<img src="',
        //     'https://api.mapbox.com/styles/v1/sitly1/cjiu9egyt7j3q2sq83e8su46v/static/',
        //     markersString + '/auto',
        //     '/' + width + 'x' + height,
        //     '?access_token=pk.eyJ1Ijoic2l0bHkxIiwiYSI6ImNqaWQ5ZzNpMzA1c2UzcWxpazBuMHI4eTAifQ.PGCZgChFlCIaMURlXTTugA',
        //     '">'
        // ];
    }
}
