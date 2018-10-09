import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../auth/auth.service';
import { CartService } from '../../shared/services/cart.service';
import { Cartarr } from '../../shared/model/cart.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth = false;  //BYDEFAULT
  authSubscription: Subscription;
  cartSubscription: Subscription;
  cartarr: Array<Cartarr> = [];

  constructor(private authService: AuthService, private Cartservice: CartService) { }

  ngOnInit() {

    this.authSubscription = this.authService.authChange.subscribe(resp => {
      console.log(resp);
      this.isAuth = resp.isauth;

    });
    this.isAuth = this.authService.isLoggedIn();
    this.cartSubscription = this.Cartservice.cartChange.subscribe(resp => {
      //console.log(resp);
      this.cartarr = resp;
    });
    this.cartarr=this.Cartservice.getcartlist();
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

}
