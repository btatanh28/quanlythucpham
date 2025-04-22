import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { ManagerComponent } from './manager/manager.component';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notifi/notification.component';
import { AuthGuard } from './AuthGuard/authGuard'; // Import Guard


export const routes: Routes = [
    {path: '', component: ProductComponent },
    {path: 'product', component: ProductComponent },
    {path: 'cart', component: CartComponent },
    {path: 'manager', component: ManagerComponent, canActivate: [AuthGuard] },
    {path: 'login', component: LoginComponent},
    {path: 'notification', component: NotificationComponent}
];
