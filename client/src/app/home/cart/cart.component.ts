import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Subscription } from 'rxjs';
import { Cartarr } from '../../shared/model/cart.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { CartDataSource } from '../../shared/class/cartdatasouce';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material';
import { PayService } from '../../shared/services/pay.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartSubscription: Subscription;
  cartarr: Array<Cartarr> = [];
  isLinear = true;
  firstbox: boolean = false;
  secondFormGroup: FormGroup;
  thirdbox: boolean = false;
  dataSource = new CartDataSource(this.Cartservice);
  fp: number;

  displayedColumns = ['bookcover', 'title', 'quantity', 'price', 'Action'];

  constructor(private Cartservice: CartService,
    private Payservice: PayService,
    private _formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {

    this.secondFormGroup = this._formBuilder.group({
      address: ['', Validators.required],
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      mobnum: ['254708374149', Validators.required],
      method: ['mpesa', Validators.required]
    });
  }

  book_quantity_change(info, index) {
    console.log(info.target.value);
    console.log(index);
    this.Cartservice.change_custom_quantity(index, info.target.value);
    this.refresh();
  }

  refresh() {
    //this.changeDetectorRefs.detectChanges();
    this.dataSource = new CartDataSource(this.Cartservice);
  }

  removefrmcart(index: number) {
    console.log(index);
    this.Cartservice.removefrmcart(index);
    this.refresh();
  }

  getFinalPrice() {
    this.fp= this.Cartservice.get_cart_finalprice();
    return this.fp;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  paynow() {
   
    if((this.secondFormGroup.valid==true) && (this.fp>0))
    {
      this.spinner.show();
      console.log(this.secondFormGroup.value);
      
      this.Payservice.paynow(this.Cartservice.getcartlist(),this.fp,this.secondFormGroup.value.mobnum).subscribe((res)=>{
        console.log('pay response'+res);
      },(err)=>{
        console.log('pay error'+err);
      })
    }
    else
    {
        this.openSnackBar('Please fill shipping details completely',null);
    }
  }
}
