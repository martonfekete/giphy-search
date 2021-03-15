import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { MappedPagination } from '../api/pagination.model';
import { GifSearchResultItem } from '../api/search-gif.model';
import { GifImage } from './images.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  searchResults$: Subject<GifImage[]> = new Subject();
  noResults$: Subject<boolean> = new Subject();
  private currentQuery = '';

  constructor(
    private readonly http: HttpClient,
    private readonly api: ApiService
  ) { }

  getBadWords(): Observable<string[]> {
    return this.http.get<string[]>(environment.badWords);
  }

  queryImages(query: string, page = 0): void {
    this.currentQuery = query;
    this.api.getImageData(query, page).pipe(
      first(),
      map(results => {
        this.updateResultStatus(results);
        return this.mapImages(results);
      }))
      .subscribe(data => this.searchResults$.next(data));
  }

  getPagination(): Subject<MappedPagination> {
    return this.api.imagePages$;
  }

  queryGifPage(pageRequested: number): void {
    this.queryImages(this.currentQuery, pageRequested);
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
