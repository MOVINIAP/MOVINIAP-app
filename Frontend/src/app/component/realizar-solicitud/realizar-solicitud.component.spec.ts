import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarSolicitudComponent } from './realizar-solicitud.component';

describe('RealizarSolicitudComponent', () => {
  let component: RealizarSolicitudComponent;
  let fixture: ComponentFixture<RealizarSolicitudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RealizarSolicitudComponent]
    });
    fixture = TestBed.createComponent(RealizarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
