import { Component, OnInit } from '@angular/core';
import { LoginApiService } from '../login/login-api.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'main-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  constructor(
    private loginApiService: LoginApiService,
    private router: Router,
    private modalService: NgbModal,
  ) { }

  logout() {
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

  profile() {
    const modalRef = this.modalService.open(ProfileComponent, { backdrop: 'static' });
  }

  ngOnInit() {
  }

}
