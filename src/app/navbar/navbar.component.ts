import { Component, OnInit } from '@angular/core';
import { LoginApiService } from '../login/login-api.service'
import { first } from 'rxjs/operators'
import { Router } from '@angular/router';

@Component({
  selector: 'main-navbar',
  templateUrl: './navbar.component.html',
  //styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private loginApiService: LoginApiService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  logout(){
    this.loginApiService.logout()
    .pipe(first())
        .subscribe(
            data => {
              this.router.navigate(['/login'])
            },
            error => {
                console.log(error)
            });
  }

}
