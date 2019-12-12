import { MainService } from './../main.service';
import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  loading :any;
  constructor(public navCtrl: NavController,
              public router: Router,
              public mainSvc : MainService,
              public loadingCtrl:LoadingController,
              public alertCtrl:AlertController) { }

  ngOnInit() {
  }

  form() {
    this.router.navigate(['/form']);
  }
  timeline(){

  }
  async presentLoading(form:NgForm){
    this.loading = await this.loadingCtrl.create({
      message: 'Authentication',
    });
    await this.loading.present();
    const data_nama = form.value.nama;
    const data_username = form.value.username;
    const data_password = form.value.password;
    const data_email = form.value.email;
    const data_alamat = form.value.alamat;
    const data_noTel = form.value.telepon;
    let recordAuth = {
      email: data_email,
      password: data_password,
    };
    let record = {
      email:data_email,
      nama:data_nama,
      username:data_username,
      alamat:data_alamat,
      no_telepon:data_noTel,
      point : 0,
      id:null
    }
    this.mainSvc.createUser(recordAuth)
        .then(
          () => {
            record.id = this.mainSvc.getUserIdRegister();
            this.mainSvc.addDataUsers(record);
            this.loading.dismiss();
            this.presentAlert(1);
          },
          error => {
            this.presentAlert(0);
            this.loading.dismiss();
        }
        );
  }
  async presentAlert(nilai : any){
    let header_data,subHeader_data;
    if(nilai == 1){
      header_data = 'Success'; 
    }else{
      header_data = 'Failed'; 
      subHeader_data = 'Account registration failed!';
    }
    const alert = await this.alertCtrl.create({
      header: header_data,
      subHeader: subHeader_data,
      message: 'Press Ok for continue',
      buttons: [
        {
          text:'Ok',
          handler : () => {
            this.router.navigate(['/form']);
          }
        }
      ]
    });
    await alert.present();
  }
}
