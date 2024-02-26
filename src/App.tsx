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
import { PieChart, Pie, Cell, LabelList, BarChart, Bar } from "recharts";

const App = () => {
  const [csvData, setCsvData] = useState<DeerDataRow[]>([]);
  const [pieData, setPieData] = useState<PieDataRow[]>([]);
  const [barData, setBarData] = useState<BarDataRow[]>([]);

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
    let newBarData: BarDataRow[] = [];
    for (let key in barData) {
      newBarData.push({
        name: key,
        // @ts-ignore
        value: barData[key],
      });
    }
    console.log("Updated data for bar chaart", newBarData);
    setBarData(newBarData);
  }, [csvData]);

  return (
    <main style={{ maxWidth: 800, margin: "auto" }}>
      <h1>Hello Data Visualization</h1>
      <p>Loaded {csvData.length} rows of CSV Data!</p>
      <h2>Risk of Certain Weather Conditions</h2>
      <BarChart width={300} height={300}>
        <Bar data={barData} dataKey="value" nameKey="name" label fill="yellow">
          <LabelList dataKey="name" position="middle" />
          {barData.map((entry) => (
            <Cell key={entry.name} fill={entry.name.toLowerCase()} />
          ))}
        </Bar>
      </BarChart>
    </main>
  );
};

export default App;
