import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { ManagerComponent } from './manager/manager.component';

export const routes: Routes = [
    {path: '', component: ProductComponent },
    {path: 'product', component: ProductComponent },
    {path: 'cart', component: CartComponent },
    {path: 'manager', component: ManagerComponent}
];
