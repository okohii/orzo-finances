import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js/auto';
import { ThemeService } from '../../../services/theme.service';

export interface GraphicData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
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
      border: '#d9c8b4'
    },
    dark: {
      primary: '#ff2d95',
      accent: '#00ffc6',
      text: '#e0e0f0',
      background: '#0e0e1b',
      muted: '#1c1c2b',
      border: '#31314f'
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
    
    // Atualiza as cores dos datasets se não foram definidas
    this.data.datasets.forEach((dataset, index) => {
      if (!dataset.backgroundColor) {
        if (this.config.type === 'pie' || this.config.type === 'doughnut') {
          // Para gráficos de pizza, usa cores diferentes para cada segmento
          dataset.backgroundColor = this.generateColorPalette(colors, this.data.labels.length);
        } else {
          // Para outros tipos, usa a cor principal com transparência
          dataset.backgroundColor = this.hexToRgba(colors.accent, 0.7);
        }
      }
      
      if (!dataset.borderColor) {
        dataset.borderColor = colors.primary;
      }
      
      if (dataset.borderWidth === undefined) {
        dataset.borderWidth = 2;
      }
    });
  }

  private generateColorPalette(colors: any, count: number): string[] {
    const baseColors = [
      colors.primary,
      colors.accent,
      colors.border,
      colors.muted
    ];
    
    const palette: string[] = [];
    for (let i = 0; i < count; i++) {
      const colorIndex = i % baseColors.length;
      const opacity = 0.8 - (Math.floor(i / baseColors.length) * 0.2);
      palette.push(this.hexToRgba(baseColors[colorIndex], Math.max(opacity, 0.3)));
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
        plugins: {
          title: {
            display: !!this.config.title,
            text: this.config.title,
            color: colors.text,
            font: {
              family: 'Sen, sans-serif',
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: this.config.showLegend,
            labels: {
              color: colors.text,
              font: {
                family: 'Sen, sans-serif'
              }
            }
          },
          tooltip: {
            enabled: this.config.showTooltips,
            backgroundColor: colors.background,
            titleColor: colors.text,
            bodyColor: colors.text,
            borderColor: colors.border,
            borderWidth: 1
          }
        },
        scales: this.getScalesConfig(colors)
      }
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, chartConfig);
  }

  private getScalesConfig(colors: any): any {
    if (this.config.type === 'pie' || this.config.type === 'doughnut') {
      return {};
    }

    return {
      x: {
        ticks: {
          color: colors.text,
          font: {
            family: 'Sen, sans-serif'
          }
        },
        grid: {
          color: colors.border
        }
      },
      y: {
        ticks: {
          color: colors.text,
          font: {
            family: 'Sen, sans-serif'
          }
        },
        grid: {
          color: colors.border
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
