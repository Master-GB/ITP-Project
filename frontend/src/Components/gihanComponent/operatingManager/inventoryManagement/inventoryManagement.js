import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import axios from "axios";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './inventoryManagement.css';

const InventoryManagement = () => {
  const [donations, setDonations] = useState([]);
  const [allDonations, setAllDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'category', direction: 'asc' });
  const [pieChartInstance, setPieChartInstance] = useState(null);
  const [barChartInstance, setBarChartInstance] = useState(null);
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  const foodCategories = {
    Meat: ["Chicken", "Fish", "Pork", "Ambul Thiyal", "Mutton"],
    Rice: ["Fried Rice", "white Rice", "Biriyani", "Milk Rice", "Yellow Rice"],
    Baked: ["Egg Rolls", "Patties", "Kimbula Banis", "Paan", "Sausage Buns", "Fish Buns"],
    Desserts: ["Watalappan", "Ice cream", "Fruit Salad", "Cake"],
    Koththu: ["Koththu"],
    Noodles: ["Noodles"],
    Curry: ["Dhal Curry", "Soya Curry", "Manioc Curry", "Bonchi Curry", "Polos Curry", 
            "Kiri Kos Curry", "Batu Moju", "Ala Curry", "Kola Mallum", "Kaju Curry", 
            "Kehel Muwa Curry", "Mushroom Curry"]
  };

  const getLocation = (category, storageCondition) => {
    const base = storageCondition === 'refrigerated' ? 'WH-R' : 'WH-T';
    
    switch(category) {
      case 'Meat': return `${base}-1`;
      case 'Desserts': return `${base}-2`;
      case 'Rice': return 'WH-T-1';
      case 'Curry': return 'WH-T-2';
      case 'Noodles': return 'WH-T-3';
      case 'Koththu': return 'WH-T-4';
      case 'Baked': return 'WH-T-5';
      default: return base;
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await axios.get("http://localhost:8090/donations/display");
      setAllDonations(response.data.donations);
      
      const activeDonations = response.data.donations.filter(
        donation => ['Collected', 'Packaging'].includes(donation.status)
      );
      
      const donationMap = activeDonations.reduce((acc, donation) => {
        const key = `${donation.foodCategory}-${donation.foodItem || donation.foodCategory}`;
        if (!acc[key]) {
          acc[key] = {
            id: donation._id,
            category: donation.foodCategory,
            name: donation.foodItem || donation.foodCategory,
            quantityKg: donation.quantityUnit === 'kg' ? Number(donation.quantity) : 0,
            quantityUnit: donation.quantityUnit === 'unit' ? Number(donation.quantity) : 0,
            storageCondition: donation.storageCondition || 'room-temperature',
            status: donation.status,
            donationDate: donation.donationDate,
            expiryDate: donation.expiryDate
          };
        } else {
          if (donation.quantityUnit === 'kg') {
            acc[key].quantityKg += Number(donation.quantity);
          } else if (donation.quantityUnit === 'unit') {
            acc[key].quantityUnit += Number(donation.quantity);
          }
        }
        return acc;
      }, {});

      const allFoodItems = [];
      Object.entries(foodCategories).forEach(([category, items]) => {
        items.forEach(item => {
          const key = `${category}-${item}`;
          if (donationMap[key]) {
            allFoodItems.push({
              ...donationMap[key],
              name: item,
              location: getLocation(category, donationMap[key].storageCondition)
            });
          } else {
            allFoodItems.push({
              id: `${category}-${item}`,
              category,
              name: item,
              quantityKg: 0,
              quantityUnit: 0,
              storageCondition: category === 'Meat' || category === 'Desserts' ? 'refrigerated' : 'room-temperature',
              status: 'Not Available',
              location: 'N/A',
              donationDate: new Date().toISOString()
            });
          }
        });
      });

      setDonations(allFoodItems);
      setFilteredDonations(allFoodItems);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const calculateStockMetrics = () => {
    let totalPendingkg = 0;
    let totalPendingunit = 0;
    let totalRecentlykg = 0;
    let totalRecentlyunit = 0;
    let totalCancelykg = 0;
    let totalCancelunit = 0;
    let totalCompletedkg = 0;
    let totalCompletedunit = 0;
    let totalExpiredkg = 0;
    let totalExpiredunit = 0;
    let totalStockkg = 0;
    let totalStockunit = 0;

    const now = new Date();
    const twelveHoursLater = new Date(now.getTime() + 12 * 60 * 60 * 1000);

    for (let i = 0; i < allDonations.length; i++) {
      const donation = allDonations[i];
      const quantity = Number(donation.quantity);
      const unit = donation.quantityUnit;

      if (donation.status === "Collected" || donation.status === "Packaging") {
        if (unit === "kg") {
          totalStockkg += quantity;
        } else if (unit === "unit") {
          totalStockunit += quantity;
        }
      }

      if (donation.status === "Pending") {
        if (unit === "kg") {
          totalPendingkg += quantity;
        } else if (unit === "unit") {
          totalPendingunit += quantity;
        }
      }

      if (donation.status === "Collected") {
        if (unit === "kg") {
          totalRecentlykg += quantity;
        } else if (unit === "unit") {
          totalRecentlyunit += quantity;
        }
      }

      if (donation.status === "Cancel") {
        if (unit === "kg") {
          totalCancelykg += quantity;
        } else if (unit === "unit") {
          totalCancelunit += quantity;
        }
      }

      if (donation.status === "Completed" || donation.status === "Delivery") {
        if (unit === "kg") {
          totalCompletedkg += quantity;
        } else if (unit === "unit") {
          totalCompletedunit += quantity;
        }
      }

      if (donation.expiryDate) {
        const expiryDate = new Date(donation.expiryDate);
        if (expiryDate < twelveHoursLater && (donation.status === "Collected" || donation.status === "Packaging")) {
          if (unit === "kg") {
            totalExpiredkg += quantity;
          } else if (unit === "unit") {
            totalExpiredunit += quantity;
          }
        }
      }
    }

    return {
      totalStock: { kg: totalStockkg, units: totalStockunit },
      recentlyAdded: { kg: totalRecentlykg, units: totalRecentlyunit },
      pendingStock: { kg: totalPendingkg, units: totalPendingunit },
      completedStock: { kg: totalCompletedkg, units: totalCompletedunit },
      expiringSoon: { kg: totalExpiredkg, units: totalExpiredunit },
      expiredStock: { kg: totalCancelykg, units: totalCancelunit }
    };
  };

  const stockMetrics = calculateStockMetrics();

  useEffect(() => {
    let result = [...donations];
    
    if (searchTerm) {
      result = result.filter(donation => 
        donation.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === 'quantity') {
          const aTotal = a.quantityKg + a.quantityUnit;
          const bTotal = b.quantityKg + b.quantityUnit;
          return sortConfig.direction === 'asc' ? aTotal - bTotal : bTotal - aTotal;
        }
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredDonations(result);
  }, [donations, searchTerm, sortConfig]);

  const getCategoryStockData = () => {
    const categoryData = {};
    
    donations.forEach(donation => {
      const category = donation.category;
      const totalQuantity = donation.quantityKg + donation.quantityUnit;
      categoryData[category] = (categoryData[category] || 0) + totalQuantity;
    });

    return {
      labels: Object.keys(categoryData),
      datasets: [{
        label: 'Total Stock',
        data: Object.values(categoryData),
        backgroundColor: '#36A2EB',
        borderRadius: 4
      }]
    };
  };

  const getTopItemsData = () => {
    const itemsWithQuantity = donations.map(donation => ({
      name: donation.name,
      quantity: donation.quantityKg + donation.quantityUnit
    }));

    const topItems = [...itemsWithQuantity]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      labels: topItems.map(item => item.name),
      datasets: [{
        data: topItems.map(item => item.quantity),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ]
      }]
    };
  };

 
  useEffect(() => {
    if (donations.length > 0 && pieChartRef.current) {
      if (pieChartInstance) pieChartInstance.destroy();
      
      const pieCtx = pieChartRef.current.getContext('2d');
      const newPieChart = new Chart(pieCtx, {
        type: 'pie',
        data: getTopItemsData(),
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            }
          }
        }
      });
      setPieChartInstance(newPieChart);
    }

    return () => {
      if (pieChartInstance) pieChartInstance.destroy();
    };
  }, [donations]);

 
  useEffect(() => {
    if (donations.length > 0 && barChartRef.current) {
      if (barChartInstance) barChartInstance.destroy();
      
      const barCtx = barChartRef.current.getContext('2d');
      const newBarChart = new Chart(barCtx, {
        type: 'bar',
        data: getCategoryStockData(),
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Total Stock (kg + units)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Food Categories'
              }
            }
          }
        }
      });
      setBarChartInstance(newBarChart);
    }

    return () => {
      if (barChartInstance) barChartInstance.destroy();
    };
  }, [donations]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.text('Inventory Report', 14, 20);
    
    doc.autoTable({
      startY: 30,
      head: [['Category', 'Food Item', 'Quantity', 'Location']],
      body: filteredDonations.map(donation => [
        donation.category,
        donation.name,
        `${donation.quantityKg > 0 ? donation.quantityKg + ' kg' : ''}${donation.quantityKg > 0 && donation.quantityUnit > 0 ? ' + ' : ''}${donation.quantityUnit > 0 ? donation.quantityUnit + ' units' : ''}`,
        donation.location
      ]),
      theme: 'grid'
    });

    doc.save('inventory_report.pdf');
  };

  return (
    <div className="inventory-container">
      <div className="dashboard-cards">
        <div className="card total-stock">
          <h3>Total Stock</h3>
          <div className="quantity-display">
            <div className="quantity-item">
              <span className="value">{stockMetrics.totalStock.kg}</span>
              <span className="unit">kg</span>
            </div>
            <div className="quantity-item">
              <span className="value">{stockMetrics.totalStock.units}</span>
              <span className="unit">units</span>
            </div>
          </div>
        </div>

        <div className="card recently-added">
          <h3>Recently Added</h3>
          <div className="quantity-display">
            <div className="quantity-item">
              <span className="value">{stockMetrics.recentlyAdded.kg}</span>
              <span className="unit">kg</span>
            </div>
            <div className="quantity-item">
              <span className="value">{stockMetrics.recentlyAdded.units}</span>
              <span className="unit">units</span>
            </div>
          </div>
        </div>

        <div className="card pending-stock">
          <h3>Pending Stock</h3>
          <div className="quantity-display">
            <div className="quantity-item">
              <span className="value">{stockMetrics.pendingStock.kg}</span>
              <span className="unit">kg</span>
            </div>
            <div className="quantity-item">
              <span className="value">{stockMetrics.pendingStock.units}</span>
              <span className="unit">units</span>
            </div>
          </div>
        </div>

        <div className="card completed-stock">
          <h3>Completed</h3>
          <div className="quantity-display">
            <div className="quantity-item">
              <span className="value">{stockMetrics.completedStock.kg}</span>
              <span className="unit">kg</span>
            </div>
            <div className="quantity-item">
              <span className="value">{stockMetrics.completedStock.units}</span>
              <span className="unit">units</span>
            </div>
          </div>
        </div>

        <div className="card expiring-soon">
          <h3>Expiring Soon</h3>
          <div className="quantity-display">
            <div className="quantity-item">
              <span className="value">{stockMetrics.expiringSoon.kg}</span>
              <span className="unit">kg</span>
            </div>
            <div className="quantity-item">
              <span className="value">{stockMetrics.expiringSoon.units}</span>
              <span className="unit">units</span>
            </div>
          </div>
        </div>

        <div className="card expired-stock">
          <h3>Expired Stock</h3>
          <div className="quantity-display">
            <div className="quantity-item">
              <span className="value">{stockMetrics.expiredStock.kg}</span>
              <span className="unit">kg</span>
            </div>
            <div className="quantity-item">
              <span className="value">{stockMetrics.expiredStock.units}</span>
              <span className="unit">units</span>
            </div>
          </div>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by food category or item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={generatePDFReport} className="export-btn">
          Export PDF
        </button>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th 
                onClick={() => requestSort('category')}
                className={sortConfig.key === 'category' ? `sort-${sortConfig.direction}` : ''}
              >
                Food Category
                {sortConfig.key === 'category' && (
                  <span className={`sort-arrow ${sortConfig.direction}`}>
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => requestSort('name')}
                className={sortConfig.key === 'name' ? `sort-${sortConfig.direction}` : ''}
              >
                Food Item
                {sortConfig.key === 'name' && (
                  <span className={`sort-arrow ${sortConfig.direction}`}>
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                onClick={() => requestSort('quantity')}
                className={sortConfig.key === 'quantity' ? `sort-${sortConfig.direction}` : ''}
              >
                Quantity
                {sortConfig.key === 'quantity' && (
                  <span className={`sort-arrow ${sortConfig.direction}`}>
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map((donation) => (
              <tr key={donation.id} className={donation.status === 'Cancel' ? 'expired' : ''}>
                <td>{donation.category}</td>
                <td>{donation.name}</td>
                <td>
                  {donation.quantityKg > 0 && `${donation.quantityKg} kg`}
                  {donation.quantityKg > 0 && donation.quantityUnit > 0 && ' + '}
                  {donation.quantityUnit > 0 && `${donation.quantityUnit} units`}
                  {donation.quantityKg + donation.quantityUnit === 0 && '0'}
                </td>
                <td>{donation.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="analytics-section">
        <section className="chart-section">
          <h3>📊 Stock by Category</h3>
          <div className="chart-container">
            <canvas ref={barChartRef}></canvas>
          </div>
        </section>

        <section className="chart-section">
          <h3>🍽️ Top Items by Quantity</h3>
          <div className="chart-container">
            <canvas ref={pieChartRef}></canvas>
          </div>
        </section>
      </div>
    </div>
  );
};

export default InventoryManagement;