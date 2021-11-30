import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { switchMap } from 'rxjs/operators';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
	animations: [
		trigger('visibility', [
			state('shown', style({
				transform: 'scale(1.0)',
				opacity: 1
			})),
			state('hidden', style({
				transform: 'scale(0.5)',
				opacity: 0
			})),
			transition('* => *', animate('0.5s ease-in-out'))
		])
	]
})
export class DishdetailComponent implements OnInit {

  dish: Dish | undefined;
	dishCopy: Dish | undefined;
	errMess: string | undefined;
	dishIds: string[] | undefined;

	prev: string | undefined;
	next: string | undefined;

	commentForm!: FormGroup;
	@ViewChild('cform') commentFormDirective!: NgForm;

	visibility = 'shown';

	formErrors: { [key: string]: string } = {
		'author': '',
		'comment': '',
	};
	
	validationMessages: { [key: string]: { [key: string]: string } } = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
    },
    'comment': {
      'required':      'Comment is required.',
    },
  };

  constructor(
    private dishService: DishService,
    private location: Location,
    private route: ActivatedRoute,
		private fb: FormBuilder,
		@Inject('BaseURL') public BaseURL: string,
  ) {
		this.createForm();
	}

  ngOnInit(): void {
		this.dishService.getDishIds()
			.subscribe(dishIds => this.dishIds = dishIds);
    this.route.params
			.pipe(switchMap((params: Params) => {
				this.visibility = 'hidden';
				return this.dishService.getDish(params['id']);
			}))
			.subscribe(
				dish => {
					this.dish = dish;
					this.dishCopy = dish;
					this.setPrevNext(dish.id);
					this.visibility = 'shown';
				},
				errMess => this.errMess = <any>errMess,
			);
  }

	setPrevNext(dishId: string): void {
		if (this.dishIds) {
			const index = this.dishIds.indexOf(dishId);
			const length = this.dishIds.length;
			this.prev = this.dishIds[(length + index - 1) % length];
			this.next = this.dishIds[(length + index + 1) % length];
		}
	}
 
  goBack(): void {
    this.location.back();
  }

	createForm(): void {
		this.commentForm = this.fb.group({
			author: ['', [
				Validators.required, Validators.minLength(2)
			]],
			rating: 5,
			comment: ['', [
				Validators.required
			]],
		});

		this.commentForm.valueChanges
			.subscribe(data => this.onValueChanged(data));
	
		this.onValueChanged(); // (re)set form validation message
	}

	onValueChanged(data?: any): void {
		if (!this.commentForm) return;

		const form = this.commentForm;
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
		if (this.dishCopy) {
			this.dishCopy.comments.push({
				...this.commentForm.value,
				date: new Date().toISOString(),
			});
			this.dishService.putDish(this.dishCopy)
				.subscribe(dish => {
					this.dish = dish;
					this.dishCopy = dish;
				},
				errMess => {
					this.dish = undefined;
					this.dishCopy = undefined;
					this.errMess = <any>errMess;
				});
		}
		this.commentFormDirective.resetForm();
		this.commentForm.reset({
			author: '',
			rating: 5,
			comment: '',
		});
	}

}
