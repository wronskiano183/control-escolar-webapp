import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {

  //Variables
  public total_user: any = {};

  //Histograma
  lineChartData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: [89, 34, 43, 54, 28, 74, 93],
        label: 'Registro de materias',
        backgroundColor: '#F88406'
      }
    ]
  }
  lineChartOption = {
    responsive: false
  }
  lineChartPlugins = [DatalabelsPlugin];

  //Barras
  barChartData = {
    labels: ["Congreso", "FePro", "Presentación Doctoral", "Feria Matemáticas", "T-System"],
    datasets: [
      {
        data: [34, 43, 54, 28, 74],
        label: 'Eventos Académicos',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  }
  barChartOption = {
    responsive: false
  }
  barChartPlugins = [DatalabelsPlugin];

  //Circular
  pieChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  }
  pieChartOption = {
    responsive: false
  }
  pieChartPlugins = [DatalabelsPlugin];

  //Dona - Doughnut
  doughnutChartData = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  }
  doughnutChartOption = {
    responsive: false
  }
  doughnutChartPlugins = [DatalabelsPlugin];

  constructor(
    private administradoresServices: AdministradoresService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  // Función para obtener el total de usuarios registrados
  public obtenerTotalUsers(){
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response)=>{
        this.total_user = response;
        console.log("Total usuarios: ", this.total_user);

        // llamamos las nuevas graficas con los datos que recinimos de obtenerTotalUsers
        this.actualizarGraficas();

      }, (error)=>{
        console.log("Error al obtener total de usuarios ", error);
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

  private actualizarGraficas(){
    // creamos la grafixa con los nuevos datos
    this.pieChartData = {
      labels: ["Administradores", "Maestros", "Alumnos"],
      datasets: [
        {
          data: [
            this.total_user.admins,
            this.total_user.maestros,
            this.total_user.alumnos
          ],
          label: 'Registro de usuarios',
          backgroundColor: [
            '#FCFF44',
            '#F1C8F2',
            '#31E731'
          ]
        }
      ]
    };

    // creamos la grafixa con los nuevos datos
    this.doughnutChartData = {
      labels: ["Administradores", "Maestros", "Alumnos"],
      datasets: [
        {
          data: [
            this.total_user.admins,
            this.total_user.maestros,
            this.total_user.alumnos
          ],
          label: 'Registro de usuarios',
          backgroundColor: [
            '#F88406',
            '#FCFF44',
            '#31E7E7'
          ]
        }
      ]
    };

      //Barras
  this.barChartData = {
    labels: ["Congreso", "FePro", "Presentación Doctoral", "Feria Matemáticas", "T-System"],
    datasets: [
      {
        data: [this.total_user.admins,
            this.total_user.maestros,
            this.total_user.alumnos],
        label: 'Eventos Académicos',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  }
  }
}
