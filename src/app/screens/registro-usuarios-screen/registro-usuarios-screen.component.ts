import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MatRadioChange } from '@angular/material/radio';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { MaestrosService } from '../../services/maestros.service';
import { AlumnosService } from '../../services/alumnos.service';

@Component({
  selector: 'app-registro-usuarios-screen',
  templateUrl: './registro-usuarios-screen.component.html',
  styleUrls: ['./registro-usuarios-screen.component.scss']
})
export class RegistroUsuariosScreenComponent implements OnInit {

  public tipo : string = "registro-usuarios";
  public user : any = {};
  public editar : boolean = false;
  public rol : string = "";
  public idUser : number = 0;

  //Banderas para el tipo de usuario
  public isAdmin:boolean = false;
  public isAlumno:boolean = false;
  public isMaestro:boolean = false;
  public isMaterias:boolean = false;

  public tipo_user:string = "";

  constructor(
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public facadeService: FacadeService,
    private administradoresService: AdministradoresService,
    private MaestrosService: MaestrosService,
    private AlumnosService: AlumnosService,
  ) { }

  ngOnInit(): void {
     this.user.tipo_usuario = '';
    //Obtener de la URL el rol para saber cual editar
    if(this.activatedRoute.snapshot.params['rol'] != undefined){
      this.rol = this.activatedRoute.snapshot.params['rol'];
      console.log("Rol detectado: ", this.rol);
    }

    //El if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
       console.log("ID User: ", this.editar);
      //Al iniciar la vista obtiene el usuario por su ID
      this.obtenerUserByID();
    }
    else{
      console.log("Es la primera ves que se va a regsitrar");//como sale entonces reutilizo el url que ya se habia craado em app routing

      if(this.rol == "administrador"){
        this.isAdmin = true;
        this.isAlumno = false;
        this.isMaestro = false;
        this.tipo_user = "administrador";
        this.user.tipo_usuario = "administrador";
      }else if (this.rol == "alumno"){
        this.isAdmin = false;
        this.isAlumno = true;
        this.isMaestro = false;
        this.tipo_user = "alumno";
        this.user.tipo_usuario = "alumno";
      }else if (this.rol == "maestro"){
        this.isAdmin = false;
        this.isAlumno = false;
        this.isMaestro = true;
        this.tipo_user = "maestro";
        this.user.tipo_usuario = "maestro";
      }else if (this.rol == "materias"){
          this.isAdmin = false;
          this.isAlumno = false;
          this.isMaestro = false;
          this.isMaterias = true;
          this.tipo_user = "materias";
          this.user.tipo_usuario = "materias";
        }


    }
  }

    //Obtener usuario por ID
  public obtenerUserByID() {
    //Lógica para obtener el usuario según su ID y rol
    console.log("Obteniendo usuario de tipo: ", this.rol, " con ID: ", this.idUser);
    //Aquí se haría la llamada al servicio correspondiente según el rol
    if(this.rol == "administrador"){
      this.administradoresService.obtenerAdminPorID(this.idUser).subscribe(
        (response) => {
          this.user = response;
          console.log("Usuario original obtenido: ", this.user);
          // Asignar datos, soportando respuesta plana o anidada
          this.user.first_name = response.user?.first_name || response.first_name;
          this.user.last_name = response.user?.last_name || response.last_name;
          this.user.email = response.user?.email || response.email;
          this.user.tipo_usuario = this.rol;
          this.isAdmin = true;
        }, (error) => {
          console.log("Error: ", error);
          alert("No se pudo obtener el administrador seleccionado");
        }
      );
    }else if(this.rol == "maestros"){

     this.MaestrosService.obtenerMaestroPorID(this.idUser).subscribe(
        (response) => {
          this.user = response;
          console.log("Usuario original obtenido: ", this.user);
          // Asignar datos, soportando respuesta plana o anidada
          this.user.first_name = response.user?.first_name || response.first_name;
          this.user.last_name = response.user?.last_name || response.last_name;
          this.user.email = response.user?.email || response.email;
          this.user.tipo_usuario = this.rol;
          this.isMaestro = true;
        }, (error) => {
          console.log("Error: ", error);
          alert("No se pudo obtener el administrador seleccionado");
        }
      );
    }else if(this.rol == "alumnos"){
       this.AlumnosService.obtenerAlumnoPorID(this.idUser).subscribe(
        (response) => {
          this.user = response;
          console.log("Usuario original obtenido: ", this.user);
          // Asignar datos, soportando respuesta plana o anidada
          this.user.first_name = response.user?.first_name || response.first_name;
          this.user.last_name = response.user?.last_name || response.last_name;
          this.user.email = response.user?.email || response.email;
          this.user.tipo_usuario = this.rol;
          this.isAlumno = true;
        }, (error) => {
          console.log("Error: ", error);
          alert("No se pudo obtener el Alumno seleccionado");
        }
      );
    }

  }


  public radioChange(event: MatRadioChange) {
    console.log(event);
  if(event.value == "administrador"){
    this.isAdmin = true;
    this.isAlumno = false;
    this.isMaestro = false;
    this.isMaterias = false;  // ← Asegurar que se desactiven los otros
    this.tipo_user = "administrador";
  }else if (event.value == "alumno"){
    this.isAdmin = false;
    this.isAlumno = true;
    this.isMaestro = false;
    this.isMaterias = false;
    this.tipo_user = "alumno";
  }else if (event.value == "maestro"){
    this.isAdmin = false;
    this.isAlumno = false;
    this.isMaestro = true;
    this.isMaterias = false;
    this.tipo_user = "maestro";
  }else if (event.value == "materias"){  // ← Cambiar a "materias" (plural)
    this.isAdmin = false;
    this.isAlumno = false;
    this.isMaestro = false;
    this.isMaterias = true;
    this.tipo_user = "materias";
  }
  }

  //Función para regresar a la pantalla anterior
  public goBack() {
    this.location.back();
  }


}
