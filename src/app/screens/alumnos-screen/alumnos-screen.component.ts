
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_alumnos: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['clave_alumno', 'nombre', 'email', 'fecha_nacimiento', 'telefono', 'curp', 'edad'];
  dataSource = new MatTableDataSource<DatosAlumno>(this.lista_alumnos as DatosAlumno[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    public facadeService: FacadeService,
    public alumnosService: AlumnosService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate(["/"]);
    }
    //Obtener alumnos
    this.obtenerAlumnos();

    if (this.rol === 'administrador') {
      this.displayedColumns = [...this.displayedColumns, 'editar','eliminar' , ];
    }
  }

   // es el para el filtering
    applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  // Consumimos el servicio para obtener los alumnos
  // Obtener alumnos
  public obtenerAlumnos() {
    this.alumnosService.obtenerListaAlumnos().subscribe( // Cambia el método del servicio
      (response) => {
        this.lista_alumnos = response;
        console.log("Lista alumnos: ", this.lista_alumnos);
        if (this.lista_alumnos.length > 0) {
          //Agregar datos del nombre e email
          this.lista_alumnos.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });
          console.log("Alumnos: ", this.lista_alumnos);

          //this.dataSource = new MatTableDataSource<DatosUsuario>(this.lista_maestros as DatosUsuario[]);
          // Actualizar datos sin crear nuevo dataSource
          this.dataSource.data = this.lista_alumnos;

          //  paginator
          setTimeout(() => {
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
            if (this.sort) {
            this.dataSource.sort = this.sort;
          }
          });
        }
      }, (error) => {
        console.error("Error al obtener la lista de alumnos: ", error);
        alert("No se pudo obtener la lista de alumnos");
      }
    );
  }

  public goEditar(idUser: number) {
    this.router.navigate(["registro-usuarios/alumnos/" + idUser]);

  }

  public delete(idUser: number) {
    // Se obtiene el ID del usuario en sesión, es decir, quien intenta eliminar
            const userIdSession = Number(this.facadeService.getUserId());
            // --------- Pero el parametro idUser (el de la función) es el ID del maestro que se quiere eliminar ---------
            // Administrador puede eliminar cualquier maestro
            // Maestro solo puede eliminar su propio registro
            if (this.rol === 'administrador' || (this.rol === 'alumnos' && userIdSession === idUser)) {
              //Si es administrador o es maestro, es decir, cumple la condición, se puede eliminar
              const dialogRef = this.dialog.open(EliminarUserModalComponent,{
                data: {id: idUser, rol: 'alumnos'}, //Se pasan valores a través del componente
                height: '288px',
                width: '328px',
              });

            dialogRef.afterClosed().subscribe(result => {
              if(result.isDelete){
                console.log("Alumno eliminado");
                alert("Alumno eliminado correctamente.");
                //Recargar página
                window.location.reload();
              }else{
                alert("Alumno no se ha podido eliminar.");
                console.log("No se eliminó el Alumno");
              }
            });
            }else{
              alert("No tienes permisos para eliminar este Alumno.");
            }

  }

}

//Esto va fuera de la llave que cierra la clase
export interface DatosAlumno {
  id: number,
  clave_alumno: string;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string,
  telefono: string,
  curp: string,
  edad: number,

}
