// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './Components/app/app.component';
import { ProductsComponent } from './Components/products/products.component';
import { OrdersComponent } from './Components/orders/orders.component';
import { CartComponent } from './Components/cart/cart.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
      AppComponent,
      ProductsComponent,
      OrdersComponent,
      CartComponent,
    ],
    imports: [
      BrowserModule,
      HttpClientModule,
      AppRoutingModule,
      FormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
  })
  export class AppModule {}
