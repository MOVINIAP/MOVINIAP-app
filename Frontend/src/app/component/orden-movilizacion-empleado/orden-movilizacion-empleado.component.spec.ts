import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenMovilizacionEmpleadoComponent } from './orden-movilizacion-empleado.component';

describe('OrdenMovilizacionEmpleadoComponent', () => {
  let component: OrdenMovilizacionEmpleadoComponent;
  let fixture: ComponentFixture<OrdenMovilizacionEmpleadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdenMovilizacionEmpleadoComponent]
    });
    fixture = TestBed.createComponent(OrdenMovilizacionEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
