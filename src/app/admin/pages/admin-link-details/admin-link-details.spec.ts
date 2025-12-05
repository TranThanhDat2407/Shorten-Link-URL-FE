import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLinkDetails } from './admin-link-details';

describe('AdminLinkDetails', () => {
  let component: AdminLinkDetails;
  let fixture: ComponentFixture<AdminLinkDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLinkDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLinkDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
