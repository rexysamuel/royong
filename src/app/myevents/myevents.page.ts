import { BarcodeComponent } from './../component/barcode/barcode.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
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
  angt : any[] = [];
  constructor(public mainSvc : MainService,public loadingCtrl : LoadingController,
              public firestore : AngularFirestore,
              public alertCtrl : AlertController,
              public modalCtrl : ModalController) { }

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
          doc.data().alamat,
          doc.data().point,
          doc.data().anggotaDatang
        )
        
        this.loadedEvents.push(dat);
        this.loading.dismiss();
      });
      this.loading.dismiss();
    });
  }
  async finish(id : string){
    var i ;
    this.loading = await this.loadingCtrl.create({
      message : 'Loading'
    });
    (await this.loading).present();

    this.firestore.collection('event',ref => ref.where('eid','==',id))
    .get()
    .toPromise()
    .then(snapshot => {
      snapshot.forEach(doc => {
        this.angt = doc.data().anggotaDatang;
        let angtSize = this.angt.length;
        console.log(angtSize);
        if(angtSize >= 5){
          for(i=0 ; i < angtSize ;i++){
            this.firestore.collection('users', ref => ref.where('id','==',this.angt[i]))
            .get()
            .toPromise()
            .then(snapshot => {
              snapshot.forEach(doc => {
                let pnt = doc.data().point;
                let temp = {
                  point : 0
                }
                temp.point = pnt + 10;
                this.firestore.doc('users/'+doc.id).update(temp);
              });
            });
          }
          this.firestore.doc<any>('event/'+doc.id).delete();
          this.loading.dismiss();
          this.showSuccesfulUploadAlert(1);
        } else {
          this.loading.dismiss();
          this.showSuccesfulUploadAlert(0);
        }
      });
    });

  }
  async showSuccesfulUploadAlert(nilai : number) {
    if(nilai == 1){
      let alert = this.alertCtrl.create({
        header: 'Finish!',
        subHeader: 'Thanks for making our cleaner!',
        buttons: ['OK']
      });
      (await alert).present();
    } else if(nilai == 0){
      let alert = this.alertCtrl.create({
        header: 'Failed!',
        subHeader: 'Member not reach minimum requirements ( 5 members )',
        buttons: ['OK']
      });
      (await alert).present();
    }


    // clear the previous photo data in the variable

  }
  async showModalBarcode(id : string){
    this.mainSvc.setEventId(id);
    const modal = await this.modalCtrl.create({
      component : BarcodeComponent
    });
    return await modal.present();
  }
}
