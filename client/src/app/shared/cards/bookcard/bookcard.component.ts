import { Component, OnInit } from '@angular/core';
import { AppConstants } from '../../constants/app-constants';

@Component({
  selector: 'app-bookcard',
  templateUrl: './bookcard.component.html',
  styleUrls: ['./bookcard.component.css']
})
export class BookcardComponent implements OnInit {
  defaultLocationFallback:string;
  imagesrc:string;

  constructor() { }

  ngOnInit() {
    this.imagesrc="https://cf-books.infibeam.net/img/f6261e2a/988fa/18/fa3/P-M-B-9789352669806-f5918fa3.jpg?wid=320&hei=320";
    this.defaultLocationFallback = AppConstants.DEFAULT_LOCATION_IMAGE;
  }
openBook(){
  console.log('clicked');
}
}
