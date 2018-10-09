import { DataSource } from "@angular/cdk/table";
import { CartService } from "../services/cart.service";
import { Observable,of as observableOf, merge } from "rxjs";
import { Cartarr } from "../model/cart.model";

export class CartDataSource extends DataSource<any> {
  
    constructor(private Cartservice:CartService) {
      super();
    }
    connect(): Observable<Array<Cartarr>> {
      return observableOf(this.Cartservice.getcartlist());
    }
    disconnect() {}
  }