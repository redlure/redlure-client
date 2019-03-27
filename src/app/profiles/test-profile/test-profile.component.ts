import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Profile } from '../profile.model'
import { first } from 'rxjs/operators'
import { ProfilesApiService } from '../profiles-api.service'

@Component({
  selector: 'app-test-profile',
  templateUrl: './test-profile.component.html',
  styleUrls: ['./test-profile.component.css']
})
export class TestProfileComponent implements OnInit {
  sendSuccess = false;
  sendFail = false;
  workspaceId: String;
  myForm: FormGroup;
  submitted = false;
  loading = false;
  editProfile: Profile;


  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private profilesApiService: ProfilesApiService,
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });

    this.workspaceId = this.router.url.split('/')[2];
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
    this.profilesApiService.testProfile(this.workspaceId, String(this.editProfile.id), this.f.email.value)
      .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                if (data['success']) {
                  this.sendFail = false;
                  this.sendSuccess = true;
                } else {
                  this.sendFail = true;
                  this.sendSuccess = false;
                }
  

                //this.router.navigate(['workspaces/' + data['id']])
            },
            error => {
                this.loading = false;
                console.log(error)
            });
            
}

}
