import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrTestPage } from './qr-test.page';

describe('QrTestPage', () => {
  let component: QrTestPage;
  let fixture: ComponentFixture<QrTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QrTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
