import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Ability } from "@casl/ability";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Admin } from "src/app/role";
import { AuthService } from "src/app/services/auth.service";
import { InvestService } from "src/app/services/invest.service";

@Component({
  selector: "investors",
  templateUrl: "./data.html",
  styleUrls: [],
})
export class InvestorsComponent implements OnInit {

  dataItems: any;
  data: any;
  filter: any;
  currentPage: number;
  totalPage: number;
  pageSize: number;
  alertShowSearch: boolean;
  loading: boolean;
  totalCost: any;
  currentUser: any;
  is_access: boolean = false;
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
    this.filter = { name: '', amount: '' };
      this.spinner.show();
      this.getFilter();
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
    this.DataApi.getDataItems(currentPage).subscribe((res: any) => {
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

  getDataFilter() {
    this.DataApi.getDataFilter(this.filter).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        this.dataItems = res.data;
        this.currentPage = res.current_page;
        this.totalPage = res.total;
        this.pageSize = res.per_page;
        this.closeAlerPopup();
      }
    })
  }

  pageChanged(page) {
    this.router.navigate(['/investors'], { queryParams: { page: page } });
  }

  closeAlerPopup() {
    this.alertShowSearch = false;
  }

  filterApply() {
    // this.spinner.show();
    this.getData(1);
  }

  getFilter() {
    this.filter = { page: 1, id: '', name: '', phone: '', passport: '', percentage: '' };
  }

  clearForm() {
    this.getFilter();
    this.getDataItems();
  }

  search() {
    this.alertShowSearch = true;
  }

}

@Component({
  selector: "investor-edit",
  templateUrl: "./data-edit.html",
  styleUrls: [],
})
export class InvestorEditComponent implements OnInit {
  data: any;
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
      this.getData();
    }
  }

  getData() {
    this.route.params.subscribe((res: any) => {
      if (res.id != 'add') {
        this.DataApi.getData(res.id).subscribe((res: any) => {
          if (res) {
            this.spinner.hide();
            this.data = res.data;
          }
        }, error => {
          this.toastr.error(error.message)
        })
      } else {
        this.spinner.hide();
        this.data = { name: '' }
      }
    })
  }

  patchData() {
    this.loading = true;
    if (this.data.id) {
      let data = {
        id: this.data.id,
        name: this.data.name,
        phone: this.data.phone,
        passport: this.data.passport,
        percentage: this.data.percentage
      }
      this.DataApi.updateData(data).subscribe(
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
      this.DataApi.createData(this.data).subscribe(
        (data: any) => {
          this.loading = false;
          if (data) {
            this.toastr.success("Muvaffaqiyatli qo'shildi");
            this.router.navigateByUrl('/investors/' + data.data.id);
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
    this.DataApi.deleteData(this.data).subscribe(
      (data: any) => {
        this.loading = false;
        if (data) {
          this.alertShowRemoved = false;
          this.toastr.success("Muvaffaqiyatli o'chirildi");
          this.router.navigateByUrl('/investors');
        }
      },
      error => {
        this.loading = false;
        this.router.navigateByUrl('/investors');
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


@Component({
  selector: "investor-detail",
  templateUrl: "./data-detail.html",
  styleUrls: [],
})
export class InvestorDetailComponent implements OnInit {

  data: any;
  currentUser: any;
  is_access: boolean = false;
  siteUrl: string;
  loadingPage: boolean;
  loading: boolean;
  alertShowRemoved: boolean;
  statusEdit: boolean = false;
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
      this.getData();
    }
  }

  getData() {
    this.route.params.subscribe((res: any) => {
      if (res.id != 'add') {
        this.DataApi.getData(res.id).subscribe((res: any) => {
          if (res) {
            this.spinner.hide();
            this.data = res.data;
          }
        }, error => {
          this.toastr.error(error.message)
        })
      } else {
        this.spinner.hide();
        this.data = { name: '' }
      }
    })
  }

  changeStatus(item) {
    this.loading = true;
    this.DataApi.investorSalaryUpdate(item).subscribe((res: any) => {
      if (res) {
        this.statusEdit = false;
        this.toastr.success("Muvaffaqiyatli o'zgardi")
        location.reload();
      }
    }, error => {
      this.toastr.error(error.message)
      this.statusEdit = false;
    })
  }
}
