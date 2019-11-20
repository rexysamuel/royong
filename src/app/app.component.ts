import { AngularFirestore } from 'angularfire2/firestore';
import { MainService } from 'src/app/main.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent{
  nama : any;
  user : firebase.User;
  userId : any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private mainSvc : MainService,
    private firestore : AngularFirestore
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    // this.user = this.mainSvc.getUserId();
    // this.userId = this.user.uid;
    // this.firestore.collection('users', ref=>ref.where('id','==',this.userId))
    // .get()
    // .toPromise()
    // .then(snapshot => {
    //   snapshot.forEach(doc => {
    //     this.nama = doc.data().nama;
    //   })
    // })
  }

}
