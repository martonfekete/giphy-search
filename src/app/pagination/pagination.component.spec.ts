import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('previous button', () => {
    it('should not show when on page 1', () => {
      // arrange
      component.pages.current = 0;
      fixture.detectChanges();
      // assert
      const prevButton = fixture.debugElement.query(By.css('.page-item.previous'));
      expect(prevButton).toBeFalsy();
    });

    it('should show when not on page 1', () => {
      // arrange
      component.pages.current = 1;
      fixture.detectChanges();
      // assert
      const prevButton = fixture.debugElement.query(By.css('.page-item.previous'));
      expect(prevButton).toBeDefined();
    });

    it('should emit pageRequested when clicked', () => {
      // arrange
      component.pages.current = 3;
      fixture.detectChanges();
      const prevButton = fixture.debugElement.query(By.css('.page-item.previous'));
      spyOn(component.pageRequested, 'emit');
      // act
      prevButton.triggerEventHandler('click', {});
      // assert
      expect(component.pageRequested.emit).toHaveBeenCalledWith(2);
    });
  });

  describe('next button', () => {
    it('should not show when on last page', () => {
      // arrange
      component.pages.current = 3;
      component.pages.last = 3;
      fixture.detectChanges();
      // assert
      const nextButton = fixture.debugElement.query(By.css('.page-item.next'));
      expect(nextButton).toBeFalsy();
    });

    it('should not show when there is only one page', () => {
      // arrange
      component.pages.current = 0;
      component.pages.last = 0;
      fixture.detectChanges();
      // assert
      const nextButton = fixture.debugElement.query(By.css('.page-item.next'));
      expect(nextButton).toBeFalsy();
    });

    it('should show when there are future pages', () => {
      // arrange
      component.pages.current = 2;
      component.pages.last = 5;
      fixture.detectChanges();
      // assert
      const nextButton = fixture.debugElement.query(By.css('.page-item.next'));
      expect(nextButton).toBeDefined();
    });

    it('should emit pageRequested when clicked', () => {
      // arrange
      component.pages.current = 3;
      component.pages.last = 5;
      fixture.detectChanges();
      const nextButton = fixture.debugElement.query(By.css('.page-item.next'));
      spyOn(component.pageRequested, 'emit');
      // act
      nextButton.triggerEventHandler('click', {});
      // assert
      expect(component.pageRequested.emit).toHaveBeenCalledWith(4);
    });
  });
});
