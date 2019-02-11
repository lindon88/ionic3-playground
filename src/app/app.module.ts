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
import {ModalTaskNotePageModule} from "../pages/checklist-subtasks/modal-task-note/modal-task-note.module";
import { LoadingProvider } from '../providers/loading/loading';
import { ShiftsProvider } from '../providers/shifts/shifts';
import {ModalEosCancelPageModule} from "../pages/employee-open-shift/modal-eos-cancel/modal-eos-cancel.module";
import {ModalEosSendPageModule} from "../pages/employee-open-shift/modal-eos-send/modal-eos-send.module";
import {ModalEosSuccessPageModule} from "../pages/employee-open-shift/modal-eos-success/modal-eos-success.module";
import { AbsenceProvider } from '../providers/absence/absence';
import {ModalDropAbsencePageModule} from "../pages/absence/modal-drop-absence/modal-drop-absence.module";
import {ModalAbsenceNotePageModule} from "../pages/absence/modal-absence-note/modal-absence-note.module";
import { RosterProvider } from '../providers/roster/roster';
import { CalendarModule} from 'ionic3-calendar-en';
import {ModalShiftPopupPageModule} from "../pages/employee-shifts/modal-shift-popup/modal-shift-popup.module";

import {FingerprintAIO} from '@ionic-native/fingerprint-aio';
import {DatePicker} from '@ionic-native/date-picker';
import { CountryProvider } from '../providers/country/country';
import { AvailabilityProvider } from '../providers/availability/availability';
import {ModalShiftAvailabilityPageModule} from "../pages/shift-availability/modal-shift-availability/modal-shift-availability.module";
import { MessagesProvider } from '../providers/messages/messages';
import { NotificationsCounterProvider } from '../providers/notifications-counter/notifications-counter';
import { LocaleProvider } from '../providers/locale/locale';
import { RemoteDeviceProvider } from '../providers/remote-device/remote-device';
import { MobileDeviceProvider } from '../providers/mobile-device/mobile-device';
import { ApplicationVersionProvider } from '../providers/application-version/application-version';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, { swipeBackEnabled: false, backButtonText: '', mode: 'ios', menuType: 'push'}),
    LandingPageModule,
    HttpClientModule,
    PipesModule,
    ChecklistSubtasksPopoverPageModule,
    ChecklistFilterPopoverPageModule,
    ModalTaskNotePageModule,
    ModalEosCancelPageModule,
    ModalEosSendPageModule,
    ModalEosSuccessPageModule,
    ModalDropAbsencePageModule,
    ModalAbsenceNotePageModule,
    ModalShiftPopupPageModule,
    ModalShiftAvailabilityPageModule,
    CalendarModule
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
    LoadingProvider,
    ShiftsProvider,
    AbsenceProvider,
    RosterProvider,
    FingerprintAIO,
    DatePicker,
    CountryProvider,
    AvailabilityProvider,
    MessagesProvider,
    NotificationsCounterProvider,
    LocaleProvider,
    RemoteDeviceProvider,
    MobileDeviceProvider,
    ApplicationVersionProvider,
  ]
})
export class AppModule {}
