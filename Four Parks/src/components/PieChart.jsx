import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';  // Esto importa las dependencias necesarias para Chart.js

/* eslint-disable react/prop-types */
const PieChart = ({ data }) => {
  // Extraemos las etiquetas (duracion_reserva) y los datos (cantidad_reservas) del array de datos
  const labels = data.map(entry => entry.duracion_reserva);
  const quantities = data.map(entry => entry.cantidad_reservas);

  // Datos para la gráfica de torta
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Cantidad de Reservas',
        data: quantities,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opciones para la gráfica de torta
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;
