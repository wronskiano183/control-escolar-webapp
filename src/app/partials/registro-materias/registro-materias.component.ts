import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';
import { RegistrarMateriasService } from '../../services/registrar-materias.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { ActualizarUserModalComponent } from 'src/app/modals/actualizar-user-modal/actualizar-user-modal.component';


@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit {

  @Input() rol: string = "";
  @Input() datos_user: string = "";



  // Agrega esta propiedad 'errors' si no existe

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
    {value: '1', viewValue: 'Ingenieria en Ciencias de la Computacion'},
    {value: '2', viewValue: 'Licenciatura en Ciencias de la Computacion'},
    {value: '3', viewValue: 'Ingenieria en Tecnologias de la Informacion'},

  ];

  //Para el select
  public profesors: any[] = [];

  public dias: any[] = [
  {value: '1', nombre: 'Lunes'},
  {value: '2', nombre: 'Martes'},
  {value: '3', nombre: 'Miercoles'},
  {value: '4', nombre: 'Jueves'},
  {value: '5', nombre: 'Viernes'},
  {value: '6', nombre: 'Sabado'},
];


  constructor(
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private router: Router,
    private RegistrarMateriasService: RegistrarMateriasService,
    private maestrosService: MaestrosService,
    public dialog: MatDialog,

  ){

  }

  ngOnInit(): void{


    this.cargarProfesores();
    console.log("Profesores: ", this.profesors);

     //El primer if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;



      console.log("ID User: ", this.idUser);
      //Al iniciar la vista asignamos los datos del user
      this.materias = this.datos_user;
        }else{

      // Si no va a this.editar, entonces inicializamos el JSON para registro nuevo
       this.materias = this.RegistrarMateriasService.esquemamaterias();
       // Asegurar que dias es un array

    if (!this.materias.programa_educativo) {
  this.materias.programa_educativo = '';
}
          if (this.materias.hora_inicio) {
        this.materias.hora_inicio = this.materias.hora_inicio;
      }
      if (this.materias.hora_final) {
        this.materias.hora_final = this.materias.hora_final;
      }

      this.materias.dias_json = [...this.materias.dias];  // copia el array de la API





      this.materias.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    }
    //Imprimir datos en consola
    console.log("Maestro: ", this.materias);


  }

  public cargarProfesores() {  //para cargar los maestros reutilizar¿mos la funcion del servicio de maestros que ya tenemos
  this.maestrosService.obtenerListaMaestros().subscribe({ // y reutilizamos el servidcio obtenerListaMaestros
    next: (response) => {
      console.log("Maestros cargados:", response);

      // mapear los datos reciviods
      this.profesors = response.map((m: any) => ({ //hacemos la llamada al servicio y transformasos el array a un response cada elemento
        value: m.id.toString(), // Usar el ID del maestrs
        viewValue: `${m.user.first_name} ${m.user.last_name}`
      }));

      console.log("Profesores mapeados: ", this.profesors);
    },
    error: (error) => {
      console.error("Error cargando profesores", error);

    }
  });
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
    this.errors = this.RegistrarMateriasService.validarMaterias (this.materias, this.editar);
    if(Object.keys(this.errors).length > 0){
      return false;
    }
    //convertir las horas a formato 24 horas para que lo leea el backend
     const dataEnviar = {
    ...this.materias,
    hora_inicio: this.convertirHora12a24(this.materias.hora_inicio),
    hora_final: this.convertirHora12a24(this.materias.hora_final)
  };

  console.log("Enviando:", dataEnviar);//que datos vamos a enviar

    // Si pasa todas las validaciones se registra la materia
    this.RegistrarMateriasService.registrarMateria(dataEnviar).subscribe({ //es una promesa va a esperar 2 respuestas la de exito y la de error
      next: (response:any) => {
        //Aquí va la ejecución del servicio si todo es correcto
        alert('Materia registrada con éxito');
        console.log("Materia registrada", response);

        //Validar si se registro que entonces navegue en la vista de materias
        if(this.token != ""){
          this.router.navigate(['materias']);
        }else{
          this.router.navigate(['/']);
        }
      },
      error: (error:any) => {
       // ERROR ESPECÍFICO DE NRC DUPLICADO
    if (error.status === 400 && error.error?.nrc) {
      const mensajeError = Array.isArray(error.error.nrc)
        ? error.error.nrc[0]
        : error.error.nrc;

      // error por si el nrc ya esta registrdo
      alert(`Error: El NRC ${this.materias.nrc} ya está registrado en el sistema.\n\nPor favor, usa un NRC diferente.`);

      // También poner el error en el formulario
      this.errors.nrc = "Este NRC ya existe";
    }
    // Mantienes tu manejo actual para error 422
    else if(error.status === 422){
      this.errors = error.error.errors;
    }
    // Error genérico para otros casos
    else {
      alert('Error al registrar la materia');
    }
  }
});
}

  public actualizar() {

  this.errors = {};
  this.errors = this.RegistrarMateriasService.validarMaterias(this.materias, this.editar);

  if (Object.keys(this.errors).length > 0) {
    console.log("Errores de validación:", this.errors);
    return false;
  }

  // Preparar datos para enviar
  const dataEnviar = {
    ...this.materias,
    hora_inicio: this.convertirHora12a24(this.materias.hora_inicio),
    hora_final: this.convertirHora12a24(this.materias.hora_final)
  };

  console.log("Datos preparados para actualizar:", dataEnviar);

  // Mostrar modal de confirmación ANTES de actualizar
  this.mostrarModalConfirmacion(dataEnviar);
}

private mostrarModalConfirmacion(dataEnviar: any) {
  console.log("Mostrando modal de confirmación...");

  const dialogRef = this.dialog.open(ActualizarUserModalComponent, {
    data: {
      id: this.idUser,
      rol: 'materias',
      nombre: this.materias.nombre_materia,
      nrc: this.materias.nrc,
      datos: dataEnviar
    },
    height: '288px',
    width: '328px',
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log("Resultado del modal:", result);

    if (result && result.isactualizar) {
      console.log("se ejecuta laactualización");
      this.ejecutarActualizacion(dataEnviar);
    } else {
      console.log("se cancela la actualización");
    }
  });
}

private ejecutarActualizacion(dataEnviar: any) {
  console.log("actualizando");

  this.RegistrarMateriasService.actualizarMateria(dataEnviar).subscribe(
    (response) => {
      alert("Materia actualizada con éxito");
      console.log("Materia actualizada: ", response);
      this.router.navigate(['materias']);
    },
    (error) => {
      console.error("Error al actualizar la materia", error);
      alert("Error al actualizar la Materia");
    }
  );
}
  // metodos para las horas
  changeHoraInicio(hora: string): void {
    console.log('Hora inicio cambiada:', hora);
    this.materias.hora_inicio = hora; // guardamos las horas en el arry materas

    this.validarHoras();
  }

  changeHoraFinal(hora: string): void {
    console.log('Hora final cambiada:', hora);
    this.materias.hora_final = hora; // guardamos las horas en el arry materas


    this.validarHoras();
  }

    private validarHoras(): void {
    // Limpiar errores previos para reutilizar
    this.errors.hora_inicio = '';
    this.errors.hora_final = '';

    // Validar que la hora final sea mayor que la hora inicial
    if (this.materias.hora_inicio && this.materias.hora_final) {
      const inicio = this.convertirHora12a24(this.materias.hora_inicio);
      const final = this.convertirHora12a24(this.materias.hora_final);

      if (inicio && final && inicio >= final) {
        this.errors.hora_final = 'La hora final debe ser mayor que la hora inicial';
      }
    }
  }

  public convertirHora12a24(hora12: string): string {
    if (!hora12) return '';

    const [time, modifier] = hora12.split(' ');
    if (!time || !modifier) return hora12;

    let [hours, minutes] = time.split(':').map(Number);

    if (modifier.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
    }
    if (modifier.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
    }

    const horasStr = hours.toString().padStart(2, '0');
    const minutosStr = minutes.toString().padStart(2, '0');

    return `${horasStr}:${minutosStr}`;
}

public convertirHora24a12(hora24: string): string {
    if (!hora24) return '';

    const [hours, minutes] = hora24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    let adjustedHours = hours % 12 || 12; // convertir 0 -> 12

    const horasStr = adjustedHours.toString().padStart(2, '0');
    const minutosStr = minutes.toString().padStart(2, '0');

    return `${horasStr}:${minutosStr} ${ampm}`;
}



// Funciones para los checkbox
  public checkboxChange(event:any){
    console.log("Evento: ", event);
    if(event.checked){
     this.materias.dias.push(event.source.value);
    }else{
      console.log(event.source.value);
      this.materias.dias.forEach((materia, i) => {
        if(materia == event.source.value){
          this.materias.dias.splice(i,1)
        }
      });
    }
    console.log("Array materias: ", this.materias);
  }

 public revisarSeleccion(nombre: string){
  if(this.materias.dias){
    var busqueda = this.materias.dias.find((element)=>element==nombre);
    if(busqueda != undefined){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}

public revisarSeleccionprofesor(nombre: string){
  if(this.materias.profesors){
    var busqueda = this.materias.profesors.find((element)=>element==nombre);
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
      !(charCode >= 65 && charCode <= 90) && // Letras mayúsculas
      !(charCode >= 97 && charCode <= 112) &&// letrras minusculas
       charCode !== 32// espacio
    ) {
      event.preventDefault();
    }
  }
}

