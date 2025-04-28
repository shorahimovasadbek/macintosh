import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { env } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ControllersService {

  constructor(private http: HttpClient) { }

  getControllers(){
    return this.http.get(env.apiUrl+'/api/controller')
  }


  postControllers(data:any){
    return this.http.post(env.apiUrl+'/api/controller/store', data)
  }


  editControllers(id:number, data:any){
    return this.http.post(env.apiUrl+'/api/controller/update/'+id, data)
  }

  delController(id:number){
    return this.http.delete(env.apiUrl+'/api/controller/destroy/'+id)
  }

}
