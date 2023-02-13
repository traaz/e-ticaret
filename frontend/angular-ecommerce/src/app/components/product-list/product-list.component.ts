import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products:Product[] = [];
  cuurentCategoryId:number=1;
  searchMode:boolean=false;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { } //route parametrlerine erismek icin 1,2,3....

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

  }

  listProducts(){
    this.searchMode=this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();

    }

  }

  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id'); //varsa true yoksa false. app.moodules.ts'te ayni id yazmali
    if(hasCategoryId){
      //"id" al bu string. bunu + sembolu ile numbera cevirecegiz
      this.cuurentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else{
      this.cuurentCategoryId = 1;
    }
    //simdi urun getirelim kategoriye gore
    this.productService.getProductList(this.cuurentCategoryId).subscribe(
      data => {
        this.products = data;
      }
    )
  }
  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!; //parametreyi okuyuyorz
    this.productService.searchProducts(theKeyword).subscribe(
      data =>{
        this.products = data;
      }
    );

  }

  addToCart(theProduct:Product){
      const thecartItem = new CartItem(theProduct);
      this.cartService.addToCart(thecartItem);
  }

}
