import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { routing } from './routes';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { EventsComponent } from './events/events.component';

import { DateFnsModule } from 'ngx-date-fns';

@NgModule({
    declarations: [AppComponent, MapComponent, EventsComponent],
    imports: [BrowserModule, RouterModule, routing, DateFnsModule.forRoot()],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
