import { Component, Inject, OnInit } from '@angular/core';

import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { expand, flyInOut } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
	host: {
		'[@flyInOut]': 'true',
		'style': 'display: block;'
	},
	animations: [
		expand(),
		flyInOut()
	]
})
export class AboutComponent implements OnInit {

  leaders: Leader[] | undefined;
	errMess: string | undefined;

  constructor(
    private leaderService: LeaderService,
		@Inject('BaseURL') public BaseURL: string,
  ) { }

  ngOnInit(): void {
    this.leaderService.getLeaders()
			.subscribe(
				(leaders) => this.leaders = leaders,
				errMess => this.errMess = errMess,
			);
  }

}
