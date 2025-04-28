import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  getDataRolles(){
    return this.http.get(env.apiUrl+'/api/role')
  }

  postDataRole(data:any){
    return this.http.post(env.apiUrl+'/api/role/store', data)
  }

  roleEdit(id:number, data:any){
    return this.http.post(env.apiUrl+'/api/role/update/'+id, data)
  }

  deleteRole(id:number){
    return this.http.delete(env.apiUrl+'/api/role/destroy/'+id)
  }

}
