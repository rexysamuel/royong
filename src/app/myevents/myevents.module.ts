import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { BarcodeComponent } from './../component/barcode/barcode.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyeventsPage } from './myevents.page';

const routes: Routes = [
  {
    path: '',
    component: MyeventsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxQRCodeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyeventsPage,BarcodeComponent],
  entryComponents:[BarcodeComponent]
})
export class MyeventsPageModule {}
