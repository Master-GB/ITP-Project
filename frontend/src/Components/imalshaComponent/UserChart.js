import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Number of Users',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Statistics',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8090/users');
        const users = response.data.users; // Updated to match the API response structure

        // Process the data for the chart
        const userCount = users.length;
        const activeUsers = users.filter(user => user.status === 'active').length;
        const inactiveUsers = users.filter(user => user.status === 'inactive').length;

        setChartData({
          labels: ['Total Users', 'Active Users', 'Inactive Users'],
          datasets: [
            {
              label: 'Number of Users',
              data: [userCount, activeUsers, inactiveUsers],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 99, 132, 0.6)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Set default data in case of error
        setChartData({
          labels: ['Total Users', 'Active Users', 'Inactive Users'],
          datasets: [
            {
              label: 'Number of Users',
              data: [0, 0, 0],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 99, 132, 0.6)',
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '80%', margin: '0 auto', padding: '20px' }}>
      <h2>User Statistics Chart</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default UserChart; 