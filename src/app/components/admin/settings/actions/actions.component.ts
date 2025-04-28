import { Component, OnInit, inject, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ability } from '@casl/ability';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActionService } from 'src/app/services/action.service';
import { ControllersService } from 'src/app/services/controllers.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ActionsComponent implements OnInit {
  actionData: any = {};
  data: any;
  dataControllerConts_ID: any;
  loading: boolean
  firstPage: number
  totalPage: number
  fullPage: number
  ActionPutData: any
  actionEditData: any = {}
  config = {
    displayKey: "label",
  };


  permissions: Ability;
  private modalService = inject(NgbModal);

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  openVerticallyCenteredAction(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }


  constructor(
    private authService: AuthService,
    private getData: ActionService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastr: ToastrService,
    private getControllerLabels: ControllersService
  ) { }


  ngOnInit(): void {
    this.permissions = this.authService.getPermissions()
    this.getActions()
    this.getDataControllers()
  }


  getDataControllers() {
    this.dataControllerConts_ID = []
    this.getControllerLabels.getControllers().subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide()
          this.dataControllerConts_ID = res.data.data
          
          this.firstPage = res.data.current_page
          this.totalPage = res.data.total
          this.fullPage = res.data.per_page

        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.error(error.message)
      }
    )
  }


  getActions() {
    this.loading = true;
    this.spinner.show();
    this.data = []
    this.getData.getActions().subscribe(
      (res: any) => {
        if (res.status) {
          this.spinner.hide()
          this.data = res.data.data
          this.firstPage = res.data.current_page
          this.totalPage = res.data.total
          this.fullPage = res.data.per_page
          this.loading = false
        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.error(error.message)
        this.loading = false
      }
    )
  }

  addActions() {
    this.loading = true
    this.getData.postActions(this.actionData).subscribe(
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


  editAction(id: number) {
    this.ActionPutData = { name: this.actionEditData.name, code: this.actionEditData.code, conts_id: this.actionEditData.conts_id }
    this.loading = true
    this.getData.editAction(id, this.ActionPutData).subscribe(
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


  delAction(id: number) {
    this.loading = true
    this.getData.deleteAction(id).subscribe(
      (res: any) => {
        this.loading = false
        if (res.status) {
          this.toastr.success("Muvaffaqiyatli o'chirildi");
          window.location.reload() 
        }
      },
      (error) => {
        this.loading = false
        this.toastr.error(error.error.message)
      }
    )
  }

  pageChanged(page: number) {
    this.loading = true;
    this.spinner.show();
    this.router.navigate(['/action'], { queryParams: { page: page } });
    this.getData.getActionPagination(page).subscribe(
      (res: any) => {
        if (res.status) {
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
}