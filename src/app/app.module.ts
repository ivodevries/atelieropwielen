import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { routing } from './routes';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { EventsComponent } from './events/events.component';

import { DateFnsModule, DateFnsConfigurationService } from 'ngx-date-fns';
import * as nl from 'date-fns/locale/nl';

const frenchConfig = new DateFnsConfigurationService();
frenchConfig.setLocale(nl);

@NgModule({
    declarations: [AppComponent, MapComponent, EventsComponent],
    imports: [BrowserModule, RouterModule, routing, DateFnsModule.forRoot()],
    providers: [
        { provide: DateFnsConfigurationService, useValue: frenchConfig }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
