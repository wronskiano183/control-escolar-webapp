import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';
import { RegistrarMateriasService } from '../../services/registrar-materias.service';

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: string = "";

   //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public materias:any = {};
  public errors:any = {};
  public editar:boolean = false;
  public token: string = "";
  public idUser: Number = 0;

  //Para el select
  public areas: any[] = [
    {value: '1', viewValue: 'Ing. en Cs. de la Computación'},
    {value: '2', viewValue: 'Lic. en Cs. de la Computación'},
    {value: '3', viewValue: 'Ing. en Tecnologías de la Inf.'},

  ];

  public dias: any[] = [
  {value: '1', nombre: 'Lunes'},
  {value: '2', nombre: 'Martes'},
  {value: '3', nombre: 'Miércoles'},
  {value: '4', nombre: 'Jueves'},
  {value: '5', nombre: 'Viernes'},
  {value: '6', nombre: 'Sábado'},
];


  constructor(
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private router: Router,
    private RegistrarMateriasService: RegistrarMateriasService

  ){

  }

  ngOnInit(): void{

     //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.materias = this.datos_user;
    }else{
      // Si no va a this.editar, entonces inicializamos el JSON para registro nuevo
       this.materias = this.RegistrarMateriasService.esquemamaterias();
      this.materias.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Maestro: ", this.materias);


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

  }

  public actualizar(){

  }



// Funciones para los checkbox
  public checkboxChange(event:any){
    console.log("Evento: ", event);
    if(event.checked){
     this.materias.dias_json.push(event.source.value);
    }else{
      console.log(event.source.value);
      this.materias.dias_json.forEach((materia, i) => {
        if(materia == event.source.value){
          this.materias.dias_json.splice(i,1)
        }
      });
    }
    console.log("Array materias: ", this.materias);
  }

 public revisarSeleccion(nombre: string){
  if(this.materias.dias_json){ // Cambiar de programa_educativo a dias_json
    var busqueda = this.materias.dias_json.find((element)=>element==nombre);
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

