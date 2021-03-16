import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { DataService } from './data.service';
import { GifImage } from './images.model';

describe('DataService', () => {
  let service: DataService;
  let apiServiceStub: jasmine.SpyObj<ApiService>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    apiServiceStub = jasmine.createSpyObj('ApiService', ['getImageData']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceStub }
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildSearchObservable', () => {
    beforeEach(() => {
      spyOn(service, 'triggerImageSearch');
    });

    it('should not trigger request if query is missing', () => {
      // arrange
      (service as any).currentQuery$.next(''); //tslint:disable-line
      // act
      service.buildSearchObservable().subscribe();
      expect(service.triggerImageSearch).not.toHaveBeenCalled();
    });

    it('should trigger request if request query changes', () => {
      // arrange
      (service as any).currentQuery$.next('test'); //tslint:disable-line
      // act
      service.buildSearchObservable().subscribe();
      expect(service.triggerImageSearch).toHaveBeenCalledWith('test', 0);
    });

    it('should trigger request if request page changes', () => {
      // arrange
      (service as any).currentQuery$.next('test'); //tslint:disable-line
      (service as any).pageRequested$.next(3); //tslint:disable-line
      // act
      service.buildSearchObservable().subscribe();
      expect(service.triggerImageSearch).toHaveBeenCalledWith('test', 3);
    });

    it('should not trigger request if request parameters do not change', () => {
      // arrange
      (service as any).currentQuery$.next('test'); //tslint:disable-line
      (service as any).currentQuery$.next('test'); //tslint:disable-line
      (service as any).pageRequested$.next(3); //tslint:disable-line
      (service as any).pageRequested$.next(3); //tslint:disable-line
      // act
      service.buildSearchObservable().subscribe();
      expect(service.triggerImageSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('triggerImageSearch', () => {
    it('should trigger API with query and page values', () => {
      // arrange
      apiServiceStub.getImageData.and.returnValue(of([]));
      // act
      service.triggerImageSearch('test', 2).subscribe();
      // assert
      expect(apiServiceStub.getImageData).toHaveBeenCalledWith('test', 2);
    });

    it('should update empty-response boolean to true on empty subject', () => {
      // arrange
      apiServiceStub.getImageData.and.returnValue(of([]));
      const noResultUpdateSpy = spyOn(service.noResults$, 'next');
      // act
      service.triggerImageSearch('test', 2).subscribe();
      // assert
      expect(noResultUpdateSpy).toHaveBeenCalledWith(true);
    });

    describe('on valid response', () => {
      let mockApiResponse: any; //tslint:disable-line
      beforeEach(() => {
        mockApiResponse = [
          {
            url: 'testGiphyUrl',
            id: 'testId',
            title: 'testTitle',
            images: {
              fixed_height: {
                url: 'testImageSrc',
                width: '100',
                height: '100'
              }
            }
          }];
        apiServiceStub.getImageData.and.returnValue(of(mockApiResponse));
      });

      it('should update empty-response boolean to false', () => {
        // arrange
        const noResultUpdateSpy = spyOn(service.noResults$, 'next');
        // act
        service.triggerImageSearch('test', 2).subscribe();
        // assert
        expect(noResultUpdateSpy).toHaveBeenCalledWith(false);
      });

      it('should map API response to image structure', (done: DoneFn) => {
        // arrance
        const expectedMap: GifImage[] = [{
          giphyUrl: 'testGiphyUrl',
          id: 'testId',
          title: 'testTitle',
          src: 'testImageSrc',
          width: '100',
          height: '100'
        }];
        // act
        service.triggerImageSearch('test', 2).subscribe(mappedValues => {
          // assert
          expect(mappedValues).toEqual(expectedMap);
          done();
        });
      });
    });
  });

  it('getBadWords should return assets', () => {
    // act
    service.getBadWords().subscribe(data => {
      // assert
      expect(data).toEqual(['badwords']);
    });

    // assert cont
    const req = httpTestingController.expectOne(environment.badWords);
    expect(req.request.method).toEqual('GET');
    req.flush(['badwords']);
    httpTestingController.verify();
  });

  it('updateQuery should update currentQuery observable', () => {
    // arrange
    const subjectSpy = spyOn((service as any).currentQuery$, 'next'); //tslint:disable-line
    // act
    service.updateQuery('test');
    // assert
    expect(subjectSpy).toHaveBeenCalledWith('test');
  });

  it('updateRequestedPage should update currentQuery observable', () => {
    // arrange
    const subjectSpy = spyOn((service as any).pageRequested$, 'next'); //tslint:disable-line
    // act
    service.updateRequestedPage(4);
    // assert
    expect(subjectSpy).toHaveBeenCalledWith(4);
  });
});
