import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberLayout } from './member-layout';

describe('MemberLayout', () => {
  let component: MemberLayout;
  let fixture: ComponentFixture<MemberLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
