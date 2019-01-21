import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Story } from '../Models';

@Component({
  selector: 'app-mystories',
  templateUrl: './mystories.component.html',
  styleUrls: ['./mystories.component.scss']
})
export class MystoriesComponent implements OnInit {

  private stories: Story[];
  private newStory: boolean;

  constructor(private apiService: DataService) { }

  getStory (): void{
    this.apiService.getStory()
    .subscribe((data) => {
      console.log('Server Response',data);
      this.stories = data;
    })
  }

  handleClick () {
    this.newStory = true;
  }

  clickCancel () {
    this.newStory = false;
  }

  ngOnInit() {
    this.newStory = false;
    this.getStory();
  }

}