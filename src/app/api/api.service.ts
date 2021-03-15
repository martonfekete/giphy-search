import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APIKEY, BASEURL, PERPAGE } from '../app.constants';
import { MappedPagination, Pagination } from './pagination.model';
import { GifSearchResponse, GifSearchResultItem } from './search-gif.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  imagePages$: Subject<MappedPagination> = new Subject();

  constructor(
    private readonly http: HttpClient
  ) { }

  getImageData(query: string, page = 0): Observable<GifSearchResultItem[]> {
    const searchParams = this.buildSearchParams(query, page);
    return this.http.get<GifSearchResponse>(BASEURL, {
      params: searchParams
    }).pipe(
      map(response => {
        this.imagePages$.next(this.mapPaginationData(response.pagination));
        return response.data;
      }),
      catchError(() => of([]))
    );
  }

  mapPaginationData(rawPagination: Pagination): MappedPagination {
    const { offset, count, total_count } = rawPagination;
    const divisor = count > 0 ? count : 1;
    return {
      current: Math.floor(offset / divisor),
      last: Math.ceil(total_count / divisor - 1)
    };
  }

  private buildSearchParams(query: string, page: number): HttpParams {
    return new HttpParams()
      .set('q', query)
      .set('api_key', APIKEY)
      .set('limit', PERPAGE.toString())
      .set('offset', (page * PERPAGE).toString());
  }
}
