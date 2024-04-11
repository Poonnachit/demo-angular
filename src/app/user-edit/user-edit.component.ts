import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {User} from "../user";
import {UserService} from "../user.service";
import {Location, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserCreate} from "../user-create";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent {
  @Input() id!: string;
  userDetail!: User

  @ViewChild('UpdateSuccessModal')
  updateSuccessModal!: ElementRef<HTMLDialogElement>;

  @ViewChild('ErrorDialog')
  errorDialog!: ElementRef<HTMLDialogElement>;

  errorTitle: string = '';
  errorMessage: string = '';

  constructor(private readonly userService: UserService, readonly location: Location) {
  }

  ngOnInit(): void {
    this.getUserDetail();
  }

  getUserDetail() {
    this.userService.getUserById(this.id).subscribe({
      next: (data: any) => {
        this.userDetail = data as User;
        this.userForm.patchValue({
          name: this.userDetail.name,
          email: this.userDetail.email,
          phone: "0" + this.userDetail.phone.slice(3, 13)
        })
      },
      error: (error) => {
        this.errorTitle = 'Internal Server Error';
        this.errorMessage = error;
        this.errorDialog.nativeElement.showModal();
        setTimeout(() => {
          this.location.back();
        }, 2000)
      }
    })
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

  editUser() {
    if (this.userForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      this.errorDialog.nativeElement.showModal();
      return;
    }
    this.userService.updateUser(this.userDetail._id, <UserCreate>{
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      phone: "+66" + this.userForm.value.phone?.slice(1, 10)
    }).subscribe({
      next: () => {
        this.updateSuccessModal.nativeElement.showModal();
        setTimeout(() => {
          this.updateSuccessModal.nativeElement.close();
        }, 3000)
      },
      error: (error) => {
        this.errorTitle = 'Failed to update user';
        this.errorMessage = error;
        this.errorDialog.nativeElement.showModal();
      }
    })
  }
}
