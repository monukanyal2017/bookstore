import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from './dialog.model';
import { Router } from '@angular/router';

@Component({
  selector: 'dialog-box',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class Dialogbox {

  constructor(
    public dialogRef: MatDialogRef<Dialogbox>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private router: Router) { }

    onNoClick(): void {
      this.dialogRef.close();
    }

    onCloseCancel() {
      this.dialogRef.close('confirm');
      console.log(this.data.status);
      // if(this.data.status==true)
      // {
      //   this.router.navigate(['/']);
      // } 
    }
}