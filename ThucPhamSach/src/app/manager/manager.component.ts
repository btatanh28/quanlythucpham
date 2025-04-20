import { Component } from "@angular/core";
import { ProductAdminComponent } from "./productAdmin/productAdmin.component";
import { AdminOrdersComponent } from "./order/order.component";

@Component({
    selector: 'app-manager',
    imports: [ProductAdminComponent, AdminOrdersComponent],
    templateUrl: './manager.component.html',
    styleUrl: './manager.component.css'
})

export class ManagerComponent{

}