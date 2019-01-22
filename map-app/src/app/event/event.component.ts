import { Component, OnInit } from '@angular/core';
import { Event, Location } from '../Models'
import { DataService } from '../data.service';
import { HttpClientModule, HttpClient} from '@angular/common/http';

import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {


  name = 'Angular';
  lat:any;
  lng:any;

  constructor(private apiService: DataService) { 
    if (navigator)
    {
    navigator.geolocation.getCurrentPosition( pos => {
        this.lng = +pos.coords.longitude;
        this.lat = +pos.coords.latitude;
        this.newEvent.location = new Location ();
        this.newEvent.location.lat = this.lat;
        this.newEvent.location.lng = this.lng;
      });
    }
  }
  
  newEvent = new Event ();


  public imagePath;
  iosPhoto: File;
  imageUrl: any;


  onFileSelected(event)
  {
    this.iosPhoto = event.target.files[0];
    const reader = new FileReader();
    this.imagePath = event.target.files;
    reader.readAsDataURL(this.iosPhoto);
    reader.onload = (_event) => {this.imageUrl = reader.result;}
  }

  onUpload()
  {
    const s3 = new S3(
      {
        accessKeyId: '',
        secretAccessKey: '',
        region: 'eu-west-3'
      }
    );

    const params = {
      Bucket: 'map-story',
      Key: '/' + this.iosPhoto.name,
      Body: this.iosPhoto,
      ACL: 'public-read',
    };

    s3.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }

      console.log('Successfully uploaded file.', data);
      return true;
    });

    console.log(this.iosPhoto);

  }

  ngOnInit() {
    console.log(this.newEvent);
  }

  postEvent (data): void {
    console.log(data);
    this.apiService.postEvent (data);
  }

  get diagnostic() { return JSON.stringify(this.newEvent); }

}
