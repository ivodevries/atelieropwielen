import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
declare const mapboxgl: any;

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    map: any;
    maskLocation: { x: undefined; y: undefined };

    constructor() {}

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
        this.maskLocation = this.map.project(event.lngLat.map(Math.round));
        console.log(this.maskLocation);
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
