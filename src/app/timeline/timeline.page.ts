import { AngularFirestore } from 'angularfire2/firestore';
import { Event } from './../event.model';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { MainService } from '../main.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {

  public isSearchbarOpened = false;
  loadedEvent : Event[] = [];
  anggotaSize : any;
  loading : any;
  constructor(public mainSvc : MainService,public navCtrl: NavController,public router : Router,public loadingCtrl:LoadingController,
              public firestore : AngularFirestore) { }

  ngOnInit() {
    this.presentLoading();
  }
  refresh(){
    this.loadedEvent = [];
    this.presentLoading();
  }
  onSearch(event){
    console.log(event.target.value);
  }
  async presentLoading(){
    this.loading = await this.loadingCtrl.create({
      message : 'Loading',
    });
    (await this.loading).present();
    this.firestore.collection('event')
    .get()
    .toPromise()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let dat = new Event(
          doc.data().eid,
          doc.data().uid,
          doc.data().nama_event,
          doc.data().nama_pembuat,
          doc.data().deskripsi,
          doc.data().tanggal,
          doc.data().url,
          doc.data().anggota,
          doc.data().lat,
          doc.data().lng
        )
        
        this.loadedEvent.push(dat);
      });
      this.loading.dismiss();
    });
  }
  timeline(){

  }
  newEvent(){
    this.router.navigate(['/newevent']);
  }
  detail(){
    this.router.navigate(['/timeline-detail']);
  }
}
