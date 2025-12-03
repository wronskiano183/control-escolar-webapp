import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class RegistrarMateriasService {

  constructor(
     private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

   public esquemamaterias(){
    return {
      'rol':'',
      'nrc': '',
      'nombre_materia': '',
      'seccion': '',
      'dias': [],
      'hora_inicio': '',
      'hora_final': '',
      'salon': '',
      'programa_educativo': '',
      'profesor_asignado': '',
      'creditos': '',


      // materias a impartir
      'Ing. en Cs. de la Computación': false,
      'Lic. en Cs. de la Computación': false,
      'Ing. en Tecnologías de la Inf.': false,

    }
  }

  public validarMaterias(data: any, editar: boolean){
  let errors:any = {};

  if(!data.nrc || data.nrc.trim() === ""){
    errors.nrc = "El NRC es obligatorio";
  }

  if(!data.nombre_materia || data.nombre_materia.trim() === ""){
    errors.nombre_materia = "El nombre de la materia es obligatorio";
  }

  if(!data.seccion || data.seccion.trim() === ""){
    errors.seccion = "La sección es obligatoria";
  }

  if(!data.dias || data.dias.length === 0){
    errors.dias = "Selecciona al menos un día";
  }

  if(!data.hora_inicio){
    errors.hora_inicio = "La hora de inicio es obligatoria";
  }

  if(!data.hora_final){
    errors.hora_final = "La hora final es obligatoria";
  }

  if(data.hora_inicio && data.hora_final && data.hora_inicio >= data.hora_final){
    errors.hora_final = "La hora final debe ser mayor que la de inicio";
  }

  if(!data.salon){
    errors.salon = "El salón es obligatorio";
  }

  if(!data.programa_educativo){
    errors.programa_educativo = "El programa educativo es obligatorio";
  }

  if(!data.profesor_asignado){
    errors.profesor_asignado = "Debes seleccionar un profesor";
  }

  if(!data.creditos){
    errors.creditos = "Los créditos son obligatorios";
  }

  return errors;
}

public registrarMateria(data: any): Observable<any> {
  const token = this.facadeService.getSessionToken();
  let headers: HttpHeaders;

  if (token) {
    headers = new HttpHeaders({'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  } else {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  return this.http.post<any>(`${environment.url_api}/materias/`, data, { headers });
}

// Servicio para obtener la lista de materias
public obtenerListaMaterias(): Observable<any> {
  // Verificamos si existe el token de sesión
  const token = this.facadeService.getSessionToken();
  let headers: HttpHeaders;

  if (token) {
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  } else {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  return this.http.get<any>(`${environment.url_api}/lista-materias/`, { headers });
}

// Petición para obtener una materia por su ID
public obtenerMateriaPorID(idMateria: number): Observable<any> {
  const token = this.facadeService.getSessionToken();
  let headers: HttpHeaders;

  if (token) {
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  } else {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("No se encontró el token del usuario");
  }

  return this.http.get<any>(`${environment.url_api}/materias/?id=${idMateria}`, { headers });
}

public actualizarMateria(data: any): Observable<any> {
  const token = this.facadeService.getSessionToken();
  let headers: HttpHeaders;

  if (token) {
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  } else {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("No se encontró el token del usuario");
  }


  return this.http.put<any>(`${environment.url_api}/materias/`, data, { headers });


}

public eliminarMateria(idMateria: number): Observable<any> {
  // Verificamos si existe el token de sesión
  const token = this.facadeService.getSessionToken();
  let headers: HttpHeaders;

  if (token) {
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  } else {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  // Cambia la URL para materias
  return this.http.delete<any>(`${environment.url_api}/materias/?id=${idMateria}`, { headers });
}
}
