import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor() { }

  getLeaders(): Observable<Leader[]> {
		// Simulate server latency with 2 second delay
    return of(LEADERS).pipe(delay(2000));
  }

  getLeader(id: string): Observable<Leader> {
		const leader = LEADERS.filter(leader => (leader.id === id))[0];

		// Simulate server latency with 2 second delay
    return of(leader).pipe(delay(2000));
  }

  getFeaturedLeader(): Observable<Leader> {
		const featuredLeader = LEADERS.filter(leader => leader.featured)[0];

		// Simulate server latency with 2 second delay
    return of(featuredLeader).pipe(delay(2000));
  }
}
