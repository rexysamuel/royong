import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-timeline-detail',
  templateUrl: './timeline-detail.page.html',
  styleUrls: ['./timeline-detail.page.scss'],
})
export class TimelineDetailPage implements OnInit {

  public isSearchbarOpened = false;

  constructor(public navCtrl: NavController) { }

  ngOnInit() {
    this.isSearchbarOpened = false;
  }

  onSearch(event){
    console.log(event.target.value);
  }

}
