import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products:Product[] = [];
  cuurentCategoryId:number=1;
  constructor(private productService: ProductService,
              private route: ActivatedRoute) { } //route parametrlerine erismek icin 1,2,3....

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

  }

  listProducts(){

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

}
