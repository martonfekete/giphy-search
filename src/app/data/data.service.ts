import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, first, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { MappedPagination } from '../api/pagination.model';
import { GifSearchResultItem } from '../api/search-gif.model';
import { GifImage, ImageRequestProps } from './images.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  searchResults$: Observable<GifImage[]> = of([]);
  noResults$: Subject<boolean> = new Subject();
  private currentQuery$: BehaviorSubject<string> = new BehaviorSubject('');
  private pageRequested$: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    private readonly http: HttpClient,
    private readonly api: ApiService
  ) {
    this.searchResults$ = this.buildSearchObservable();
  }

  buildSearchObservable(): Observable<GifImage[]> {
    return combineLatest([
      this.currentQuery$,
      this.pageRequested$]).pipe(
        map(([query, page]) => ({ query, page })),
        filter((request: ImageRequestProps) => !!request.query),
        distinctUntilChanged((prev, current) => prev.query === current.query && prev.page === current.page),
        switchMap((request: ImageRequestProps) => this.triggerImageSearch(request.query, request.page)),
        catchError(() => of([])));
  }

  triggerImageSearch(query: string, page: number): Observable<GifImage[]> {
    return this.api.getImageData(query, page).pipe(
      map(results => {
        this.updateResultStatus(results);
        return this.mapImages(results);
      }));
  }

  getBadWords(): Observable<string[]> {
    return this.http.get<string[]>(environment.badWords);
  }

  updateQuery(query: string): void {
    this.currentQuery$.next(query);
  }

  updateRequestedPage(pageRequested: number): void {
    this.pageRequested$.next(pageRequested);
  }

  getPagination(): Subject<MappedPagination> {
    return this.api.imagePages$;
  }

  private updateResultStatus(results: GifSearchResultItem[]): void {
    if (!results.length) {
      this.noResults$.next(true);
    } else {
      this.noResults$.next(false);
    }
  }

  private mapImages(data: GifSearchResultItem[]): GifImage[] {
    return data.map(rawData => {
      const { url: giphyUrl, id, title,
        images: { fixed_height: { url: src, width, height } } } = rawData;
      return {
        giphyUrl,
        id,
        title,
        height,
        width,
        src
      };
    });
  }
}
