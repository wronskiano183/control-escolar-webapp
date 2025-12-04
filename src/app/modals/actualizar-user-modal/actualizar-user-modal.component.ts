import { Component, Inject, OnInit } from '@angular/core';
import { RegistrarMateriasService } from '../../services/registrar-materias.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { EliminarUserModalComponent } from '../eliminar-user-modal/eliminar-user-modal.component';


@Component({
  selector: 'app-actualizar-user-modal',
  templateUrl: './actualizar-user-modal.component.html',
  styleUrls: ['./actualizar-user-modal.component.scss']
})
export class ActualizarUserModalComponent implements OnInit {

  public rol: string = "";

  constructor(
        private administradoresService: AdministradoresService,
        private registrarMateriasService: RegistrarMateriasService,
        private maestrosService: MaestrosService,
        private alumnosService: AlumnosService,
        private dialogRef: MatDialogRef<EliminarUserModalComponent>,
        @Inject (MAT_DIALOG_DATA) public data: any

  ){

  }
ngOnInit(): void {
    this.rol = this.data.rol;
  }

  public cerrar_modal(){
    this.dialogRef.close({isactualizar:false});
  }

 public ActualizarUser() {
  if (this.rol == "administrador") {
    console.log("Datos del administrador a actualizar:", this.data);

    this.administradoresService.actualizarAdmin(this.data.datos).subscribe(
      (response) => {
        console.log("Respuesta del servidor:", response);
        this.dialogRef.close({ isactualizar: true });
      },
      (error) => {
        console.error("Error al actualizar administrador:", error);
        this.dialogRef.close({ isactualizar: false });
      }
    );
  } else if(this.rol == "maestro") {
  console.log("Datos del maestro a actualizar:", this.data);

  this.maestrosService.actualizarMaestro(this.data.datos).subscribe(
    (response) => {
      console.log("Respuesta del servidor:", response);
      this.dialogRef.close({ isactualizar: true });
    },
    (error) => {
      console.error("Error al actualizar maestro:", error);
      this.dialogRef.close({ isactualizar: false });
    }
  );
}else if (this.rol == "alumnos") {

    console.log("Datos del alumno a actualizar:", this.data);

    this.alumnosService.actualizarAlumno(this.data.datos).subscribe(
      (response) => {
        console.log("Respuesta del servidor:", response);
        this.dialogRef.close({ isactualizar: true });
      },
      (error) => {
        console.error("Error al actualizar alumno:", error);
        this.dialogRef.close({ isactualizar: false });
      }
    );
  } else if (this.rol == "materias") {
    console.log("Confirmando actualización de materia:", this.data);
    this.dialogRef.close({ isactualizar: true });
  }
}

}

