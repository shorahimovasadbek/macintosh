import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ability } from '@casl/ability';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActionService } from 'src/app/services/action.service';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionsService } from 'src/app/services/permissions.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})

export class PermissionsComponent implements OnInit {
  id: any = {}
  data: any;
  dataPermissions: any;
  dataActions: any;
  newdata: any;
  checked: boolean;
  loading: boolean;
  ControllerNames: any = []
  ControllerNamesMassiv: any = []
  obj: any = {}
  objDefault: any = {}
  checkedControl: boolean;
  permissions: Ability
  is_default: boolean

  constructor(
    private getData: PermissionsService,
    private getActions: ActionService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private authServices: AuthService
  ) { }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const pageId = params['id'];
      this.id = { role_id: pageId }
      this.obj = {
        permissions: [],
        id: this.id.role_id
      }
      this.objDefault = {
        permissions: [],
        id: this.id.role_id
      }

    });
    this.getPermissions()
    this.getActionsData()
    this.permissions = this.authServices.getPermissions()

  }


  defaultPermissionFunk() {

    JSON.parse(localStorage.getItem("DefaultMassiv")!).map((item: any, index: number) => {
      if (item.name == "ClientController") {
        item.data.map((itemClient: any, index: number) => {
          if (itemClient.name == "Ro'yxat") {
            this.objDefault.permissions.push(
              {
                conts_id: itemClient.conts_id,
                role_id: this.id.role_id,
                action_id: itemClient.id
              }
            )
          }
        })
      }
    })

    JSON.parse(localStorage.getItem("DefaultMassiv")!).map((item: any, index: number) => {
      if (item.name == "DeviceController") {
        item.data.map((itemClient: any, index: number) => {
          if (itemClient.name == "Ro'yxat") {
            this.objDefault.permissions.push(
              {
                conts_id: itemClient.conts_id,
                role_id: this.id.role_id,
                action_id: itemClient.id
              }
            )
          }
        })
      }
    })

    JSON.parse(localStorage.getItem("DefaultMassiv")!).map((item: any, index: number) => {
      if (item.name == "OrderController") {
        item.data.map((itemClient: any, index: number) => {
          if (itemClient.name == "Ro'yxat") {
            this.objDefault.permissions.push(
              {
                conts_id: itemClient.conts_id,
                role_id: this.id.role_id,
                action_id: itemClient.id
              }
            )
          }
        })
      }
    })

    this.getData.postPermission(this.id.role_id, this.objDefault).subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide()
        } else {
          let firstError: string[] = [];
          Object.keys(res.errors).forEach((key) => {
            res.errors[key].forEach((value1: string) => {
              firstError.push(value1);
            });
          });
          let errorHTML = firstError.join('<br>');
          this.toastr.error(errorHTML);
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



  CheckBox() {
    if (this.checked) {
      this.checked = false
    } else {
      this.checked = true
      this.obj.permissions = []
      this.ControllerNamesMassiv.map((item: any, index: number) => {
        item.data.map((id_number: any, index: number) => {
          id_number.checkedControl = false
          this.obj.permissions.push({
            conts_id: id_number.conts_id,
            role_id: this.id.role_id,
            action_id: id_number.id
          })
        })
      })

    }
  }

  CheckController(son: number, id: number) {
    this.ControllerNamesMassiv.map((item: any, index: number) => {
      item.data.map((dataItem: any, dataIndex: number) => {
        if (dataItem.id == id) {
          dataItem.checkedControl = false
        }
      })
    })

    let searchItem = this.obj.permissions.find(item => item.action_id == id)
    if (searchItem) {
      return this.obj.permissions = this.obj.permissions.filter(item => item.action_id != id)
    }
    else {
      return this.obj.permissions.push({
        conts_id: this.ControllerNamesMassiv[son].conts_id,
        role_id: this.id.role_id,
        action_id: id
      })
    }
  }

  removeAll() {
    this.ControllerNamesMassiv.map((item: any, index: number) => {
      item.data.map((itemData: any, indexData: number) => {
        if (itemData.checkedControl) {
          return itemData.checkedControl = false
        } else {
          return itemData.checkedControl = false
        }
      })
    })
    this.checkedControl = false
    this.obj.permissions = []
  }

  getActionsData() {
    this.loading = true;
    this.spinner.show();
    this.dataActions = []
    this.getActions.getActions().subscribe(
      (res: any) => {
        if (res.status) {
          this.spinner.hide()
          this.dataActions = res.data.data
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


  getPermissions() {
    this.loading = true
    this.spinner.show()
    this.data = []
    this.dataPermissions = []
    this.getData.getPermissions(this.id).subscribe(
      (res: any) => {
        if (res) {

          this.data = res.data.actions
          this.dataPermissions = res.data.permissions
          this.dataPermissions.map((item: any, index: number) => {
            this.obj.permissions.push({
              conts_id: item.conts_id,
              role_id: item.role_id,
              action_id: item.action_id
            })

          })

          this.data.map(item => {
            const name = Object.keys(item)[0]
            this.ControllerNames.push(name)
            if (this.ControllerNames.includes(name)) {
              let controllers: any = item[name];
              const updatedControllers = controllers.map((contItem: any) => {
                return { ...contItem, checkedControl: false };
              });
              this.ControllerNamesMassiv.push(
                {
                  name: name,
                  data: updatedControllers,
                  conts_id: updatedControllers[0].conts_id
                }
              )
            }
          })
        }

        localStorage.setItem("DefaultMassiv", JSON.stringify(this.ControllerNamesMassiv))

        this.ControllerNamesMassiv.forEach((item: any) => {
          item.data.forEach((dataCont: any) => {
            const foundDataPer = this.dataPermissions.find((dataPer: any) => Number(dataPer.action_id) === dataCont.id);
            if (foundDataPer) {
              dataCont.checkedControl = true;
            } else {
              dataCont.checkedControl = false;
            }
          });
        });
      },
      (error) => {
        this.spinner.hide()
        this.toastr.error(error.message)
      }
    )
  }




  SendPermission() {
    this.loading = true
    this.ControllerNamesMassiv.map((item: any, index: number) => {
      item.data.map((dataItem: any, dataIndex: number) => {
        if (this.obj.permissions.length > 0) {
          let response = this.obj.permissions.find(item => item.action_id === dataItem.id)
          if (dataItem.checkedControl && !response) {
            this.obj.permissions.push({
              conts_id: dataItem.conts_id,
              role_id: this.id.role_id,
              action_id: dataItem.id
            })
          }
        }
      })
    })

    this.getData.postPermission(this.id.role_id, this.obj).subscribe(
      (res: any) => {
        if (res) {
          this.spinner.hide()
          this.toastr.success("Muvaffaqiyatli qo'shildi.");
          this.router.navigate(['/role'])
        } else {
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
    localStorage.removeItem("DefaultMassiv")
  }
}
