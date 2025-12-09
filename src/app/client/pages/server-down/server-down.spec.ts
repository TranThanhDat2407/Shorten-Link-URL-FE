import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerDown } from './server-down';

describe('ServerDown', () => {
  let component: ServerDown;
  let fixture: ComponentFixture<ServerDown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerDown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerDown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
