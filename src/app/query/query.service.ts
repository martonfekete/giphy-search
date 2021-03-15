import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  query: FormControl = new FormControl();

  constructor(
    private readonly dataService: DataService
  ) {
    this.dataService.getBadWords().subscribe(badWords => {
      this.query.setValidators(Validators.pattern(this.buildPreventWordsRegex(badWords)));
    });
  }

  initQueryControl(): FormControl {
    this.watchQueryField();
    return this.query;
  }

  watchQueryField(): void {
    this.query.valueChanges.pipe(
      debounceTime(1000),
      filter(() => this.query.valid && !!this.query)
    ).subscribe(val => {
      this.dataService.queryImages(val);
    });
  }

  private buildPreventWordsRegex(toPrevent: string[]): RegExp {
    return new RegExp(`^((?!${toPrevent.join('|')}).)*$`);
  }
}
