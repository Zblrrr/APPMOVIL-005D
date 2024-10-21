import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrTestPage } from './qr-test.page';

const routes: Routes = [
  {
    path: '',
    component: QrTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QrTestPageRoutingModule {}
