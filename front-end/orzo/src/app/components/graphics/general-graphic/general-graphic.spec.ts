import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralGraphic } from './general-graphic';

describe('GeneralGraphic', () => {
  let component: GeneralGraphic;
  let fixture: ComponentFixture<GeneralGraphic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralGraphic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralGraphic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
