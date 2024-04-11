import {Routes} from '@angular/router';
import {UsersComponent} from "./users/users.component";
import {UserCreateComponent} from "./user-create/user-create.component";
import {UserEditComponent} from "./user-edit/user-edit.component";

export const routes: Routes = [
  {
    path: "",
    component: UsersComponent
  },
  {
    path: "create",
    component: UserCreateComponent
  },
  {
    path: "edit/:id",
    component: UserEditComponent
  }
];
