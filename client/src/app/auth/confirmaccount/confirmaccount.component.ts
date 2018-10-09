import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirmaccount',
  templateUrl: './confirmaccount.component.html',
  styleUrls: ['./confirmaccount.component.css']
})
export class ConfirmaccountComponent implements OnInit {
  status:any;
  message:any;
  key:any;
  id:number;
  constructor(private activeRoute: ActivatedRoute,private AuthService:AuthService) { }

  ngOnInit() {
    // const queryParams = this.activeRoute.snapshot.queryParams
    // this.key=queryParams.key;
    // this.id=queryParams.id;
    this.activeRoute.queryParams.subscribe(params => {
            this.key = params['key'];
            this.id = params['id'];
            console.log('key:'+this.key);
            console.log('id:'+this.id);
            this.AuthService.confirm_account(this.key,this.id) .subscribe(
              (resp: any) => {
                console.log('resp:');
                console.log(resp);
                  this.message = resp.text;
              },
              (error: any) => {
                this.message = error;
              }
            );
       });
  
  }

}
