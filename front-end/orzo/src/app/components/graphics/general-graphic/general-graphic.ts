import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js/auto';
import { ThemeService } from '../../../services/theme.service';

export interface GraphicData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[] | CanvasGradient;
    borderColor?: string | string[];
    borderWidth?: number;
    tension?: number;
    pointBackgroundColor?: string;
    pointBorderColor?: string;
    pointBorderWidth?: number;
    pointRadius?: number;
    pointHoverRadius?: number;
    [key: string]: any; // Allow additional Chart.js properties
  }[];
}

export interface GraphicConfig {
  type: ChartType;
  title?: string;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  showLegend?: boolean;
  showTooltips?: boolean;
}

@Component({
  selector: 'app-general-graphic',
  imports: [],
  templateUrl: './general-graphic.html',
  styleUrl: './general-graphic.css'
})
export class GeneralGraphic implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  @Input() data: GraphicData = {
    labels: [],
    datasets: []
  };
  
  @Input() config: GraphicConfig = {
    type: 'bar',
    responsive: true,
    maintainAspectRatio: false,
    showLegend: true,
    showTooltips: true
  };

  private chart: Chart | null = null;
  private themeColors = {
    light: {
      primary: '#8c5e3c',
      accent: '#a6c48a',
      text: '#3b322c',
      background: '#fdfcf9',
      muted: '#e6e0d4',
      border: '#d9c8b4',
      gradients: {
        primary: ['#8c5e3c', '#a67c52'],
        accent: ['#a6c48a', '#8fb86f'],
        chart: ['#a6c48a', '#8c5e3c', '#e6e0d4', '#d9c8b4']
      }
    },
    dark: {
      primary: '#ff2d95',
      accent: '#00ffc6',
      text: '#e0e0f0',
      background: '#0e0e1b',
      muted: '#1c1c2b',
      border: '#31314f',
      gradients: {
        primary: ['#ff2d95', '#ff6bb3'],
        accent: ['#00ffc6', '#4dffd9'],
        chart: ['#ff2d95', '#00ffc6', '#7c3aed', '#3b82f6']
      }
    }
  };

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Configura cores baseadas no tema atual
    this.updateColorsForCurrentTheme();
  }

  ngAfterViewInit(): void {
    this.createChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private updateColorsForCurrentTheme(): void {
    const currentTheme = this.themeService.getTheme();
    const colors = this.themeColors[currentTheme];
    
    this.data.datasets.forEach((dataset, index) => {
      if (!dataset.backgroundColor) {
        if (this.config.type === 'pie' || this.config.type === 'doughnut') {
          dataset.backgroundColor = this.generateModernColorPalette(colors, this.data.labels.length);
        } else if (this.config.type === 'line') {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, this.hexToRgba(colors.accent, 0.8));
          gradient.addColorStop(1, this.hexToRgba(colors.accent, 0.1));
          dataset.backgroundColor = gradient;
          dataset.borderColor = colors.accent;
          dataset.borderWidth = 3;
          dataset.tension = 0.4;
          dataset.pointBackgroundColor = colors.accent;
          dataset.pointBorderColor = colors.background;
          dataset.pointBorderWidth = 3;
          dataset.pointRadius = 6;
          dataset.pointHoverRadius = 8;
        } else {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, this.hexToRgba(colors.primary, 0.8));
          gradient.addColorStop(1, this.hexToRgba(colors.accent, 0.6));
          dataset.backgroundColor = gradient;
          dataset.borderColor = colors.primary;
        }
      }
      
      if (dataset.borderWidth === undefined) {
        dataset.borderWidth = this.config.type === 'line' ? 3 : 0;
      }
    });
  }

  private generateModernColorPalette(colors: any, count: number): string[] {
    const baseColors = colors.gradients.chart;
    const palette: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const colorIndex = i % baseColors.length;
      const opacity = 0.9 - (Math.floor(i / baseColors.length) * 0.15);
      palette.push(this.hexToRgba(baseColors[colorIndex], Math.max(opacity, 0.5)));
    }
    
    return palette;
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  private createChart(): void {
    if (!this.chartCanvas) return;

    const currentTheme = this.themeService.getTheme();
    const colors = this.themeColors[currentTheme];

    const chartConfig: ChartConfiguration = {
      type: this.config.type,
      data: this.data,
      options: {
        responsive: this.config.responsive,
        maintainAspectRatio: this.config.maintainAspectRatio,
        layout: {
          padding: {
            top: 20,
            bottom: 20,
            left: 10,
            right: 10
          }
        },
        elements: {
          bar: {
            borderRadius: 8,
            borderSkipped: false,
          },
          point: {
            radius: 6,
            hoverRadius: 8,
            borderWidth: 3,
            backgroundColor: colors.accent,
            borderColor: colors.background
          }
        },
        plugins: {
          title: {
            display: !!this.config.title,
            text: this.config.title,
            color: colors.text,
            font: {
              family: 'Sen, sans-serif',
              size: 18,
              weight: 600
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          legend: {
            display: this.config.showLegend,
            position: 'bottom',
            labels: {
              color: colors.text,
              font: {
                family: 'Sen, sans-serif',
                size: 12,
                weight: 500
              },
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            enabled: this.config.showTooltips,
            backgroundColor: colors.background,
            titleColor: colors.text,
            bodyColor: colors.text,
            borderColor: colors.border,
            borderWidth: 1,
            cornerRadius: 12,
            titleFont: {
              family: 'Sen, sans-serif',
              weight: 600
            },
            bodyFont: {
              family: 'Sen, sans-serif'
            },
            padding: 12,
            displayColors: true,
            boxPadding: 6
          }
        },
        scales: this.getModernScalesConfig(colors),
        interaction: {
          intersect: false,
          mode: 'index'
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      }
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, chartConfig);
  }

  private getModernScalesConfig(colors: any): any {
    if (this.config.type === 'pie' || this.config.type === 'doughnut') {
      return {};
    }

    return {
      x: {
        ticks: {
          color: colors.text,
          font: {
            family: 'Sen, sans-serif',
            size: 11,
            weight: 500
          },
          padding: 10
        },
        grid: {
          color: this.hexToRgba(colors.border, 0.3),
          lineWidth: 1,
          drawBorder: false
        },
        border: {
          display: false
        }
      },
      y: {
        ticks: {
          color: colors.text,
          font: {
            family: 'Sen, sans-serif',
            size: 11,
            weight: 500
          },
          padding: 10
        },
        grid: {
          color: this.hexToRgba(colors.border, 0.3),
          lineWidth: 1,
          drawBorder: false
        },
        border: {
          display: false
        }
      }
    };
  }

  public updateChart(newData: GraphicData): void {
    if (this.chart) {
      this.data = newData;
      this.updateColorsForCurrentTheme();
      this.chart.data = this.data;
      this.chart.update();
    }
  }

  public updateTheme(): void {
    if (this.chart) {
      this.chart.destroy();
      this.createChart();
    }
  }
}
