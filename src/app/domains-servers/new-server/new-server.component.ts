import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ServersApiService } from '../servers-api.service'
import { first } from 'rxjs/operators'

@Component({
  selector: 'app-new-server',
  templateUrl: './new-server.component.html',
  styleUrls: ['./new-server.component.css']
})
export class NewServerComponent implements OnInit {
  myForm: FormGroup;
  submitted = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private serversApiService: ServersApiService,
  ) { }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      ip: ['', Validators.required],
      alias: ['', Validators.required],
      port: ['', Validators.compose([Validators.pattern('[0-9]*'), Validators.required])]
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
    
    this.serversApiService.postServer(this.f.name.value)
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
