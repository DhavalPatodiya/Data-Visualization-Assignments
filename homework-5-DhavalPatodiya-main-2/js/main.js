year_dict = {};
avg_dict= {};
var movies;
// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 580 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

document.addEventListener('DOMContentLoaded', function () {
 
    Promise.all([d3.csv('data/filmtv_movies.csv')])
         .then(function (values) {
            console.log('dataloaded');
            movies = values[0];
            movies = movies.filter(function(d) {return (d['critics_vote']!="" && d['avg_vote']!="")})
            movies = movies.filter(function(d) { return (+d.year == 2021 && +d.duration>130); });
            drawAvgRating();
            drawCriticsRating();
            console.log(movies);
         });
 });

 function drawAvgRating(){
    const svg = d3.select("#imdb_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X axis
    const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(movies.map(d => d.title))
    .padding(0.2);

    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
    

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, 10])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Define the div for the tooltip
    var div = d3.select("#imdb_div").append("div")
    .attr("class", "tooltip")			
    .style("opacity", 0);
    
    // Bars
    svg.selectAll("mybar")
    .data(movies)
    .join("rect")
    .attr("x", d => x(d.title))
    .attr("width", x.bandwidth())
    .attr("fill", "#008484")
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .attr("height", d => height - y(0)) 
    .attr("y", d => y(0))
    .on("mouseover", function(event,d) {
      this.style["stroke-width"] = "4px";
          div.transition()
          .duration(200)
            .style("opacity", .9);
          div.html("Genre: " + d.genre + "<br/>" + "Rating: " + d.avg_vote)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
          })
      .on("mousemove", function(event, d){
        div.style("transform","translateY(-55%)")
             .style("left",(event.pageX)+"px")
             .style("top",(event.pageY)-28+"px")
      })
      .on("mouseout", function(event, d) {
        this.style["stroke-width"] = "1px";
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

        // Animation
    svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", d => y(d.avg_vote))
    .attr("height", d => height - y(d.avg_vote))
    .delay((d,i) => {console.log(i); return i*100})

    // Add X axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 80)
    .text("Movies");

    // Y axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+20)
    .attr("x", -margin.top)
    .text("Ratings")

 }

 function drawCriticsRating(){
    // append the svg object to the body of the page
    const svg = d3.select("#rtt_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // X axis
    const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(movies.map(d => d.title))
    .padding(0.2);

    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
    
    // Define the div for the tooltip
    var div = d3.select("#rtt_div").append("div")
    .attr("class", "tooltip")			
    .style("opacity", 0);

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, 10])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
    .data(movies)
    .join("rect")
    .attr("x", d => x(d.title))
    .attr("width", x.bandwidth())
    .attr("fill", "#ff7b7b")
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .attr("height", d => height - y(0))
    .attr("y", d => y(0))
    .on("mouseover", function(event,d) {
      this.style["stroke-width"] = "4px";
        div.transition()
        .duration(200)
          .style("opacity", .9);
        div.html("Genre: " + d.genre + "<br/>" + "Rating: " + d.critics_vote)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
        })
    .on("mousemove", function(event, d){
      div.style("transform","translateY(-55%)")
           .style("left",(event.pageX)+"px")
           .style("top",(event.pageY)-28+"px")
    })
    .on("mouseout", function(event, d) {
      this.style["stroke-width"] = "1px";
      
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

        // Animation
    svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", d => y(d.critics_vote))
    .attr("height", d => height - y(d.critics_vote))
    .delay((d,i) => {console.log(i); return i*100})

    // Add X axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 80)
    .text("Movies");

    // Y axis label:
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+20)
    .attr("x", -margin.top)
    .text("Ratings")

 }
 