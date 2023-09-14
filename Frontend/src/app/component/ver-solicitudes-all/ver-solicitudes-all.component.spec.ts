import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSolicitudesAllComponent } from './ver-solicitudes-all.component';

describe('VerSolicitudesAllComponent', () => {
  let component: VerSolicitudesAllComponent;
  let fixture: ComponentFixture<VerSolicitudesAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerSolicitudesAllComponent]
    });
    fixture = TestBed.createComponent(VerSolicitudesAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
