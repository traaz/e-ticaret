import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice:number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {
      //alisveris seperi ogelerini liste icinde almak icin
      this.cartItems=this.cartService.carItems;

      this.cartService.totalPrice.subscribe(
        data => this.totalPrice = data
      );
      //subscribe to the car total quantity
      this.cartService.totalQuantity.subscribe(
        data => this.totalQuantity = data
     );
     this.cartService.computeCartTotals();
  }
  incrementQuantity(theCartItem: CartItem){
    this.cartService.addToCart(theCartItem);
  }
  decrementQuantity(theCartItem : CartItem ){
    this.cartService.decrementQuantity(theCartItem);
  }
  removeItem(theCartItem : CartItem){
    this.cartService.remove(theCartItem);
  }

}
