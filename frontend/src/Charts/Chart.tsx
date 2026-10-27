import {
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

  let appliedToInterview = 0;
  let appliedToRejected = 0;

  let interviewToRejected = 0;
  let interviewToOffer = 0;

  applications.forEach((application) => {
    const history = application.statusHistory;

    // Ignore "To Apply"
    if (!history || history.length === 0) {
      return;
    }

    appliedNum++;

    // Go through each transition in the history
    for (let i = 0; i < history.length - 1; i++) {
      const currentStatus = history[i].status;
      const nextStatus = history[i + 1].status;

      if (
        currentStatus === "Applied" &&
        nextStatus === "Interviewing"
      ) {
        appliedToInterview++;
      }

      else if (
        currentStatus === "Applied" &&
        nextStatus === "Rejected"
      ) {
        appliedToRejected++;
      }

      else if (
        currentStatus === "Interviewing" &&
        nextStatus === "Rejected"
      ) {
        interviewToRejected++;
      }

      else if (
        currentStatus === "Interviewing" &&
        nextStatus === "Offer"
      ) {
        interviewToOffer++;
      }
    }
  });

  const appliedToUnknown =
    appliedNum -
    appliedToInterview -
    appliedToRejected;

  const interviewToUnknown =
    appliedToInterview -
    interviewToRejected -
    interviewToOffer;

  // Sankey chart data
  const graphData = {
    nodes: [
      { name: "Applications", value: appliedNum },           // 0: Applications
      { name: "Pending", value: appliedToUnknown },          // 1: Pending after applying
      { name: "Interviewing", value: appliedToInterview },     // 2: Reached interview
      { name: "Rejected", value: appliedToRejected },        // 3: Rejected after applying
      { name: "Pending", value: interviewToUnknown },        // 4: Pending after interview
      { name: "Rejected", value: interviewToRejected },      // 5: Rejected after interview
      { name: "Offers", value: interviewToOffer },           // 6: Offer after interview
    ],

    links: [
      { source: 0, target: 1, value: appliedToUnknown },
      { source: 0, target: 2, value: appliedToInterview },
      { source: 0, target: 3, value: appliedToRejected },
      { source: 2, target: 4, value: interviewToUnknown },
      { source: 2, target: 5, value: interviewToRejected },
      { source: 2, target: 6, value: interviewToOffer },
    ],
  };

  // Get node color based on its name
  function getNodeColor(name: string) {
    if (name === "Applications") return "#2f2fe8";
    if (name === "Pending") return "#8d8b89";
    if (name === "Interviewing") return "#0b8cf59e";
    if (name === "Rejected") return "rgb(217, 47, 47)";
    if (name === "Offers") return "#22c55e";

    return "transparent";
  }

  // Get link color based on its index
  function getLinkColor(index: number) {
    if (index === 0) return "#8d8b898a";                 // Applied -> Unknown
    if (index === 1) return "#0b8cf568";                 // Applied -> Interview
    if (index === 2) return "rgba(217, 47, 47, 0.51)";   // Applied -> Rejected
    if (index === 3) return "#8d8b898a";                 // Interview -> Unknown
    if (index === 4) return "rgba(217, 47, 47, 0.51)";   // Interview -> Rejected
    if (index === 5) return "#22c55e74";                 // Interview -> Offer

    return "transparent";                                // It is should not exist
  }

  function MyCustomSankeyNode({
    x,
    y,
    width,
    height,
    payload,
  }: SankeyNodeProps) {
    return (
      <Layer>
        <Rectangle
          x={x}
          y={y - 1}
          width={width}
          height={height + 2}
          radius={4}
          fill={getNodeColor(payload.name)}
        />

        <foreignObject
          x={x + width + 14}
          y={y + height / 2 - 25}
          width={300}
          height={50}
        >
          <div
            className="sankey-label"
            style={{
              borderColor: getNodeColor(payload.name),
            }}
          >
            <div
              className="sankey-value"
              style={{
                backgroundColor: getNodeColor(payload.name),
              }}
            >
              {payload.value}
            </div>

            <div className="sankey-name">
              {payload.name}
            </div>
          </div>
        </foreignObject>
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
    return (
      <path
        d={`
        M${sourceX},${sourceY}
        C${sourceControlX},${sourceY}
         ${targetControlX},${targetY}
         ${targetX},${targetY}
      `}
        stroke={getLinkColor(index)}
        strokeWidth={linkWidth}
        fill="none"
        strokeOpacity={0.5}
      />
    );
  }

  return (
    <div className="chart">
      <div className="chart-header">Application Stats</div>

      <div className="application-flow-chart">
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={graphData}
            node={MyCustomSankeyNode}
            link={MyCustomSankeyLink}
            nodeWidth={24}
            nodePadding={50}
            align="left"
            sort={false}
            margin={{ top: 30, right: 150, bottom: 30, left: 80 }}
          >
          </Sankey>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
