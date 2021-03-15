import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MappedPagination } from '../api/pagination.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() pages: MappedPagination;
  @Output() pageRequested: EventEmitter<number> = new EventEmitter();

  get showPrevious(): boolean {
    return this.pages.current !== 0;
  }
  get showNext(): boolean {
    return this.pages.last !== this.pages.current && this.pages.last !== -1;
  }

  constructor() {
    this.pages = {
      current: 0,
      last: 0
    };
  }

  prevClicked(): void {
    this.pageRequested.emit(this.pages.current - 1);
  }

  nextClicked(): void {
    this.pageRequested.emit(this.pages.current + 1);
  }
}
