import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Abilities, Ability } from "@casl/ability";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Admin } from "src/app/role";
import { AuthService } from "src/app/services/auth.service";
import { EmployeeService } from "src/app/services/employe.service";
import { RoleService } from "src/app/services/role.service";
import { env } from "src/environments/environment";

@Component({
  selector: "employee",
  templateUrl: "./data.html",
  styleUrls: [],
})
export class EmployeeComponent implements OnInit {

  dataItems: any;
  data: any;
  filter: any;
  currentUser: any;
  is_access: boolean;
  currentPage: number;
  totalPage: number;
  siteUrl: string;
  pageSize: number;
  alertShowSearch: boolean;
  loading: boolean;
  permissions: Ability

  constructor(
    private DataApi: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authServices: AuthService
  ) { }

  ngOnInit() {
    this.permissions = this.authServices.getPermissions()
    this.spinner.show();
    this.siteUrl = env.apiUrl;
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
    this.filter.page = currentPage;
    this.DataApi.getDataItems(currentPage).subscribe((res: any) => {
      
      if (res) {
        this.spinner.hide();
        this.dataItems = res.data;
        this.dataItems.forEach((user) => {
          if (user.middle_name)
            user.name = user.name + ' ' + user.surname + ' ' + user.middle_name;
          else
            user.name = user.name + ' ' + user.surname;
        });
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
    this.router.navigate(['/employee'], { queryParams: { page: page } });
  }

  closeAlerPopup() {
    this.alertShowSearch = false;
  }

  filterApply() {
    this.getData(1);
  }

  getFilter() {
    this.filter = { page: 1, id: '', client: '', passport: '', phone: '' };
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
  selector: "employee-edit",
  templateUrl: "./data-edit.html",
  styleUrls: [],
})
export class EmployeeEditComponent implements OnInit {
  dataNew:any;
  data:any;
  dataHistory: any;
  currentUser: any;
  is_access: boolean;
  siteUrl: string;
  loadingPage: boolean;
  loading: boolean;
  uploading: boolean;
  uploadingText: string;
  uploadFiles: any = [];
  openLogs: boolean;
  alertShowPayment: boolean;
  alertShowRemoved: boolean;
  alertShowEdited: boolean;
  permission: Ability;
  roleData: any;
  filter: string;

  constructor(
    private DataApi: EmployeeService,
    private getDataRolles: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authServices: AuthService
  ) { }
  ngOnInit() {
    this.permission = this.authServices.getPermissions()
    this.filter = ''
    this.data = { name: '', phone1: '' }
    this.getData();
    this.getDataRole();
  }

  getData() {
    this.spinner.show();
    this.route.params.subscribe((res: any) => {
      if (res.id !== 'add') {
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
        this.data = { name: '', phone1: '' }
      }
    })
  }

  getDataRole() {
    this.getDataRolles.getDataRolles().subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide()
          this.roleData = res.data.data
        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.error(error.message)
      }
    )
  }

  patchData() {
    this.loading = true;
    if (this.data.id) {
      this.DataApi.updateData(this.data).subscribe(
        (data: any) => {
          if (data) {
            this.loading = false;
            this.toastr.success("Muvaffaqiyatli o'zgartirildi");
            this.router.navigateByUrl('/employee?page=1');
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
          if (data.status) {
            this.toastr.success("Muvaffaqiyatli qo'shildi.");
            this.router.navigateByUrl('/employee?page=1');
          }
          else if (!data.status) {
            let firstError: string[] = []
            Object.keys(data['errors']).forEach((key) => {
              data['errors'][key].forEach((value1: string) => {
                firstError?.push(value1)
              });
            });
            let errorHTML = "";
            firstError.forEach(error => {
              errorHTML += `${error}`
            })
            errorHTML += ""
            this.toastr.error(errorHTML);
            this.router.navigateByUrl('/employee?page=1');
          }
        },
        error => {
          this.loading = false;
          this.toastr.error(error.error.message);
        }
      );
    }
  }

  

  removeData() {
    this.alertShowRemoved = true;
  }

  deleteData() {
    this.loading = true;
    this.DataApi.deleteData(this.data).subscribe(
      (data: any) => {
        this.loading = false;
        if (data) {
          this.alertShowRemoved = false;
          this.toastr.success("Muvaffaqiyatli o'chirildi");
          this.router.navigateByUrl('/employee');
        }
      },
      (error) => {
        this.loading = false;
        this.toastr.error(error.error.message);
      }
    );
  }

  closeAlerPopup() {
    this.alertShowRemoved = false;
  }
}
