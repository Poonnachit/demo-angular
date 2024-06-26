import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {UserCreate} from "../user-create";
import {catchError, retry, throwError} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The response body may contain clues as to what went wrong.
      if (Array.isArray(error.error.message)) {
        console.error(`Backend returned code ${error.status}, body was: `, error.error.message[0]);
      } else {
        console.error(`Backend returned code ${error.status}, body was: `, error.error.message);
      }
    }
    // Return an observable with a user-facing error message.
    if (Array.isArray(error.error.message)) {
      return throwError(() => new Error(error.error.message[0]));
    } else {
      return throwError(() => new Error(error.error.message));
    }
  }

  constructor(private http: HttpClient) {
  }

  getAllUsers() {
    return this.http.get(`${this.baseUrl}/users`).pipe(retry(3), catchError(this.handleError));
  }

  getUserById(id: string) {
    return this.http.get(`${this.baseUrl}/users/${id}`).pipe(retry(3), catchError(this.handleError));
  }

  createUser(user: UserCreate) {
    return this.http.post(`${this.baseUrl}/users`, user).pipe(retry(3), catchError(this.handleError));
  }

  updateUser(id: string, user: any) {
    return this.http.patch(`${this.baseUrl}/users/${id}`, user).pipe(retry(3), catchError(this.handleError));
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.baseUrl}/users/${id}`).pipe(retry(3), catchError(this.handleError));
  }
}
