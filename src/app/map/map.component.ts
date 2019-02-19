import { Component, OnInit } from '@angular/core';
declare const mapboxgl: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: any;
  constructor() { }

  ngOnInit() {

    const mapboxAccessToken = 'pk.eyJ1IjoiaWt6aWUiLCJhIjoiY2pueXp0dGUwMGkwbjQwcW90ODhodmxrcyJ9.5zI_GjGaFLz4IJpriXfttQ';
    mapboxgl.accessToken = mapboxAccessToken;

    const mapElement = document.querySelector('.mapbox-map');
    const mapOptions: any = {
      container: mapElement,
      center: [4.457500, 51.932802],
      style: 'mapbox://styles/mapbox/streets-v10',
      zoom: 13
    };

    this.map = new mapboxgl.Map(mapOptions);
    this.addMarkers();
  }

  addMarkers() {

    const lngLats = [
      [4.452972, 51.930539],
      [4.456556, 51.926980],
      [4.441171, 51.923266],
      [4.460395, 51.933965],
    ];

    var bounds = new mapboxgl.LngLatBounds();

    lngLats.forEach(lngLat => {
      const markerContainer = document.createElement('div');
      markerContainer.innerHTML = `<div class="pin"></div>`;
      const marker = new mapboxgl.Marker(markerContainer)
        .setLngLat(lngLat)
        .addTo(this.map);

      bounds.extend(lngLat);
    })


    
    lngLats.forEach(lngLat => {
      const markerContainer = document.createElement('div');
      const marker = new mapboxgl.Marker(markerContainer)
        .setLngLat(lngLat)
        .addTo(this.map);

      bounds.extend(lngLat);
    })

    this.map.fitBounds(bounds, {padding: 10});


  }

}
