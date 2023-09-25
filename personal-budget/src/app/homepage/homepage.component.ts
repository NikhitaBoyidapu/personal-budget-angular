import { AfterViewInit, Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements AfterViewInit {

  public dataSource : any = {
    datasets: [
        {
            data: [],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
            ]
        }
    ],
    labels: []
  };


  constructor(private http: HttpClient, private dataService: DataService){

   }

  ngAfterViewInit(): void {

    if (this.dataService.isEmpty()) {
      this.dataService.fetchData().subscribe((res: any) => {
        this.dataSource = {
          datasets: [
            {
              data: res.myBudget.map((item: any) => item.budget),
              backgroundColor: [
              '#ffcd56',
              '#ff6384',
              '#36a2eb',
              '#fd6b19'],
            },
          ],
          labels: res.myBudget.map((item: any) => item.title),
        };

        this.dataService.setData(this.dataSource);

        this.createChart();
        this.createD3JSChart();
      });
    } else {
      this.dataSource = this.dataService.getData();
      this.createChart();
      this.createD3JSChart();
    }
  }


  createChart() {
    var ctx = document.getElementById('myChart') as HTMLCanvasElement;
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
  }

  createD3JSChart() {
    const width = 400,
      height = 400,
      margin = 40;
    const radius = Math.min(width, height) / 2 - margin;
    const svg = d3.select("#newChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);
    const color = d3
      .scaleOrdinal()
      .domain(this.dataSource.labels)
      .range(d3.schemeDark2);

    const pie = d3
      .pie<any>() // Define the data type for pie
      .sort(null)
      .value((d) => d.data);

    const data_ready = pie(
      this.dataSource.datasets[0].data.map((data: any, index: string | number) => ({
        data: data,
        label: this.dataSource.labels[index],
      }))
    );

    const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius * 0.8);
    const outerArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

    svg
      .selectAll('allSlices')
      .data(data_ready)
      .join('path')
      .attr('d', (d: any) => (arc(d) as string))
      .attr('fill', (d) => String(color(d.data.label)))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.7);

    svg
      .selectAll('allPolylines')
      .data(data_ready)
      .join('polyline')
      .attr('stroke', 'black')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', function (d: any) {
        const posA = arc.centroid(d as any);
        const posB = outerArc.centroid(d as any);
        const posC = outerArc.centroid(d as any);
        const midangle = (d as any).startAngle + ((d as any).endAngle - (d as any).startAngle) / 2;

        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);

        // Convert the array of points to a string
        return [posA, posB, posC].map((point: [number, number]) => point.join(',')).join(' ');
      });


    svg
      .selectAll('allLabels')
      .data(data_ready)
      .join('text')
      .text((d) => d.data.label)
      .attr('transform', function (d) {
        const pos = outerArc.centroid(d as any);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', function (d) {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? 'start' : 'end';
      });
  }
}
