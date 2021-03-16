import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MappedPagination } from '../api/pagination.model';
import { DataService } from '../data/data.service';
import { GifImage } from '../data/images.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {
  empty$: Subject<boolean>;
  images$: Observable<GifImage[]>;
  pages$: Subject<MappedPagination>;

  constructor(
    private readonly dataService: DataService
  ) {
    this.empty$ = this.dataService.noResults$;
    this.images$ = this.dataService.searchResults$;
    this.pages$ = this.dataService.getPagination();
  }

  onPageRequested(pageNumber: number): void {
    this.dataService.updateRequestedPage(pageNumber);
  }
}
