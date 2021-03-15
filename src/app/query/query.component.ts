import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { QueryService } from './query.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent {
  query: FormControl;

  constructor(
    private readonly queryService: QueryService
  ) {
    this.query = this.queryService.initQueryControl();
  }
}
