import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaVehiculoComponent } from './lista-vehiculo.component';

describe('ListaVehiculoComponent', () => {
  let component: ListaVehiculoComponent;
  let fixture: ComponentFixture<ListaVehiculoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaVehiculoComponent]
    });
    fixture = TestBed.createComponent(ListaVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
