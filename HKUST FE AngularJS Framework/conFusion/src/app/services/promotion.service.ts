import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor() { }

  getPromotions(): Observable<Promotion[]> {
		// Simulate server latency with 2 second delay
    return of(PROMOTIONS).pipe(delay(2000));
  }

  getPromotion(id: string): Observable<Promotion> {
		const promotion = PROMOTIONS.filter((promo) => (promo.id === id))[0];

		// Simulate server latency with 2 second delay
    return of(promotion).pipe(delay(2000));
  }

  getFeaturedPromotion(): Observable<Promotion> {
		const featuredPromotion = PROMOTIONS.filter((promotion) => promotion.featured)[0];

		// Simulate server latency with 2 second delay
    return of(featuredPromotion).pipe(delay(2000));
  }
}
