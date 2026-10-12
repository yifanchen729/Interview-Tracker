import {
  Tooltip,
  ResponsiveContainer,
  Sankey,
  Layer,
  Rectangle,
} from "recharts";
import type { SankeyNodeProps, SankeyLinkProps } from "recharts";
import type { Application } from "../data/ApplicationArray";
import "./Charts.css";

type ChartsProp = {
  applications: Application[];
};

export function Charts({ applications }: ChartsProp) {
  // Counter that goes through application array
  let appliedNum = 0;
  let interviewNum = 0;
  let rejectedNum = 0;
  let offerNum = 0;

  applications.forEach((application) => {
    const status = application.status;

    appliedNum++;
    if (status === "Interviewing") {
      interviewNum++;
    } else if (status === "Rejected") {
      rejectedNum++;
      interviewNum++;
    } else if (status === "Offer") {
      offerNum++;
      interviewNum++;
    }
  });

  // Sankey chart on the right
  const graphData = {
    nodes: [
      { name: "Applied", value: appliedNum },
      { name: "Unknown", value: appliedNum - interviewNum },
      { name: "Interview", value: interviewNum },
      { name: "Rejected", value: rejectedNum },
      { name: "Offer", value: offerNum },
      { name: "Dummy", value: 0 },
    ],

    links: [
      { source: 0, target: 1, value: appliedNum - interviewNum }, // From applied to unknown
      { source: 0, target: 2, value: interviewNum }, // From applied to interview
      { source: 2, target: 3, value: rejectedNum }, // From Interview to rejected
      { source: 2, target: 4, value: offerNum }, // From Interview to offer
      { source: 1, target: 5, value: 0 }, // From applied to dummy
    ],
  };

  function MyCustomSankeyNode({
    x,
    y,
    width,
    height,
    payload,
  }: SankeyNodeProps) {
    if (payload.name == "Dummy") {
      return;
    }

    let color = "blue";

    if (payload.name === "Applied") color = "#2f2fe8";
    else if (payload.name === "Unknown") color = "#8d8b89";
    else if (payload.name === "Interview") color = "#0b8cf59e";
    else if (payload.name === "Rejected") color = "rgb(217, 47, 47)";
    else if (payload.name === "Offer") color = "#22c55e";
    else if (payload.name === "Dummy") color = "black";

    return (
      <Layer>
        <Rectangle x={x} y={y} width={width} height={height} fill={color} />

        <text x={x + width + 10} y={y + height / 2}
          fill="#515151"
        >
          {payload.name}:{payload.value}
        </text>
      </Layer>
    );
  }

  function MyCustomSankeyLink({
    sourceX,
    targetX,
    sourceY,
    targetY,
    sourceControlX,
    targetControlX,
    linkWidth,
    index,
  }: SankeyLinkProps) {
    let color = "blue";

    if (index === 0) color = "#8d8b898a";
    else if (index === 1) color = "#0b8cf568";
    else if (index === 2) color = "rgba(217, 47, 47, 0.51)";
    else if (index === 3) color = "#22c55e74";
    else if (index === 4) color = "transparent";

    return (
      <path
        d={`
        M${sourceX},${sourceY}
        C${sourceControlX},${sourceY}
         ${targetControlX},${targetY}
         ${targetX},${targetY}
      `}
        stroke={color}
        strokeWidth={linkWidth}
        fill="none"
        strokeOpacity={0.4}
      />
    );
  }

  return (
    <div className="chart">
      <div className="chart-header">Application Stats</div>

      <div className="application-flow-chart">
        <ResponsiveContainer width={900} height="70%">
          <Sankey
            data={graphData}
            node={MyCustomSankeyNode}
            link={MyCustomSankeyLink}
            nodeWidth={10}
            nodePadding={60}
            margin={{
              top: 20,
              right: 100,
              bottom: 20,
              left: 40,
            }}
          >
            <Tooltip />
          </Sankey>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
