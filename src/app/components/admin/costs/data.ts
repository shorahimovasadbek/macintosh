import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Ability } from "@casl/ability";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Admin } from "src/app/role";
import { AuthService } from "src/app/services/auth.service";
import { CostService } from "src/app/services/cost.service";
@Component({
  selector: "costs",
  templateUrl: "./data.html",
  styleUrls: [],
})
export class CostComponent implements OnInit {
  dataItems: any;
  data: any;
  filter: any;
  currentPage: number;
  currentUser: any;
  is_access: boolean = false;
  totalPage: number;
  pageSize: number;
  alertShowSearch: boolean;
  loading: boolean;
  totalCost: any;
  permissions: Ability

  constructor(
    private DataApi: CostService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authServices: AuthService
  ) { }

  ngOnInit() {
    this.permissions = this.authServices.getPermissions()
    this.getDataItems();
    this.filter = { name: '', amount: '', type:'', from:'', to:''};
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
        this.totalCost = 0;
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
      this.toastr.error(error.message)
    }
  }

  getStats() {
    this.loading = true;
    this.DataApi.getCostsStats(this.filter).subscribe((res: any) => {
      this.totalCost = 0;
      if (res && res.status == true) {
        this.totalCost = res.data.summa;
        this.dataItems = res.data.costs;
        this.currentPage = res.current_page;
        this.totalPage = res.total;
        this.pageSize = res.per_page;
        this.closeAlerPopup();
        this.loading = false;
      }

    })
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
    this.router.navigate(['/cost'], { queryParams: { page: page } });
  }

  closeAlerPopup() {
    this.alertShowSearch = false;
  }

  filterApply() {
    // this.spinner.show();
    this.getData(1);
  }

  getFilter() {
    this.filter = { page: 1, name: '',type: '', amount: '',from:'', to:''};
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
  selector: "costs-edit",
  templateUrl: "./data-edit.html",
  styleUrls: [],
})
export class CostEditComponent implements OnInit {
  data: any;
  currentUser: any;
  is_access: boolean = false;
  siteUrl: string;
  loadingPage: boolean;
  loading: boolean;
  alertShowRemoved: boolean;
  formattedDate:any;

  constructor(
    private DataApi: CostService,
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
        this.data = { name: '', amount: '', created_at: '' }
      }
    })
  }

  patchData() {
    this.loading = true;
    if (this.data.id) {
      this.DataApi.updateData(this.data).subscribe(
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
      this.data.type = 'Boshqa';
      this.DataApi.createData(this.data).subscribe(
        (data: any) => {
          this.loading = false;
          if (data) {
            this.toastr.success("Muvaffaqiyatli qo'shildi");
            this.router.navigateByUrl('/cost/' + data.data.id);
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
          this.router.navigateByUrl('/cost');
        }
      },
      error => {
        this.loading = false;
        this.router.navigateByUrl('/cost');
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