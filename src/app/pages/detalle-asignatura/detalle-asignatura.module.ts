import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleAsignaturaPageRoutingModule } from './detalle-asignatura-routing.module';

import { DetalleAsignaturaPage } from './detalle-asignatura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleAsignaturaPageRoutingModule
  ],
  declarations: [DetalleAsignaturaPage]
})
export class DetalleAsignaturaPageModule {}
