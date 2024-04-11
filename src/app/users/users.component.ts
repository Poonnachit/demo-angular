import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserService} from "../user.service";
import {User} from "../user";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './users.component.html',
})
export class UsersComponent {
  users: User[] = []

  @ViewChild('ErrorDialog')
  errorDialog!: ElementRef<HTMLDialogElement>;

  errorTitle: string = '';
  errorMessage: string = '';

  @ViewChild('DeleteSuccessDialog')
  deleteSuccessDialog!: ElementRef<HTMLDialogElement>;

  constructor(readonly userService: UserService) {
  }

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe({
        next: (data) => {
          this.users = data as User[];
        },
        error: (error) => {
          this.errorTitle = 'Internal Server Error';
          this.errorMessage = error;
          this.errorDialog.nativeElement.showModal();
        }
      }
    );
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.getAllUsers();
        this.deleteSuccessDialog.nativeElement.showModal();
        setTimeout(() => {
          this.deleteSuccessDialog.nativeElement.close();
        }, 2000);
      },
      error: (error) => {
        this.errorTitle = 'Failed to delete user';
        this.errorMessage = error;
        this.errorDialog.nativeElement.showModal();
      }
    })
  }
}
