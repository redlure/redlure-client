import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ServersApiService } from '../servers-api.service'
import { first } from 'rxjs/operators'
import { Server } from '../server.model'

@Component({
  selector: 'app-del-server',
  templateUrl: './del-server.component.html'
})
export class DelServerComponent implements OnInit {
  loading = false;
  @Input() editServer: Server;
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

  deleteServer() {
    this.loading = true;
    this.serversApiService.deleteServer(this.editServer.id)
      .pipe(first())
        .subscribe(
            data => {
                this.loading = false;
                this.emitter.emit(this.editServer)
                this.closeModal()
            },
            error => {
                console.log(error)
            });
            
}

}