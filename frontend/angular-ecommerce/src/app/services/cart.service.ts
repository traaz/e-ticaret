import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  carItems: CartItem[] =[];
  totalPrice: Subject<number> = new Subject<number>(); //subject ile tum subscriberslara event gonderiyoz
  totalQuantity: Subject<number> = new Subject<number>(); //subject ile tum subscriberslara event gonderiyoz

  constructor() { }

  addToCart(thecartItem: CartItem){
    //sepette urun var mı kontrol
    let alreadyExistsInCartt: boolean = false; //sepette varm iyok mu
    let existingCartItem:CartItem | undefined; //sepette varolan urun

    if(this.carItems.length > 0) {
      //urunu bul sepette
      existingCartItem = this.carItems.find(tempCartItem => tempCartItem.id === thecartItem.id);

    //eger bulduysan kontrol
    alreadyExistsInCartt = (existingCartItem != undefined); //urun yukarda varsa true
    }

    if(alreadyExistsInCartt){
      existingCartItem?.quantity ? existingCartItem.quantity++ : 0; //urunun quantitysini 1 arttir. tekrar eklemedik urunun quantitisini arttirdik
    }else{
      this.carItems.push(thecartItem); //eger eklenecek urun sepette yoksa direkt ekle
    }


    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue:number = 0;

    for(let currentCartItem of this.carItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
      //publish new values all subsricber will receive new data

      this.totalPrice.next(totalPriceValue);
      this.totalQuantity.next(totalQuantityValue);

    }
  }
}
