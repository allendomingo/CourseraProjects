import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { expand, flyInOut } from '../animations/app.animation';
import { FeedbackService } from '../services/feedback.service';
import { Feedback, ContactType } from '../shared/feedback';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
	host: {
		'[@flyInOut]': 'true',
		'style': 'display: block;'
	},
	animations: [
		expand(),
		flyInOut(),
	]
})
export class ContactComponent implements OnInit {

	feedback: Feedback | undefined;
	errMess: string | undefined;
	contactType = ContactType;

	feedbackForm!: FormGroup;
	@ViewChild('fform') feedbackFormDirective!: NgForm;

	status = 'default';

	formErrors: { [key: string]: string } = {
		'firstname': '',
		'lastname': '',
		'telnum': '',
		'email': ''
	};

	validationMessages: { [key: string]: { [key: string]: string } } = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  constructor(
		private fb: FormBuilder,
		private feedbackService: FeedbackService,
	) {
		this.createForm();
	}

  ngOnInit(): void {
  }

	createForm(): void {
		this.feedbackForm = this.fb.group({
			firstname: ['', [
				Validators.required, Validators.minLength(2), Validators.maxLength(25)
			]],
			lastname: ['', [
				Validators.required, Validators.minLength(2), Validators.maxLength(25)
			]],
			telnum: [0, [
				Validators.required, Validators.pattern
			]],
			email: ['', [
				Validators.required, Validators.email
			]],
			agree: false,
			contactype: 'None',
			message: ''
		});

		this.feedbackForm.valueChanges
			.subscribe(data => this.onValueChanged(data));
	
		this.onValueChanged(); // (re)set form validation message
	}

	onValueChanged(data?: any): void {
		if (!this.feedbackForm) return;

		const form = this.feedbackForm;
		for (const field in this.formErrors) {
			if (this.formErrors.hasOwnProperty(field)) {
				// clear previous error message (if any)
				this.formErrors[field] = '';

				const control = form.get(field);
				if (control && control.dirty && !control.valid) {
					const messages = this.validationMessages[field];
					for (const key in control.errors) {
						if (control.errors.hasOwnProperty(key)) {
							this.formErrors[field] += messages[key] + ' ';
						}
					}
				}
			}
		}
	}

	onSubmit(): void {
		this.status = 'submitting';
		const feedback = this.feedbackForm.value;
		console.log('feedback', feedback);

		this.feedbackService.postFeedback(feedback)
			.subscribe(feedbackResponse => {
				this.status = 'success';
				this.feedback = feedbackResponse;
				this.errMess = undefined;
			},
			errMess => {
				this.status = 'error';
				this.feedback = undefined;
				this.errMess = <any>errMess;
			});
		
		setTimeout(() => this.status = 'default', 5000);
		this.feedbackForm.reset({
			firstname: '',
			lastname: '',
			telnum: 0,
			email: '',
			agree: false,
			contactype: 'None',
			message: ''
		});
		this.feedbackFormDirective.resetForm();
	}

}
