import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Ability } from "@casl/ability";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { Observable, OperatorFunction, debounceTime, distinctUntilChanged, map, switchMap } from "rxjs";
import { Admin } from "src/app/role";
import { AuthService } from "src/app/services/auth.service";
import { ClientsService } from "src/app/services/clients.service";
import { DevicesService } from "src/app/services/devices.service";
import { OrderService } from "src/app/services/orders.service";
import { env } from "src/environments/environment";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: "orders",
  templateUrl: "./data.html",
  styleUrls: [],
})
export class OrdersComponent implements OnInit {
  dataItems: any;
  data: any;
  filter: any;
  currentUser: any;
  currentUserPer: any;
  currentPage: number;
  totalPage: number;
  siteUrl: string;
  pageSize: number;
  alertShowSearch: boolean;
  alertShowNotification: boolean;
  loading: boolean;
  clients: any;
  devices: any;
  notes: any;
  resultNotes: any = [];
  monthlyCommentModal: boolean;
  monthlyComment: any;
  month: any;
  permissions: Ability

  constructor(
    private DataApi: OrderService,
    private ClientApi: ClientsService,
    private DevicesApi: DevicesService,
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
    this.ClientApi.getDataItems().subscribe((res: any) => {
      this.clients = res.data
    })
    this.DevicesApi.getDataItems().subscribe((res: any) => {
      this.devices = res.data

    })
    this.filter = { id: '', status: '', client: {}, device: '', pay_type: '', imei: '' };
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
    this.spinner.show();
    this.dataItems = [];
    this.filter.page = currentPage;
    this.DataApi.getDataItems(currentPage).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        this.dataItems = localStorage.getItem('searchItems') ? JSON.parse(localStorage.getItem('searchItems') || '') : res.data;
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
    this.loading = true;
    this.DataApi.getDataFilter(this.filter).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        localStorage.setItem("searchItems", JSON.stringify(res.data));
        this.dataItems = JSON.parse(localStorage.getItem("searchItems") || '');

        this.currentPage = res.current_page;
        this.totalPage = res.total;
        this.pageSize = res.per_page;
        this.closeAlerPopup();
        this.loading = false;
      }
    })
  }

  pageChanged(page) {
    this.spinner.show();
    this.router.navigate(['/orders'], { queryParams: { page: page } });
    this.spinner.hide();
  }

  closeAlerPopup() {
    this.alertShowSearch = false;
    this.alertShowNotification = false;
    this.monthlyCommentModal = false;
  }

  filterApply() {
    this.spinner.show();
    this.getData(1);
  }

  getFilter() {
    this.filter = { id: '', status: '', client: '', device: '', pay_type: '', imei: '' };
  }

  clearForm() {
    this.getFilter();
    this.getDataItems();
    this.filter = { id: '', status: '', client: '', device: '', pay_type: '', imei: '' };
    localStorage.removeItem('searchItems')
  }

  search() {
    this.alertShowSearch = true;
  }

  showNotification() {
    this.loading = true
    this.alertShowNotification = true;
    this.DataApi.notes().subscribe((res: any) => {
      if (res) {

        this.loading = false;
        this.notes = res.data;
        this.removeDupliacate(this.notes);
      }
    })
  }

  removeDupliacate(data) {
    this.resultNotes = data.filter((item, index) => {
      return index === data.findIndex(o => item.id === o.id);
    });
  }

  showMonthlyComment(item) {
    this.month = item;
    this.monthlyCommentModal = true;
  }

  setMonthlyComment() {
    this.spinner.show();
    this.DataApi.monthlyComment(this.month.monthly_id, { comment: this.monthlyComment }).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        this.closeAlerPopup();
        this.toastr.success("Muvaffaqiyatli o'zgartirildi");
      }
    }, error => {
      this.closeAlerPopup();
      this.toastr.error(error.message);
    })
  }

  searchClient: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        this.DataApi.getDataSearch(term)
      ),
      map((results: any) => {
        results.data = results.data.filter((item, index) => {


          return index === results.data.findIndex(o => item.id === o.id);
        });
        return results.data as readonly any[]
      })
    );

  formatMatches = (value: any) => {
    value.phones = value.phones.replace("[", "").replace("]", "").replace("\"", "");
    if (value.name && value.surname && value.phones)
      return value.name + ' ' + value.surname + '(' + value.phones + ')'
    else {
      return value.name || ''
    }
  }

}


@Component({
  selector: "order-edit",
  templateUrl: "./data-edit.html",
  styleUrls: [],
})
export class OrderEditComponent implements OnInit {

  data: any;
  typeDevicAccess: any;
  qurilma: boolean = false;
  accessory: boolean = false;
  naxtAccess: boolean = false;
  naxtQurilma: boolean = false;
  bolibtolashAccess: boolean = false;
  bolibtolashQurilma: boolean = false;
  AccessuarMassiv: any[] = [];
  AccessuarMassivFilter: any[] = []

  clients_id: any;
  clinets_name: string;
  devices: any[] = [];
  devicesFilter: any[] = []
  displayText: any;
  dataHistory: any;
  currentUser: any;
  siteUrl: string;
  loadingPage: boolean;
  loading: boolean;
  alertShowPayment: boolean;
  alertShowRemoved: boolean;
  alertShowEdited: boolean;
  is_access: boolean;
  permissions: Ability

  constructor(
    private DataApi: OrderService,
    private ClientApi: ClientsService,
    private DevicesApi: DevicesService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authServices: AuthService
  ) { }

  ngOnInit() {
    this.permissions = this.authServices.getPermissions()
    this.data = {
      order: { monthlies: [{ payments: [] }] },
      device: { id: '' }
    }

    this.route.queryParams.subscribe(params => {
      this.typeDevicAccess = params['type'];
    });

    this.spinner.show();
    this.getData();
    this.ClientApi.getDataItems().subscribe((res: any) => {
      let clients = res.data
      this.clients_id = clients[0].id
      this.clinets_name = clients[0].name

    })
    this.DevicesApi.getDataItems().subscribe((res: any) => {
      this.devices = res.data
      this.devicesFilter = this.devices.filter(device => device.status === 0);
      this.devicesFilter = this.devicesFilter.map(device => {
        return {
          ...device,
          displayText: `${device.model} (${device.imei})`
        };
      });
    })
    this.DevicesApi.getDataItemsAccess().subscribe((res: any) => {
      this.AccessuarMassiv = res.data
      this.AccessuarMassivFilter = this.AccessuarMassiv.filter(device => device.status === 0);
    })
  }

  onChangeDevices(event: any) {

    if (event == "device") {
      this.qurilma = true
      this.accessory = false
    }

    if (event == "accessory") {
      this.accessory = true
      this.qurilma = false
    }
  }

  onChangeAccess(event: any) {

    if (event == "true") {
      this.bolibtolashAccess = false
      this.bolibtolashQurilma = false
      this.naxtAccess = true
      this.naxtQurilma = true
    }
    if (event == "false") {
      this.bolibtolashAccess = true
      this.bolibtolashQurilma = true
      this.naxtAccess = false
      this.naxtQurilma = false
    }
  }

  getData() {
    this.route.params.subscribe((res: any) => {
      if (res.id != 'add') {
        this.DataApi.getData(res.id).subscribe((res: any) => {
          if (res) {
            this.spinner.hide();
            this.data = res.data;

            this.devices.push(this.data.device)
          }
        }, error => {
          this.toastr.error(error.message)
        })
      } else {
        this.spinner.hide();
        this.data = { client: { id: '', name: "" }, device: { id: '', model: '' }, order: { box: 0 }, device_id: '', pay_day: '', pay_type: '' }
      }
    })
  }

  patchData() {
    this.loading = true;
    if (this.data.order.id) {
      let data = {
        id: this.data.order.id,
        client_id: this.clients_id.id,
        device_id: this.data.device_id,
        pay_type: this.data.order.pay_type,
        body_price: this.data.order.body_price,
        summa: this.data.order.summa,
        initial_payment: this.data.order.initial_payment,
        pay_day: this.data.order.pay_day,
        box: this.data.order.box,
        startDate: this.data.order.startDate,
        notes: this.data.order.notes,
        is_cash: this.data.is_cash == "true" ? true : false,
        type: this.data.type,
        quantity: this.data.quantity,
        account: this.data.account
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

      let data = {
        client_id: this.clients_id.id,
        device_id: this.data.device_id,
        pay_type: this.data.order.pay_type,
        body_price: this.data.order.body_price,
        summa: this.data.order.summa,
        initial_payment: this.data.order.initial_payment,
        pay_day: this.data.order.pay_day,
        box: this.data.order.box,
        startDate: this.data.order.startDate,
        notes: this.data.order.notes,
        is_cash: this.data.is_cash == "true" ? true : false,
        type: this.data.type,
        quantity: this.data.quantity,
        account: this.data.account
      }


      this.DataApi.createData(data).subscribe(
        (data: any) => {
          this.loading = false;
          if (data) {
            this.toastr.success("Muvaffaqiyatli qo'shildi");
            this.router.navigateByUrl('/orders');
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
          this.router.navigateByUrl('/orders');
        }
      },
      error => {
        this.loading = false;
        this.toastr.error(error.error.message);
      }
    );
  }

  closeAlerPopup() {
    this.alertShowRemoved = false
  }

  searchClient: OperatorFunction<string, readonly any[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) =>
        this.DataApi.getDataSearch(term)
      ),
      map((results: any) => {
        results.data = results.data.filter((item, index) => {
          return index === results.data.findIndex(o => item.id === o.id);
        });
        return results.data as readonly any[]
      })
    );
  formatMatches = (value: any) => {
    value.phones = value.phones.replace("[", "").replace("]", "").replace("\"", "");

    if (value.name && value.surname && value.phones)
      return value.name + ' ' + value.surname + '(' + value.phones + ')'
    else {
      return value.name || ''
    }
  }
}


@Component({
  selector: "order-detail",
  templateUrl: "./data-detail.html",
  styleUrls: [],
})
export class OrderDetailComponent implements OnInit {

  data: any;
  client: any;
  total_sum: any;
  rest_sum: any;
  paymentSum: any;
  date: any;
  dataHistory: any;
  loading: boolean;
  paymentType: any
  currentUser: any;
  siteUrl: string;
  alertShowPayment: boolean;
  alertShowCloseOrder: boolean;
  alertShowRemoved: boolean = false;
  allPayments = 0;
  is_access: boolean;
  selectedPayment: any;
  datePipe: any;
  permissions: Ability
  constructor(
    private DataApi: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authServices: AuthService
  ) { };

  ngOnInit() {
    this.permissions = this.authServices.getPermissions()
    if (true) {
      this.is_access = true;
    }
    this.getData();
    this.date = new Date().toISOString().split('T')[0];
    this.data = { name: '' }
  }


  formatDateWithoutTime(dateString: string): string {
    return dateString.split(' ')[0];
  }


  downloadPDF() {
    const DATA = document.getElementById('htmlData')!;
    html2canvas(DATA).then(canvas => {
      const imgWidth = 200;
      const padding = 10;
      const imgHeight = (canvas.height * imgWidth / canvas.width) + (padding);
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4');
      const position = padding;
      pdf.addImage(contentDataURL, 'PNG', padding, position, imgWidth + (padding), imgHeight);
      pdf.save('table.pdf');
    });
  }



  getData() {
    this.spinner.show();
    this.route.params.subscribe((res: any) => {
      if (res.id != 'add') {
        this.DataApi.getData(res.id).subscribe((data: any) => {
          if (data) {
            this.spinner.hide();
            this.data = data.data;

            this.client = data.data.client
            this.total_sum = this.data?.order?.summa
            this.rest_sum = this.data?.order?.rest_summa
            this.data.order.monthlies.forEach((month: any) => {
              month.payments.forEach((payment) => {
                this.allPayments += payment.amount;
              })
            })
          }
        }, error => {
          this.toastr.error(error.message)
        })
      } else {
        this.spinner.hide();
        this.data = { client: '', date: '', pay_type: '', id: '', }
      }
    })
  }

  showPaymentModal() {
    this.alertShowPayment = true;
  }

  showCloseOrderModal() {
    this.alertShowCloseOrder = true;
  }

  payment() {
    let payment
    this.loading = true;
    this.paymentType === 'monthly' ? payment = { amount: this.paymentSum, date: this.date, discount: false }
      :
      payment = { amount: this.paymentSum, date: this.date, discount: true }

    this.DataApi.createPayment(this.data.order.id, payment).subscribe(
      (data: any) => {
        if (data.status) {
          this.toastr.success("To'lov muvaffaqiyatli amalga oshirildi");
          this.paymentSum = ''
          this.closeAlerPopup();
          setTimeout(() => {
            location.reload();
          }, 1000);
          this.loading = false;
        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.error(error.error.message)
        setTimeout(() => {
          location.reload();
        }, 3000);
      }
    )
  }

  closeOrder() {
    this.spinner.show();
    let data = {
      id: this.data.order.id,
      status: 2,
      name: this.data.name
    }
    this.DataApi.closeOrder(data).subscribe((res: any) => {
      if (res && res.status === true) {
        this.spinner.hide();
        this.router.navigate(['/orders'])
        this.toastr.success("Muvaffaqiyatli o'zgartirldi");
      }
    })
  }

  changeType(event) {
    this.paymentType = event.target.value;
  }

  closeAlerPopup() {
    this.alertShowPayment = false;
    this.alertShowCloseOrder = false;
    this.alertShowRemoved = false;
  }

  showDeletePayment(item) {
    this.selectedPayment = item
    this.alertShowRemoved = !this.alertShowRemoved;
  }

  deleteData() {
    this.spinner.show();
    this.DataApi.deletePayment(this.selectedPayment).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        this.toastr.success("Muvaffaqiyatli o'chirilidi")
        this.getData();
        this.closeAlerPopup()
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.message);
      this.closeAlerPopup()
    })
  }
}