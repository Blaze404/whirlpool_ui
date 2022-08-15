import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MaterialExampleModule} from '../material.module';
import { DashboardComponent, AddItemPopupDialog, ReturnItemPopupDialog } from './dashboard/dashboard.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { InventoryComponent, AddInventoryPopupDialog } from './inventory/inventory.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { NgSelectModule } from '@ng-select/ng-select';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ToolbarComponent,
    InventoryComponent,
    StatisticsComponent,
    AddItemPopupDialog,
    AddInventoryPopupDialog,
    ReturnItemPopupDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialExampleModule,
    NgSelectModule
  ],
 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
