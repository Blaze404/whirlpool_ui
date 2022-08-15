import { Injectable } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import { HttpClient, HttpErrorResponse, HttpHeaderResponse } from "@angular/common/http";
import { Observable, BehaviorSubject, Subject, of, throwError } from 'rxjs'
import { catchError, first } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private http: HttpClient) { }


  private baseURL = "http://172.105.252.13:8000/api"

  private loginUrl = "login/";
  private dashboardUrl = "dashboard/";
  private currentQuantityUrl = "available_quantity/";
  private add_transactionUrl = "add_transaction/"
  private inventoryUrl = 'inventory/';
  private add_inventoryUrl = 'add_inventory/';
  private remove_transactionUrl = 'return_inventory/';



  login(username: string, password: string){
    let context = {
      "username": username,
      "password": password
    }
    // console.log(headerss);
    const loginURL = `${this.baseURL}/${this.loginUrl}`;
    // Adding empty {} because POST takes headers as third option second are post  params
    return this.http.post(loginURL,context).pipe(
      catchError(error => this.handleError(error))
    );

  }

  dashboard(){
    const dashboardURL = `${this.baseURL}/${this.dashboardUrl}`;
    // Adding empty {} because POST takes headers as third option second are post  params
    return this.http.get(dashboardURL).pipe(
      catchError(error => this.handleError(error))
    );

  }


  current_quantity(name: string, part_number: string){
    let context = {
      "name": name,
      "part_number": part_number
    }
    // console.log(headerss);
    const loginURL = `${this.baseURL}/${this.currentQuantityUrl}`;
    // Adding empty {} because POST takes headers as third option second are post  params
    return this.http.post(loginURL,context).pipe(
      catchError(error => this.handleError(error))
    );

  }

  add_transaction(name: string, item: string, part_number: string, quantity: string){
    let context = {
      "name": name,
      "part_number": part_number,
      "item": item,
      "quantity": quantity
    }
    // console.log(headerss);
    const loginURL = `${this.baseURL}/${this.add_transactionUrl}`;
    // Adding empty {} because POST takes headers as third option second are post  params
    return this.http.post(loginURL,context).pipe(
      catchError(error => this.handleError(error))
    );

  }

  remove_transaction(name: string, item: string, part_number: string, quantity: string, not_working: boolean ){
    // remove_transactionUrl

    let context = {
      "name": name,
      "part_number": part_number,
      "item": item,
      "quantity": quantity,
      "not_working": not_working
    }
    // console.log(headerss);
    const loginURL = `${this.baseURL}/${this.remove_transactionUrl}`;
    // Adding empty {} because POST takes headers as third option second are post  params
    return this.http.post(loginURL,context).pipe(
      catchError(error => this.handleError(error))
    );
  }


  
  inventory(){
    const dashboardURL = `${this.baseURL}/${this.inventoryUrl}`;
    // Adding empty {} because POST takes headers as third option second are post  params
    return this.http.get(dashboardURL).pipe(
      catchError(error => this.handleError(error))
    );

  }


  add_inventory(name: string, part_number: string, quantity: string){
    let context = {
      "name": name,
      "part_number": part_number,
      "quantity": quantity
    }
    // console.log(headerss);
    const loginURL = `${this.baseURL}/${this.add_inventoryUrl}`;
    // Adding empty {} because POST takes headers as third option second are post  params
    return this.http.post(loginURL,context).pipe(
      catchError(error => this.handleError(error))
    );

  }




  
  private handleError(error: HttpErrorResponse) {
	  if (error.error instanceof ErrorEvent) {
	    // A client-side or network error occurred. Handle it accordingly.
	    console.error('An error occurred:', error.error.message);
	  } else {
	    // The backend returned an unsuccessful response code.
	    // The response body may contain clues as to what went wrong,
	    //console.error(
	    //  `Backend returned code ${error.status}, ` +
	    //  `body was: ${error.error}`);
	  }
	  // return an observable with a user-facing error message
	  return throwError(error);
	};

}
