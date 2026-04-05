import { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

function Graph({ itemId }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!itemId) return;

    fetchGraph();
  }, [itemId]);

  async function fetchGraph() {
    const res = await axios.get(
      `http://localhost:5000/api/items/graph/${itemId}`,
      {
        withCredentials: true,
      },
    );
    console.log(res.data);
    drawGraph(res.data);
  }

  function drawGraph(data) {
    const width = 600;
    const height = 400;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.edges)
          .id((d) => d.id)
          .distance(120),
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg
      .selectAll("line")
      .data(data.edges)
      .enter()
      .append("line")
      .attr("stroke", "#aaa");

    const node = svg
      .selectAll("circle")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("r", 8)
      .attr("fill", "blue")
 
      node
        .on("mouseover", function () {
          d3.select(this).attr("r", 14).attr("fill", "#2563eb").attr("cursor", "pointer")
        })
        .on("mouseout", function () {
          d3.select(this).attr("r", 10).attr("fill", "#3b82f6");
        });

    const label = svg
      .selectAll("text")
      .data(data.nodes)
      .enter()
      .append("text")
      .text((d) => d.label)
      .attr("font-size", 14)
      .attr("fill", "#fff")
    //   .attr("dx", 12)
    //   .attr("dy", 4);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      label.attr("x", (d) => d.x + 10).attr("y", (d) => d.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  }

  return <svg ref={svgRef}></svg>;
}

export default Graph;
