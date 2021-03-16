import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryComponent } from './query.component';
import { QueryService } from './query.service';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    QueryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    QueryService
  ],
  exports: [
    QueryComponent
  ]
})
export class QueryModule { }
