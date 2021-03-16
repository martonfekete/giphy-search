import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { DataService } from '../data/data.service';

@Injectable()
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
    this.initQueryFieldWatcher();
    return this.query;
  }

  initQueryFieldWatcher(): void {
    this.query.valueChanges.pipe(
      debounceTime(1000),
      filter(value => this.query.valid && !!value)
    ).subscribe(value => {
      this.dataService.updateQuery(value);
    });
  }

  private buildPreventWordsRegex(toPrevent: string[]): RegExp {
    return new RegExp(`^((?!${toPrevent.join('|')}).)*$`);
  }
}
