import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroContactComponent } from './hero-contact.component';

describe('HeroContactComponent', () => {
  let component: HeroContactComponent;
  let fixture: ComponentFixture<HeroContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeroContactComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
