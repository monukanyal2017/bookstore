import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
//import { AuthConstants } from '../auth.constants';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Dialogbox } from '../../shared/dialogbox/dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  info: any;
  status: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.info = "";
    this.status = "";

  }
  openDialog(): void {
    const dialogRef = this.dialog.open(Dialogbox, {
      width: '350px',
      data: { text: this.info, status: this.status }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + result);

    });
  }



  login(form: NgForm) {
    const val = form.value;

    if (val.email && val.password) {
      this.authService.login(val.email, val.password)
        .subscribe(
          (resp: any) => {
            console.log('resp:');
            console.log(resp);
            if (resp.error == false) {
              this.info = resp.text;
              this.status = false;
              this.authService.setSession(resp.result, resp.token);
              this.openDialog();
              this.router.navigate(['/home']);

            }
            else {
              this.info = resp.text;
              this.status = true;
              this.openDialog();
            }
          },
          (error: any) => {
            this.info = error;
            this.status = false;
            this.openDialog();
          }
        );
    }
  }
}
