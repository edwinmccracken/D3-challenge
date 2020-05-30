// Define SVG area dimensions
var svgWidth = 1000;
var svgHeight = 600;

// Define the chart's margins as an object
var chartMargin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100,
};

//Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Append a group to the SVG area and shift it to the right and down to adhere to the margins set in the "chartMargin" object
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);


    d3.csv("/assets/data/data.csv").then(function(data) {
        console.log(data);

        var age = data.map(data => data.age);
        console.log("age", age);

        var smokes = data.map(data => data.smokes);
        console.log("smokes", smokes);

        var abbr = data.map(data => data.abbr);
        console.log("abbr", abbr)

        data.forEach(function(data1) {
            data1.age = +data1.age;
            data1.smokes = +data1.smokes;
        });


     // Add x axis
        var x = d3.scaleLinear()
            .domain([28, 46])
            .range([0, svgWidth]);
        svg.append("g")
            .call(d3.axisBottom(x));
    
    // Add y axis
        var y = d3.scaleLinear()
            .domain([0, 50])
            .range([svgHeight, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

    // Add graph circles
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
                .attr("cx", function (d) {return x(d.age);})
                .attr("cy", function (d){return y(d.smokes);})
                .attr("r", 10)
                .style("fill", "#69b3a2")
                .attr("opacity", 0.7);
        
        // Create State Labels
        var circleLabels = chartGroup.selectAll(null).data(data).enter().append("text");

            circleLabels
                .attr("x", function(d) {return d.age; })
                .attr("y", function(d) {return d.smokes; })
                .text(function(d) { return d.abbr; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("text-anchor", "middle")
                .attr("fill", "black");
        
        // Add Axes Labels
            chartGroup.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - chartMargin.left + 40)
                .attr("x", 0 - (svgHeight / 2))
                .attr("class", "axisText")
                .text("Smoking %");

            chartGroup.append("text")
                .attr("transform", `translate(${svgWidth}, ${svgHeight + chartMargin.top + 30})`)
                .attr("class", "axisText")
                .text("Age");
});




// .catch(function(error){
//     console.log(error);