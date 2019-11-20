import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {
  lat = -6.256460;
  lng = 106.618683;
  address : any;
  @ViewChild('map',{static:false}) mapElementRef : ElementRef;
  constructor(private modalCtrl: ModalController,
    private renderer: Renderer2,
    private geolocation : Geolocation) { }

  ngOnInit() {

  }
  location(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.ionViewDidEnter();
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }
  ionViewDidEnter(){
    this.getGoogleMaps().then((googleMaps) => {
      const mapElement = this.mapElementRef.nativeElement;
      const map = new googleMaps.Map(mapElement, {
        center : {lat: this.lat,lng: this.lng},
        zoom: 16,
      });
      googleMaps.event.addListenerOnce(map,'idle',() => {
        this.renderer.addClass(mapElement,'visible');
      });
      const marker = new googleMaps.Marker({position: {
        lat: this.lat,
        lng: this.lng},map
      });
      console.log(marker);
      map.addListener('click', event => {
        const selectedCoords = {
          lat : event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        this.modalCtrl.dismiss(selectedCoords);
      });
    }).catch(err => {
      console.log(err);
    });
  }
  onCancel(){
    this.modalCtrl.dismiss();
  }
  onChooseLocation(event : any){
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    console.log(this.lat + this.lng + event.coords.name);
  }
  private getGoogleMaps() : Promise<any>{
    const win = window as any;

    const googleModule = win.google;
    if(googleModule && googleModule.maps){
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve,reject)=>{
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.mapsAPIKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if(loadedGoogleModule && loadedGoogleModule.maps){
          resolve(loadedGoogleModule.maps);
        }else{
          reject('Google maps SDK is not available');
        }
      };
    });
  }
}
