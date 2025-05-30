import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderDetailsComponent } from './order-details.component';

describe('OrderDetailsComponent', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OrderDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
