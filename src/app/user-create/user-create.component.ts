import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {UserCreate} from "../user-create";
import {Location, NgIf} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule,
  ],
  templateUrl: './user-create.component.html',
})
export class UserCreateComponent {
  @ViewChild('CreateSuccessDialog')
  createSuccessDialog!: ElementRef<HTMLDialogElement>;

  @ViewChild('ErrorDialog')
  errorDialog!: ElementRef<HTMLDialogElement>;

  errorMessage: string = '';

  constructor(private readonly userService: UserService, readonly location: Location) {
  }

  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*$')]),
  })

  get name() {
    return this.userForm.get('name');
  }

  get email() {
    return this.userForm.get('email');
  }

  get phone() {
    return this.userForm.get('phone');
  }

  goBack() {
    this.location.back();
  }

  createUser() {
    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      this.errorDialog.nativeElement.showModal();
      return;
    }
    this.userService.createUser(<UserCreate>{
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      phone: "+66" + this.userForm.value.phone?.slice(1, 10)
    }).subscribe({
      next: () => {
        this.createSuccessDialog.nativeElement.showModal();
        setTimeout(() => {
          this.createSuccessDialog.nativeElement.close();
        }, 3000)
      },
      error: (error) => {
        this.errorMessage = error;
        this.errorDialog.nativeElement.showModal();
      }
    })
  }
}

