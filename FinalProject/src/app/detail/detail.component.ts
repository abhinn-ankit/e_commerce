import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {ProductService} from '../services/product.service';

import 'rxjs/add/operator/switchMap';
import {Product} from '../models/product';
import {UserAccountService} from '../services/userAccount.service';
import {CartModel} from '../models/cart';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  productID: string;
  product: Product;
  selectedSize: string;
  selectedQty: number;

  size: string[] = ['s', 'm', 'l', 'xl'];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: ProductService,
              private userAccountService: UserAccountService) {
  }

  ngOnInit() {
    // this.productID = this.route.snapshot.params["productID"]
    // console.log(this.productID);
    this.route.paramMap
      .switchMap((params: ParamMap) => params.getAll('productID'))
      .subscribe(productID => {
        this.productID = productID;
        // console.log(this.productID)
        this.service
          .getProduct(productID)
          .subscribe(product => {
            this.product = product;
          });
      });
  }

  changeSize(size) {
    this.selectedSize = size;
  }

  onAdd() {
    this.userAccountService.getCurrentUser();
    const cart = new CartModel( this.selectedSize, this.selectedQty, this.productID );
    if ( !this.selectedSize || !this.selectedQty ) {
      alert('You missed something');
      return;
    }
    this.userAccountService.addProductToCart(cart)
      .subscribe(
        data => {
          this.userAccountService.updateCart(data.obj);
        },
        error => console.error(error)
      );
  }

}
