import { useEffect, useState } from "react";
import papa from "papaparse";
import "./App.css";
import {
  DeerDataRow,
  PieDataRow,
  BarDataRow,
  GraphDataRow,
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
  Line,
} from "recharts";

const App = () => {
  const [csvData, setCsvData] = useState<DeerDataRow[]>([]);
  const [pieData, setPieData] = useState<PieDataRow[]>([]);
  const [barData, setBarData] = useState<BarDataRow[]>([]);
  const [graphData, setGraphData] = useState<GraphDataRow[]>([]);

  const csvFileUrl = "/data/Deer Crashes.csv";

  const getData = async () => {
    let response = await fetch(csvFileUrl);
    let text = await response.text();
    let parsed = await papa.parse<DeerDataRow>(text, { header: true });
    parsed.data.forEach((row) => {
      if (row["Crash Time"]) {
        row.Hour = timeStringToHour(row["Crash Time"]);
      }
    });
    console.log("Successfully parsed data:", parsed); // Log to make it easy to inspect shape of our data in the inspector
    setCsvData(parsed.data.filter((row) => row["Weather Conditions"])); // Only keep rows that have a name, so we avoid blank row at end of file
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let newLineGraph: { [key: string]: number } = {};
    let newLineData: GraphDataRow[] = [];
    csvData.forEach((row) => {
      if (!newLineGraph[row["Hour"]]) {
        newLineGraph[row["Hour"]] = 0; // initialize if not there...
      }
      newLineGraph[row["Hour"]]++; // Add one!
    });
    for (let key in newLineGraph) {
      newLineData.push({ name: key, crashes: newLineGraph[key] });
    }
    setGraphData(newLineData.slice(0, 24));
    console.log("Set new Line data!", newLineData);
  }, [csvData]);

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
      <h1>Deer Crash Data Visualization</h1>
      <h2>Average Deer Crashes per Day in Different Weather Conditions Over Past 8 Years</h2>
      <BarChart width={730} height={250} data={barData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar name="Crashes per Day" dataKey="crashes" fill="#42033D" />
      </BarChart>
     <h2>Total Deer Crashes per Hour Over Past 8 Years</h2>
      <LineChart
        width={730}
        height={500}
        data={graphData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          //label={{ value: "Hour of Day", position: "start" }}
          dataKey="name"
        />
        <YAxis
          /*label={{
            value: "Number of Crashes",
            angle: "-90",
            position: "start",
          }}*/
          dataKey="crashes"
        />
        <Tooltip />
        <Legend />
        <Line
          name="#Crashes per Hour of Day"
          type="monotone"
          dataKey="crashes"
          stroke="#8884d8"
        />
      </LineChart>
      <h3>Data Source:</h3>
      <a href="https://apps.impact.dot.state.ma.us/cdv/">Source Data</a>
    </main>
  );
};

export default App;
