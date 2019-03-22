import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewDomainComponent } from './new-domain/new-domain.component'
import { NewServerComponent } from './new-server/new-server.component'
import { ServersApiService } from './servers-api.service'
import { DomainsApiService } from './domains-api.service'
import { Domain } from './domain.model'
import { Server } from './server.model'

@Component({
  selector: 'app-domains-servers',
  templateUrl: './domains-servers.component.html',
  providers: [
    DomainsApiService,
    ServersApiService
   ],
  styleUrls: ['./domains-servers.component.css']
})
export class DomainsServersComponent implements OnInit {
  servers: Server[];
  editServer: Server; // the Server currently being edited
  domains: Domain[];
  editDomain: Domain; // the Domain currently being edited

  domainHeaders = ['', 'Domain', 'DNS Lookup', 'Certificate Path', 'Key Path', 'Delete']
  serverHeaders = ['', 'Alias', 'IP', 'Port', 'Status', 'Refresh Status', 'Delete']

  constructor(
    private domainsApiService: DomainsApiService,
    private serversApiService: ServersApiService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getDomains()
    this.getServers()
  }

  openServerModal() {
    const modalRef = this.modalService.open(NewServerComponent);
  }

  openDomainModal() {
    const modalRef = this.modalService.open(NewDomainComponent);
  }


  getServers(): void {
    this.serversApiService.getServers()
      .subscribe(servers => this.servers = servers);
  }

  getDomains(): void {
    this.domainsApiService.getDomains()
      .subscribe(domains => this.domains = domains);
  }

}
