import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormServiceService } from 'src/app/services/form-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears : number [] = [];
  creditCardMonths : number [] = [];
  countries: Country[] = [];
  shippingAddressStates : State[] = [];
  billingAddressStates : State[] = [];

  constructor(private formBuilder: FormBuilder,
    private formService : FormServiceService) { }

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
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
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
