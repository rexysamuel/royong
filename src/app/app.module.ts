import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFirestoreModule, FirestoreSettingsToken } from 'angularfire2/firestore';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { Network } from '@ionic-native/network';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFirestoreModule,
    HttpClientModule,
    NgxQRCodeModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    BarcodeScanner,
    Geolocation,
    NativeGeocoder,
    ImagePicker,
    HttpClient,
    BarcodeScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: FirestoreSettingsToken, useValue: {}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
