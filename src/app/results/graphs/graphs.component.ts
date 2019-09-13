import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../data.service';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html'
})
export class GraphsComponent implements OnInit {
  @Input() results: any[] = [];
  buttons = [
    {name: 'Doughnut'},
    {name: 'Pie'},
    {name: 'Bar'},
  ]
  activeButton = this.buttons[0]

  constructor(
    public activeModal: NgbActiveModal,
    private dataService: DataService
  ) { }

  ngOnInit() {
  
  }

  closeModal() {
    this.activeModal.close();
  }

  showPhase(event){
    this.activeButton = event;
    this.dataService.updateType(event.name.toLowerCase());
  }

}
