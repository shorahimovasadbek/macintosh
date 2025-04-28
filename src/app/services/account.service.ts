import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private headers: HttpHeaders;

  constructor (
    private http: HttpClient
  ) { }



  public getDataItems(data) {
    return this.http.get(env.apiUrl+'/api/user?name='+data.name+'&phone='+data.phone+'&status='+data.status+'&page='+data.page+'&region_id='+data.region_id+'&role='+data.role);
  }

  public getData() {
    return this.http.get(env.apiUrl+'/api/user');
  }

  public getDataShow(id) {
    return this.http.get(env.apiUrl+'/api/user/'+ id);
  }

  public updateData(data) {
    return this.http.put(env.apiUrl+'/api/user/'+data.id, data);
  }

  public createData(data) {
    return this.http.post(env.apiUrl+'/api/user', data);
  }

  public deleteData(data) {
    return this.http.delete(env.apiUrl+'/api/user/'+data.id);
  }

  public getPage(slug):any {
    return this.http.get(env.apiUrl+'/api/page-detail/'+slug);
  }

  public changeRegion(data) {
    return this.http.post(env.apiUrl+'/api/user-change-region', data);
  }

  public changePassword(data) {
    return this.http.put(env.apiUrl+'/api/profile/update', data);
  }

}
