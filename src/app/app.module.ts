import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

// Custom modules
import { NgbModalModule, NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSelectModule } from 'ngx-select-ex';
import { FileSaverModule } from 'ngx-filesaver';
import { CodeInputModule } from 'angular-code-input';
import { NgxPrintModule } from 'ngx-print';

// Components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './routes/app-routing.module';
import { ClientsComponent, ClientsEditComponent } from './components/admin/clients/data';
import { HeaderComponent } from './components/admin/header/data';
import { DevicesComponent, DevicesEditComponent } from './components/admin/devices/data';
import { OrderDetailComponent, OrderEditComponent, OrdersComponent } from './components/admin/orders/data';
import { AuthComponent, PageNotFoundComponent, TermsConditionComponent } from './components/auth/auth.component';
import { DashboardComponent } from './components/admin/dashboard/data';
import { TokenInterceptor } from './services/token.interceptor';
import { EmployeeComponent, EmployeeEditComponent } from './components/admin/employes/data';
import { CustomDateFormatPipe, PhoneNumberPipe, ReplacePipe } from './directives/filter';
import { CostComponent, CostEditComponent } from './components/admin/costs/data';
import { InvestorDetailComponent, InvestorEditComponent, InvestorsComponent } from './components/admin/invest/investors/data';
import { InvestmentsComponent, InvestmentsEditComponent } from './components/admin/invest/investments/data';
import { Admin } from './role';
import { AbilityModule } from '@casl/angular';
import { PureAbility, Ability } from '@casl/ability';
import { RoleComponent } from './components/admin/settings/role/role.component';
import { ControllersComponent } from './components/admin/settings/controllers/controllers.component';
import { ActionsComponent } from './components/admin/settings/actions/actions.component';
import { PermissionsComponent } from './components/admin/settings/permissions/permissions.component';
import { DailyComponent } from './components/admin/daily/daily';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    PageNotFoundComponent,
    TermsConditionComponent,
    DashboardComponent,
    ClientsComponent,
    ClientsEditComponent,
    DevicesComponent,
    DevicesEditComponent,
    OrdersComponent,
    OrderEditComponent,
    OrderDetailComponent,
    EmployeeComponent,
    EmployeeEditComponent,
    HeaderComponent,
    CostComponent,
    CostEditComponent,
    InvestorsComponent,
    InvestorEditComponent,
    InvestmentsComponent,
    InvestmentsEditComponent,
    InvestorDetailComponent,
    PhoneNumberPipe,
    ReplacePipe,
    CustomDateFormatPipe,
    RoleComponent,
    ControllersComponent,
    ActionsComponent,
    RoleComponent,
    ControllersComponent,
    ActionsComponent,
    PermissionsComponent,
    DailyComponent
    ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgxSpinnerModule,
    NgxSelectModule,
    NgxPrintModule,
    FileSaverModule,
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    CodeInputModule,
    NgbTypeaheadModule,
    AbilityModule,
    NgbModalModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: Ability, useValue: new Ability() },
    { provide: PureAbility, useExisting: Ability },
    Admin
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
