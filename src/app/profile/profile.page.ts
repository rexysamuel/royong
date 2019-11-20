import { AngularFirestore } from 'angularfire2/firestore';
import { LoadingController, AlertController } from '@ionic/angular';
import { MainService } from 'src/app/main.service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Component, OnInit } from '@angular/core';
import { firestore } from 'firebase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  createdCode : any;
  user : firebase.User;
  userId : any;
  loading : any;
  data : any[] = [];
  alert : any;
  barcodeScannerOptions: BarcodeScannerOptions;
  constructor(private barcodeScanner : BarcodeScanner,private mainSvc : MainService,private loadingCtrl : LoadingController,
    private alertCtrl : AlertController,private afs : AngularFirestore
    ) { }

  ngOnInit() {
    this.user = this.mainSvc.getUserId();
    this.userId = this.user.uid;
    this.createdCode = this.user.uid;
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }
  async scanCode(){
    var i ;
    this.loading = await this.loadingCtrl.create({
      message : 'Loading!'
    });
    (await this.loading).present();

    this.barcodeScanner.scan().then(barcodeData =>{
      this.afs.collection('event', ref => ref.where('eid', '==' , barcodeData.text))
      .get()
      .toPromise()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.data = doc.data().anggota;
          for(i = 0 ; i < this.data.length ; i++){
            if(this.data[i] === this.userId){
              this.afs.collection('event').doc(barcodeData.text).update({
                'anggotaDatang' : firestore.FieldValue.arrayUnion(this.userId)
              })
              this.showSuccesfulUploadAlert();
            }
          }
          this.loading.dismiss();
        });
      });
    });
  }
  async showSuccesfulUploadAlert() {
    let alert = this.alertCtrl.create({
      header: 'Success!',
      subHeader: 'Lets clean our place!',
      buttons: ['OK']
    });
    (await alert).present();

    // clear the previous photo data in the variable

  }
}
