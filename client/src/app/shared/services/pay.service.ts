import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import 'rxjs/add/operator/do';
import { throwError, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class PayService {
    user: any;
    authToken: any;

    constructor(private http: HttpClient, private router: Router) { 

    }
    paynow(productlist,price,shipping_details,user_id,Msisdn){
        console.log('price:'+price);
        console.log('shipping_details:'+shipping_details);
        console.log('Msisdn'+Msisdn);
        let data = 'Msisdn='+Msisdn+'&shipping_details='+shipping_details+'&productlist='+productlist+'&price=' +price + '&user_id='+user_id;
        let header = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded').append('Access-Control-Allow-Origin', '*');
        return this.http.post<any>('/api/pay/customer_pay',data, { observe: 'response', responseType: 'json', headers: header }).pipe(map((res) => { console.log(res.body); return res.body; }));
       // return this.http.post<any>('/api/pay/c2b_pay',data, { observe: 'response', responseType: 'json', headers: header }).pipe(map((res) => { console.log(res.body); return res.body; }));
       // return this.http.get<any>('https://glacial-harbor-87888.herokuapp.com/api/mpesa/', { observe: 'response', responseType: 'json', headers: header }).pipe(map((res) => { console.log(res.body); return res.body; }));
    }

}
