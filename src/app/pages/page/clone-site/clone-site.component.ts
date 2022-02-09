import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators'
import { PagesApiService } from '../../pages-api.service'

@Component({
  selector: 'app-clone-site',
  templateUrl: './clone-site.component.html',
  styleUrls: ['./clone-site.component.css']
})
export class CloneSiteComponent implements OnInit {
  myForm: FormGroup;
  submitted = false;
  loading = false;
  fail = false;
  failMsg: String;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private pagesApiService: PagesApiService,
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      link: ['', [Validators.required]]
    });
  }

  closeModal() {
    this.activeModal.close();
  }

  get formControls() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.myForm.valid) {
      this.loading = true;
      this.pagesApiService.cloneSite(this.formControls.link.value)
        .pipe(first())
        .subscribe(
          data => {
            this.loading = false;
            if (data['success'] == false) {
              this.failMsg = data['message']
              this.fail = true
            } else {
              this.fail = false
              this.emitter.emit(data['html'])
              this.closeModal()
            }
          },
          error => {
            this.loading = false;
            console.log(error)
          });

    }
  }
}
