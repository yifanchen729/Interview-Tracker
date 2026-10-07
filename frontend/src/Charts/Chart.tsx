import { Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import type { Application } from "../data/ApplicationArray";
import "./Charts.css"

type ChartsProp = {
  applications: Application[];
};

export function Charts({ applications }: ChartsProp) {
  // Counter that goes through application array
  let applicationNum = 0;
  let interviewingNum = 0;
  let offerNum = 0;
  let rejectedNum = 0;

  applications.forEach((application) => {
    const status = application.status;
    if (status === "Interviewing")
      interviewingNum++;
    else if (status === "Offer")
      offerNum++;
    else if (status === "Rejected")
      rejectedNum++;

    applicationNum++;
  });

  const data = [
    { name: "All", count: applicationNum, fill: "#2f67e8" },
    { name: "Interviewing", count: interviewingNum, fill: "#f59e0b" },
    { name: "Offer", count: offerNum, fill: "#22c55e" },
    { name: "Rejected", count: rejectedNum, fill: "#ef4444" }
  ];

  return (
    <div className="chart">
      <div className="chart-header">
        <h2>Application Stats</h2>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: -25,
              bottom: 10
            }}
          >
            <CartesianGrid
              strokeDasharray={3}
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tickLine={false}
              tick={{ fill: "#667085", fontSize: 15 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#667085", fontSize: 15 }}
            />

            <Tooltip
              cursor={{ fill: "rgba(173, 216, 230, 0.2)" }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e1e7ef"
              }}
              labelStyle={{
                color: "black"
              }}
              itemStyle={{
                color: "#667085"
              }}
            />

            <Bar
              dataKey="count"
              radius={[6, 6, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}