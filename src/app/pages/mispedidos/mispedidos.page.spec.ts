import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MispedidosPage } from './mispedidos.page';

describe('MispedidosPage', () => {
  let component: MispedidosPage;
  let fixture: ComponentFixture<MispedidosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MispedidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
