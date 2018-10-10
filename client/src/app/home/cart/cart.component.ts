import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Subscription } from 'rxjs';
import { Cartarr } from '../../shared/model/cart.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartDataSource } from '../../shared/class/cartdatasouce';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar, MatStepper } from '@angular/material';
import { PayService } from '../../shared/services/pay.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

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
  user:any;
  payresponse:any;
  displayedColumns = ['bookcover', 'title', 'quantity', 'price', 'Action'];

  constructor(private Cartservice: CartService,
    private Payservice: PayService,
    private _formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public snackBar: MatSnackBar,
    private authService: AuthService,
    private router:Router) { }

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
    // console.log(info.target.value);
    // console.log(index);
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
      duration: 3000,
    });
  }

  paynow(stepper: MatStepper) {
   
    if(this.secondFormGroup.valid==true)
    {
      if(this.fp>0)
      {
        if(this.authService.isLoggedIn)
        {
          this.user=JSON.parse(localStorage.getItem('user'));
          this.spinner.show();
          // console.log(this.secondFormGroup.value);
          this.Payservice.paynow(this.Cartservice.getcartlist(),this.fp,this.secondFormGroup.value.mobnum,this.user._id).subscribe((res)=>{
            console.log('pay response'+res);
            this.spinner.hide();
            this.payresponse=res.result;
            this.openSnackBar(res.text,null);
            this.Cartservice.clear_cart();
            setTimeout(()=>{
              this.thirdbox=true;
              stepper.next();
            },3000);
          
          },(err)=>{
            console.log('pay error'+err);
            
          })
        }
        else
        {
          this.openSnackBar('Please login first',null);
        }
      }
      else
      {
        this.openSnackBar('Cart is empty!!',null);
      }
    }
    else
    {
        this.openSnackBar('Please fill shipping details completely',null);
    }
  }

  back_home(){
    this.thirdbox=false;
    this.router.navigate(['/home']);
  }
}
