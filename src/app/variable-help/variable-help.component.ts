import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-variable-help',
  templateUrl: './variable-help.component.html'
})
export class VariableHelpComponent implements OnInit {
  @Input() variables: string[];
  @Input() title: String;

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

}
