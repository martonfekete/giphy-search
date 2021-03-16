import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { QueryComponent } from './query.component';
import { QueryService } from './query.service';

describe('QueryComponent', () => {
  let component: QueryComponent;
  let fixture: ComponentFixture<QueryComponent>;
  let queryServiceSpies: any; //tslint:disable-line

  beforeEach(async () => {
    queryServiceSpies = jasmine.createSpyObj('QueryService', ['initQueryControl']);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ReactiveFormsModule
      ],
      declarations: [QueryComponent],
      providers: [{ QueryService, useValue: queryServiceSpies }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryComponent);
    component = fixture.componentInstance;
    queryServiceSpies.initQueryControl.and.returnValue(new FormControl());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display invalid message', () => {
    // arrange
    component.query.setValidators(Validators.required);
    // act
    component.query.setValue(null);
    fixture.detectChanges();
    // assert
    const inputElement = fixture.debugElement.query(By.css('#query'));
    const validationElement = fixture.debugElement.query(By.css('.invalid-feedback'));
    expect(inputElement.classes['is-invalid']).toBeTrue();
    expect(validationElement).toBeDefined();
  });
});
