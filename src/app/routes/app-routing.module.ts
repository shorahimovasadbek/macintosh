import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent, ClientsEditComponent } from '../components/admin/clients/data';
import { AuthComponent, PageNotFoundComponent } from '../components/auth/auth.component';
import { DevicesComponent, DevicesEditComponent } from '../components/admin/devices/data';
import { OrderDetailComponent, OrderEditComponent, OrdersComponent } from '../components/admin/orders/data';
import { DashboardComponent } from '../components/admin/dashboard/data';
import { NoAuthGuard } from '../services/noauth.guard';
import { AuthGuard } from '../services/auth.guard';
import { EmployeeService } from '../services/employe.service';
import { EmployeeComponent, EmployeeEditComponent } from '../components/admin/employes/data';
import { CostComponent, CostEditComponent } from '../components/admin/costs/data';
import { InvestorDetailComponent, InvestorEditComponent, InvestorsComponent } from '../components/admin/invest/investors/data';
import { InvestmentsComponent, InvestmentsEditComponent } from '../components/admin/invest/investments/data';
import { RoleComponent } from '../components/admin/settings/role/role.component';
import { ControllersComponent } from '../components/admin/settings/controllers/controllers.component';
import { ActionsComponent } from '../components/admin/settings/actions/actions.component';
import { PermissionsComponent } from '../components/admin/settings/permissions/permissions.component';
import { DailyComponent } from '../components/admin/daily/daily';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    pathMatch: 'full',
    canActivate: [NoAuthGuard],
  },
  {
    path: 'clients',
    component: ClientsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clients/:id',
    component: ClientsEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'devices',
    component: DevicesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'devices/:id',
    component: DevicesEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/:id',
    component: OrderEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/show-order/:id',
    component: OrderDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employee',
    component: EmployeeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'employee/:id',
    component: EmployeeEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cost',
    component: CostComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cost/:id',
    component: CostEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'investors',
    component: InvestorsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'investors/:id',
    component: InvestorEditComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'investors/:id/detail',
    component: InvestorDetailComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'investments',
    component: InvestmentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'investments/:id',
    component: InvestmentsEditComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'daily',
    component: DailyComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'role',
    component: RoleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'controllers',
    component: ControllersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'action',
    component: ActionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'permissions/:id',
    component: PermissionsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
