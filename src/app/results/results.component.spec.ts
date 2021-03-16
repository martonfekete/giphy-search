import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { MappedPagination } from '../api/pagination.model';
import { DataService } from '../data/data.service';
import { PaginationComponent } from '../pagination/pagination.component';
import { ResultsComponent } from './results.component';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let dataServiceStub: Partial<DataService>;
  let dataService: DataService;

  beforeEach(async () => {
    dataServiceStub = {
      noResults$: new Subject(),
      searchResults$: of([{
        giphyUrl: 'testGiphyUrl',
        id: 'testId',
        title: 'testTitle',
        src: 'testImageSrc',
        width: '100',
        height: '100'
      }]),
      getPagination(): BehaviorSubject<MappedPagination> {
        return new BehaviorSubject({
          current: 0,
          last: 0
        });
      },
      updateRequestedPage(): void {
        return;
      }
    };

    await TestBed.configureTestingModule({
      declarations: [ResultsComponent, PaginationComponent],
      providers: [
        { provide: DataService, useValue: dataServiceStub }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display results as images', () => {
    // arrange
    const displayedImage = fixture.debugElement.query(By.css('.image__wrapper .image'));
    // assert
    expect(displayedImage).toBeDefined();
    expect(displayedImage.attributes.src).toEqual('testImageSrc');
    expect(displayedImage.attributes.id).toEqual('testId');
    expect(displayedImage.attributes.title).toEqual('testTitle');
  });

  describe('pagination', () => {
    it('should be displayed when results shown', () => {
      // arrange
      const pagination = fixture.debugElement.query(By.css('app-pagination'));
      // assert
      expect(pagination).toBeDefined();
    });

    it('should not be displayed when no pages$', () => {
      // act
      component.pages$.next(undefined);
      fixture.detectChanges();
      // arrange
      const pagination = fixture.debugElement.query(By.css('app-pagination'));
      // assert
      expect(pagination).toBeFalsy();
    });

    it('should trigger event', () => {
      // arrange
      const pagination = fixture.debugElement.query(By.css('app-pagination'));
      spyOn(component, 'onPageRequested');
      // act
      pagination.triggerEventHandler('pageRequested', {});
      // assert
      expect(component.onPageRequested).toHaveBeenCalled();
    });
  });

  it('should not display no-results when images are displayed', () => {
    // arrange
    const noResultAlert = fixture.debugElement.query(By.css('.alert'));
    // assert
    expect(noResultAlert).toBeFalsy();
  });

  it('should display no-results when images are empty', () => {
    // act
    component.empty$.next(true);
    fixture.detectChanges();
    // arrange
    const noResultAlert = fixture.debugElement.query(By.css('.alert'));
    // assert
    expect(noResultAlert).toBeDefined();
  });

  it('onPageRequested should trigger service', () => {
    // arrange
    spyOn(dataService, 'updateRequestedPage');
    // act
    component.onPageRequested(3);
    // assert
    expect(dataService.updateRequestedPage).toHaveBeenCalledWith(3);
  });
});
