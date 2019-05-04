import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
declare const mapboxgl: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    map: any;
    maskLocation: { x: number; y: number };
    selectedEvent: any;
    @ViewChild('mapboxMap') private mapboxMap: ElementRef;

    constructor(private sanitizer: DomSanitizer) {}

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

    showEvent(event) {
        this.selectedEvent = event;
        this.maskLocation = this.map.project(event.lngLat);
        this.maskLocation.x = Math.round(this.maskLocation.x);
        this.maskLocation.y = Math.round(this.maskLocation.y);
        console.log(this.maskLocation);
    }

    getClipPath(maskLocation) {
        return maskLocation
            ? this.sanitizer.bypassSecurityTrustStyle(
                  'circle(80px at ' + this.maskLocation.x + 'px ' + this.maskLocation.y + 'px)'
              )
            : '';
    }

    getDescriptionPosition(maskLocation, mask, description) {
        if (maskLocation && maskLocation.y > 300) {
            return 'translateY(0px)';
        }
        return 'translateY(385px)';

    }

    addMarkers(events) {
        const bounds = new mapboxgl.LngLatBounds();

        events.forEach(event => {
            const markerContainer = document.createElement('div');
            markerContainer.innerHTML = `<div class="pin pin-${event.timeState}"></div>`;
            new mapboxgl.Marker(markerContainer).setLngLat(event.lngLat).addTo(this.map);
            bounds.extend(event.lngLat);
        });
        this.map.fitBounds(bounds, { padding: 50 });
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
