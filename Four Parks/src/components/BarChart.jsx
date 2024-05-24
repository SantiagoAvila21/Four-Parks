import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

/* eslint-disable react/prop-types */
const BarChart = ({ data }) => {
    console.log(data)
    // Normalizamos las fechas y extraemos los datos necesarios
    const formattedData = data.map(entry => ({
      ...entry,
      fecha: new Date(entry.fecha).toLocaleDateString(),
    }));
  
    // Extraemos las etiquetas (fechas) y los datos (cantidad_reservas) del array normalizado
    const labels = formattedData.map(entry => entry.fecha);
    const quantities = formattedData.map(entry => entry.cantidad_reservas);
  
    // Datos para la gráfica
    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Cantidad de Reservas',
          data: quantities,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
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
  
    return <Bar data={chartData} options={options} />;
};

export default BarChart;