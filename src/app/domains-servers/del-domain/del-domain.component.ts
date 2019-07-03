import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DomainsApiService } from '../domains-api.service'
import { first } from 'rxjs/operators'
import { Domain } from '../domain.model'

@Component({
  selector: 'app-del-domain',
  templateUrl: './del-domain.component.html'
})
export class DelDomainComponent implements OnInit {

  @Input() editDomain: Domain;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private domainsApiService: DomainsApiService,
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  deleteDomain() {
    this.domainsApiService.deleteDomain(this.editDomain.id)
      .pipe(first())
        .subscribe(
            data => {
                this.emitter.emit(this.editDomain)
                this.closeModal()
            },
            error => {
                console.log(error)
            });
            
}

}