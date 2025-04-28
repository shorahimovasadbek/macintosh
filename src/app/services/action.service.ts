import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(private http: HttpClient) { }

  getActions(){
    return this.http.get(env.apiUrl+'/api/action')
  }

  getActionPagination(page:number){
    return this.http.get(env.apiUrl+'/api/action?page='+page)
  }

  postActions(data:any){
    return this.http.post(env.apiUrl+'/api/action/store', data)
  }

  editAction(id:number, data:any){
    return this.http.post(env.apiUrl+'/api/action/update/'+id, data)
  }

  deleteAction(id:number){
    return this.http.delete(env.apiUrl+'/api/action/destroy/'+id)
  }
}
