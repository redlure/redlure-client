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
import { AlertService } from '../alert/alert.service'
import { EditCertsComponent } from './edit-certs/edit-certs.component'


@Component({
  selector: 'app-domains-servers',
  templateUrl: './domains-servers.component.html',
  providers: [
    DomainsApiService,
    ServersApiService
  ]
})
export class DomainsServersComponent implements OnInit {
  servers: Server[];
  domains: Domain[];
  apiKey: string;
  serverLoading = false;
  domainHeaders = ['#', 'Domain', 'DNS Lookup', 'Certs', 'Generate Cert', 'Delete']
  serverHeaders = ['#', 'Alias', 'IP', 'Port', 'Status', 'Refresh Status', 'Delete']

  @Input() editServer: Server; // the Server currently being edited
  @Input() editDomain: Domain; // the Domain currently being edited

  constructor(
    private domainsApiService: DomainsApiService,
    private serversApiService: ServersApiService,
    private modalService: NgbModal,
    private alertService: AlertService,
  ) { }

  onServerSelect(server: Server): void {
    this.editServer = server;
  }

  onDomainSelect(domain: Domain): void {
    this.editDomain = domain;
  }

  hasCerts(domain) {
    if (domain.cert_path != "null" && domain.key_path != "null") {
      return true;
    } else {
      return false;
    }
  }

  editCerts(domain) {
    this.onDomainSelect(domain)
    const modalRef = this.modalService.open(EditCertsComponent, { size: 'lg' });
    modalRef.componentInstance.editDomain = this.editDomain
    modalRef.componentInstance.emitter.subscribe(
      data => {
        const index: number = this.domains.indexOf(this.editDomain);
        if (index !== -1) {
          this.domains[index] = data;
        }
      }
    );
  }

  openServerModal() {
    const modalRef = this.modalService.open(NewServerComponent, { size: 'lg' });
    modalRef.componentInstance.emitter.subscribe(data => this.servers.push(data));
  }

  openDomainModal() {
    const modalRef = this.modalService.open(NewDomainComponent, { size: 'lg' });
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

  getApiKey() {
    this.serversApiService.getApiKey()
      .subscribe(key => this.apiKey = key["key"])
  }

  refreshApiKey() {
    this.serversApiService.refreshApiKey()
    .subscribe(key => this.apiKey = key["key"])
  }

  copyApiKey() {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (this.apiKey));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  refreshStatus(server: Server): void {
    this.serverLoading = true;
    this.serversApiService.refreshServerStatus(server.id)
      .subscribe(
        data => {
          server.status = data['status']
          if (server.status == 'Offline') {
            this.alertService.newAlert("danger", "Request to " + server.alias + " timed out")
          }
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
    this.getApiKey()
  }
}
