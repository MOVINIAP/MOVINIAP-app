import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearDepartamentoComponent } from './crear-departamento.component';

describe('CrearDepartamentoComponent', () => {
  let component: CrearDepartamentoComponent;
  let fixture: ComponentFixture<CrearDepartamentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearDepartamentoComponent]
    });
    fixture = TestBed.createComponent(CrearDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
