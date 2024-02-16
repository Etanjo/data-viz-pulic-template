import { useEffect, useState } from "react";
import papa from "papaparse";
import "./App.css";
import type { DemoDataRow, PieDataRow } from "./types";
import { PieChart, Pie, Cell, LabelList } from "recharts";

const App = () => {
  const [csvData, setCsvData] = useState<DemoDataRow[]>([]);
  const [pieData, setPieData] = useState<PieDataRow[]>([]);
  const csvFileUrl = "/data/Deer Crashes.csv"; // FIX ME

  const getData = async () => {
    let response = await fetch(csvFileUrl);
    let text = await response.text();
    let parsed = await papa.parse<DemoDataRow>(text, { header: true });
    console.log("Successfully parsed data:", parsed); // Log to make it easy to inspect shape of our data in the inspector
    setCsvData(parsed.data.filter((row) => row.Name)); // Only keep rows that have a name, so we avoid blank row at end of file
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    // Update whenever data changes...
    let newPieCounts: { [key: string]: number } = {};
    let newPieData: PieDataRow[] = [];
    csvData.forEach((row) => {
      if (!newPieCounts[row["Weather Conditions"]]) {
        newPieCounts[row["Weather Conditions"]] = 0; // initialize if not there...
      }
      newPieCounts[row["Weather Conditions"]]++; // Add one!
    });
    for (let key in newPieCounts) {
      newPieData.push({ name: key, value: newPieCounts[key] });
    }
    setPieData(newPieData);
    console.log("Set new pie data!", newPieData);
  }, [csvData]);

  return (
    <main style={{ maxWidth: 800, margin: "auto" }}>
      <h1>Hello Data Visualization</h1>
      <p>Loaded {csvData.length} rows of CSV Data!</p>
      <h2>Risk of Certain Weather Conditions</h2>
      <PieChart width={300} height={300}>
        <Pie data={pieData} dataKey="value" nameKey="name" label fill="yellow">
          <LabelList dataKey="name" position="middle" />
          {pieData.map((entry) => (
            <Cell key={entry.name} fill={entry.name.toLowerCase()} />
          ))}
        </Pie>
      </PieChart>
      {csvData.map((row, idx) => (
        <div key={idx}>
          {row.Name} age {row.Age}'s favorite color is {row["Weather Conditions"]}{" "}
          and they play {row["Weather Conditions"]}
        </div>
      ))}
    </main>
  );
};

export default App;
