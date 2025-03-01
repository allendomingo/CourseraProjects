import { Component, Inject, OnInit } from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { expand, flyInOut } from '../animations/app.animation';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
	host: {
		'[@flyInOut]': 'true',
		'style': 'display: block;'
	},
	animations: [
		expand(),
		flyInOut()
	]
})
export class MenuComponent implements OnInit {
  dishes: Dish[] | undefined;
	errMess: string | undefined;

  constructor(
		private dishService: DishService,
		@Inject('BaseURL') public BaseURL: string,
	) { }

  ngOnInit(): void {
    this.dishService.getDishes()
			.subscribe(
				(dishes) =>  this.dishes = dishes,
				errMess => this.errMess = <any>errMess,
			);
  }
}
