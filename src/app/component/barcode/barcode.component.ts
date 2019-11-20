import { Router } from '@angular/router';
import { MainService } from 'src/app/main.service';
import { Component, OnInit } from '@angular/core';
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner/ngx";

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss'],
})
export class BarcodeComponent implements OnInit {
  createdCode : any
  constructor(public mainSvc : MainService,public barcodeScanner : BarcodeScanner,public router : Router) { }

  ngOnInit() {
    this.createdCode = this.mainSvc.getEventId();
  }
  back(){
    this.router.navigate(['./timeline']);
  }
}
