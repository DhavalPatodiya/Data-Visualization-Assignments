var vowel = {"a" : 0, "e" : 0, "i" : 0, "o" : 0, "u" : 0, "y" : 0}
var constant = {"b":0, "c":0, "d":0, "f":0, "g":0, "h":0, "j":0, "k":0, "l":0, "m":0, "n":0, "p":0, "q":0, "r":0, "s":0, "t":0, "v":0, "w":0, "x":0, "z":0}
var punctutation = {"." : 0, "," : 0, "?" : 0, "!" : 0, ":" : 0, ";" : 0}

var vowels = 0
var constants = 0
var punctutations = 0

// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 580 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

function submitText(){
    d3.selectAll("#bar_svg > *").remove(); 
    const span = document.getElementById('character-name');
    span.textContent = "";
    vowel = {"a" : 0, "e" : 0, "i" : 0, "o" : 0, "u" : 0, "y" : 0}
    constant = {"b":0, "c":0, "d":0, "f":0, "g":0, "h":0, "j":0, "k":0, "l":0, "m":0, "n":0, "p":0, "q":0, "r":0, "s":0, "t":0, "v":0, "w":0, "x":0, "z":0}
    punctutation = {"." : 0, "," : 0, "?" : 0, "!" : 0, ":" : 0, ";" : 0}
    console.log("Inside Submit Text");
    var paragraph = d3.select('#wordbox').node().value;
    paragraph = paragraph.toLowerCase();
    vowels = 0
    constants = 0
    punctutations = 0
    console.log(paragraph);

    for(var i = 0; i<paragraph.length; i++){
        var charac = paragraph.charAt(i);
        if(charac == ' '){
            continue;
        }

        if(charac in vowel){
            vowel[charac] += 1
            vowels += 1
        }
        else if(charac in punctutation){
            punctutation[charac] += 1
            punctutations += 1
        }
        else if(charac in constant){
            constant[charac] += 1;
            constants += 1
            
        }
    }
    console.log(constant);
    console.log(vowel);
    console.log(punctutation);

    drawDonutChart();
 
}


function drawDonutChart(){
    // set the dimensions and margins of the graph
    const width = 580,
    height = 400;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    const radius = Math.min(width, height) / 2 - 50

    d3.selectAll("#pie_svg > *").remove(); 

    // append the svg object to the div called 'my_dataviz'
    const svg = d3.select("#pie_svg")
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create dummy data
    const data = {"vowels" : vowels, "punctutations" : punctutations, "constants" : constants}

    // set the color scale
    const color = d3.scaleOrdinal()
    .range(d3.schemeSet1)

    // Compute the position of each group on the pie:
    const pie = d3.pie()
    .value(d=>d[1])

    const data_ready = pie(Object.entries(data))
    tooltip = svg
    .append("text")
    .attr("text-anchor", "middle")
    .attr("font-size", "1.2em");
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
    .selectAll('s')
    .data(data_ready)
    .join('path')
    .attr('d', d3.arc()
        .innerRadius(100)         // This is the size of the donut hole
        .outerRadius(radius)
    )
    .attr('fill', d => color(d.data[0]))
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", 0.7)
    .on("mouseover", function (event, d) {
        this.style["stroke-width"] = "4px";
        tooltip.text(d.data[0] + " : " + d.data[1]);
      })
      .on("mouseout", function (d) {
        this.style["stroke-width"] = "1px";
        tooltip.text("");
      })
      .on("click", function (event, d) {
        barchart(d.data[0], color(d.data[0]));
      })
      .attr("fill", function (d) {
        return color(d.data[0]);
      })
}

function barchart(categ, color){

    
    console.log(categ.slice(0, -1))
    console.log(color)
    d3.selectAll("#bar_svg > *").remove(); 

    // append the svg object to the body of the page
    const svg = d3.select("#bar_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    data = ""
    count = 0
    if (categ.slice(0, -1) == "constant"){
        data = constant
        count = constants
    }
    else if (categ.slice(0, -1) == "punctutation"){
        data = punctutation
        count = punctutations
    }
    else if (categ.slice(0, -1) == "vowel"){
        data = vowel
        count =vowels
    }

    // X axis
    const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(Object.keys(data))
    .padding(0.2);

    svg.append("g")
    .transition()
    .ease(d3.easeBackIn)
    .duration(1000)
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([0, Math.max(...Object.values(data))])
    .range([ height, 0]);
    svg.append("g")
    .transition()
    .ease(d3.easeBackIn)
    .duration(1000)
    .call(d3.axisLeft(y));

    newData = [];
    for (const [key, val] of Object.entries(data)) {
      newData.push({ char: key, count: val });
    }

    // Define the div for the tooltip
    var div = d3.select("#bar_div").append("div")
    .attr("class", "tooltip")			
    .style("opacity", 0);
    
    // Bars
    var bars = svg.selectAll('mybar')
    .data(newData)
    .attr("class", "bar")
    .enter()
    .append("rect")
    
    .attr("x", d => x(d.char))
    .attr("y", d => y(d.count))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.count))
    .attr("fill", color)
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .style('opacity', 0);

    bars.transition()
    .ease(d3.easeBackIn)
    .duration(1000)
    .style('opacity', 1);

    const span = document.getElementById('character-name');
    span.textContent = categ.slice(0, -1) + " is: " + count;

    bars.on("mouseover", function(event,d) {
      const span = document.getElementById('character-name');
        span.textContent = d.char + " is: " + d.count;
        div.transition()
        .duration(200)
          .style("opacity", .9);
        div.html("Character: " + d.char + "<br/>" + "Count: " + d.count)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
        })
    .on("mousemove", function(event, d){
      div.style("transform","translateY(-55%)")
           .style("left",(event.pageX)+"px")
           .style("top",(event.pageY)-28+"px")
    })
    .on("mouseout", function(event, d) {
      
      span.textContent = categ.slice(0, -1) + " is: " + count;
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });
    
}