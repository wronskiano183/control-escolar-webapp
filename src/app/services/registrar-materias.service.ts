import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrarMateriasService {

  constructor() { }

   public esquemamaterias(){
    return {
      'rol':'',
      'nrc': '',
      'nombre': '',
      'seccion': '',
      'salon': '',
      'programa_educativo': '',
      'dias_json': [],


      // materias a impartir
      'Ing. en Cs. de la Computación': false,
      'Lic. en Cs. de la Computación': false,
      'Ing. en Tecnologías de la Inf.': false,

    }
  }
}
