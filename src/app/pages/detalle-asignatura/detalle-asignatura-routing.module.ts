import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleAsignaturaPage } from './detalle-asignatura.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleAsignaturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleAsignaturaPageRoutingModule {}
