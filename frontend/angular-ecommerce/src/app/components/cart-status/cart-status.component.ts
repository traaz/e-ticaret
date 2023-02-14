import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {
  cartItems: CartItem[] = [];

  totalPrice:number = 0.00;
  totalQuantity:number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }
  updateCartStatus() {
    this.cartItems=this.cartService.carItems;

    //subscribe to the car total price
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    //subscribe to the car total quantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
   );
  }

}
