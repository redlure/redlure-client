import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ServersApiService } from '../servers-api.service'
import { first } from 'rxjs/operators'

@Component({
  selector: 'app-new-key',
  templateUrl: './new-key.component.html'
})
export class NewKeyComponent implements OnInit {
  apiKey: String;
  @Output() emitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private serversApiService: ServersApiService,
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  refreshApiKey() {
    this.serversApiService.refreshApiKey()
      .pipe(first())
      .subscribe(
        data => {
          this.apiKey = data["key"]
          this.emitter.emit(this.apiKey)
          this.closeModal()
        }
      )
  }

}