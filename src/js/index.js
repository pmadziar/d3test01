import { getSize, maxDepthFunc, colorScale, addBranchNo } from "./helpers";

import * as d3 from "d3";
import orgx from "../data/org.json";

const org = addBranchNo(orgx);

const root = d3.hierarchy(org, (d) => d.OrgUnits);

const svg = d3.select("svg");
const width = svg.attr("width");
const height = svg.attr("height");
const g = svg.append("g");
const maxDepthToShow = 3;

g.attr('transform', `translate(${width/2},${height/2})`);

const radius = d3.min([width, height])/2-10;

const maxDepth = maxDepthFunc(org);
//const levelRadius = radius/maxDepthToShow*0.95;
const levelRadius = radius/maxDepth*0.95;
const color = (d) => colorScale(d.data.BranchNo)(d.depth?(d.depth-1)/maxDepth:0);

root.sum((d) => getSize(d));

var layout  = d3.partition();

var x = d3.scaleLinear()
    .range([0, 2 * Math.PI]);

//var y = d3.scaleSqrt()
var y = d3.scaleLinear()
    .range([0, radius]);

layout(root);

const arc = d3.arc()
  .startAngle((d) => x(d.x0))
  .endAngle((d) => x(d.x1)-(d.depth?0.02:0))
  .innerRadius((d) => y(d.y0))
  .outerRadius((d) => y(d.y1)-3);
//  .innerRadius((d) => d.depth*levelRadius)
//  .outerRadius((d) => (d.depth+0.95)*levelRadius);

  const click = (d) => {
    svg.transition()
    .duration(1750)
    .tween("scale", function() {
      let xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
          yd = d3.interpolate(y.domain(), [d.y0, 1]),
          yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
      return (t) => { 
        x.domain(xd(t));
        y.domain(yd(t)).range(yr(t));
        return arc(d);
      };
    })
  .selectAll("path")
    .attrTween("d", function(d) { return function() { return arc(d); }; });
}

g
  .selectAll('path')
  .data(root.descendants())
  .enter()
  //.filter((d) => d.depth<maxDepthToShow)
  .append('path')
    .attr('d', arc)
    .style('fill', (d) => color(d))
    .on('click', click)
  .append("title")
    .text((d) => d.data.Name)
//.attr('fill-opacity', 0.5)
//  .attr('stroke', '#000')
;

//g
//  .selectAll('rect')
//  .data(root.descendants())
//  .enter()
//  .append('rect')
//  .attr('x', (d) => d.y0)
//  .attr('y', (d) => d.x0)
//  .attr('width', (d) => d.y1 - d.y0)
//  .attr('height', (d) => d.x1 - d.x0)
//  .attr('fill', (d) => {
//      return colors[d.data.Level -1];
//    })
//  .attr('fill-opacity', 0.4)
//  .attr('stroke', '#000')
//  ;

