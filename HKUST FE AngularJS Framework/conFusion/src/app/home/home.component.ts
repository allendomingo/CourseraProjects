import { Component, Inject, OnInit } from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { expand, flyInOut } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
	host: {
		'[@flyInOut]': 'true',
		'style': 'display: block;'
	},
	animations: [
		expand(),
		flyInOut()
	]
})
export class HomeComponent implements OnInit {

  dish: Dish | undefined;
	dishErrMess: string | undefined;
  promotion: Promotion | undefined;
	promotionErrMess: string | undefined;
  leader: Leader | undefined;
	leaderErrMess: string | undefined;

  constructor(
    private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
		@Inject('BaseURL') public BaseURL: string,
  ) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish()
			.subscribe(
				(featuredDish) => this.dish = featuredDish,
				errMess => this.dishErrMess = <any>errMess,
			);
    this.promotionService.getFeaturedPromotion()
			.subscribe(
				(featuredPromotion) => this.promotion = featuredPromotion,
				errMess => this.promotionErrMess = <any>errMess,
			);
    this.leaderService.getFeaturedLeader()
			.subscribe(
				(featuredLeader) => this.leader = featuredLeader,
				errMess => this.leaderErrMess = <any>errMess,
			);
  }

}
