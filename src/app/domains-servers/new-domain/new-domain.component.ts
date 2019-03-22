import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DomainsApiService } from '../domains-api.service'
import { first } from 'rxjs/operators'

@Component({
  selector: 'app-new-domain',
  templateUrl: './new-domain.component.html',
  styleUrls: ['./new-domain.component.css']
})
export class NewDomainComponent implements OnInit {
  myForm: FormGroup;
  submitted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private domainsApiService: DomainsApiService,
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      domain: ['', Validators.required],
      certPath: [],
      keyPath: []
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
    
    this.domainsApiService.postDomain(this.f.domain.value, this.f.certPath.value, this.f.keyPath.value)
      .pipe(first())
        .subscribe(
            data => {
                this.closeModal()
                //this.router.navigate(['workspaces/' + data['id']])
            },
            error => {
                console.log(error)
            });
    }
}
