import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-server-processes',
  templateUrl: './server-processes.component.html'
})
export class ServerProcessesComponent implements OnInit {
  alias: String;
  processes: Object[];

  headers = ["Protocol", "Local address", "Status", "PID", "Program name"]

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

}
