import { Component, OnInit, inject, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Ability } from '@casl/ability';
import { AuthService } from 'src/app/services/auth.service';
import { ControllersService } from 'src/app/services/controllers.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-controllers',
  templateUrl: './controllers.component.html',
  styleUrls: ['./controllers.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ControllersComponent implements OnInit {
  controllerData: any = {};
  controllerEditData: any = {};
  controllerPutData: any;
  data: any;
  permissions: Ability;
  firstPage: number;
  totalPage: number;
  fullPage: number;
  loading: boolean;

  private modalService = inject(NgbModal);

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  openVerticallyCentered_crud(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  constructor(
    private authService: AuthService,
    private getControl: ControllersService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit() {
    this.permissions = this.authService.getPermissions()
    this.getDataControllers()
  }

  getDataControllers() {
    this.loading = true;
    this.spinner.show();
    this.data = []
    this.getControl.getControllers().subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide()
          this.data = res.data.data
          this.firstPage = res.data.current_page
          this.totalPage = res.data.total
          this.fullPage = res.data.per_page
          this.loading = false;
        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.error(error.message)
        this.loading = false;
      }
    )
  }

  addController() {
    this.loading = true
    this.getControl.postControllers(this.controllerData).subscribe(
      (res: any) => {
        if (res.status) {
          this.spinner.hide()
          this.toastr.success("Muvaffaqiyatli qo'shildi.");
          window.location.reload()
        }
        else {
          let firstError: string[] = [];
          Object.keys(res.errors).forEach((key) => {
            res.errors[key].forEach((value1: string) => {
              firstError.push(value1);
            });
          });
          let errorHTML = firstError.join('<br>');
          this.toastr.error(errorHTML);
        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.error(error.message)
      }
    )
  }


  editController(id: number) {
    this.controllerPutData = { label: this.controllerEditData.label, name: this.controllerEditData.name }
    this.loading = true
    this.getControl.editControllers(id, this.controllerPutData).subscribe(
      (data: any) => {
        if (data.status) {
          this.loading = false
          this.toastr.success("Muvaffaqiyatli o'zgartirildi")
          window.location.reload()
        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.error(error.message)
      }
    )
  }


  deleteController(id: number) {
    this.loading = true
    this.getControl.delController(id).subscribe((data: any) => {
      this.loading = false
      if (data.status) {
        this.toastr.success("Muvaffaqiyatli o'chirildi");
        window.location.reload()
      }
    },
      (error) => {
        this.loading = false;
        this.toastr.error(error.error.message);
      }
    )
  }

  pageChanged(page) {
    this.router.navigate(['/controllers'], { queryParams: { page: page } });
  }
}                                                                               