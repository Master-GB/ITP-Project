import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const FeedbackChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
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
        text: 'Feedback Statistics',
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8090/feedbacks');
        const feedbacks = response.data.feedbacks;

        // Count feedbacks by rating
        const ratingCounts = {
          'Excellent': 0,
          'Good': 0,
          'Average': 0,
          'Poor': 0,
          'Very Poor': 0
        };

        feedbacks.forEach(feedback => {
          const rating = feedback.rating;
          if (rating >= 4.5) ratingCounts['Excellent']++;
          else if (rating >= 3.5) ratingCounts['Good']++;
          else if (rating >= 2.5) ratingCounts['Average']++;
          else if (rating >= 1.5) ratingCounts['Poor']++;
          else ratingCounts['Very Poor']++;
        });

        setChartData({
          labels: Object.keys(ratingCounts),
          datasets: [
            {
              data: Object.values(ratingCounts),
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
              ],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching feedback data:', error);
        // Set default data in case of error
        setChartData({
          labels: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor'],
          datasets: [
            {
              data: [0, 0, 0, 0, 0],
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
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
      <h2>Feedback Rating Distribution</h2>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default FeedbackChart; 