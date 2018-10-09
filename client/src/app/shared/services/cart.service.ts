import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import 'rxjs/add/operator/do';
import { throwError, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Cartarr } from '../model/cart.model';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class CartService {

    cartarr: Array<Cartarr> = [];
    cartChange = new Subject<Array<Cartarr>>();
    constructor(private http: HttpClient, private router: Router, public snackBar: MatSnackBar) { }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    addtocart(book) {

        if (this.cartarr.length != 0) {
            if (!this.cartarr.some((item) => item._id == book._id)) {
                book.cartprice = book.price;
                book.quantity = 1;
                this.cartarr.push(book);
                this.openSnackBar('Added to Cart', null);
            }
        }
        else {
            book.cartprice = book.price;
            book.quantity = 1;
            this.cartarr.push(book);
            this.openSnackBar('Added to Cart', null);
        }
        this.reflectchanges();
    }

    removefrmcart(index: number) {
        this.cartarr.splice(index, 1);
        this.openSnackBar('Removed From Cart', null);
        this.reflectchanges();
    }

    reflectchanges() {
        this.cartChange.next(this.cartarr);
    }

    change_custom_quantity(index, quantity) {
        this.cartarr[index].cartprice = this.cartarr[index].price * quantity;

    }

    getcartlist() {
        return this.cartarr;
    }

    get_cart_finalprice() {
        return this.cartarr.map(t => t.cartprice).reduce((acc, value) => acc + value, 0);
    }

    clear_cart() {
        this.cartarr = [];
        this.cartChange.next(this.cartarr);
    }
}
