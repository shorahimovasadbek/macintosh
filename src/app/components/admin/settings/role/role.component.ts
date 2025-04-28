import { Component, OnInit, inject, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ability } from '@casl/ability';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service'
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class RoleComponent implements OnInit {
  permissions: Ability;
  roleData: any = {};
  roleEditData: any = {};
  data: any;
  firstPage: number;
  totalPage: number;
  fullPage: number;
  loading: boolean;

  private modalService = inject(NgbModal);

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  openVerticallyCenteredRole(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  constructor(
    private authService: AuthService,
    private getData: RoleService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.permissions = this.authService.getPermissions()
    this.getDataRole()
  }

  getDataRole() {
    this.loading = true;
    this.spinner.show();
    this.data = []
    this.getData.getDataRolles().subscribe(
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

  addRole() {
    this.loading = false
    this.getData.postDataRole(this.roleData).subscribe(
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

  editRole(id: number) {
    this.roleEditData = { label: this.roleEditData.label, name: this.roleEditData.name }
    this.loading = true
    this.getData.roleEdit(id, this.roleEditData).subscribe(
      (res: any) => {
        if (res.status) {
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

  delRole(id: number) {
    this.loading = true
    this.getData.deleteRole(id).subscribe(
      (res: any) => {
        this.loading = false;
        if (res) {
          this.toastr.success("Muvaffaqiyatli o'chirildi");
          window.location.reload()
        }
      },
      (error) => {
        this.spinner.hide()
        this.toastr.error(error.message)
      }
    )
  }


  pageChanged(page) {
    this.router.navigate(['/role'], { queryParams: { page: page } });
  }
}