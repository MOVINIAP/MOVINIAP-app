import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInformesAllComponent } from './ver-informes-all.component';

describe('VerInformesAllComponent', () => {
  let component: VerInformesAllComponent;
  let fixture: ComponentFixture<VerInformesAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerInformesAllComponent]
    });
    fixture = TestBed.createComponent(VerInformesAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
