import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomainsApiService } from '../domains-api.service'
import { first } from 'rxjs/operators'
import { Domain } from '../domain.model'

@Component({
  selector: 'app-new-domain',
  templateUrl: './new-domain.component.html'
})
export class NewDomainComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  newDomain: Domain;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

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

    this.loading = true;
    this.domainsApiService.postDomain(this.f.domain.value, this.f.certPath.value, this.f.keyPath.value)
      .pipe(first())
      .subscribe(
        data => {
          this.newDomain = data;
          this.emitter.emit(this.newDomain);
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
