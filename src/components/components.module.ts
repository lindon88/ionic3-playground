import { NgModule } from '@angular/core';
import { TabsComponent } from './tabs/tabs';
import { TabComponent } from './tab/tab';
import {CommonModule} from '@angular/common';
import {IonicModule} from "ionic-angular";

@NgModule({
	declarations: [TabsComponent,
    TabComponent  ],
	imports: [CommonModule, IonicModule],
	exports: [TabsComponent,
    TabComponent
    ],
  entryComponents: [TabComponent]
})
export class ComponentsModule {}
