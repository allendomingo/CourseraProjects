import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Feedback } from '../shared/feedback';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
		private http: HttpClient,
		private processHTTPMsgService: ProcessHTTPMsgService,
	) { }

	postFeedback(feedback: Feedback): Observable<Feedback> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
			})
		};

		return this.http.post<Feedback>(
			baseURL + 'feedback/',
			feedback,
			httpOptions,
		).pipe(catchError(this.processHTTPMsgService.handleError));
	}
}
