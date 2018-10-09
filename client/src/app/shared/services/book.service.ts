import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import 'rxjs/add/operator/do';
import { throwError, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class BookService {
    user: any;
    authToken: any;

    constructor(private http: HttpClient, private router: Router) { 

    }
    getbooklist(){
        let header = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded').append('Access-Control-Allow-Origin', '*');
        return this.http.get<any>('/api/books', { observe: 'response', responseType: 'json', headers: header }).pipe(map((res) => { console.log(res.body); return res.body; }));
    }

}
