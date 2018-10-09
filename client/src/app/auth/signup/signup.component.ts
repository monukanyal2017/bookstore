import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from '../auth.service';
import { Dialogbox } from '../../shared/dialogbox/dialog.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  maxDate;
  info: any;
  status: any;
  dob:any;
  
  constructor(public dialog: MatDialog, private authService: AuthService, public snackBar: MatSnackBar) {
    this.info = '';
    this.status = '';
  }

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  changedate(ndate){
    console.log(ndate.value);
    this.dob=this.GetDateFormat(ndate.value);
  }
  onSubmit(form: NgForm) {
    console.log(form.value);
    form.value.birthdate=this.dob;
    if (form.value.cpassword == form.value.password) {
      this.authService.signup(form.value).subscribe(res => {
        if (res.error == false) {
          this.openSnackBar(res.text, null);
        }
        else {
          form.resetForm();
          this.openSnackBar(res.text, null);
        }
      }, error => {
        this.openSnackBar(error, null);
      });
    }
    else {
      this.openSnackBar("Confirmation Password should be same", null);
    }
  }

   GetDateFormat(date) {
    var month = (date.getMonth() + 1).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '/' + day + '/' + date.getFullYear();
}




}
