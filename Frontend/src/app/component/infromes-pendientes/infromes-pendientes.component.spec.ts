import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfromesPendientesComponent } from './infromes-pendientes.component';

describe('InfromesPendientesComponent', () => {
  let component: InfromesPendientesComponent;
  let fixture: ComponentFixture<InfromesPendientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfromesPendientesComponent]
    });
    fixture = TestBed.createComponent(InfromesPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
