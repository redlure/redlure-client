import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UsersApiService } from '../users-api.service'
import { first } from 'rxjs/operators'
import { User } from '../user.model'

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  newUser: Object;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private usersApiService: UsersApiService,
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required, Validators.minLength(10)],
      role: ['', Validators.required]
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  get f() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.myForm.invalid) {
        return;
    }
    
    this.loading = true;
    this.usersApiService.postUser(this.f.username.value, this.f.password.value, this.f.role.value)
      .pipe(first())
        .subscribe(
            data => {
                this.newUser = data;
                this.emitter.emit(this.newUser);
                this.loading = false;
                this.closeModal()
                //this.router.navigate(['workspaces/' + data['id']])
            },
            error => {
                this.loading = false;
                console.log(error)
            });
    }
}
