import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Patrocinador } from './patrocinador';

describe('Patrocinador', () => {
  let component: Patrocinador;
  let fixture: ComponentFixture<Patrocinador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Patrocinador],
    }).compileComponents();

    fixture = TestBed.createComponent(Patrocinador);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
