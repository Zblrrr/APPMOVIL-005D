import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QrTestPageRoutingModule } from './qr-test-routing.module';

import { QrTestPage } from './qr-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QrTestPageRoutingModule
  ],
  declarations: [QrTestPage]
})
export class QrTestPageModule {}
