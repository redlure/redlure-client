import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewDomainComponent } from './new-domain/new-domain.component'
import { NewServerComponent } from './new-server/new-server.component'
import { ServersApiService } from './servers-api.service'
import { DomainsApiService } from './domains-api.service'
import { Domain } from './domain.model'
import { Server } from './server.model'
import { DelServerComponent } from './del-server/del-server.component'
import { DelDomainComponent } from './del-domain/del-domain.component'


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
  domains: Domain[];
  serverLoading = false;
  domainHeaders = ['#', 'Domain', 'DNS Lookup', 'Cert Path', 'Key Path', 'Generate Cert', 'Delete']
  serverHeaders = ['#', 'Alias', 'IP', 'Port', 'Status', 'Refresh Status', 'Delete']

  @Input() editServer: Server; // the Server currently being edited
  @Input() editDomain: Domain; // the Domain currently being edited

  constructor(
    private domainsApiService: DomainsApiService,
    private serversApiService: ServersApiService,
    private modalService: NgbModal
  ) { }

  onServerSelect(server: Server): void {
    this.editServer = server;
  }

  onDomainSelect(domain: Domain): void {
    this.editDomain = domain;
  }

  openServerModal() {
    const modalRef = this.modalService.open(NewServerComponent);
    modalRef.componentInstance.emitter.subscribe(data => this.servers.push(data));
  }

  openDomainModal() {
    const modalRef = this.modalService.open(NewDomainComponent);
    modalRef.componentInstance.emitter.subscribe(data => this.domains.push(data));
  }

  deleteServerModal(server) {
    this.onServerSelect(server)
    const modalRef = this.modalService.open(DelServerComponent);
    modalRef.componentInstance.editServer = this.editServer
    modalRef.componentInstance.emitter.subscribe(
      data => {
        const index: number = this.servers.indexOf(data);
        if (index !== -1) {
          this.servers.splice(index, 1);
        }
      }
    );
  }

  deleteDomainModal(domain) {
    this.onDomainSelect(domain)
    const modalRef = this.modalService.open(DelDomainComponent);
    modalRef.componentInstance.editDomain = this.editDomain
    modalRef.componentInstance.emitter.subscribe(
      data => {
        const index: number = this.domains.indexOf(data);
        if (index !== -1) {
          this.domains.splice(index, 1);
        }
      }
    );
  }

  getServers(): void {
    this.serversApiService.getServers()
      .subscribe(servers => this.servers = servers);
  }

  getDomains(): void {
    this.domainsApiService.getDomains()
      .subscribe(domains => this.domains = domains);
  }

  refreshStatus(server: Server): void {
    this.serverLoading = true;
    this.serversApiService.refreshServerStatus(server.id)
      .subscribe(
        data => {
          server.status = data['status']
          this.serverLoading = false;
        },
        error => {
          this.serverLoading = false;
        }
      )
  }

  ngOnInit() {
    this.getDomains()
    this.getServers()
  }
}
