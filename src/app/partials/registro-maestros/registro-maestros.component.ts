import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MaestrosService } from '../../services/maestros.service';

@Component({
  selector: 'app-registro-maestros',
  templateUrl: './registro-maestros.component.html',
  styleUrls: ['./registro-maestros.component.scss']
})
export class RegistroMaestrosComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public maestro:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idUser: Number = 0;


  //Para el select
  public areas: any[] = [
    {value: '1', viewValue: 'Desarrollo Web'},
    {value: '2', viewValue: 'Programacion'},
    {value: '3', viewValue: 'Bases de datos'},
    {value: '4', viewValue: 'Redes'},
    {value: '5', viewValue: 'Matematicas'},
  ];

  public materias:any[] = [
    {value: '1', nombre: 'Aplicaciones Web'},
    {value: '2', nombre: 'Programacion 1'},
    {value: '3', nombre: 'Bases de datos'},
    {value: '4', nombre: 'Tecnologias Web'},
    {value: '5', nombre: 'Mineria de datos'},
    {value: '6', nombre: 'Desarrollo movil'},
    {value: '7', nombre: 'Estructuras de datos'},
    {value: '8', nombre: 'Administracion de redes'},
    {value: '9', nombre: 'Ingenieria de Software'},
    {value: '10', nombre: 'Administracion de S.O.'},
  ];

  constructor(
    private router: Router,
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private MaestrosService: MaestrosService
  ) { }

  ngOnInit(): void {

     this.maestro = this.MaestrosService.esquemamaestros();
    // Rol del usuario
    this.maestro.rol = this.rol;


    console.log("Datos maestro: ", this.maestro);
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
    this.errors = this.MaestrosService.validarmaestros(this.maestro, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    // Se verifica si las contraseñas coinciden
    if(this.maestro.password != this.maestro.confirmar_password){
      alert('Las contraseñas no coinciden');
      return false;
    }
    // Si pasa todas las validaciones se registra el alumno
    this.MaestrosService.registrarmaestro(this.maestro).subscribe({//es una promesa va a esperar 2 respuestas la de exito y la de error
      next: (response:any) => {
        //Aquí va la ejecución del servicio si todo es correcto
        alert('Maestro registrado con éxito');
        console.log("Maestro registrado",response);

        //Validar si se registro que entonces navegue en la vista de mestros
        if(this.token != ""){
          this.router.navigate(['maestro']);
        }else{
          this.router.navigate(['/']);
        }
      },
      error: (error:any) => {
        if(error.status === 422){
          this.errors = error.error.errors;
        } else {
          alert('Error al registrar el maestro');
        }
      }
    });
  }

  public actualizar(){

  }



  //Función para detectar el cambio de fecha
  public changeFecha(event :any){
    console.log(event);
    console.log(event.value.toISOString());

    this.maestro.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.maestro.fecha_nacimiento);
  }


  // Funciones para los checkbox
  public checkboxChange(event:any){
    console.log("Evento: ", event);
    if(event.checked){
      this.maestro.materias_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.maestro.materias_json.forEach((materia, i) => {
        if(materia == event.source.value){
          this.maestro.materias_json.splice(i,1)
        }
      });
    }
    console.log("Array materias: ", this.maestro);
  }

  public revisarSeleccion(nombre: string){
    if(this.maestro.materias_json){
      var busqueda = this.maestro.materias_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
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
