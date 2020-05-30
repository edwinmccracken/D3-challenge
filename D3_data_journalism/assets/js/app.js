var svgArea = d3.select("body").select("svg");

// clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

// Defining SVG area dimensions
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

// Define the chart's margins as an object
var chartMargin = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100,
};

//Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift it to the right and down to adhere to the margins set in the "chartMargin" object
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Import data
d3.csv("/assets/data/data.csv").then(function(SmokeData) {
    console.log(SmokeData);
    SmokeData.forEach(function(data){
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.abbr = data.abbr
    });

        // xLinearScale function above csv import
        var xLinearScale = d3.scaleLinear()
            .domain(d3.extent(SmokeData, d => d.age))
            .range([0, chartWidth]);

        // Create y scale function
        var yLinearScale = d3.scaleLinear()
            .domain(d3.extent(SmokeData, d => d.smokes))
            .range([chartHeight, 0]);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

    // append axis to chart
            chartGroup.append("g")
                .attr("transform", `translate(0, ${chartHeight})`)
                .call(bottomAxis);

            chartGroup.append("g")
                .call(leftAxis);

                var y = d3.scaleLinear()
                .domain([0, d3.max(SmokeData, d => d.smokes)])
                .range([svgHeight, 0])
                

    // Add graph circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(SmokeData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.age))
            .attr("cy", function(d){return y(d.smokes);})
            .attr("r", "10")
            .style("fill", "#69b3a2")
            .attr("opacity", "0.7");

        // Create State Labels
            var circlesText = chartGroup.append("g")
            .selectAll("text")
            .data(SmokeData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d.age))
            .attr("y", function(d){return y(d.smokes);})
            .text(d => (d.abbr))
            .attr("font-family", "sans-serif")
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .attr("fill", "black");
        
        // Appending X Axis
        var xAxisGroup = chartGroup.append("g")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);


        xAxisGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("font-weight",1000)
            .style('fill', 'black')
            .classed("stateText", true)
            .text("Average Age");

});

        // Appending Y Axis
        var yAxisGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)", `translate(${chartWidth}, ${chartHeight})`);

        yAxisGroup.append("text")
            .attr("text-anchor", "center")
            .attr("y", -60)
            .attr("x", -300)
            .attr("font-weight",1000)
            .style('fill', 'black')
            .classed("stateText", true)
            .text("% of People That Smoke");