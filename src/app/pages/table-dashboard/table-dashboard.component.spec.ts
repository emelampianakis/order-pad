import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TableDashboardComponent } from './table-dashboard.component';

describe('TableDashboardComponent', () => {
  let component: TableDashboardComponent;
  let fixture: ComponentFixture<TableDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TableDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
