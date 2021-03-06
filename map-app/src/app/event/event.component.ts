import { Component, OnInit, Input } from '@angular/core';
import { Event, MapLoc, Story, Attachment, Editor } from '../Models'
import { DataService } from '../data.service';
import { HttpEvent} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  private story: Story;
  private attachment = new Attachment();
  private fileName = String(Math.floor(Math.random() * 10000));
  private editor = new Editor;
  private length: number;

  newEvent = new Event ();

  name = 'Angular';
  lat:any;
  lng:any;

  constructor(
    private apiService: DataService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
    )
    {
    if (navigator)
    {
    navigator.geolocation.getCurrentPosition( pos => {
        this.lng = +pos.coords.longitude;
        this.lat = +pos.coords.latitude;
        this.newEvent.coordinates = [];
        const myLoc = new MapLoc ();
        myLoc.lng = this.lng;
        myLoc.lat = this.lat;
        this.newEvent.coordinates.push(myLoc);
      });
    }
  }

  private AWSData: any;

  public imagePath;
  iosPhoto: File;
  imageUrl: any;


  onFileSelected(event)
  {
    this.iosPhoto = event.target.files[0];
    const reader = new FileReader();
    this.imagePath = event.target.files;
    reader.readAsDataURL(this.iosPhoto);
    console.log('iosphoto',this.iosPhoto);
    reader.onload = (_event) => {this.imageUrl = reader.result;}
  }

  onUpload () {
    this.apiService.uploadfileAWSS3(this.AWSData, 'image/jpeg', this.iosPhoto, this.fileName)
      .subscribe((event:HttpEvent<any>) => {console.log(event);
      })

  }

  ngOnInit() {
    this.getAWSUrl();
    this.getOneStory();
  }

  getAWSUrl (): void {
    this.apiService.getAWSUrl()
    .subscribe(data => {
      this.AWSData = data;
      this.attachment.imageUrl = data.url + `/uploads/${this.fileName}.jpeg`;
      this.attachment.type = 'image';
      this.newEvent.attachments = [];
      this.newEvent.attachments.push(this.attachment);
    })
  }

  postEvent (data, id): void {
    data.dateAndTime = Date.now();
    this.apiService.postEvent (data, id);
    this.router.navigate(['mystories']);
  }

  getOneStory (): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.apiService.getOneStory(id)
    .subscribe((data) => {
      this.story = data;
      this.editor = this.story.editor;
      this.length = this.story.events.length;
      this.newEvent.startTime = `00:${this.length}0`;
      this.newEvent.user = this.story.editor._id;

    })
  }
}


