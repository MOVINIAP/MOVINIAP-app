import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarOrdenMovilizacionComponent } from './editar-orden-movilizacion.component';

describe('EditarOrdenMovilizacionComponent', () => {
  let component: EditarOrdenMovilizacionComponent;
  let fixture: ComponentFixture<EditarOrdenMovilizacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarOrdenMovilizacionComponent]
    });
    fixture = TestBed.createComponent(EditarOrdenMovilizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
