import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { APIKEY, BASEURL, PERPAGE } from '../app.constants';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;
  const mockImages = {
    data: [{
      content: 'mock'
    }],
    pagination: {
      offset: 50,
      total_count: 2555,
      count: 15
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getImageData', () => {
    function getUrl(query: string, page = 0): string {
      return `${BASEURL}?q=${query}&api_key=${APIKEY}&limit=${PERPAGE}&offset=${page * PERPAGE}`;
    }

    it('should query giphy APIs', () => {
      // act
      service.getImageData('test', 5).subscribe();

      // assert
      const req = httpTestingController.expectOne(getUrl('test', 5));
      expect(req.request.method).toEqual('GET');
      req.flush(mockImages);
    });

    it('should update pagination', () => {
      // act
      service.getImageData('test').subscribe();

      // assert
      const req = httpTestingController.expectOne(getUrl('test'));
      expect(req.request.method).toEqual('GET');

      service.imagePages$.subscribe(pages => {
        // assert cont
        expect(pages).toEqual({
          current: 3,
          last: 170
        });
      });
      req.flush(mockImages);
    });

    it('should return empty array in case of errors', () => {
      // act
      service.getImageData('test', 5).subscribe(data => {
        // assert
        expect(data).toEqual([]);
      });

      // assert
      const req = httpTestingController.expectOne(getUrl('test', 5));
      expect(req.request.method).toEqual('GET');
      req.flush(mockImages, {
        status: 400,
        statusText: 'Mock error'
      });
    });
  });
});
