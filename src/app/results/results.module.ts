import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results.component';
import { PaginationModule } from '../pagination/pagination.module';

@NgModule({
  declarations: [
    ResultsComponent
  ],
  imports: [
    CommonModule,
    PaginationModule
  ],
  exports: [
    ResultsComponent
  ]
})
export class ResultsModule { }
