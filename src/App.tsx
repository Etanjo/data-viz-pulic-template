import { useEffect, useState } from "react";
import papa from "papaparse";
import "./App.css";
import {
  DeerDataRow,
  PieDataRow,
  BarDataRow,
  clearList,
  rainList,
  fogList,
  snowList,
} from "./types";
import {
  LineChart,
  PieChart,
  Pie,
  Cell,
  LabelList,
  BarChart,
  Bar,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Legend,
} from "recharts";

const App = () => {
  const [csvData, setCsvData] = useState<DeerDataRow[]>([]);
  const [pieData, setPieData] = useState<PieDataRow[]>([]);
  const [barData, setBarData] = useState<BarDataRow[]>([]);
  const [graphData, setGraphData] = useState<GraphDataRow[]>([]);

  const csvFileUrl = "/data/Deer Crashes.csv"; // FIX ME

  const getData = async () => {
    let response = await fetch(csvFileUrl);
    let text = await response.text();
    let parsed = await papa.parse<DeerDataRow>(text, { header: true });
    console.log("Successfully parsed data:", parsed); // Log to make it easy to inspect shape of our data in the inspector
    setCsvData(parsed.data.filter((row) => row["Weather Conditions"])); // Only keep rows that have a name, so we avoid blank row at end of file
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let barData = {
      Clear: 0,
      Rainy: 0,
      Foggy: 0,
      Snowy: 0,
    };

    csvData.forEach((row) => {
      if (clearList.includes(row["Weather Conditions"])) {
        barData.Clear += 1;
      } else if (rainList.includes(row["Weather Conditions"])) {
        barData.Rainy += 1;
      } else if (fogList.includes(row["Weather Conditions"])) {
        barData.Foggy += 1;
      } else if (snowList.includes(row["Weather Conditions"])) {
        barData.Snowy += 1;
      }
    });
    barData.Clear = barData.Clear / 1960;
    barData.Rainy = barData.Rainy / 648;
    barData.Foggy = barData.Foggy / 136;
    barData.Snowy = barData.Snowy / 184;
    let newBarData: BarDataRow[] = [];
    for (let key in barData) {
      newBarData.push({
        name: key,
        // @ts-ignore
        crashes: barData[key],
      });
    }
    console.log("Updated data for bar chart", newBarData);
    setBarData(newBarData);
  }, [csvData]);

  function timeStringToHour(timeString: string): number {
    const [hour, minute, ampm] = timeString.split(/[: ]/g);
    let timeNum = Number(hour);
    if (ampm == "AM") {
      if (timeNum == 12) {
        timeNum = 0;
      }
    } else if (ampm == "PM") {
      if (timeNum != 12) {
        timeNum += 12;
      }
    }
    return timeNum;
  }
  console.log("1:56 PM to 24 hour time:", timeStringToHour("1:56 PM"));
  return (
    <main style={{ maxWidth: 800, margin: "auto" }}>
      <h1>Hello Data Visualization</h1>
      <p>Loaded {csvData.length} rows of CSV Data!</p>
      <h2>Risk of Certain Weather Conditions</h2>
      <BarChart width={730} height={250} data={barData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="crashes" fill="#42033D" />
      </BarChart>
    </main>
  );
};

export default App;
