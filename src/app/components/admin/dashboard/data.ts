import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Ability } from "@casl/ability";
import { AbilityService } from "@casl/angular";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { DashboardService } from "src/app/services/dashboard.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "dashboard",
  templateUrl: "./data.html",
  styleUrls: [],
})
export class DashboardComponent implements OnInit {
  dataItems: any;
  data: any;
  balance: any;
  filter: any;
  currentUser: any;
  is_access: boolean = false;
  alertShowSearch: boolean;
  loading: boolean;
  expense: any;
  permissions: Ability;
  dataItemsAcc: any;
  dataItemsDevices:any

  constructor(
    private DataApi: DashboardService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authServices: AuthService
  ) {
  }

  ngOnInit() {
    this.permissions = this.authServices.getPermissions();
    let date = new Date();
    this.filter = { report_type: 'month', month: date.getUTCMonth() + 1, year: date.getFullYear() }
    this.DataApi.getBalance().subscribe((res: any) => {
      if (res.status == true) {
        this.balance = res.data;
        this.loading = false;
      }
    })

    this.getData()
    this.router.navigate(['/dashboard'])
  }

  getData() {
    this.loading = true;
    this.spinner.show();
    this.dataItems = [];
    this.dataItemsAcc = []
    this.dataItemsDevices = []

    this.DataApi.getReport(this.filter).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        this.dataItems = res.data;
        this.closeAlerPopup();
        this.loading = false;
      }
    }, error => {
      this.spinner.hide()
      this.toastr.error(error.message);
      this.closeAlerPopup();
      this.loading = false;
    }
    )


    this.DataApi.getIntervalDate(this.filter).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        this.dataItemsAcc = res.data;
        this.closeAlerPopup();
        this.loading = false;
      }
    }, error => {
      this.spinner.hide()
      this.toastr.error(error.message);
      this.closeAlerPopup();
      this.loading = false;
    }
    )

    this.DataApi.getIntervalDateDevices(this.filter).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        this.dataItemsDevices = res.data;
        this.closeAlerPopup();
        this.loading = false;
      }
    }, error => {
      this.spinner.hide()
      this.toastr.error(error.message);
      this.closeAlerPopup();
      this.loading = false;
    }
    )
    
    this.getExpense()
  }

  getExpense() {
    this.DataApi.getExpense(this.filter).subscribe((res: any) => {
      this.expense = res.data;
    })
  }

  search() {
    this.alertShowSearch = true;
  }

  closeAlerPopup() {
    this.alertShowSearch = false;
  }

}