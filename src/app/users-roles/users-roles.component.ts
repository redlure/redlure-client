import { Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersApiService } from './users-api.service';
import { RolesApiService } from './roles-api.service';
import { NewUserComponent } from './new-user/new-user.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { DelUserComponent } from './del-user/del-user.component';
import { DelRoleComponent } from './del-role/del-role.component';
import { EditRoleComponent } from './edit-role/edit-role.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ChangeUserRoleComponent } from './change-user-role/change-user-role.component';
import { Subject, forkJoin } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';


@Component({
  selector: 'app-users-roles',
  templateUrl: './users-roles.component.html'
})

export class UsersRolesComponent implements OnInit {
  users: Object[];
  roles: Object[];
  @Input() editUser: Object; // the User currently being edited
  @Input() editRole: Object; // the Role currently being edited

  userHeaders = ["#", "Username", "Role", "Actions"]
  roleHeaders = ["#", "Name", "Type", "Actions"]

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;
  dtTrigger: Subject<any>[] = [];
  dtOptions: DataTables.Settings[] = [];

  userLoading = false;
  roleLoading = false;

  constructor(
    private usersApiService: UsersApiService,
    private rolesApiService: RolesApiService,
    private modalService: NgbModal
  ) { }

  onUserSelect(user: Object): void {
    this.editUser = user;
  }

  onRoleSelect(role: Object): void {
    this.editRole = role;
  }

  // deprecated; now using forkJoin in ngInit
  getUsers(): void {
    this.usersApiService.getUsers()
      .subscribe(users => {
        this.users = users;
      });
  }

  // deprecated; now using forkJoin in ngInit
  getRoles(): void {
    this.rolesApiService.getRoles()
      .subscribe(roles => {
        this.roles = roles;
        this.getUsers();
      });
  }

  changeUserRole(user) {
    this.onUserSelect(user);
    const modalRef = this.modalService.open(ChangeUserRoleComponent, { backdrop: 'static' });
    modalRef.componentInstance.editUser = this.editUser;
    modalRef.componentInstance.roles = JSON.parse(JSON.stringify(this.roles));
  }

  addUserModal() {
    const modalRef = this.modalService.open(NewUserComponent, { backdrop: 'static' });
    modalRef.componentInstance.roles = this.roles;
    modalRef.componentInstance.emitter.subscribe(data => {
      this.users.push(data);
      this.rerender('userTable');
    });
  }

  deleteUserModal(user) {
    this.onUserSelect(user);
    const modalRef = this.modalService.open(DelUserComponent, { backdrop: 'static' });
    modalRef.componentInstance.editUser = this.editUser;
    modalRef.componentInstance.emitter.subscribe(
      data => {
        const index: number = this.users.indexOf(data);
        if (index !== -1) {
          this.users.splice(index, 1);
          this.rerender('userTable');
        }
      }
    );
  }

  resetPassword(user) {
    this.onUserSelect(user);
    const modalRef = this.modalService.open(PasswordResetComponent, { backdrop: 'static' });
    modalRef.componentInstance.editUser = this.editUser;
  }

  addRoleModal() {
    const modalRef = this.modalService.open(NewRoleComponent, { backdrop: 'static' });
    modalRef.componentInstance.emitter.subscribe(data => {
      this.roles.push(data);
      this.rerender('roleTable');
    });
  }

  deleteRoleModal(role) {
    this.onRoleSelect(role);
    const modalRef = this.modalService.open(DelRoleComponent, { backdrop: 'static' });
    modalRef.componentInstance.editRole = this.editRole;
    modalRef.componentInstance.emitter.subscribe(
      data => {
        const index: number = this.roles.indexOf(data);
        if (index !== -1) {
          this.roles.splice(index, 1);
          //refresh users, some may have been deleted when role was deleted
          this.getUsers();
        }
        this.rerender('userTable');
        this.rerender('roleTable');
      }
    );
  }

  editRoleModal(role) {
    this.onRoleSelect(role);
    const modalRef = this.modalService.open(EditRoleComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.editRole = this.editRole;
    modalRef.componentInstance.emitter.subscribe(
      data => {
        const index: number = this.roles.indexOf(this.editRole);
        if (index !== -1) {
          this.roles[index] = data
        }
      }
    );
  }

  ngOnInit() {
    this.dtTrigger["userTable"] = new Subject<any>();
    this.dtTrigger["roleTable"] = new Subject<any>();
    //this.getUsers()
    //this.getRoles()

    this.userLoading = true;
    this.roleLoading = true;

    forkJoin([this.usersApiService.getUsers(), this.rolesApiService.getRoles()])
      .subscribe(data => {
        this.users = data[0];
        this.roles = data[1];
        this.dtTrigger['userTable'].next();
        this.dtTrigger['roleTable'].next();
        this.userLoading = false;
        this.roleLoading = false;
      });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger["userTable"].unsubscribe();
    this.dtTrigger["roleTable"].unsubscribe();
  }

  rerender(table): void {
    this.dtElements.forEach((dtElement: DataTableDirective) => {
      let tableId = dtElement['el'].nativeElement.id
      dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        if (tableId == table) {
          dtInstance.destroy();
          //console.log('destroying ' + table)
        }
      });
    });
    this.dtTrigger[table].next();
  }

}
