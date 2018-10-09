import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import 'rxjs/add/operator/do';
import { throwError, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { authobj } from '../shared/interface/authobj.interface';

@Injectable()
export class AuthService {
    user: any;
    authToken: any;
    //authChange = new Subject<boolean>();
    authChange = new Subject<authobj>();
    
    constructor(private http: HttpClient, private router: Router) { 
        if(localStorage.getItem('user'))
        {
            this.user= localStorage.getItem('user'); 
            this.authToken =localStorage.getItem('id_token');
        }
    }
    /* esferasoft start */
    login(email: string, password: string) {
        let header = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded').append('Access-Control-Allow-Origin', '*');
        let login_data = 'email=' + email + '&password=' + password;
        return this.http.post<any>('/api/login', login_data, { observe: 'response', responseType: 'json', headers: header }).pipe(map((res) => { console.log(res.body); return res.body; }));
    }
    setSession(result, token) {
        // console.log('setsession called');
        localStorage.setItem('id_token', token);
        localStorage.setItem('user', JSON.stringify(result));
        this.authToken = token;
        this.user = result;
        this.authSuccessfully();
    }
 

    confirm_account(key,id){
        let header = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded').append('Access-Control-Allow-Origin', '*');
        return this.http.get<any>('/api/user/confirm_account?key='+key+"&id="+id, { observe: 'response', responseType: 'json', headers: header }).pipe(map((res) => { console.log(res.body); return res.body; }));
    
    }
    forgetpassword(user) {
        let header = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded').append('Access-Control-Allow-Origin', '*');
        let login_data = 'email=' + user.email;
        return this.http.post<any>('/api/user/forgetpassword', login_data, { observe: 'response', responseType: 'json', headers: header }).pipe(map((res) => { console.log(res.body); return res.body; }));
    }

    changepassword(user) {
        let header = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded').append('Access-Control-Allow-Origin', '*');
        let login_data = 'userid=' + user.userid + '&currentpassword=' + user.password + '&newpassword=' + user.newpassword + '&forgettoken=' + user.token;
        return this.http.post<any>('/api/user/changepassword', login_data, { observe: 'response', responseType: 'json', headers: header }).pipe(map((res) => { console.log(res.body); return res.body; }));
    }

    private authSuccessfully() {
        this.authToken = localStorage.getItem('id_token');
        this.user = JSON.parse(localStorage.getItem('user'));
        this.authChange.next({isauth:true});

    }


    signup(user: any) {
        let header = new HttpHeaders().set('content-type', 'application/x-www-form-urlencoded').append('Access-Control-Allow-Origin', '*');
        let login_data = 'username=' + user.name + '&email=' + user.email + '&dob=' + user.birthdate + '&password=' + user.password+'&mob='+user.mob;
        return this.http.post<any>('/api/register', login_data, { observe: 'response', responseType: 'json', headers: header }).pipe(map(res => { console.log(res.body); return res.body; }), catchError(this.handleError));
    }

    /* esferasoft end */

    logout() {
        this.authToken = null;
        this.user = null;
        localStorage.removeItem('id_token');
        localStorage.removeItem('user');
        this.authChange.next({isauth:false});
        this.router.navigate(['/']);
    }

    update_user_info(authResult){
        localStorage.setItem('user', JSON.stringify(authResult.result));
        this.authSuccessfully();
    }


    isLoggedIn() {
        return this.user != null;
    }
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        return throwError(
            'Something bad happened; please try again later.');
    }

}
