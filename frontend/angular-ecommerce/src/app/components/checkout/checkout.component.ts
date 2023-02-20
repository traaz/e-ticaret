import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { FormServiceService } from 'src/app/services/form-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0.0;
  totalQuantity: number = 0;
  creditCardYears : number [] = [];
  creditCardMonths : number [] = [];
  countries: Country[] = [];
  shippingAddressStates : State[] = [];
  billingAddressStates : State[] = [];

  constructor(private formBuilder: FormBuilder,
    private formService : FormServiceService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router:Router) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer : this.formBuilder.group({
        firstName:new FormControl('', [Validators.required, Validators.minLength(3)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress : this.formBuilder.group({
        street : new FormControl('', [Validators.required, Validators.minLength(3)]),
      //  city : new FormControl('', [Validators.required, Validators.minLength(3)]),
        state : new FormControl('', [Validators.required]),
        country : new FormControl('', [Validators.required]),
        zipCode : ['']
      }),
      billingAddress : this.formBuilder.group({
        street : new FormControl('', [Validators.required, Validators.minLength(3)]),
        //  city : new FormControl('', [Validators.required, Validators.minLength(3)]),
          state : new FormControl('', [Validators.required]),
          country : new FormControl('', [Validators.required]),
          zipCode :  new FormControl('', [Validators.required, Validators.minLength(3)])
      }),
      creditCard: this.formBuilder.group({
        cardType : new FormControl('', [Validators.required]),
        nameOnCard : new FormControl('', [Validators.required, Validators.minLength(3)]),
        cardNumber : new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),//only 16 digits
        securityCode : new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear : [''],
      })

    });

    const startMonth : number = new Date().getMonth()+1; //+1cunku js 0'dan baslar bu metodu
    this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

    this.formService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data ;
      }
    )
    this.formService.getCountries().subscribe(
      data  => {
        console.log(JSON.stringify(data));
        this.countries = data;
      }
    )
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

  }
  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){ return this.checkoutFormGroup.get('customer.email'); }
  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  //get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street'); }
  //get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode'); }




  onSubmit(){
    console.log("Handling submit data")
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched(); //eger istenilen validation olmazsa ve submit edilirse input altında hata mesaji gösterilcek
      return;
    }
     //order
    let order = new Order();
    order.totalPrice= this.totalPrice;
    order.totalQuantity = this.totalQuantity;
    //cart item
    const cartItems = this.cartService.carItems;
     //orderItems from carItems
     let orderItems: OrderItem[] = [];
     for(let i =0 ; i<cartItems.length; i++){
      orderItems[i] = new OrderItem(cartItems[i]);
     }
     //purchase customer
     let purchase = new Purchase();
     purchase.customer = this.checkoutFormGroup.controls['customer'].value;

     //purchase shipping

     purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
     //Get the state object
     const shippingState : State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
     //Get the country object
     const shippingCountry : Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
     //Get the name of state from State object
     purchase.shippingAddress.state = shippingState.name;
     purchase.shippingAddress.country = shippingCountry.name;

     //purchase billing
     purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
     const billingState : State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
     const billingCountry : Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
     purchase.billingAddress.state = billingState.name;
     purchase.billingAddress.country = billingState.name;

    //order order items


    purchase.order = order;
     purchase.orderItems = orderItems;

     //call rest api via the checkoutservice
     this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response =>{
          alert(`Your order hass been received.\nOrder tracking number: ${response.orderTrackingNumber}`)
          this.resetCart();
        },
        error: err=> {
          alert(`There was an error: ${err.message}`)
        }
      }
     );



    console.log(this.checkoutFormGroup.get('customer')?.value);
  }
  resetCart() {
    //reset cart data
    this.cartService.carItems = [];
    this.cartService.totalPrice.next(0); //tum abonelere sifir gonder
    this.cartService.totalQuantity.next(0);
    //reset the form
    this.checkoutFormGroup.reset();
    //router
    this.router.navigateByUrl("/products");

  }

  copyShippingAddressToBillingAddress(event:any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

          //bug olustu otomatik gelmiyordu boyle cozduk
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
                //bug olustu otomatik gelmiyordu boyle cozduk

      this.billingAddressStates = [];

    }
  }

  handleMonthsAndYears(){
    //eger bulundugumuz yil seciliyse gecmis aylar gosterilmeyecek. gelecek yil seciliyse tum aylar gosterilcek
     const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
     const currentYear : number = new Date().getFullYear();
     const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);
     let startMonth: number ;
     if(currentYear === selectedYear){
      startMonth = new Date().getMonth()+1; //sifirdan basladigi icin +1

     }
     else{
      startMonth=1;
     }
     this.formService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data
      }
     )
  }
  getStates(formGroupName : string){

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    const stateName = formGroup?.value.state.name;
    console.log(countryCode);
    console.log(countryName);


    this.formService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates=data;
        }
        formGroup?.get('state')?.setValue(data[0]); //ulke secildikten sonra ilk sehir otomatik secilcek

    /*    if(formGroup?.value.state.name == "Trabzon"){
          this.checkoutFormGroup.controls['shippingAddress'].get('zipCode')?.setValue(61000);

        }else if(formGroup?.value.state.name != "Trabzon"){
          this.checkoutFormGroup.controls['shippingAddress'].get('zipCode')?.reset();

        }*/
      }

    );

  }





}
