import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../redux/productSlice";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts";
import { AiOutlineCalendar } from "react-icons/ai";

const COLORS = [
  "#10B981",
  "#F59E42",
  "#6366F1",
  "#F43F5E",
  "#06B6D4",
  "#FBBF24",
  "#8B5CF6",
  "#F87171",
  "#38BDF8",
  "#A3E635",
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const { dashboard } = useSelector((state) => state.products);
  const { user } = useSelector(
    (state) => state.auth || { user: { role: "admin" } }
  ); // fallback for demo

  const [darkMode, setDarkMode] = useState(true);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [skuFilter, setSkuFilter] = useState("");
  const [visibleCharts, setVisibleCharts] = useState({
    area: true,
    scatter: true,
    donut: true,
  });
  const [selectedSku, setSelectedSku] = useState(null);

  // Refs for focusing the input when icon is clicked
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const filteredStockTrend = useMemo(() => {
    let data = dashboard.stockTrend || [];
    if (dateRange.from) {
      const [fromYear, fromMonth] = dateRange.from.split("-");
      data = data.filter(
        (item) =>
          item.year > +fromYear ||
          (item.year === +fromYear &&
            new Date(`${item.month} 1`).getMonth() + 1 >= +fromMonth)
      );
    }
    if (dateRange.to) {
      const [toYear, toMonth] = dateRange.to.split("-");
      data = data.filter(
        (item) =>
          item.year < +toYear ||
          (item.year === +toYear &&
            new Date(`${item.month} 1`).getMonth() + 1 <= +toMonth)
      );
    }
    if (skuFilter) {
      data = data.filter((item) =>
        item.sku.toLowerCase().includes(skuFilter.toLowerCase())
      );
    }
    return data;
  }, [dashboard.stockTrend, dateRange, skuFilter]);

  const lowStockProducts = useMemo(
    () =>
      (filteredStockTrend || []).filter(
        (item) => item.stock < 3 && item.availability === "In Stock"
      ),
    [filteredStockTrend]
  );

  const topSkus = useMemo(() => {
    const map = {};
    (filteredStockTrend || []).forEach((item) => {
      if (!map[item.sku]) map[item.sku] = { ...item };
      else map[item.sku].stock += item.stock;
    });
    return Object.values(map)
      .filter((item) => item.availability === "In Stock")
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 5);
  }, [filteredStockTrend]);

  const stockData = [
    { name: "In Stock", value: dashboard.inStock || 0 },
    { name: "Out of Stock", value: dashboard.outOfStock || 0 },
  ];

  const qualityDemandData = [
    { name: "Avg. Quality", value: dashboard.avgQuality || 0 },
    { name: "High Demand", value: dashboard.highDemand || 0 },
  ];

  const stockTrendData = useMemo(() => {
    const trend = {};
    let outOfStockcounter = 0,
      inStockCounter = 0;
    (filteredStockTrend || []).forEach((item) => {
      console.log("items from stockTrendData", item);
      const key = `${item.month} ${item.year}`;
      if (!trend[key]) {
        trend[key] = {
          month: key,
          inStockProducts: 0,
          inStock: 0,
          outOfStockProducts: 0,
        };
      }
      if (item.availability === "In Stock") {
        trend[key].inStockProducts = inStockCounter++;
        trend[key].inStock += item.stock;
      } else if (item.availability === "Out of Stock") {
        trend[key].outOfStockProducts = outOfStockcounter++;
      }
    });
    return Object.values(trend);
  }, [filteredStockTrend]);

  const skuTrendData = useMemo(() => {
    const trend = {};
    let latestMonth = "";
    let latestYear = 0;
    (filteredStockTrend || []).forEach((item) => {
      if (
        !latestMonth ||
        new Date(`${item.month} 1, ${item.year}`) >
          new Date(`${latestMonth} 1, ${latestYear}`)
      ) {
        latestMonth = item.month;
        latestYear = item.year;
      }
    });
    (filteredStockTrend || []).forEach((item) => {
      if (item.month === latestMonth && item.year === latestYear) {
        if (!trend[item.sku]) {
          trend[item.sku] = { sku: item.sku, stock: 0 };
        }
        trend[item.sku].stock += item.stock;
      }
    });
    return Object.values(trend);
  }, [filteredStockTrend]);

  const skuLineTrendData = useMemo(() => {
    const allSkus = Array.from(
      new Set((filteredStockTrend || []).map((item) => item.sku))
    );
    const allMonths = Array.from(
      new Set(
        (filteredStockTrend || []).map((item) => `${item.month} ${item.year}`)
      )
    );
    return allMonths.map((monthKey) => {
      const entry = { month: monthKey };
      allSkus.forEach((sku) => {
        entry[sku] = (filteredStockTrend || [])
          .filter(
            (item) =>
              `${item.month} ${item.year}` === monthKey && item.sku === sku
          )
          .reduce((sum, item) => sum + item.stock, 0);
      });
      return entry;
    });
  }, [filteredStockTrend]);

  const radarData = [
    { metric: "Quality", value: dashboard.avgQuality || 0 },
    { metric: "Demand", value: dashboard.highDemand || 0 },
    { metric: "Stock", value: dashboard.inStock || 0 },
  ];

  const getStockPercent = (stock, max = 20) =>
    Math.min(100, (stock / max) * 100);

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0e7490]"
          : "bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#fbbf24]"
      } min-h-screen p-6 font-semibold`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Enhancement 4: Dark/Light mode toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#10B981] to-[#F59E42] drop-shadow-lg tracking-wide">
            SmartCommerce Product Dashboard
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded bg-[#38BDF8] text-white font-bold shadow hover:bg-[#0ea5e9] transition"
            aria-label="Toggle dark/light mode"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Chart toggles */}
        <div
          className={`${
            darkMode ? "text-white" : "text-gray-800"
          } flex gap-4 mb-4`}
        >
          <label>
            <input
              type="checkbox"
              checked={visibleCharts.area}
              onChange={() =>
                setVisibleCharts((v) => ({ ...v, area: !v.area }))
              }
            />
            Area Chart
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleCharts.scatter}
              onChange={() =>
                setVisibleCharts((v) => ({ ...v, scatter: !v.scatter }))
              }
            />
            Scatter Chart
          </label>
          <label>
            <input
              type="checkbox"
              checked={visibleCharts.donut}
              onChange={() =>
                setVisibleCharts((v) => ({ ...v, donut: !v.donut }))
              }
            />
            Donut Chart
          </label>
        </div>

        {/* Enhancement 1: Filters with adaptive date picker icon */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* From Month Picker */}
          <div className="relative">
            <label
              className={`${darkMode ? "text-white" : "text-gray-800"} mr-2`}
            >
              From:
            </label>
            <input
              ref={fromInputRef}
              type="month"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              className={`rounded px-2 py-1 border pr-8 focus:outline-none transition
        ${
          darkMode
            ? "bg-[#232B3E] border-[#334155] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#38BDF8]"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#38BDF8]"
        }`}
              aria-label="From month"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
                backgroundImage: "none",
              }}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none p-0 m-0 cursor-pointer"
              onClick={() =>
                fromInputRef.current && fromInputRef.current.showPicker
                  ? fromInputRef.current.showPicker()
                  : fromInputRef.current.focus()
              }
              style={{ outline: "none" }}
            >
              <AiOutlineCalendar
                size={20}
                color={darkMode ? "#fff" : "#334155"}
              />
            </button>
          </div>
          {/* To Month Picker */}
          <div className="relative">
            <label
              className={`${darkMode ? "text-white" : "text-gray-800"} mr-2`}
            >
              To:
            </label>
            <input
              ref={toInputRef}
              type="month"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              className={`rounded px-2 py-1 border pr-8 focus:outline-none transition
        ${
          darkMode
            ? "bg-[#232B3E] border-[#334155] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#38BDF8]"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#38BDF8]"
        }`}
              aria-label="To month"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
                backgroundImage: "none",
              }}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none p-0 m-0 cursor-pointer"
              onClick={() =>
                toInputRef.current && toInputRef.current.showPicker
                  ? toInputRef.current.showPicker()
                  : toInputRef.current.focus()
              }
              style={{ outline: "none" }}
            >
              <AiOutlineCalendar
                size={20}
                color={darkMode ? "#fff" : "#334155"}
              />
            </button>
          </div>
          {/* SKU Filter */}
          <div>
            <label
              className={`${darkMode ? "text-white" : "text-gray-800"} mr-2`}
            >
              SKU:
            </label>
            <input
              type="text"
              placeholder="Filter by SKU"
              value={skuFilter}
              onChange={(e) => setSkuFilter(e.target.value)}
              className={`rounded px-2 py-1 border focus:outline-none transition
        ${
          darkMode
            ? "bg-[#232B3E] border-[#334155] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#38BDF8]"
            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#38BDF8]"
        }`}
              aria-label="SKU filter"
            />
          </div>
        </div>
        {/* Enhancement 2: Live Stock Alert */}
        {lowStockProducts.length > 0 && (
          <div
            className="mb-6 p-4 bg-red-600 text-white rounded shadow-lg"
            role="alert"
            aria-live="polite"
          >
            <strong>Alert:</strong> {lowStockProducts.length} products are low
            in stock!
          </div>
        )}

        {/* Enhancement 3: Top Products Table */}
        <div className="bg-[#232B3E] p-4 rounded-xl shadow-lg border border-[#334155] mb-8">
          <h2
            className="text-lg font-bold text-[#38BDF8] mb-2"
            aria-label="Top 5 In-Stock Products"
          >
            Top 5 In-Stock Products
          </h2>
          <table className="w-full text-white">
            <thead>
              <tr>
                <th className="text-left">SKU</th>
                <th className="text-left">Stock</th>
                <th className="text-left">Quality</th>
                <th className="text-left">Progress</th>
              </tr>
            </thead>
            <tbody>
              {topSkus.map((item) => (
                <tr key={item.sku}>
                  <td>{item.sku}</td>
                  <td>{item.stock}</td>
                  <td>{item.qualityScore}</td>
                  <td>
                    <div className="w-full bg-gray-700 rounded h-2 mt-2">
                      <div
                        className="bg-[#10B981] h-2 rounded"
                        style={{ width: `${getStockPercent(item.stock)}%` }}
                        aria-label={`Stock progress for ${item.sku}`}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div
            className="bg-gradient-to-br from-[#38BDF8] to-[#0ea5e9] p-6 shadow-2xl flex flex-col items-center border-2 border-[#06B6D4] rounded-2xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            aria-label="Total Products"
          >
            <span className="text-xl font-semibold text-white tracking-wide">
              Total Products
            </span>
            <span className="text-5xl font-extrabold text-white mt-2 drop-shadow">
              {dashboard.total || 0}
            </span>
          </div>
          <div
            className="bg-gradient-to-br from-[#10B981] to-[#22d3ee] p-6 shadow-2xl flex flex-col items-center border-2 border-[#34D399] rounded-2xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            aria-label="In Stock"
          >
            <span className="text-xl font-semibold text-white tracking-wide">
              In Stock
            </span>
            <span className="text-5xl font-extrabold text-white mt-2 drop-shadow">
              {dashboard.inStock || 0}
            </span>
          </div>
          <div
            className="bg-gradient-to-br from-[#F43F5E] to-[#F59E42] p-6 shadow-2xl flex flex-col items-center border-2 border-[#F87171] rounded-2xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            aria-label="Out of Stock"
          >
            <span className="text-xl font-semibold text-white tracking-wide">
              Out of Stock
            </span>
            <span className="text-5xl font-extrabold text-white mt-2 drop-shadow">
              {dashboard.outOfStock || 0}
            </span>
          </div>
          <div
            className="bg-gradient-to-br from-[#6366F1] to-[#A78BFA] p-6 shadow-2xl flex flex-col items-center border-2 border-[#8B5CF6] rounded-2xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
            aria-label="Avg. Quality"
          >
            <span className="text-xl font-semibold text-white tracking-wide">
              Avg. Quality
            </span>
            <span className="text-5xl font-extrabold text-white mt-2 drop-shadow">
              {dashboard.avgQuality || 0}%
            </span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Pie Chart for Stock */}
          <div
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border-2 border-[#06B6D4] flex flex-col items-center"
            aria-label="Stock Distribution Pie Chart"
          >
            <h2 className="text-xl font-bold text-[#38BDF8] mb-4 tracking-wide">
              Stock Distribution
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart role="img" aria-label="Stock Distribution">
                <Pie
                  data={stockData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stockData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart for Quality and Demand */}
          <div
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border-2 border-[#8B5CF6] flex flex-col items-center"
            aria-label="Quality and Demand Bar Chart"
          >
            <h2 className="text-xl font-bold text-[#A78BFA] mb-4 tracking-wide">
              Quality & Demand
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={qualityDemandData}
                role="img"
                aria-label="Quality and Demand"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#A78BFA" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#A78BFA" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Line Chart for Stock Trend */}
          <div
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border-2 border-[#FBBF24] flex flex-col items-center"
            aria-label="Stock Trend Line Chart"
          >
            <h2 className="text-xl font-bold text-[#FBBF24] mb-4 tracking-wide">
              Stock Trend (Monthly)
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={[...stockTrendData].sort(
                  (a, b) => new Date(a.month) - new Date(b.month)
                )}
                role="img"
                aria-label="Stock Trend"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#FBBF24" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="inStock"
                  stroke="#FBBF81"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="inStockProducts"
                  stroke="#10B981"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="outOfStockProducts"
                  stroke="#F43F5E"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Bar Chart for SKU (Latest Month) */}
          <div
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border-2 border-[#F87171] flex flex-col items-center mb-8"
            aria-label="Stock by SKU Bar Chart"
          >
            <h2 className="text-xl font-bold text-[#F87171] mb-4 tracking-wide">
              Stock by SKU Stock Trend (Latest Month)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={skuTrendData}
                role="img"
                aria-label="Stock by SKU"
                onClick={(data) =>
                  setSelectedSku(
                    data && data.activeLabel ? data.activeLabel : null
                  )
                }
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="sku"
                  stroke="#F87171"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stock" fill="#38BDF8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Radar Chart for Product Metrics */}
          <div
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border-2 border-[#6366F1] flex flex-col items-center"
            aria-label="Product Metrics Radar Chart"
          >
            <h2 className="text-xl font-bold text-[#6366F1] mb-4 tracking-wide">
              Product Metrics Radar
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart
                data={radarData}
                role="img"
                aria-label="Product Metrics Radar"
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" stroke="#6366F1" />
                <PolarRadiusAxis />
                <Radar
                  name="Metrics"
                  dataKey="value"
                  stroke="#38BDF8"
                  fill="#38BDF8"
                  fillOpacity={0.4}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          {/* SKU Stock Trend Line Chart */}
          <div
            className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border-2 border-[#10B981] flex flex-col items-center"
            aria-label="SKU Stock Trend Line Chart"
          >
            <h2 className="text-xl font-bold text-[#10B981] mb-4 tracking-wide">
              SKU Stock Trend (Monthly)
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={[...skuLineTrendData].sort(
                  (a, b) => new Date(a.month) - new Date(b.month)
                )}
                role="img"
                aria-label="SKU Stock Trend"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#10B981" />
                <YAxis />
                <Tooltip />
                <Legend />
                {(skuLineTrendData.length > 0
                  ? Object.keys(skuLineTrendData[0]).filter(
                      (k) => k !== "month"
                    )
                  : []
                ).map((sku, idx) => (
                  <Line
                    key={sku}
                    type="monotone"
                    dataKey={sku}
                    stroke={COLORS[idx % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Enhanced Data Visualization Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          {/* Area Chart */}
          {visibleCharts.area && (
            <div
              className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border-2 border-[#F59E42] flex flex-col items-center"
              aria-label="Sales Area Chart"
            >
              <h2 className="text-xl font-bold text-[#F59E42] mb-4 tracking-wide">
                Sales Trend (Area)
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={[...stockTrendData].sort(
                    (a, b) => new Date(a.month) - new Date(b.month)
                  )}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#F59E42" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="inStock"
                    stroke="#FBBF81"
                    fill="#FBBF81"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="inStockProducts"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                  />
                  <Area
                    type="monotone"
                    dataKey="outOfStockProducts"
                    stroke="#F43F5E"
                    fill="#F43F5E"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
          {/* Scatter Chart
          {visibleCharts.scatter && (
            <div
              className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border-2 border-[#A3E635] flex flex-col items-center"
              aria-label="Stock vs Quality Scatter Chart"
            >
              <h2 className="text-xl font-bold text-[#A3E635] mb-4 tracking-wide">
                Stock vs Quality (Scatter)
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis dataKey="stock" name="Stock" stroke="#A3E635" />
                  <YAxis dataKey="qualityScore" name="Quality" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Products" data={topSkus} fill="#A3E635" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )} */}
          {/* Donut Chart */}
          {visibleCharts.donut && (
            <div
              className="bg-[#1e293b] p-6 rounded-2xl shadow-xl border-2 border-[#06B6D4] flex flex-col items-center"
              aria-label="Stock Distribution Donut Chart"
            >
              <h2 className="text-xl font-bold text-[#06B6D4] mb-4 tracking-wide">
                Stock Distribution (Donut)
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stockData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    label
                  >
                    {stockData.map((entry, index) => (
                      <Cell
                        key={`cell-donut-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Drill-down Modal */}
        {selectedSku && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h3 className="font-bold mb-2 text-gray-800">
                Details for SKU: {selectedSku}
              </h3>
              {/* You can render more details here, for demo just show SKU */}
              <button
                onClick={() => setSelectedSku(null)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Enhancement 7: User Role Integration */}
        <div className="flex justify-between items-center">
          {user.role === "admin" && (
            <Link
              to="/admin"
              className="bg-gradient-to-r from-[#6366F1] via-[#38BDF8] to-[#10B981] hover:from-[#6366F1] hover:to-[#10B981] text-white font-bold px-8 py-3 rounded-2xl shadow-xl transition-all tracking-wide text-lg"
            >
              Admin Panel
            </Link>
          )}
          <Link
            to="/products"
            className="bg-gradient-to-r from-[#38BDF8] via-[#10B981] to-[#F59E42] hover:from-[#2563EB] hover:to-[#F59E42] text-white font-bold px-8 py-3 rounded-2xl shadow-xl transition-all tracking-wide text-lg"
          >
            Manage Products
          </Link>
        </div>
      </div>
    </div>
  );
}
