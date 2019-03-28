import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { NewDomainComponent } from './new-domain/new-domain.component'
//import { NewServerComponent } from './new-server/new-server.component'
//import { ServersApiService } from './servers-api.service'
import { UsersApiService } from './users-api.service'
import { RolesApiService } from './roles-api.service'
//import { Server } from './server.model'
//import { DelServerComponent } from './del-server/del-server.component'
//import { DelDomainComponent } from './del-domain/del-domain.component'

@Component({
  selector: 'app-users-roles',
  templateUrl: './users-roles.component.html'
})

export class UsersRolesComponent implements OnInit {
  users: Object[];
  roles: Object[];

  userHeaders = ["#", "Username", "Role", "Delete"]
  roleHeaders = ["#", "Name", "Type", "Delete"]

  constructor(
    private usersApiService: UsersApiService,
    private rolesApiService: RolesApiService,
  ) { }

  getUsers(): void {
    this.usersApiService.getUsers()
      .subscribe(users => { console.log(users); this.users = users });
  }

  getRoles(): void {
    this.rolesApiService.getRoles()
      .subscribe(roles => { console.log(roles); this.roles = roles });
  }

  ngOnInit() {
    this.getUsers()
    this.getRoles()
  }
  

}
