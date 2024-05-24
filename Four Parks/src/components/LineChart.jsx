import { Line } from 'react-chartjs-2';
import 'chart.js/auto';  // Esto importa las dependencias necesarias para Chart.js

/* eslint-disable react/prop-types */
const LineChart = ({ data }) => {
  // Normalizamos las fechas y extraemos los datos necesarios
  const formattedData = data.map(entry => ({
    ...entry,
    fechaEntradaReserva: "Reserva del " + new Date(entry.fechaEntradaReserva).toLocaleDateString(),
  }));

  // Extraemos las etiquetas (fechas) y los datos (duracion_horas) del array normalizado
  const labels = formattedData.map(entry => entry.fechaEntradaReserva);
  const durations = formattedData.map(entry => entry.duracion_horas);

  // Datos para la gráfica
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Duración de Reservas (horas)',
        data: durations,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        lineTension: 0.1,
      },
    ],
  };

  // Opciones para la gráfica
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Configuramos los ticks para que solo muestren valores enteros
          callback: function(value) {
            return Number.isInteger(value) ? value : null;
          },
          stepSize: 1,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;