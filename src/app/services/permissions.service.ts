import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private http: HttpClient) { }

  getPermissions(id:number){
    return this.http.post(env.apiUrl+'/api/permissions', id)
  }

  postPermission(id:number, data:any){
    return this.http.post(env.apiUrl+'/api/permissions/store/'+id, data)
  }
}
