import { AngularFirestore } from 'angularfire2/firestore';
import { Event } from './../../event.model';
import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/main.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { firestore } from 'firebase';

@Component({
  selector: 'app-timeline-detail',
  templateUrl: './timeline-detail.page.html',
  styleUrls: ['./timeline-detail.page.scss'],
})
export class TimelineDetailPage implements OnInit {

  loading : any;
  user : firebase.User;
  userId : any;
  public isSearchbarOpened = false;
  event : Event[] = [];
  anggotaSize : any;
  namaEvent : any;
  constructor(public mainSvc : MainService,public navCtrl: NavController,public activatedRoute:ActivatedRoute,
              public loadingCtrl : LoadingController,
              public firestore : AngularFirestore,
              public alertCtrl : AlertController) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      paramMap => {
        if(!paramMap.has('timelineId')){return;}
        this.presentLoading(paramMap.get('timelineId'));
      }
    )
    this.user = this.mainSvc.getUserId();
    this.userId = this.user.uid;
  }
  ionViewDidLeave(){
   this.event = [];
  }
  async presentLoading(id:string){
    this.loading = await this.loadingCtrl.create({
      message:'Loading'
    });
    (await this.loading).present();
    this.firestore.collection('event',ref => ref.where('eid', '==', id))
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
        this.event.push(dat);
        this.namaEvent = this.event[0].nama_event;
        this.loading.dismiss();
      });
    });
  }
    
  onSearch(event){
    console.log(event.target.value);
  }
  timeline(){
    
  }
  async join(){
    let data = [this.userId];
    this.loading = await this.loadingCtrl.create({
      message :'Processing'
    });
    (await this.loading).present();
    this.firestore.doc<any>('event/'+this.event[0].eid).update(
      {'anggota' : firestore.FieldValue.arrayUnion(this.userId)}
    );
    this.showSuccesfulUploadAlert();
    this.loading.dismiss();
  }
  async showSuccesfulUploadAlert() {
    let alert = this.alertCtrl.create({
      header: 'Joined!',
      subHeader: 'Event succesfully Joined!',
      buttons: ['OK']
    });
    (await alert).present();

    // clear the previous photo data in the variable

  }
}
