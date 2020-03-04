import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
  @Input() campaign:any = {};

  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit() {
    // set nulls undefined objects
    console.log(this.campaign.payload_file.length)
    if (this.campaign.email == null)          { this.campaign.email = {'name': '[Deleted]'} }
    if (this.campaign.profile == null)        { this.campaign.profile = {'name': '[Deleted]'} }
    if (this.campaign.list == null)           { this.campaign.list = {'name': '[Deleted]'} }
    if (this.campaign.domain == null)         { this.campaign.domain = {'domain': '[Deleted]'} }
    if (this.campaign.server == null)         { this.campaign.server = {'alias': '[Deleted]'} }
    if (this.campaign.payload_file == 'null')   { console.log('hit'); this.campaign.payload_file = '' }
    if (this.campaign.payload_url == 'null')    { this.campaign.payload_url = '' }
    if (this.campaign.redirect_url == 'null')   { this.campaign.redirect_url = '' }



    if (this.campaign.pages.length == 0) { this.campaign.pages.push({ 'page': { 'name': ''} }) }
    if (this.campaign.pages.length == 1) { this.campaign.pages.push({ 'page': { 'name': ''} }) }
    if (this.campaign.pages.length == 2) { this.campaign.pages.push({ 'page': { 'name': ''} }) }
    if (this.campaign.pages.length == 3) { this.campaign.pages.push({ 'page': { 'name': ''} }) }


  }

  closeModal() {
    this.activeModal.close();
  }

}
