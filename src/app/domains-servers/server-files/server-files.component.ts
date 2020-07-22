import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ServersApiService } from '../servers-api.service';
import { AlertService } from '../../alert/alert.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-server-files',
  templateUrl: './server-files.component.html'
})
export class ServerFilesComponent implements OnInit, OnDestroy {

  loading = false
  @Input() editServer: any = {};
  files: any[] = [];
  headers = ["#", "Filename", "Actions"]
  file: File;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private serversApiService: ServersApiService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.getFiles();
  }

  getFiles() {
    this.loading = true;
    this.serversApiService.getFiles(this.editServer.id)
      .subscribe(files => {
        this.loading = false;
        this.files = files['files'];
        this.dtTrigger.next();
      });
  }

  closeModal() {
    this.activeModal.close();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  uploadFile(file) {
    if (file.target.files.length > 0) {
      this.loading = true;
      this.file = file.target.files[0];
      this.serversApiService.uploadFile(this.editServer.id, this.file)
        .subscribe(data => {
          this.loading = false;
          if (data['success'] == true) {
            const index: number = this.files.indexOf(this.file.name);
            if (index !== -1) {
              this.files.splice(index, 1);
            }
            this.files.push(this.file.name)
            this.rerender()
          } else {
            this.alertService.newAlert('warning', 'File failed to upload')
          }
        });
    }

  }

  deleteFile(file) {
    this.loading = true;
    this.serversApiService.deleteFile(this.editServer.id, file)
      .subscribe(data => {
        this.loading = false;
        if (data['success'] == true) {
          const index: number = this.files.indexOf(file);
          if (index !== -1) {
            this.files.splice(index, 1);
            this.rerender()
          }
        } else {
          this.alertService.newAlert('warning', 'Error deleting file')
        }
      });
  }

  deleteAll() {
    this.loading = true;
    this.serversApiService.deleteFiles(this.editServer.id)
      .subscribe(data => {
        this.loading = false;
        if (data['success'] == true) {
          this.files = []
          this.rerender()
        } else {
          this.alertService.newAlert('warning', 'Error deleting files')
        }
      });
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

}
