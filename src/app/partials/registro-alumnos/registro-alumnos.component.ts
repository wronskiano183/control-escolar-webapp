import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlumnosService } from '../../services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { ActualizarUserModalComponent } from 'src/app/modals/actualizar-user-modal/actualizar-user-modal.component';

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
    private facadeService: FacadeService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
     //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.alumno = this.datos_user;
    }else{
      // Si no va a this.editar, entonces inicializamos el JSON para registro nuevo
      this.alumno = this.AlumnosService.esquemaalumno();
      this.alumno.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Alumno: ", this.alumno);
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


  public actualizar() {
     if (this.rol === 'administrador') {
  // Validación de los datos
  this.errors = {};
  this.errors = this.AlumnosService.validaralumno(this.alumno, this.editar);

  if (Object.keys(this.errors).length > 0) {
    console.log("Errores de validación:", this.errors);
    return false;
  }


      console.log("Tienes permisos para actualizar este Alumno.");
  const dialogRef = this.dialog.open(ActualizarUserModalComponent, {
    data: {
      id: this.alumno.id,
      rol: 'alumnos',
      nombre: this.alumno.first_name + ' ' + this.alumno.last_name,
      matricula: this.alumno.matricula,
      email: this.alumno.email,
      datos: this.alumno

    },
    height: '288px',
    width: '328px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.isactualizar) {
      // Si confirmó, ejecutar la actualización aquí
      this.AlumnosService.actualizarAlumno(this.alumno).subscribe(
        (response) => {
          alert("Alumno actualizado exitosamente");
          console.log("Alumno actualizado: ", response);
          this.router.navigate(["alumnos"]);
        },
        (error) => {
          alert("Error al actualizar Alumno");
          console.error("Error al actualizar Alumno: ", error);
        }
      );
    }
  });

  }else{
              alert("No tienes permisos para actualizar este alumno.");
            }
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
