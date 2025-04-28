import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Ability } from "@casl/ability";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Admin } from "src/app/role";
import { AuthService } from "src/app/services/auth.service";
import { InvestService } from "src/app/services/invest.service";

@Component({
  selector: "invesments",
  templateUrl: "./data.html",
  styleUrls: [],
})
export class InvestmentsComponent implements OnInit {
  dataItems: any;
  data: any;
  filter: any;
  currentUser: any;
  is_access: boolean = false;
  currentPage: number;
  totalPage: number;
  pageSize: number;
  alertShowSearch: boolean;
  loading: boolean;
  totalCost: any;
  permissions: Ability

  constructor(
    private DataApi: InvestService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authServices: AuthService
  ) { }
  
  ngOnInit() {
    this.permissions = this.authServices.getPermissions()
    this.spinner.show();
    this.getDataItems();
  }

  getDataItems() {
    this.route.queryParamMap.subscribe((data: any) => {
      this.closeAlerPopup();
      if (data.params.page)
        this.getData(data.params.page);
      else
        this.getData(1);
    });
  }

  getData(currentPage) {
    this.dataItems = [];
    this.DataApi.getInvestmentsItems(currentPage).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        this.totalCost = res.allSumma;
        this.dataItems = res.data;
        this.currentPage = res.current_page;
        this.totalPage = res.total;
        this.pageSize = res.per_page;
        this.closeAlerPopup();
      }
    }), error => {
      this.spinner.hide()
      this.toastr.error(error.message);
    }
  }

  pageChanged(page) {
    this.router.navigate(['/investments'], { queryParams: { page: page } });
  }

  closeAlerPopup() {
    this.alertShowSearch = false;
  }

}

@Component({
  selector: "investments-edit",
  templateUrl: "./data-edit.html",
  styleUrls: [],
})
export class InvestmentsEditComponent implements OnInit {

  data: any;
  investors: any;
  currentUser: any;
  is_access: boolean = false;
  siteUrl: string;
  loadingPage: boolean;
  loading: boolean;
  alertShowRemoved: boolean;

  constructor(
    private DataApi: InvestService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    // this.currentUser = JSON.parse(decodeURIComponent(escape(atob(localStorage.getItem('user') as any))));
    // const adminInstance = new Admin();
    if (true) {
      this.is_access = true;
      this.DataApi.getDataItems(1).subscribe((res: any) => {
        this.investors = res.data;
      })
      this.getData();
    }
  }

  getData() {
    this.route.params.subscribe((res: any) => {
      if (res.id != 'add') {
        this.DataApi.getInvestment(res.id).subscribe((res: any) => {
          if (res) {
            this.spinner.hide();
            this.data = res.data;
          }
        }, error => {
          this.toastr.error(error.message)
        })
      } else {
        this.spinner.hide();
        this.data = { amount: '', investor_id: '' }
      }
    })
  }

  patchData() {
    this.loading = true;
    let data = {
      id: this.data.id,
      amount: this.data.amount,
      investor_id: this.data.investor_id
    }

    if (this.data.id) {
      this.DataApi.updateInvestment(data).subscribe(
        (data: any) => {
          if (data) {
            this.loading = false;
            this.toastr.success("Muvaffaqiyatli o'zgartirildi");
            this.getData();
          }
        },
        error => {
          this.loading = false;
          this.toastr.error(error.error.message);
        }
      );
    } else {
      this.DataApi.createInvestment(this.data).subscribe(
        (data: any) => {
          this.loading = false;
          if (data) {
            this.toastr.success("Muvaffaqiyatli qo'shildi");
            this.router.navigateByUrl('/investments/' + data.data.id);
          }
        },
        error => {
          this.loading = false;
          this.toastr.error(error.error.message);
        }
      );
    }
  }

  deleteData() {
    this.loading = true;
    this.DataApi.deleteDataInvestments(this.data).subscribe(
      (data: any) => {
        this.loading = false;
        if (data) {
          this.alertShowRemoved = false;
          this.toastr.success("Muvaffaqiyatli o'chirildi");
          this.router.navigateByUrl('/investments');
        }
      },
      error => {
        this.loading = false;
        this.router.navigateByUrl('/investments');
        this.toastr.error(error.error.message);
      }
    );
  }

  removeData() {
    this.alertShowRemoved = true;
  }

  closeAlerPopup() {
    this.alertShowRemoved = false;
  }

}