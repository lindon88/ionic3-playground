import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import {LandingPageModule} from "../pages/landing/landing.module";
import { ServerProvider } from '../providers/server/server';
import {HttpClientModule} from "@angular/common/http";
import { ApiProvider } from '../providers/api/api';
import { TokenProvider } from '../providers/token/token';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { PinProvider } from '../providers/pin/pin';
import { EmployeeProvider } from '../providers/employee/employee';
import { CompanyProvider } from '../providers/company/company';
import { WorkflowProvider } from '../providers/workflow/workflow';
import {PipesModule} from "../pipes/pipes.module";
import {ChecklistSubtasksPopoverPageModule} from "../pages/checklist-subtasks-popover/checklist-subtasks-popover.module";
import {ChecklistFilterPopoverPageModule} from "../pages/checklist-filter-popover/checklist-filter-popover.module";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { swipeBackEnabled: false, backButtonText: '' }),
    LandingPageModule,
    HttpClientModule,
    PipesModule,
    ChecklistSubtasksPopoverPageModule,
    ChecklistFilterPopoverPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServerProvider,
    ApiProvider,
    TokenProvider,
    AuthenticationProvider,
    PinProvider,
    EmployeeProvider,
    CompanyProvider,
    CompanyProvider,
    WorkflowProvider,
  ]
})
export class AppModule {}
