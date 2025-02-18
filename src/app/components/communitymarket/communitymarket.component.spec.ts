import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitymarketComponent } from './communitymarket.component';

describe('CommunitymarketComponent', () => {
  let component: CommunitymarketComponent;
  let fixture: ComponentFixture<CommunitymarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunitymarketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunitymarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
