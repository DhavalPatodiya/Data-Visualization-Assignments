// Hint: This is a good place to declare your global variables
var country_male_data;
var country_female_data;
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg, svg2, xAxis, x, y, yAxis, a;

// This function is called once the HTML page is fully loaded by the browser
document.addEventListener('DOMContentLoaded', function () {
   // Hint: create or set your svg element inside this function
   
    svg = d3.select("#my_dataviz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id" , "svg")
    .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Initialize the X axis
    x = d3.scaleTime().range([0, width]);
    
    xAxis = svg.append("g")
    .attr("transform", `translate(0, ${height})`);

    // Initialize the Y axis
    y = d3.scaleLinear()
    .range([ height, 0]);

    yAxis = svg.append("g")
    .attr("transform", "translate(0, 0})");

   // This will load your two CSV files and store them into two arrays.
   Promise.all([d3.csv('data/females_data.csv'),d3.csv('data/males_data.csv')])
        .then(function (values) {
            console.log('loaded females_data.csv and males_data.csv');
            female_data = values[0];
            female_data.forEach(data => {
                Object.keys(data).forEach(function(key){
                    data[key] = +data[key];
                })
            });
            
            country_female_data = female_data;
            console.log(country_female_data);
            
            male_data = values[1];
            male_data.forEach(data => {
                Object.keys(data).forEach(function(key){
                    data[key] = +data[key];
                })
            });

            country_male_data = male_data

            merge_data = d3.merge([country_male_data, country_female_data]);
            var country = d3.select('#country').node().value;
            //adding 1990 as base value
            a= d3.merge([[new Date(1990,0,1)], d3.extent(merge_data , (function(d) { return new Date(d.Year, 0, 1); }))]);
            a = d3.merge([a, [new Date(2023,0,1)]]);
        
            //Add X axis
            x.domain([a[0], a[a.length-1] ]);
            xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(d3.timeYear.every(5)));
        
            // Add Y axis
            y.domain([0, d3.max(merge_data, function(d) { return +d[country] }) ]);
            yAxis.transition().duration(1000).call(d3.axisLeft(y).tickFormat(d3.format(".2")));

            // X-axis label
            svg.append("text")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "middle")
            .text("Year");

            // Y-axis label
            svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Employment Rate");

            // Hint: This is a good spot for doing data wrangling
            //Male Chart
            svg.append("g")
            .attr("stroke", "#264d65")
            .attr("stroke-width", 1)
            .selectAll(".myLine")
            .data(country_male_data)
            .join("line")
            .transition()
            .duration(1000)
            .attr("class", "male_data")
            .attr("x1", function(d) { return x(new Date(d.Year, 0, 1)); })
            .attr("x2", function(d) { return x(new Date(d.Year, 0, 1)); })
            .attr("y1", y(0))
            .style("transform", "translate(-5px,0px)")
            .attr("y2", function(d) { return y(d[country]); })
      
            svg.append("g")
            .attr("stroke", "#e8952d")
            .attr("stroke-width", 1)
            .selectAll("line")
            .data(country_female_data)
            .join("line")
            .transition()
            .duration(1000)
            .attr("class", "female_data")
            .attr("x1", function(d) { return x(new Date(d.Year, 0, 1)); })
            .attr("x2", function(d) { return x(new Date(d.Year, 0, 1)); })
            .attr("y1", y(0))
            .style("transform", "translate(5px,0px)")
            .attr("y2", function(d) { return y(d[country]); })
      
      
            //Female chart
            svg.append("g")
            .selectAll("circle")
            .data(country_male_data)
            .join("circle")
            .transition()
            .duration(1000)
            .attr("class", "male_data_circle")
            .attr("cx", function(d) { return x(new Date(d.Year, 0, 1)); })
            .attr("cy", function(d) { return y(d[country]); })
            .attr("r", 4)
            .style("transform", "translate(-5px,0px)")
            .attr("fill", "#264d65");
          
      
            svg.append("g")
            .selectAll("circle")
            .data(country_female_data)
            .join("circle")
            .transition()
            .duration(1000)
            .attr("class", "female_data_circle")
            .attr("cx", function(d) { return x(new Date(d.Year, 0, 1)); })
            .attr("cy", function(d) { return y(d[country]); })
            .attr("r", 4)
            .style("transform", "translate(5px,0px)")
            .attr("fill", "#e8952d");
                
            drawLolliPopChart();
        });
});

// Use this function to draw the lollipop chart.
function drawLolliPopChart() {
    console.log('trace:drawLollipopChart()');
    // Getting country
    var country = d3.select('#country').node().value;
    console.log('country ' + country);

    //Update X axis
    x.domain([a[0], a[a.length-1] ]);
    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(d3.timeYear.every(5)));

    // Update Y axis
    y.domain([0, d3.max(merge_data, function(d) { return +d[country] }) ]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y).tickFormat(d3.format(".2")));

    const t = d3.transition()
    .duration(1050)
    .ease(d3.easeLinear);

    // Update Male data
    svg.enter().append("svg") ;
    var path = svg.selectAll(".male_data")  
           .data(country_male_data).attr("x1", function(d) { return x(new Date(d.Year, 0, 1)); })
           .join("line")
           .transition().ease(d3.easeExpInOut).duration(1000)
           .attr("x2", function(d) { return x(new Date(d.Year, 0, 1)); })
           .attr("y1", y(0))
           .attr("y2", function(d) { return y(d[country]); })
    
    path = svg.selectAll(".male_data_circle")  
           .data(country_male_data).attr("cx", function(d) { return x(new Date(d.Year, 0, 1)); })
           .join("circle")
           .transition().ease(d3.easeExpInOut).duration(1000)
           .attr("cy", function(d) { return y(d[country]); })

    // Update Female data
    path = svg.selectAll(".female_data")  
           .data(country_female_data).attr("x1", function(d) { return x(new Date(d.Year, 0, 1)); })
           .join("line")
           .transition().ease(d3.easeExpInOut).duration(1000)
           .attr("x2", function(d) { return x(new Date(d.Year, 0, 1)); })
           .attr("y1", y(0))
           .attr("y2", function(d) { return y(d[country]); })


    path = svg.selectAll(".female_data_circle")  
           .data(country_female_data).attr("cx", function(d) { return x(new Date(d.Year, 0, 1)); })
           .join("circle")
           .transition().ease(d3.easeExpInOut).duration(1000)
           .attr("cy", function(d) { return y(d[country]); })

    // Legends
    var legendNames = d3.merge([["Female Employment Rate"], ["Male Employment Rate"]])

    var legendHolder = svg.append('g')
    // translate the holder to the right side of the graph
        .attr('transform', "translate(" + (width ) + ",0)");
    var color = d3.merge([["#e8952d"], ["#264d65"]]);
  
    var legend = legendHolder.selectAll(".legend")
        .data(legendNames)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 30 + ")"; });
    
    legend.append("rect")
        .attr("x", 0)
        .data(color)
        .attr("width", 18)
        .attr("height", 18)
        .style("text-anchor", "end")
        .style("fill", function(d, i){
            return d;
        });
    

    legend.append("text")
        .attr("x", -9)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
    

    console.log('Drawn');
}



