import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';

@Injectable({
  providedIn: 'root'
})
export class FacadeService {

  constructor(
    private validatorService: ValidatorService,
    private errorsService: ErrorsService
  ) { }

  // Validación para el login
  public validarLogin(username: String, password: String) {
    let data = {
      "username": username,
      "password": password
    };

    console.log("Validar login: ", data);

    let errors: any = {};

    // Validaciones para el username
    if (!this.validatorService.required(data["username"])) {
      errors["username"] = this.errorsService.required;
    }else if (!this.validatorService.max(data["username"], 40)) {
      errors["username"] = this.errorsService.max(40);
    }else if (!this.validatorService.email(data["username"])) {
      errors['username'] = this.errorsService.email;
    }
    if (!this.validatorService.required(data["password"])) {
      errors["password"] = this.errorsService.required;
    }
    return errors;
  }

}
