import { NgModule } from '@angular/core';
import { Test1Component } from './test1/test1';
import { Test2Component } from './test2/test2';
@NgModule({
	declarations: [Test1Component,
    Test2Component],
	imports: [],
	exports: [Test1Component,
    Test2Component]
})
export class ComponentsModule {}
