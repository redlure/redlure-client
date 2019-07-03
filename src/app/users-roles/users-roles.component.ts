import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { NewDomainComponent } from './new-domain/new-domain.component'
//import { NewServerComponent } from './new-server/new-server.component'
//import { ServersApiService } from './servers-api.service'
import { UsersApiService } from './users-api.service'
import { RolesApiService } from './roles-api.service'
import { NewUserComponent } from './new-user/new-user.component';
import { NewRoleComponent } from './new-role/new-role.component'
//import { Server } from './server.model'
import { DelUserComponent } from './del-user/del-user.component'
import { DelRoleComponent } from './del-role/del-role.component'
import { EditRoleComponent } from './edit-role/edit-role.component'
//import { DelDomainComponent } from './del-domain/del-domain.component'

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

  getUsers(): void {
    this.usersApiService.getUsers()
      .subscribe(users => this.users = users);
  }

  getRoles(): void {
    this.rolesApiService.getRoles()
      .subscribe(roles => this.roles = roles);
  }

  addUserModal(){
    const modalRef = this.modalService.open(NewUserComponent);
    modalRef.componentInstance.roles = this.roles;
    modalRef.componentInstance.emitter.subscribe(data => this.users.push(data));
  }

  deleteUserModal(user){
    this.onUserSelect(user);
    const modalRef = this.modalService.open(DelUserComponent);
    modalRef.componentInstance.editUser = this.editUser;
    modalRef.componentInstance.emitter.subscribe( 
      data => {
        const index: number = this.users.indexOf(data);
        if (index !== -1) {
          this.users.splice(index, 1);
        }        
      }
    );
  }

  addRoleModal(){
    const modalRef = this.modalService.open(NewRoleComponent);
    modalRef.componentInstance.emitter.subscribe(data => this.roles.push(data));
  }

  deleteRoleModal(role){
    this.onRoleSelect(role);
    const modalRef = this.modalService.open(DelRoleComponent);
    modalRef.componentInstance.editRole = this.editRole;
    modalRef.componentInstance.emitter.subscribe( 
      data => {
        const index: number = this.roles.indexOf(data);
        if (index !== -1) {
          this.roles.splice(index, 1);
        }   
        //refresh users, some may have been deleted when role was deleted
        this.getUsers();     
      }
    );
  }

  editRoleModal(role){
    this.onRoleSelect(role);
    const modalRef = this.modalService.open(EditRoleComponent);
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
    this.getUsers()
    this.getRoles()
  }
  

}
