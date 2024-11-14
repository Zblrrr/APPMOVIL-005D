import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleAsignaturaPage } from './detalle-asignatura.page';

describe('DetalleAsignaturaPage', () => {
  let component: DetalleAsignaturaPage;
  let fixture: ComponentFixture<DetalleAsignaturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAsignaturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
