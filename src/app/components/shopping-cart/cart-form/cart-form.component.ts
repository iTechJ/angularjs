import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {ShoppingCartService} from "../shopping-cart.service";
import {Book} from "../../book/book";

@Component({
  selector: 'app-cart-form',
  templateUrl: './cart-form.component.html',
  styleUrls: ['./cart-form.component.scss']
})
export class CartFormComponent implements OnInit {
  cartForm: FormGroup;
  books: Book[];

  ngOnInit() {
  }

  cards: string[] = [
    "Visa",
    "American Express",
    "MasterCard",
    "Discover"
  ];

  constructor(private fb: FormBuilder,
              private shoppingCartService: ShoppingCartService,) {
    this.cartForm = fb.group({
      "cardType": [''],
      "cardNo": ['', Validators.compose([Validators.required])],
      "fullName": ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Zа-яА-Я\s]*$/)])]
    }, {validator: cardValidator});

    this.books = shoppingCartService.list();
  }

  onSubmit(cartForm: FormGroup): void {
    cartForm.reset();
    this.shoppingCartService.checkout();
    this.books = this.shoppingCartService.list();
  }

  bookWasDeleted(book: Book): void {
    this.shoppingCartService.remove(book);
    // this.books = this.shoppingCartService.list();
  }
}

function cardValidator(group: FormGroup) {
  const cardType: string = group.controls['cardType'].value;
  const cardNo: string = group.controls['cardNo'].value;
  let errors: any = {};

  if(!isValidCard(cardType, cardNo)) {
    errors.invalidCardNo = true;
  }

  return errors;
}

function isValidCard(cardType, cardNo): boolean {
  switch (cardType) {
    case "Visa": {
      //Visa card starting with 4, length 13 or 16 digits
      return cardNo.match(/^(?:4[0-9]{12}(?:[0-9]{3})?)$/);
    }
    case "American Express": {
      //American Express credit card starting with 34 or 37, length 15 digits
      return cardNo.match(/^(?:3[47][0-9]{13})$/);
    }
    case "MasterCard": {
      //MasterCard starting with 51 through 55, length 16 digits
      return cardNo.match(/^(?:5[1-5][0-9]{14})$/);
    }
    case "Discover": {
      //Discover Card starting with 6011, length 16 digits or starting with 5, length 15 digits
      return cardNo.match(/^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/);
    }
    default: {
      return false;
    }
  }
}
