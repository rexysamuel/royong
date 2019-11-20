import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController, LoadingController, ActionSheetController } from '@ionic/angular';
import { MainService } from './../main.service';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';
import { NgForm } from '@angular/forms';
import { ImagePicker} from '@ionic-native/image-picker/ngx';

@Component({
  selector: 'app-newevent',
  templateUrl: './newevent.page.html',
  styleUrls: ['./newevent.page.scss'],
})
export class NeweventPage implements OnInit {
  captureDataUrl : any ;
  address = '';
  lat : any;
  lng : any;
  user : firebase.User;
  userId : any;
  downloadURL : any;
  tanggal : any;
  nama_event : any;
  nama_pembuat : any;
  deskripsi : any;
  loading : any;
  options : any;
  imageResponse : any;
  constructor(public mainSvc : MainService,
              public alertCtrl : AlertController,
              public loadingCtrl : LoadingController,
              public actionSheetCtrl : ActionSheetController,
              private imagePicker : ImagePicker,
              private firestore : AngularFirestore
              ) { }
//public imagePicker : ImagePicker
  ngOnInit() {
    this.mainSvc.getAddress().subscribe((currAddress) => {
      this.address = currAddress;
    });
    this.mainSvc.getLat().subscribe((currLat)=>{
      this.lat = currLat;
    });
    this.mainSvc.getLng().subscribe((currLng)=>{
      this.lng = currLng;
    });
    this.user = this.mainSvc.getUserId();
    this.userId = this.user.uid;
    this.firestore.collection('users',ref => ref.where('id','==',this.userId))
    .get()
    .toPromise()
    .then(snapshot =>{
      snapshot.forEach(doc => {
        this.nama_pembuat = doc.data().nama;
        console.log(this.nama_pembuat);
      });
    });
    
  }
  timeline(){
    
  }
  async presentActionSheet(){
    const actionSheet = this.actionSheetCtrl.create({
      header:'',
      buttons : [
        {
          text:'Take Photo From Library',
          handler : () => {
              this.photoFromLibrary();
          }
        },
        {
          text:'Take Photo From Camera',
          handler : () => {
            this.takePhoto();
          }
        }
      ]
    });
    (await actionSheet).present();
  }
  photoFromLibrary(){
    this.options = {
      width: 200,
      quality: 30,
      outputType: 1,
      maximumImagesCount: 3
    };
    if(!this.imagePicker.hasReadPermission){
      this.imagePicker.requestReadPermission();
    }
    this.imageResponse = [];
    this.imagePicker.getPictures(this.options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.imageResponse.push('data:image/jpeg;base64,' + results[i]);
      }
    }, (err) => {
      console.log(err);
    });
  }
  takePhoto(){
    const cameraOptions: CameraOptions = {
      quality: 30,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
    }
    Camera.getPicture(cameraOptions)
    .then((imageData) => {
      this.captureDataUrl = 'data:image/jpeg;base64,'+imageData;
    },(err) => {
    });
  }
  async presentLoading(form:NgForm){
    this.loading = await this.loadingCtrl.create({
      message:'Uploading!',
    });
    await this.loading.present();
    this.nama_event = form.value.nama;
    this.tanggal = form.value.tanggal;
    this.deskripsi = form.value.deskripsi;
    console.log(this.deskripsi);
    console.log(this.tanggal);
    let storageRef = firebase.storage().ref();
    const filename = this.nama_event;
    //const filePath = 'images/events/'+this.nama;
    const imageRef = storageRef.child(`images/events/${filename}.jpg`);
    //const task:AngularFireUploadTask = this.afStorage.upload(filePath,this.captureDataUrl);
    

    imageRef.putString(this.captureDataUrl,firebase.storage.StringFormat.DATA_URL)
    .then((snapshot) =>{
      imageRef.getDownloadURL().then((data)=>{
        this.downloadURL = data;
        console.log(this.downloadURL);
        let record = {};
        record['nama_event'] =this.nama_event;
        record['nama_pembuat'] = this.nama_pembuat;
        record['deskripsi']  = this.deskripsi;
        record['tanggal'] = this.tanggal;
        record['eid'] ='1';
        record['uid'] = this.userId;
        record['lat'] = this.lat;
        record['lng'] = this.lng;
        record['url'] = this.downloadURL;
        record['anggota'] = [];
        record['alamat'] = this.address;
        record['points'] = 0;
        record['anggotaDatang'] = [];
        console.log(record);
        this.mainSvc.addDataEvent(record);
      })
      this.loading.dismiss();
      this.showSuccesfulUploadAlert();
    });
  }
  async showSuccesfulUploadAlert() {
    let alert = this.alertCtrl.create({
      header: 'Created!',
      subHeader: 'Event succesfully created!',
      buttons: ['OK']
    });
    (await alert).present();

    // clear the previous photo data in the variable

  }
}
