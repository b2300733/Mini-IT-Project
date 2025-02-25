import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopproductpageComponent } from './shopproductpage.component';

describe('ShopproductpageComponent', () => {
  let component: ShopproductpageComponent;
  let fixture: ComponentFixture<ShopproductpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShopproductpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopproductpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
