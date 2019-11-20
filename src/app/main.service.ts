import { Event } from './event.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';
export interface events{
  eid:string;
  nama_event:string;
  nama_pembuat:string;
  deskripsi : string;
  tanggal : string;
  url : string;
  anggota : {};
  lat : string;
  lng : string;
}
@Injectable({
  providedIn: 'root'
})

export class MainService {
  private user:firebase.User;
  private event : events;
  private userId : string;
  currAddress = new BehaviorSubject<string>('');
  latAddress = new BehaviorSubject<string>('');
  lngAddress = new BehaviorSubject<string>('');
  constructor(public afAuth: AngularFireAuth,public firestore: AngularFirestore) { 
    afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }
  getAddress(){
    return this.currAddress.asObservable();
  }
  getLat(){
    return this.latAddress.asObservable();
  }
  getLng(){
    return this.lngAddress.asObservable();
  }
  getName(id:string){
    let nama;
    this.firestore.collection('users',ref => ref.where('id','==',id))
    .get()
    .toPromise()
    .then(snapshot =>{
      snapshot.forEach(doc => {
        return doc.data().nama;
      });
    });
  }
  setAddress(address: string){
    this.currAddress.next(address);
  }
  setLatLng(lat : string, lng : string){
    this.latAddress.next(lat);
    this.lngAddress.next(lng);
  }
  signInWithEmail(credentials){
       return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }
  createUser(credentials){
    return new Promise((resolve,reject) => {
      firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(
        res => {
         this.userId = this.afAuth.auth.currentUser.uid,
          resolve(res)
        },
        err => {
          reject(err);
        });
    });
  }
  getUserIdRegister(){
    return this.userId;
  }
  getUserId(){
    return this.user;
  }
  addDataEvent(record){
   this.firestore.collection('event').add(record);
   return this.firestore.collection('event',ref => ref.where('eid','==','1'))
   .get()
   .toPromise()
   .then(snapshot => {
     snapshot.forEach(doc => {
       console.log(doc.id);
       this.firestore.doc<any>('event/'+doc.id).update({
         eid : doc.id
       });
     });
   });
  }
  addDataUsers(record){
    return this.firestore.collection('users').add(record);
  }
  getEvents(){
    this.firestore.collection('event')
    .get()
    .toPromise()
    .then(snapshot => {
      snapshot.forEach(doc => {
        return doc.data();
      });
    });
  }
  searchEventsId(id:string){
    this.firestore.collection('event',ref => ref.where('eid', '==', id))
    .get()
    .toPromise()
    .then(snapshot => {
      snapshot.forEach(doc => {
        this.event.nama_pembuat = doc.data().nama_pembuat;
        this.event.nama_event = doc.data().nama_event;
        this.event.deskripsi = doc.data().deskripsi;
        this.event.tanggal = doc.data().tanggal;
        this.event.anggota = doc.data().anggota;
        this.event.url = doc.data().url;
        this.event.lat = doc.data().lat;
        this.event.lng = doc.data().lng;
      });
    });
    return this.event;
  }
}
