import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { FacadeService } from 'src/app/services/facade.service';
import { RegistrarMateriasService } from 'src/app/services/registrar-materias.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-screen-materias',
  templateUrl: './screen-materias.component.html',
  styleUrls: ['./screen-materias.component.scss']
})
export class ScreenMateriasComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_materias: any[] = [];
  public lista_profesores: any[] = [];

  // Para la tabla
  displayedColumns: string[] = ['nrc', 'nombre_materia', 'seccion', 'dias', 'hora_inicio', 'hora_final', 'salon', 'programa_educativo', 'profesor', 'creditos'];
  dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    public facadeService: FacadeService,
    public materiasService: RegistrarMateriasService,
    public maestrosService: MaestrosService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerProfesores();//funcio de optenre prosefres

    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    // Validar que haya inicio de sesión
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);

    if(this.token == "") {
      this.router.navigate(["/"]);
    }

    // Ajustar columnas según rol para evitar que in maestro elimine o modifique sus materias
    if (this.rol === 'administrador') {
      this.displayedColumns = [...this.displayedColumns, 'editar','eliminar' , ];
    }

    // Obtener materias y profesores


  }

  // Filtro de búsqueda
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Obtener lista de profesores para mostrar nombres
  public obtenerProfesores() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_profesores = response;
           this.obtenerMaterias(); //aqui para que de tiempo de cargar los maestros y no este el el arreglo vacio
        console.log("Lista profesores para materias: ", this.lista_profesores);
      },
      (error) => {
        console.error("Error al obtener profesores: ", error);
      }
    );
  }

  // Obtener lista de materias
  public obtenerMaterias() {
    // Necesitarás crear este método en tu servicio
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        this.lista_materias = response;
        console.log("Lista materias: ", this.lista_materias);

        if (this.lista_materias.length > 0) {
          // Procesar datos para mostrar
          this.procesarMaterias();

          // Actualizar dataSource
          this.dataSource.data = this.lista_materias;

          // Configurar paginator y sort
          setTimeout(() => {
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
            if (this.sort) {
              this.dataSource.sort = this.sort;
            }
          });
        }
      },
      (error) => {
        console.error("Error al obtener la lista de materias: ", error);
        alert("No se pudo obtener la lista de materias");
      }
    );
  }



  // Procesar datos de materias
  private procesarMaterias() {
    this.lista_materias.forEach(materia => {
    // Buscar el profesor por su ID
    const profesorEncontrado = this.lista_profesores.find(
      profesor => profesor.id == materia.profesor_asignado
    );

    // Si encontramos al profesor, poner su nombre
    if (profesorEncontrado && profesorEncontrado.user) {
      materia.profesor = profesorEncontrado.user.first_name + ' ' + profesorEncontrado.user.last_name;
    }
    // Si no encontramos, poner el ID
    else if (materia.profesor_asignado) {
      materia.profesor = 'ID: ' + materia.profesor_asignado;
    }
    // Si no hay profesor
    else {
      materia.profesor = 'No asignado';
    }

  });
}

  // Formatear días para mostrar
  public getDiasFormateados(dias: any[]): string {
    if (!dias || dias.length === 0) return '-';

    // Si es array de strings
    if (typeof dias[0] === 'string') {
      return dias.join(', ');
    }

    // Si es array de objetos o JSON
    return dias.map(dia => {
      if (typeof dia === 'object' && dia.nombre) {
        return dia.nombre;
      }
      return dia;
    }).join(', ');
  }

  // Formatear hora
  public formatHora(hora: string): string {
    if (!hora) return '-';

    // Si ya está en formato 12h, dejarlo igual
    if (hora.includes('AM') || hora.includes('PM')) {
      return hora;
    }

    // Si está en formato 24h, convertir a 12h
    try {
      const [horas, minutos] = hora.split(':').map(Number);
      const ampm = horas >= 12 ? 'PM' : 'AM';
      const horas12 = horas % 12 || 12;
      return `${horas12}:${minutos.toString().padStart(2, '0')} ${ampm}`;
    } catch (e) {
      return hora;
    }
  }

  // Ir a editar materia
  public goEditar(idMateria: number) {
    this.router.navigate(["registro-usuarios/materias/" + idMateria]);
  }

  // Ir a registrar nueva materia
  public goRegistrar() {
    this.router.navigate(["registro-usuarios/materias"]);
  }

  // Eliminar materia
  public delete(idMateria: number) {
    // Solo administradores pueden eliminar
    if (this.rol === 'administrador') {
      const dialogRef = this.dialog.open(EliminarUserModalComponent, {
        data: { id: idMateria, rol: 'materias' },
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isDelete) {
          console.log("Materia eliminada");
          alert("Materia eliminada correctamente.");
          // Recargar página
          window.location.reload();
        } else {
          console.log("No se eliminó la materia");
        }
      });
    } else {
      alert("No tienes permisos para eliminar materias.");
    }
  }
}

// Interface para las materias
export interface DatosMateria {
  id: number;
  nrc: string;
  nombre_materia: string;
  seccion: string;
  dias: any[];
  hora_inicio: string;
  hora_final: string;
  salon: string;
  programa_educativo: string;
  profesor_asignado: number;
  profesor_nombre?: string;
  creditos: number;
  creation: string;
  update: string;
}
