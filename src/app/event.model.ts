export class Event{
    eid:string;
    uid:string;
    nama_event:string;
    nama_pembuat:string;
    deskripsi : string;
    tanggal : string;
    url : string;
    anggota : [];
    lat : string;
    lng : string;
    alamat : string;
    constructor(eid : string,
                uid : string,
                nama_event:string,
                nama_pembuat : string,
                deskrpsi : string,
                tanggal : string,
                url : string , 
                anggota : any,
                lat : string,
                lng : string,
                alamat : string){
                    this.eid = eid;
                    this.uid = uid;
                    this.nama_event = nama_event;
                    this.nama_pembuat = nama_pembuat;
                    this.deskripsi = deskrpsi;
                    this.tanggal = tanggal;
                    this.url = url;
                    this.anggota = anggota;
                    this.lat = lat;
                    this.lng = lng;
                    this.alamat = alamat;
                }
}