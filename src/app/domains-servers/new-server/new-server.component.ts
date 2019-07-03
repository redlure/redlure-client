import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ServersApiService } from '../servers-api.service'
import { first } from 'rxjs/operators'
import { Server } from '../server.model'

@Component({
  selector: 'app-new-server',
  templateUrl: './new-server.component.html'
})
export class NewServerComponent implements OnInit {
  myForm: FormGroup;
  loading = false;
  submitted = false;
  newServer: Server;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

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
    
    this.loading = true;
    this.serversApiService.postServer(this.f.ip.value, this.f.alias.value, this.f.port.value)
      .pipe(first())
        .subscribe(
            data => {
                this.newServer = data;
                this.emitter.emit(this.newServer);
                this.loading = false;
                this.closeModal();
                //this.router.navigate(['workspaces/' + data['id']])
            },
            error => {
                this.loading = false;
                console.log(error)
            });
    }

}
