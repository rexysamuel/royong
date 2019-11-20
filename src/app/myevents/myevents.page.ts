import { AngularFirestore } from 'angularfire2/firestore';
import { LoadingController } from '@ionic/angular';
import { MainService } from 'src/app/main.service';
import { Event } from './../event.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myevents',
  templateUrl: './myevents.page.html',
  styleUrls: ['./myevents.page.scss'],
})
export class MyeventsPage implements OnInit {
  loadedEvents : Event[] = [];
  address : any;
  loading : any;
  lat : any;
  lng : any;
  anggotaSize : any;
  user : firebase.User;
  userId : any;
  constructor(public mainSvc : MainService,public loadingCtrl : LoadingController,
              public firestore : AngularFirestore) { }

  ngOnInit() {
    this.user = this.mainSvc.getUserId();
    this.userId = this.user.uid;
    this.presentLoading(this.userId);
  }
  async presentLoading(id:string){
    this.loading = await this.loadingCtrl.create({
      message : 'Loading'
    });
    (await this.loading).present();
    this.firestore.collection('event',ref => ref.where('uid', '==', id))
    .get()
    .toPromise()
    .then(snapshot => {
      snapshot.forEach(doc => {
        let dat = new Event (
          doc.data().eid,
          doc.data().uid,
          doc.data().nama_event,
          doc.data().nama_pembuat,
          doc.data().deskripsi,
          doc.data().tanggal,
          doc.data().url,
          doc.data().anggota,
          doc.data().lat,
          doc.data().lng,
          doc.data().alamat
        )
        this.anggotaSize = dat.anggota.length;
        this.loadedEvents.push(dat);
        this.loading.dismiss();
      });
    });
  }
}
