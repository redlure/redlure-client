import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProfilesApiService } from '../profiles-api.service'
import { first } from 'rxjs/operators'
import { Profile } from '../profile.model'

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  @Input() editProfile: Profile;
  workspaceId: String;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private profilesApiService: ProfilesApiService,
  ) { }


  ngOnInit() {
    this.myForm = this.formBuilder.group({
      name: ['', Validators.required],
      fromAddress: ['', Validators.compose([Validators.email, Validators.required])],
      smtpHost: ['', Validators.required],
      smtpPort: ['', Validators.compose([Validators.pattern('[0-9]*'), Validators.required])],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    
    this.workspaceId = this.router.url.split('/')[2];
    
    console.log(this.editProfile.ssl)
  }

  tlsChange(event){
    this.editProfile.tls = event.target.checked;
  }

  sslChange(event){
    this.editProfile.ssl = event.target.checked;
  }

  closeModal() {
    this.activeModal.close();
  }

  get f() { return this.myForm.controls; }

}
