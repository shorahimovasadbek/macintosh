import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Ability } from "@casl/ability";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { DevicesService } from "src/app/services/devices.service";
import { env } from "src/environments/environment";

@Component({
  selector: "devices",
  templateUrl: "./data.html",
  styleUrls: [],
})
export class DevicesComponent implements OnInit {

  qurilma: boolean = true;
  accesseires: boolean = false;
  dataAccess: any;
  dataItems: any;
  paginateData: any[] = [];
  paginateDataAccess: any[] = [];
  data: any;
  filter: any;
  filterAccess: any;
  currentUser: any;
  currentUserPer: any;
  currentPage: number;
  totalPage: number;
  siteUrl: string;
  pageSize: number;
  alertShowSearch: boolean;
  alertShowSearchAccess: boolean
  loading: boolean;
  permissions: Ability

  constructor(
    private DataApi: DevicesService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authServices: AuthService
  ) { }

  ngOnInit() {
    this.permissions = this.authServices.getPermissions()
    this.siteUrl = env.apiUrl;
    this.getFilter();
    this.getDataItems();
    // this.getDataItemsAccess()
  }

  Qurilma() {
    this.qurilma = true
    this.accesseires = false
    this.getDataItems();
  }

  Access() {
    this.qurilma = false
    this.accesseires = true
    this.getDataItemsAccess()
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

  getDataItemsAccess() {
    this.route.queryParamMap.subscribe((data: any) => {
      this.closeAlerPopup();
      if (data.params.page)
        this.getDataAccess(data.params.page);
      else
        this.getDataAccess(1);
    });
  }

  getData(currentPage) {
    this.spinner.show();
    this.dataItems = [];
    this.filter.page = currentPage;
    this.DataApi.getDataItems().subscribe((res: any) => {

      if (res) {
        this.dataItems = res.data;
        this.currentPage = 1;
        this.totalPage = res.data.length;
        this.pageSize = 20;
        this.closeAlerPopup();
        this.pageChanged(this.currentPage)
        this.spinner.hide();
      }
    }), error => {
      this.spinner.hide()
      this.toastr.error(error.message);
    }
  }


  getDataAccess(currentPage) {
    this.spinner.show();
    this.dataAccess = [];
    this.filter.page = currentPage;
    this.DataApi.getDataItemsAccess().subscribe((res: any) => {
      if (res) {
        this.dataAccess = res.data;
        this.currentPage = 1;
        this.totalPage = res.data.length;
        this.pageSize = 20;
        this.closeAlerPopup();
        this.pageChangedAccess(this.currentPage)
        this.spinner.hide();
      }
    }), error => {
      this.spinner.hide()
      this.toastr.error(error.message);
    }
  }


  pageChanged(page) {
    this.paginateData = this.dataItems
      .slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize);

  }

  pageChangedAccess(page) {
    this.paginateDataAccess = this.dataAccess
      .slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize);
  }

  closeAlerPopup() {
    this.alertShowSearch = false;
    this.alertShowSearchAccess = false
  }

  filterApply() {
    this.spinner.show();
    this.getData(1);
  }

  onChangeFilter(event: any){
    
  }

  getDataFilter() {
    this.DataApi.getDataFilter(this.filter).subscribe((res: any) => {

      if (res) {
        this.spinner.hide();
        this.paginateData = res.data;
        this.currentPage = res.current_page;
        this.totalPage = res.total;
        this.pageSize = res.per_page;
        this.closeAlerPopup();
      }
    })
  }

  getDataFilterAccess() {
    
    this.DataApi.getDataFilterAccess(this.filterAccess).subscribe((res: any) => {
      
      if (res) {
        this.spinner.hide();
        this.paginateDataAccess = res.data;
        this.currentPage = res.current_page;
        this.totalPage = res.total;
        this.pageSize = res.per_page;
        this.closeAlerPopup();
      }
    })
  }



  getFilter() {
    this.filter = { id: '', imei: '', devices: '', account: '', model: '', provider: '', status: '' };
    this.filterAccess = { provider: ''}
  }

  clearForm() {
    this.getFilter();
    this.getDataItems();
  }

  clearFormAccess() {
    this.getFilter();
    this.getDataItemsAccess();
  }

  search() {
    this.alertShowSearch = true;
  }

  searchAccess() {
    this.alertShowSearchAccess = true
  }

}


@Component({
  selector: "devices-edit",
  templateUrl: "./data-edit.html",
  styleUrls: [],
})
export class DevicesEditComponent implements OnInit {
  accessory: boolean = false;
  qurilma: boolean = false;
  accessData: any;
  generatedIdValue: string = "";
  data1: any;
  data: any;
  currentUser: any;
  siteUrl: string;
  loadingPage: boolean;
  loading: boolean;
  uploading: boolean;
  uploadingText: string;
  uploadFiles: any = [];
  openLogs: boolean;
  alertShowRemoved1: boolean;
  alertShowRemoved2: boolean;
  alertShowEdited: boolean;
  productType: string;
  constructor(
    private DataApi: DevicesService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }
  ngOnInit() {
    this.getData();
    this.getDataAccess()
    this.accessData = {}
    this.data1 = [
      {
        type: "number"
      }
    ]
    this.route.queryParams.subscribe(params => {
      this.productType = params['type'];
    });
  }


  onChangeDevices(event: any) {
    if (event == "accessory") {
      this.accessory = true
      this.qurilma = false

    }
    if (event == "device") {
      this.accessory = false
      this.qurilma = true
    }
  }

  generateId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 10;
    let result = '';
    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    this.accessData.seria_number = result;
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
          // this.toastr.error(error.message)
        })
      } else {
        this.spinner.hide();
        this.data = { imei: '', provider: '', model: '', account: '' }
      }
    })
  }


  getDataAccess() {
    this.route.params.subscribe((res: any) => {
      if (res.id != 'add') {
        this.DataApi.getDataAccess(res.id).subscribe((res: any) => {
          if (res) {
            this.spinner.hide();
            this.accessData = res.data;
          }
        }, error => {
          // this.toastr.error(error.message)
        })
      } else {
        this.spinner.hide();
        this.data = { provider: '', model: '', incoming_price: '' }
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
      
      this.DataApi.createData(this.data).subscribe(
        (data: any) => {
          
          this.loading = false;
          if (data) {
            this.toastr.success("Muvaffaqiyatli qo'shildi");
            this.router.navigateByUrl('/devices/' + data.data.id);
          }
        },
        error => {
          this.loading = false;
          this.toastr.error(error.error.message);
        }
      );
    }
  }

  patchDataAccess() {
    this.loading = true;
    if (this.accessData.id) {
      this.DataApi.updateDataAccess(this.accessData).subscribe(
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

      this.DataApi.createDataAccess(this.accessData).subscribe(
        (data: any) => {
          this.loading = false;
          if (data) {
            this.toastr.success("Muvaffaqiyatli qo'shildi");
            this.router.navigateByUrl('/devices/' + data.data.id);
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
          this.alertShowRemoved1 = false;
          this.toastr.success("Muvaffaqiyatli o'chirildi");
          this.router.navigateByUrl('/devices');
        }
      },
      error => {
        this.loading = false;
        this.router.navigateByUrl('/devices');
        this.toastr.error(error.error.message);
      }
    );
  }


  deleteDataAccess() {
    this.loading = true;
    this.DataApi.deleteDataAccess(this.accessData).subscribe(
      (data: any) => {
        this.loading = false;
        if (data) {
          this.alertShowRemoved2 = false;
          this.toastr.success("Muvaffaqiyatli o'chirildi");
          this.router.navigateByUrl('/devices');
        }
      },
      error => {
        this.loading = false;
        this.router.navigateByUrl('/devices');
        this.toastr.error(error.error.message);
      }
    );
  }

  removeData() {
    this.alertShowRemoved1 = true;
  }

  removeDataAccess(){
    this.alertShowRemoved2 = true
  }

  closeAlerPopup() {
    this.alertShowRemoved1 = false;
  }

  closeAlerPopupAccess(){
    this.alertShowRemoved2 = false
  }

}