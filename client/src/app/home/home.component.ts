
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { BookService } from '../shared/services/book.service';
import { Book } from '../shared/model/book.model';
import { CartService } from '../shared/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books:Book;
  constructor(private AuthService:AuthService,private Bookservice:BookService,private Cartservice:CartService) { }

  ngOnInit() {
    this.Bookservice.getbooklist().subscribe((response)=>{
        this.books=response.data;
    },(err)=>{
        console.log('err book service'+err);
    });
  }

  openBook()
  {
    console.log('book clicked');
  }

  add_to_cart(book, index){
      console.log('addtocart:'+index);
      this.Cartservice.addtocart(book);
      this.books[index].isDisabled=true;
  }

}
