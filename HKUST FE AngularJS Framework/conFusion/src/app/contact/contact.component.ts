import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

	feedbackForm!: FormGroup;
	feedback!: Feedback;
	contactType = ContactType;

  constructor(
		private fb: FormBuilder
	) {
		this.createForm();
	}

  ngOnInit(): void {
  }

	createForm(): void {
		this.feedbackForm = this.fb.group({
			firstname: '',
			lastname: '',
			telnum: 0,
			email: '',
			agree: false,
			contactype: 'None',
			message: ''
		});
	}

	onSubmit(): void {
		this.feedback = this.feedbackForm.value;
		console.log('feedback', this.feedback);
		this.feedbackForm.reset();
	}

}
