import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisCasos } from './mis-casos';

describe('MisCasos', () => {
  let component: MisCasos;
  let fixture: ComponentFixture<MisCasos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisCasos],
    }).compileComponents();

    fixture = TestBed.createComponent(MisCasos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
