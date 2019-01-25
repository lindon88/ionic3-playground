import { NgModule } from '@angular/core';
import { OrderPipe } from './order/order';
import { NoSanitizePipe } from './no-sanitize/no-sanitize';
@NgModule({
	declarations: [OrderPipe,
    NoSanitizePipe],
	imports: [],
	exports: [OrderPipe,
    NoSanitizePipe]
})
export class PipesModule {}
