import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlumnosService } from '../../services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss']
})
export class RegistroAlumnosComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};



  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public alumno:any= {};
  public token: string = "";
  public errors:any={};
  public editar:boolean = false;
  public idUser: Number = 0;


  constructor(
    private router: Router,
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private AlumnosService: AlumnosService,
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {
     this.alumno = this.AlumnosService.esquemaalumno();
    // Rol del usuario
    this.alumno.rol = this.rol;

    console.log("Datos alumno: ", this.alumno);
  }

   //Funciones para password
  showPassword()
  {
    if(this.inputType_1 == 'password'){
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else{
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar()
  {
    if(this.inputType_2 == 'password'){
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else{
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  public regresar(){
    this.location.back();
  }

 public registrar(){
    // Validaciones del formulario
    this.errors = {};
    this.errors = this.AlumnosService.validaralumno(this.alumno, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    // Se verifica si las contraseñas coinciden
    if(this.alumno.password != this.alumno.confirmar_password){
      alert('Las contraseñas no coinciden');
      return false;
    }
    // Si pasa todas las validaciones se registra el alumno
    this.AlumnosService.registrarAlumno(this.alumno).subscribe({//es una promesa va a esperar 2 respuestas la de exito y la de error
      next: (response:any) => {
        //Aquí va la ejecución del servicio si todo es correcto
        alert('Alumno registrado con éxito');
        console.log("Alumno registrado",response);

        //Validar si se registro que entonces navegue en la vista de alumnos
        if(this.token != ""){
          this.router.navigate(['alumnos']);
        }else{
          this.router.navigate(['/']);
        }
      },
      error: (error:any) => {
        if(error.status === 422){
          this.errors = error.error.errors;
        } else {
          alert('Error al registrar el alumno');
        }
      }
    });
  }


  public actualizar(){
    // Lógica para actualizar los datos de un alumno existente
  }



  //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.alumno.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.alumno.fecha_nacimiento);
  }

   public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }
  public solonumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);

    if (
      !(charCode >= 48 && charCode <= 57) && // solo numeros
      charCode !== 47
    ) {
      event.preventDefault();
    }
  }

   public numero_letras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);

    if (
      !(charCode >= 48 && charCode <= 57) && // solo numeros
      !(charCode >= 65 && charCode <= 90)   // Letras mayúsculas

    ) {
      event.preventDefault();
    }
  }
}
