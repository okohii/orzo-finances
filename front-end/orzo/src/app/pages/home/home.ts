import { Component } from '@angular/core';
import { GeneralGraphic, GraphicData, GraphicConfig } from '../../components/graphics/general-graphic/general-graphic';

@Component({
  selector: 'app-home',
  imports: [GeneralGraphic],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // Transaction data for bar chart
  transactionData: GraphicData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Transações',
      data: [12, 19, 3, 5, 2, 3]
    }]
  };

  // Expense data for pie chart
  expenseData: GraphicData = {
    labels: ['Alimentação', 'Transporte', 'Lazer', 'Contas', 'Outros'],
    datasets: [{
      label: 'Despesas',
      data: [300, 150, 200, 400, 100]
    }]
  };

  // Revenue data for line chart
  revenueData: GraphicData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Receitas',
      data: [1000, 1200, 900, 1400, 1100, 1300]
    }]
  };

  // Chart configurations
  barChartConfig: GraphicConfig = {
    type: 'bar',
    title: 'Transações Mensais',
    responsive: true,
    maintainAspectRatio: false,
    showLegend: true,
    showTooltips: true
  };

  pieChartConfig: GraphicConfig = {
    type: 'pie',
    title: 'Distribuição de Despesas',
    responsive: true,
    maintainAspectRatio: false,
    showLegend: true,
    showTooltips: true
  };

  lineChartConfig: GraphicConfig = {
    type: 'line',
    title: 'Receitas ao Longo do Tempo',
    responsive: true,
    maintainAspectRatio: false,
    showLegend: true,
    showTooltips: true
  };
}
