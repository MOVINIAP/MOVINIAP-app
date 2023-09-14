import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarInformeComponent } from './realizar-informe.component';

describe('RealizarInformeComponent', () => {
  let component: RealizarInformeComponent;
  let fixture: ComponentFixture<RealizarInformeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RealizarInformeComponent]
    });
    fixture = TestBed.createComponent(RealizarInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
