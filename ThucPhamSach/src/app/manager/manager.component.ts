import { Component } from "@angular/core";
import { HttpClientModule } from '@angular/common/http'; // 👈 thêm dòng này
import { ProductAdminComponent } from "./productAdmin/productAdmin.component";
import { AdminOrdersComponent } from "./order/order.component"; 
import { NgFor, NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    HttpClientModule,
    ProductAdminComponent,
    AdminOrdersComponent,
    NgIf
],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent {
  activeTab: string = 'products';  // Default active tab

  selectTab(tab: string) {
    this.activeTab = tab;
  }
}
