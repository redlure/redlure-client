import { Component, OnInit, AfterViewInit, AfterViewChecked, Output, Input, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  @Input() selectedForm;

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    console.log(this.selectedForm)
  }

  closeModal() {
    this.activeModal.close();
  }

  copyData(data) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (data));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

}
