import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingCenterComponent } from './shipping-center.component';

describe('ShippingCenterComponent', () => {
  let component: ShippingCenterComponent;
  let fixture: ComponentFixture<ShippingCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShippingCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
