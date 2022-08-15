import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { AuthGuard } from '../services/auth.guard';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
// import { AuthGuard } from '../services/auth.guard';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  constructor(public mainService: MainService, public authGuard: AuthGuard, private router: Router) {
   }

   form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  error: string = "";

  ngOnInit(): void {
    
  }
  
  submit() {
    if (!this.form.valid) {
      this.error = "Please fill all fields";
      return
    }

    var username = this.form.controls['username'].value;
    var password = this.form.controls['password'].value;

    // alert(username);
    this.mainService.login(username, password).subscribe(resp => {
       var resp2: any = resp;
       if(resp2['success']){
          this.authGuard.authenticate();
          this.router.navigate(['']);
          
       }
       else{
          this.error = resp2['message'];
       }
    });

  }

   

}
