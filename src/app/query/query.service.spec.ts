import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { DataService } from '../data/data.service';
import { QueryService } from './query.service';

describe('QueryService', () => {
  let service: QueryService;
  let dataServiceSpies: any; //tslint:disable-line
  const badWords = ['badword'];

  beforeEach(() => {
    dataServiceSpies = jasmine.createSpyObj('DataService', ['getBadWords', 'updateQuery']);
    TestBed.configureTestingModule({
      providers: [
        { provide: DataService, useValue: dataServiceSpies }
      ]
    });
    dataServiceSpies.getBadWords.and.returnValue(of(badWords));
    service = TestBed.inject(QueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate query control based on prevented words', () => {
    // act
    service.query.setValue(badWords[0]);
    // assert
    expect(service.query.valid).toBeFalse();
  });

  describe('initQueryControl', () => {
    beforeEach(() => {
      spyOn(service, 'initQueryFieldWatcher');
    });

    it('should init watcher', () => {
      // act
      service.initQueryControl();
      // assert
      expect(service.initQueryFieldWatcher).toHaveBeenCalled();
    });

    it('should return query control', () => {
      // arrange
      dataServiceSpies.getBadWords.and.returnValue(of([]));
      // act
      const queryControl = service.initQueryControl();
      // assert
      expect(queryControl).toBeDefined();
    });
  });

  describe('initQueryFieldWatcher', () => {
    it('should only query value if field is valid', fakeAsync(() => {
      // act
      service.initQueryFieldWatcher();
      service.query.setValue('badword');
      tick(1000);
      expect(dataServiceSpies.updateQuery).not.toHaveBeenCalled();
    }));

    it('should only query value if there is value', fakeAsync(() => {
      // act
      service.initQueryFieldWatcher();
      service.query.setValue('gif');
      service.query.setValue('');
      tick(1000);
      expect(dataServiceSpies.updateQuery).not.toHaveBeenCalled();
    }));

    it('should debounce input', fakeAsync(() => {
      // act
      service.initQueryFieldWatcher();
      service.query.setValue('abc');
      service.query.setValue('bcd');
      service.query.setValue('def');
      tick(1000);
      expect(dataServiceSpies.updateQuery).toHaveBeenCalledTimes(1);
    }));

    it('should call query with control value', fakeAsync(() => {
      // act
      service.initQueryFieldWatcher();
      service.query.setValue('gif');
      tick(1000);
      expect(dataServiceSpies.updateQuery).toHaveBeenCalledWith('gif');
    }));
  });
});
