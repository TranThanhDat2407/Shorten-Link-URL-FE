import {ChangeDetectorRef, Component, ElementRef, inject, NgZone, OnInit, ViewChild} from '@angular/core';
import {AdminAnalyzeService} from '../../../core/services/admin-analyze';
import {AdminDailyClickResponse} from '../../../common/models/response/daily-click-response';
import {AdminDashboardResponse} from '../../../common/models/response/admin-dashboard-response';
import {Chart, registerables, ChartConfiguration} from 'chart.js';
import 'chartjs-adapter-luxon';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {AdminDailyLinkResponse} from '../../../common/models/response/daily-link-response';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class AdminDashboardComponent implements OnInit {
private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  @ViewChild('clicksChart') clicksChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('linksChart') linksChartRef!: ElementRef<HTMLCanvasElement>;

  dashboardData: AdminDashboardResponse = {
    totalLinks: 0,
    totalClicksAllTime: 0,
    todayClicks: 0,
    todayNewLinks: 0
  };
  chartData: AdminDailyClickResponse[] = [];
  chartLinkData: AdminDailyLinkResponse[] = [];
  isLoading = true;

  constructor(private adminAnalyzeService: AdminAnalyzeService) {}

  ngOnInit(): void {
    this.fetchDashboardData();
    this.fetchChartData();
    this.fetchChartLinkData();
  }

  private fetchDashboardData(): void {
    this.adminAnalyzeService.getDashboard().subscribe({
      next: (data: AdminDashboardResponse) => {
        this.dashboardData = data;
        this.checkLoading();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.checkLoading();
      }
    });
  }

  private fetchChartData(): void {
    this.adminAnalyzeService.getChartData().subscribe({
      next: (data: AdminDailyClickResponse[]) => {

          this.chartData = data;
          this.initChart();
          this.checkLoading();
          this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Failed to load chart data', err);
        this.checkLoading();
      }
    });
  }


  private fetchChartLinkData(): void {
    this.adminAnalyzeService.getChartLinkData().subscribe({
      next: (data: AdminDailyLinkResponse[]) => {

        this.chartLinkData = data;
        this.initLinksChart()
        this.cdr.detectChanges();
        this.checkLoading();

      },
      error: (err) => {
        console.error('Failed to load chart data', err);
        this.checkLoading();
      }
    });
  }

  private initChart(): void {
    if (!this.clicksChartRef || this.chartData.length === 0) {
      return;
    }

    const maxClickValue = Math.max
    (...this.chartData.map(item => item.clicks));

    const ctx = this.clicksChartRef.nativeElement;

    // 1. Định dạng dữ liệu
    const chartDataFormatted = this.chartData.map(item => ({
      x: new Date(item.date).getTime(),
      y: item.clicks
    }));

    const suggestedMaxY = maxClickValue * 1.2;

    // 2. Định nghĩa cấu hình với kiểu dữ liệu rõ ràng (ChartConfiguration)
    const chartConfig: ChartConfiguration<'line'> = { // ⭐️ Sử dụng kiểu đã import
      type: 'line',

      data: {
        datasets: [{
          label: 'Clicks',
          data: chartDataFormatted,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.4
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (context: any) => {
                return new Date(context[0].parsed.x).toLocaleDateString('vi-VN', {
                  day: '2-digit', month: '2-digit', year: 'numeric'
                });
              }
            }
          },

          datalabels: {
            align: 'end', // Vị trí hiển thị (trên/dưới/bên cạnh)
            anchor: 'end', // Vị trí neo (ở cuối của điểm)
            color: '#495057', // Màu chữ
            font: {
              weight: 'bold',
              size: 10
            },
            formatter: (value, context) => {
              // Định dạng giá trị hiển thị (chỉ hiển thị số clicks)
              // value là đối tượng {x: timestamp, y: clicks}
              return value.y;
            }
          },},


        scales: {
          x: {
            type: 'timeseries' as const,
            time: {
              unit: 'day',
              tooltipFormat: 'dd/MM/yyyy',
              displayFormats: {
                day: 'dd/MM'
              }
            },
            adapters: {
              date: { locale: 'vi-VN' }
            },
            ticks: { autoSkip: true, maxRotation: 0, minRotation: 0 }
          },
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Clicks' },
            ticks: { precision: 0 },

            suggestedMax: suggestedMaxY
          }
        }
      }
    };

    // 3. Khởi tạo biểu đồ
    new Chart(ctx, chartConfig);
  }


  private initLinksChart(): void {
    if (!this.linksChartRef || this.chartLinkData.length === 0) {
      return;
    }

    const maxLinksValue = Math.max(...this.chartLinkData.map(x => x.links));

    const ctx = this.linksChartRef.nativeElement;

    const chartDataFormatted = this.chartLinkData.map(item => ({
      x: new Date(item.date).getTime(),
      y: item.links
    }));

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        datasets: [{
          label: 'New Links',
          data: chartDataFormatted,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          datalabels: {
            align: 'end',
            anchor: 'end',
            color: '#6c757d',
            font: { size: 10, weight: 'bold' },
            formatter: v => v.y
          }
        },
        scales: {
          x: {
            type: 'timeseries',
            time: {
              unit: 'day',
              displayFormats: { day: 'dd/MM' }
            }
          },
          y: {
            beginAtZero: true,
            suggestedMax: maxLinksValue * 1.2,
            ticks: { precision: 0 },
            title: { display: true, text: 'Links' }
          }
        }
      }
    };

    new Chart(ctx, config);
  }



  private checkLoading(): void {
    if (this.dashboardData.totalLinks !== 0 || this.chartData.length > 0) {
      this.isLoading = false;
    }
  }
}
