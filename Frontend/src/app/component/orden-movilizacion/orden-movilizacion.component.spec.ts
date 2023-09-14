import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenMovilizacionComponent } from './orden-movilizacion.component';

describe('OrdenMovilizacionComponent', () => {
  let component: OrdenMovilizacionComponent;
  let fixture: ComponentFixture<OrdenMovilizacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdenMovilizacionComponent]
    });
    fixture = TestBed.createComponent(OrdenMovilizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
