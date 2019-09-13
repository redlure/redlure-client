import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdSortableHeader, TableComponent } from './table.component';

@NgModule({
  imports: [BrowserModule, CommonModule, NgbModule],
  declarations: [TableComponent, NgbdSortableHeader],
  exports: [TableComponent],
  bootstrap: [TableComponent]
})
export class NgbdTableSortableModule {}
