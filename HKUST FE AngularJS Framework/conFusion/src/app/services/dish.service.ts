import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor() { }

  getDishes(): Observable<Dish[]> {
		// Simulate server latency with 2 second delay
    return of(DISHES).pipe(delay(2000));
  }

  getDish(id: string): Observable<Dish> {
		const dish = DISHES.filter((dish) => (dish.id === id))[0];

		// Simulate server latency with 2 second delay
    return of(dish).pipe(delay(2000));
  }

  getFeaturedDish(): Observable<Dish> {
		const featuredDish = DISHES.filter((dish) => dish.featured)[0];

		// Simulate server latency with 2 second delay
		return of(featuredDish).pipe(delay(2000));
  }
}
