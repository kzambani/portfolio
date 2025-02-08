import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
console.log("Projects container found:", projectsContainer);

renderProjects(projects, projectsContainer, 'h2');

// PROJECT SEARCH AND VISUAL

let query = '';

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('change', (event) => {
  let filteredProjects = setQuery(event.target.value);
  // re-render projects when event triggers
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

let selectedIndex = -1;

function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  // clear previous SVG and legend before re-rendering
  d3.select("#projects-plot").selectAll("*").remove();
  d3.select(".legend").html("");

  // define SVG properties
  let width = 200, height = 200, radius = 50;
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let svg = d3.select("#projects-plot").attr("viewBox", "-50 -50 100 100");

  // generate arcs
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(newData);

  // append new pie chart slices
  svg.selectAll("path")
    .data(arcData)
    .enter()
    .append("path")
    .attr("d", arcGenerator)
    .attr("fill", (d, i) => colors(i))
    .style("cursor", "pointer") // Indicate clickable slices
    .on("click", function(event, d) {
        const i = arcData.indexOf(d);
        selectedIndex = selectedIndex === i ? -1 : i;
        
        // update pie slice highlighting
        svg.selectAll("path")
          .attr("class", (d, idx) => idx === selectedIndex ? "selected" : "");
        
        // update legend highlighting
        d3.select(".legend")
          .selectAll("li")
          .attr("class", (d, idx) => idx === selectedIndex ? "selected" : "");
        
        // filter projects based on selected year
        if (selectedIndex === -1) {
            renderProjects(projectsGiven, projectsContainer, 'h2');
        } else {
            const selectedYear = newData[selectedIndex].label;
            const filteredProjects = projectsGiven.filter(project => project.year === selectedYear);
            renderProjects(filteredProjects, projectsContainer, 'h2');
        }
      });

  // update legend dynamically
  let legend = d3.select(".legend");
  newData.forEach((d, idx) => {
    legend.append("li")
      .attr("style", `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .style("cursor", "pointer") // Indicate clickable legend items
      .on("click", () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;

        svg.selectAll("path").attr("class", (_, i) => 
          selectedIndex === i ? "selected" : ""
        );

        legend.selectAll("li").attr("class", (_, i) => 
          selectedIndex === i ? "selected" : ""
        );
      });
  });
}

// Function to filter projects based on search input
function setQuery(inputValue) {
  query = inputValue.toLowerCase();
  return projects.filter(project => {
    let values = Object.values(project).join(' ').toLowerCase();
    return values.includes(query)
  });
}

// call on page load
renderPieChart(projects);
