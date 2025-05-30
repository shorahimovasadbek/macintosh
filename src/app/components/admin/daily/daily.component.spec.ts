import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyComponent } from './daily';

describe('DailyComponent', () => {
  let component: DailyComponent;
  let fixture: ComponentFixture<DailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
