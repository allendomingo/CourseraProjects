import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

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
	@ViewChild('fform') feedbackFormDirective!: NgForm;

  constructor(
		private fb: FormBuilder
	) {
		this.createForm();
	}

  ngOnInit(): void {
  }

	createForm(): void {
		this.feedbackForm = this.fb.group({
			firstname: ['', Validators.required],
			lastname: ['', Validators.required],
			telnum: [0, Validators.required],
			email: ['', Validators.required],
			agree: false,
			contactype: 'None',
			message: ''
		});
	}

	onSubmit(): void {
		this.feedback = this.feedbackForm.value;
		console.log('feedback', this.feedback);
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
