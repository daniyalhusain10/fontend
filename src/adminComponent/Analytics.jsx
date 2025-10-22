// src/pages/Analytics.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaDollarSign, FaChartLine, FaExclamationTriangle } from "react-icons/fa";
import { Line, Bar } from 'react-chartjs-2';
import LoadingScreen from "../components/LoadingScreen.jsx"; 

import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  BarElement,
} from 'chart.js';
import  Sidebar  from "../adminComponent/Sidebar"

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  BarElement
);

const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

// --- MOCK DATA GENERATOR (Kept the same logic) ---
const generateMockMetrics = (orders) => {
    // ... (logic remains the same)
    const monthlyData = {};
    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    sortedOrders.forEach(order => {
        const date = new Date(order.createdAt);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { sales: 0, orders: 0 };
        }
        monthlyData[monthKey].sales += order.totalAmount || 0;
        monthlyData[monthKey].orders += 1;
    });

    const labels = Object.keys(monthlyData);
    const salesData = labels.map(key => monthlyData[key].sales);
    const orderData = labels.map(key => monthlyData[key].orders);

    return {
        labels,
        salesData,
        orderData,
    };
};
// -----------------------------------------------------------------------------------

const Analytics = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({ labels: [], salesData: [], orderData: [] });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/show-orders`); 
      
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        setMetrics(generateMockMetrics(data.orders));
      } else {
        setError("Failed to fetch order data.");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching data from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Main Metrics
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  // --- Chart Configurations (Updated for Indigo and Green-400) ---
  const DARK_THEME_COLOR = '#b3b3b3'; // Light gray for text
  const INDIGO_ACCENT = 'rgb(79, 70, 229)'; // Tailwind indigo-600 (Primary Action/Highlight)
  const GREEN_ACCENT = 'rgb(74, 222, 128)'; // Tailwind green-400 (Success/Revenue Highlight)
  const AMBER_CONTRAST = 'rgb(251, 191, 36)'; // Tailwind Amber 400 (Secondary Contrast)

  // Line Chart (Sales) will use the primary GREEN_ACCENT
  const lineChartData = {
    labels: metrics.labels,
    datasets: [
      {
        label: 'Monthly Sales (Rs)',
        data: metrics.salesData,
        borderColor: GREEN_ACCENT,
        backgroundColor: 'rgba(74, 222, 128, 0.3)', // Lighter fill
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: GREEN_ACCENT,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: DARK_THEME_COLOR } },
      title: { display: true, text: 'Sales Trend Over Time', color: DARK_THEME_COLOR },
      tooltip: { bodyColor: '#000', titleColor: GREEN_ACCENT, backgroundColor: '#fff' }
    },
    scales: {
        y: {
            beginAtZero: true,
            title: { display: true, text: 'Revenue (Rs)', color: DARK_THEME_COLOR },
            grid: { color: 'rgba(255, 255, 255, 0.15)' },
            ticks: { color: DARK_THEME_COLOR }
        },
        x: {
            title: { display: true, text: 'Month', color: DARK_THEME_COLOR },
            grid: { color: 'rgba(255, 255, 255, 0.15)' },
            ticks: { color: DARK_THEME_COLOR }
        }
    }
  };

  // Bar Chart (Orders) will use the secondary INDIGO_ACCENT
  const barChartData = {
    labels: metrics.labels,
    datasets: [
      {
        label: 'Number of Orders',
        data: metrics.orderData,
        backgroundColor: 'rgba(79, 70, 229, 0.8)', 
        borderColor: INDIGO_ACCENT,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: DARK_THEME_COLOR } },
      title: { display: true, text: 'Order Count per Month', color: DARK_THEME_COLOR },
      tooltip: { bodyColor: '#000', titleColor: INDIGO_ACCENT, backgroundColor: '#fff' }
    },
    scales: {
        y: {
            beginAtZero: true,
            title: { display: true, text: 'Orders', color: DARK_THEME_COLOR },
            ticks: { stepSize: 1, color: DARK_THEME_COLOR },
            grid: { color: 'rgba(255, 255, 255, 0.15)' },
        },
        x: {
            title: { display: true, text: 'Month', color: DARK_THEME_COLOR },
            grid: { color: 'rgba(255, 255, 255, 0.15)' },
            ticks: { color: DARK_THEME_COLOR }
        }
    }
  };

  // ------------------------------------------------------------------
  // --- Loading State UI ---
  // ------------------------------------------------------------------
  if (loading)
    return (
     <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
         <LoadingScreen message="Loading Dashboard..." />
      </div>
    );

  // ------------------------------------------------------------------
  // --- Error State UI ---
  // ------------------------------------------------------------------
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-gray-900 p-6">
        <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
        <h2 className="text-2xl font-extrabold text-white mb-2">
          Data Stream Interrupted
        </h2>
        <p className="text-gray-400 max-w-sm text-center">
          {error} Verify the backend URL and API endpoint status.
        </p>
      </div>
    );
  
  // ------------------------------------------------------------------
  // --- Main Dashboard UI (Enhanced Black/Indigo/Green Theme) ---
  // ------------------------------------------------------------------
  return (
    <div className="flex">
        <Sidebar />
        <div className="w-full">
             <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white border-b-4 border-indigo-600 inline-block mb-10 pb-1 tracking-wide">
        Dashboard 🚀
      </h1>
      
      {/* --- Key Metrics Cards (Indigo for action, Green for Revenue) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        
        {/* Total Orders (Indigo Accent) */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-l-4 border-indigo-600 transition-all hover:shadow-indigo-500/50 hover:scale-[1.02] hover:ring-4 hover:ring-indigo-700/50 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Orders</p>
              <p className="text-4xl font-extrabold text-white mt-1 animate-pulse">{totalOrders}</p>
            </div>
            <FaShoppingCart className="text-indigo-600 text-5xl opacity-40" />
          </div>
        </div>

        {/* Total Sales (Green-400 Accent for Success/Revenue) */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-l-4 border-green-400 transition-all hover:shadow-green-500/50 hover:scale-[1.02] hover:ring-4 hover:ring-green-700/50 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</p>
              <p className="text-4xl font-extrabold text-green-400 mt-1">
                Rs {totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <FaDollarSign className="text-green-400 text-5xl opacity-40" />
          </div>
        </div>
        
        {/* Average Order Value (AOV) (Indigo Accent) */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border-l-4 border-indigo-600 transition-all hover:shadow-indigo-500/50 hover:scale-[1.02] hover:ring-4 hover:ring-indigo-700/50 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Avg. Order Value (AOV)</p>
              <p className="text-4xl font-extrabold text-white mt-1">
                Rs {totalOrders > 0 ? (totalSales / totalOrders).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}
              </p>
            </div>
            <FaChartLine className="text-indigo-600 text-5xl opacity-40" />
          </div>
        </div>

      </div>

      {/* --- Charts Section (Using Green for Sales Chart, Indigo for Order Chart) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Sales Trend Chart (Green Line) */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl transition-shadow duration-300 hover:shadow-green-500/50 hover:ring-4 hover:ring-green-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Monthly Revenue Flow</h2>
          <div className="h-80">
            {metrics.labels.length > 0 ? (
                <Line data={lineChartData} options={lineChartOptions} />
            ) : (
                <p className="text-center text-gray-500 pt-10">Historical sales data unavailable.</p>
            )}
          </div>
        </div>
        
        {/* Monthly Order Count Chart (Indigo Bars) */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl transition-shadow duration-300 hover:shadow-indigo-500/50 hover:ring-4 hover:ring-indigo-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Transaction Volume</h2>
          <div className="h-80">
            {metrics.labels.length > 0 ? (
                <Bar data={barChartData} options={barChartOptions} />
            ) : (
                <p className="text-center text-gray-500 pt-10">Historical order volume data unavailable.</p>
            )}
          </div>
        </div>
        
      </div>
    </div>
        </div>
    </div>
   
  );
};

export default Analytics;