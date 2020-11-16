import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SysSoundComponent } from './sys-sound/sys-sound.component';
import { WINDOW_PROVIDERS } from './shared/services/window.service';

@NgModule({
    declarations: [
        AppComponent,
        SysSoundComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [
        ...WINDOW_PROVIDERS
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
