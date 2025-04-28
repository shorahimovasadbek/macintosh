import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Ability } from "@casl/ability";
import { INgxSelectOption } from "ngx-select-ex";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";
import { ClientsService } from "src/app/services/clients.service";
import { env } from "src/environments/environment";

@Component({
  selector: "clients",
  templateUrl: "./data.html",
  styleUrls: [],
})
export class ClientsComponent implements OnInit {

  dataItems: any;
  paginateData: any;
  data: any;
  filter: any;
  currentUser: any;
  currentPage: number;
  totalPage: number;
  siteUrl: string;
  pageSize: number;
  alertShowSearch: boolean;
  loading: boolean;
  permissions: Ability

  constructor(
    private DataApi: ClientsService,
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

  getDataFilter() {
    if (this.filter.id === null) {
      this.filter.id = ''
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
    } else {
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
  }

  getData(currentPage) {
    this.dataItems = [];
    this.filter.page = currentPage;
    this.spinner.show();
    this.DataApi.getDataItems().subscribe((res: any) => {      
      if (res) {
        this.spinner.hide();
        this.dataItems = res.data;
        
        this.dataItems.forEach((user) => {
          if(user.middle_name !== null) 
            user.name = user.name + ' ' + user.surname + ' ' + user.middle_name ;
          else 
            user.name = user.name + ' ' + user.surname;
        });
        this.currentPage = 1;
        this.totalPage = res.data.length;
        this.pageSize = 20;

        this.closeAlerPopup();
        this.pageChanged(this.currentPage)
      }
    }, error => {
      this.spinner.hide()
      this.toastr.error(error.message);
    })
  }

  pageChanged(page) {
    this.paginateData = this.dataItems
      .slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize);

  }

  closeAlerPopup() {
    this.alertShowSearch = false;
  }

  filterApply() {
    this.spinner.show();
    this.getData(1);
  }

  getFilter() {
    this.filter = { id: '', full_name: '', passport: '', phone: '', passport_status: '' };
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
  selector: "clients-edit",
  templateUrl: "./data-edit.html",
  styleUrls: [],
})
export class ClientsEditComponent implements OnInit {

  data: any;
  currentUser: any;
  siteUrl: string;
  loadingPage: boolean;
  loading: boolean;
  uploading: boolean;
  uploadingText: string;
  uploadFiles: any = [];
  openLogs: boolean;
  alertShowRemoved: boolean;
  alertShowEdited: boolean;
  file: any;
  previewUrl: any;
  previewPassportUrl: any;
  selectedFile: any;
  selectedFilePassport: any;

  deltedPhone: any;
  constructor(
    private DataApi: ClientsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.data = {
      name: '', middle_name: '', surname: '',
      passport: '', passport_status: '', place_of_issue: '',
      date_of_issue: '', date_of_birth: '',
      gender: '', place_of_birth: '', place_of_residence: '',
      file_passport: '',
      file: '', phone: [''], email: '', workplace: '', specialization: '', passpord: '', confirm_password: ''
    }
    this.getData();
    if (!this.data.phone)
      this.data.phone = ['']
  }

  getData() {
    this.route.params.subscribe((res: any) => {
      if (res.id != 'add') {
        this.DataApi.getData(res.id).subscribe((res: any) => {
          if (res) {
            this.spinner.hide();
            this.data = res.data;
            this.previewUrl = res.data.file_url;
            this.previewPassportUrl = res.data.file_passport_url;
          }
        }, error => {
          this.toastr.error(error.message)
        })
      } else {
        this.spinner.hide();
        this.data = { name: '', passport: '', phones: '' }
      }
    })
  }

  selectPassport(event: any) {
    if (event.target.files && event.target.files[0])
      this.selectedFilePassport = event.target.files[0];
    this.previewFile(this.selectedFilePassport, 'previewPassportUrl');
  }

  selectFile(event: any) {
    if (event.target.files && event.target.files[0])
      this.selectedFile = event.target.files[0];
    this.previewFile(this.selectedFile, 'previewUrl');
  }

  previewFile(file: File, previewUrlProperty: string) {
    const reader = new FileReader();
    reader.onload = () => {
      this[previewUrlProperty] = reader.result;
    };
    reader.readAsDataURL(file);
  }

  patchData() {
    let formData = new FormData();
    if (this.data.id) {
      formData.append("id", this.data.id);
      formData.append('status', this.data.status ? this.data.status : '');
      formData.append('name', this.data.name ? this.data.name : '');
      formData.append('middle_name', this.data.middle_name ? this.data.middle_name : '');
      formData.append('surname', this.data.surname ? this.data.surname : '');
      formData.append('passport', this.data.passport ? this.data.passport : '');
      formData.append('passport_status', this.data.passport_status ? this.data.passport_status : '');
      formData.append('place_of_issue', this.data.place_of_issue ? this.data.place_of_issue : '');
      formData.append('date_of_issue', this.data.date_of_issue ? this.data.date_of_issue : '');
      formData.append('date_of_birth', this.data.date_of_birth ? this.data.date_of_birth : '');
      formData.append('gender', this.data.gender ? this.data.gender : 3);
      formData.append('place_of_birth', this.data.place_of_birth ? this.data.place_of_birth : '');
      formData.append('place_of_residence', this.data.place_of_residence ? this.data.place_of_residence : '');
      formData.append('bail_name', this.data.bail_name ? this.data.bail_name : '');
      formData.append('bail_phone', this.data.bail_phone ? this.data.bail_phone : '');
      formData.append('file_passport', this.selectedFilePassport ? this.selectedFilePassport : this.data.file_passport);

      formData.append("file", this.selectedFile ? this.selectedFile : this.data.file);
      this.data.phone.forEach((v, i) => {
        formData.append('phones' + '[' + [i] + ']', v ? v : '')
      });
      formData.append('email', this.data.email ? this.data.email : '');
      formData.append('workplace', this.data.workplace ? this.data.workplace : '');
      formData.append('specialization', this.data.specialization ? this.data.specialization : '');
      formData.append('password', this.data.passpord ? this.data.passpord : null);
      formData.append('password', this.data.confirm_password ? this.data.confirm_password : null)
    }
    else {
      formData.append('status', this.data.status ? this.data.status : '');
      formData.append('name', this.data.name ? this.data.name : '');
      formData.append('middle_name', this.data.middle_name ? this.data.middle_name : '');
      formData.append('surname', this.data.surname ? this.data.surname : '');
      formData.append('passport', this.data.passport ? this.data.passport : '');
      formData.append('passport_status', this.data.passport_status ? this.data.passport_status : '');
      formData.append('place_of_issue', this.data.place_of_issue ? this.data.place_of_issue : '');
      formData.append('date_of_issue', this.data.date_of_issue ? this.data.date_of_issue : '');
      formData.append('date_of_birth', this.data.date_of_birth ? this.data.date_of_birth : '');
      formData.append('gender', this.data.gender ? this.data.gender : '');
      formData.append('place_of_birth', this.data.place_of_birth ? this.data.place_of_birth : '');
      formData.append('place_of_residence', this.data.place_of_residence ? this.data.place_of_residence : '');
      formData.append('bail_name', this.data.bail_name ? this.data.bail_name : '');
      formData.append('bail_phone', this.data.bail_phone ? this.data.bail_phone : '');
      formData.append('file_passport', this.selectedFilePassport);
      this.data.phone.forEach((v, i) => {
        formData.append('phones' + '[' + [i] + ']', v)
      });
      formData.append("file", this.selectedFile);
      formData.append('email', this.data.email ? this.data.email : '');
      formData.append('workplace', this.data.workplace ? this.data.workplace : '');
      formData.append('specialization', this.data.specialization ? this.data.specialization : '');
      formData.append('password', this.data.passpord ? this.data.passpord : null);
      formData.append('password', this.data.confirm_password ? this.data.confirm_password : null)
    }
    this.loading = true;
    if (this.data.id) {
      this.DataApi.updateData(this.data.id, formData).subscribe((data: any) => {
        if (data) {
          this.loading = false;
          this.toastr.success("Muvaffaqiyatli o'zgartirildi");
          this.getData();
        }
      }, error => {
        this.loading = false;
        this.toastr.error(error.message);
      });
    } else {
      this.DataApi.createData(formData).subscribe((data: any) => {
        this.loading = false;
        if (data) {
          this.toastr.success("Muvaffaqiyatli qo'shildi");
          this.router.navigateByUrl('/clients/' + data.data.id);
        }
      }, error => {
        this.loading = false;
        this.toastr.error(error.message);
      }
      );
    }
  }

  removeData() {
    this.alertShowRemoved = true;
  }

  deleteData() {
    this.loading = true;
    if (this.deltedPhone || this.deltedPhone == 0) {
      this.data.phone.splice(this.deltedPhone, 1);
      this.loading = false;
      this.deltedPhone = ''
      this.alertShowRemoved = false;
    }
    else {
      this.DataApi.deleteData(this.data).subscribe(
        (data: any) => {
          this.loading = false;
          if (data) {
            this.alertShowRemoved = false;
            this.toastr.success("Muvaffaqiyatli o'chirildi");
            this.router.navigateByUrl('/clients');
          }
        },
        error => {
          this.loading = false;
          if (this.data.orders)
            this.toastr.error("Mijozni o'chirish mumkin emas. Mijozda buyurtma mavjud")
          else
            this.toastr.error(error.message);
          this.closeAlerPopup();
        }
      );
    }
  }

  closeAlerPopup() {
    this.alertShowRemoved = false;
  }

  addItem() {
    this.data.phone.push('')
  }

  removeItem(index) {
    this.deltedPhone = index;
    this.removeData();
  }

  trackByFn(index: any, item: any) {
    return index;
  }
}