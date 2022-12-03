// global variables
var regions = {} //dict
var countries = {}
year = [1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015]
const margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 980 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;


var svg,x, y, yAxis, xAxis, color = {}, line, opacity = 30;

$(function(){
   //dropdown checkbox
   $('input:checkbox').each(function(i){
      $(this).prop("checked", false);
   });

   $(".checkbox-menu").on("change", "input[type='checkbox']", function() {
      var val =[] ;
      if(this.checked == true){
         val.push(this.value);
      }
      
      $('#deselect_all').prop('checked', false);
      
      var count = 0;
      $('input:checkbox:not("#deselect_all"):not("#select_all")').each(function(i){
         if($(this).is(":checked")){
            count = count +1;
         }
      });

      if(count == 7){
         $('#deselect_all').prop('checked', false);
         $('#select_all').prop('checked', true);
      }else if(count == 0){
         $('#deselect_all').prop('checked', true);
         $('#select_all').prop('checked', false);
      }else{
         $('#deselect_all').prop('checked', false);
         $('#select_all').prop('checked', false);
      }
      
      //update the graph
      drawline(val);
   });
   
   $(document).on('click', '.allow-focus', function (e) {
     e.stopPropagation();
   });

   // deselect checkbox
   $('#deselect_all').click(deselectcheckbox);

   //select checkbox
   $('#select_all').click(selectcheckbox);

 });

function deselectcheckbox(){
   if($('#deselect_all').is(':checked')){
      var val = [];
      $('input:checkbox:not("#deselect_all")').each(function(i){
         $(this).prop("checked", false);
      });
   }
   //update the graph
   drawline();
}

function selectcheckbox(){
   if($('#select_all').is(':checked')){
      var val = [];
      $('input:checkbox:not(:checked)').each(function(i){
         $(this).prop("checked", true);
         // drawline(this.value);
         val.push(this.value);
      });

      if($('#deselect_all').attr('checked', true)){
         $('#deselect_all').prop('checked', false);
      }
      drawline(val);
   }
   else{
      $('input:checkbox').each(function(i){
         $(this).prop("checked", false);
      });

      $('#select_all').prop('checked', false);
      $('#deselect_all').prop('checked', true);
      drawline();
   }
}

document.addEventListener('DOMContentLoaded', function () {

   // This will load your two CSV files and store them into two arrays.
   Promise.all([d3.csv('data/countries_regions.csv'),d3.csv('data/global_development.csv')])
        .then(function (values) {
            console.log('loaded females_data.csv and males_data.csv');

            y = d3.scaleLinear()
            .range([height, 0]);

            color = d3.scaleOrdinal(d3.schemeCategory10);
            
            x = d3.scaleTime()
               .domain(d3.extent(year, function(d) { return new Date(d,0,1);  }))
               .range([ 0, width ]);
            

            line = d3.line()
                  .x(function(d) { return x(d.date); })
                  .y(function(d) { return y(d.price); })
                  .curve(d3.curveBasis);;

            svg = d3.select("body").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

            
   
               // y = d3.scaleLinear()
               // .range([ height, 0]);
   
               yAxis = svg.append("g")
               .attr("transform", "translate(0, 0})");

            // populationg regions dict
            get_region_data(values[0]);

            // populating countries dict
            get_countries_data(values[1]);

            // creating inputs in dropdown
            populate_regions_dropdown();

            // create Axis and Legends
            drawline();

        });
});

function onchangeOpacity(){
   opacity = d3.select("#opacity").node().value;
   console.log(opacity);
   d3.selectAll(".liie").transition().duration(300).style("opacity", opacity/100);
}

function drawline(currregion){
   // append the svg object to the body of the page
      
      var boxes = d3.selectAll("input[type='checkbox']:checked");
      var uncheckedboxes = d3.selectAll("input[type='checkbox']:not(:checked)");
      var attr = d3.select("#global_indicator").node().value;
      opacity = d3.select("#opacity").node().value;

      newYaxis = [];
      boxes.each(function() {
         if(this.name == "regions"){
            var countri = regions[this.value];
            for (var i=0; i<countri.length; i++){
               if(countries[countri[i].countries]){
                  newYaxis = d3.merge([newYaxis, countries[countri[i].countries]]);
               }
            }
         }
      });

      var path, circle;
      
      y.domain([0, d3.max(newYaxis, function(d) { return +d[attr]; })])
      yAxis.transition().duration(1000).call(d3.axisLeft(y).tickFormat(d3.format(".2")));

      svg.enter().append("svg") ;

      boxes.each(function() {   
         if(this.name == "regions"){
            var countri = regions[this.value];
            for (var i=0; i<countri.length; i++){
               if(countries[countri[i].countries]){
                  // line generator
                  const line = d3.line()
                  .x(function(d) { return x(new Date(d.Year,0,1)); })
                  .y(function(d) { return y(d[attr]) }) ;

                  path = svg.selectAll(".liie_"+ countri[i].geo)  
                  .datum(countries[countri[i].countries])
                  .attr("class", "liie_"+ countri[i].geo + " liie" )
                  .attr("fill", "none")
                  .attr("stroke", color[this.value])
                  .style("opacity", opacity/100)
                  .attr("stroke-linejoin", "round")    
                  .attr("stroke-linecap", "round")
                  .attr("stroke-width", 1.5)
                  .on('mouseover', function (d, i) {
                     d3.selectAll(".liie")
                     .style("opacity", 0.1)
                        var name = $(this).attr("class").split(" ")[0].split("_")[1];
                        d3.selectAll(".liie_"+ name)
                        .style("opacity", 1)
                        d3.selectAll(".circle_"+ name)
                        .style("opacity", 1)
                        d3.selectAll(".text_"+ name)
                              .style("opacity", 1)
                     })
                     .on('mouseout', function (d, i) {
                        d3.selectAll(".liie")
                        .style("opacity", opacity/100);
                     })
                  .transition().ease(d3.easeSin).duration(1000)
                  .attr("d",line(countries[countri[i].countries])); 
                  
                  svg.selectAll(".circle_"+countri[i].geo)
                  .attr("class", "circle_"+countri[i].geo + " liie" )
                  .attr('fill', color[this.value])
                  .style("opacity", opacity/100)
                  .attr('r', 5)
                  .transition().ease(d3.easeSin).duration(1000)
                  .attr("cx", x(new Date(countries[countri[i].countries].at(-1).Year,0,1)))
                  .attr("cy", y(countries[countri[i].countries].at(-1)[attr]));                  

                  svg.selectAll(".text_"+countri[i].geo)
                  .attr("class", "text_"+countri[i].geo + " liie")
                  
                  .attr("dx", ".35em")
                  .attr("text-anchor", "start")
                  .style("opacity", opacity/100)
                  .style("fill", color[this.value])
                  .on('mouseover', function (d, i) {
                     d3.selectAll(".liie")
                        .style("opacity", 0.1)
                     var name = $(this).attr("class").split(" ")[0].split("_")[1];
                     d3.selectAll(".liie_"+ name)
                     .style("opacity", 1)
                     d3.selectAll(".circle_"+ name)
                     .style("opacity", 1)
                     d3.selectAll(".text_"+ name)
                           .style("opacity", 1)
                  })
                  .on('mouseout', function (d, i) {
                     d3.selectAll(".liie")
                     .style("opacity", opacity/100);
                  })
                  .transition().ease(d3.easeSin).duration(1000)
                  .attr("x", x(new Date(countries[countri[i].countries].at(-1).Year,0,1)))
                  .attr("y", y(countries[countri[i].countries].at(-1)[attr]))
                  .text(countri[i].countries);
                  

                  if(currregion.includes(this.value)){
                     // Add the line
                     path = svg.append("path")
                     .datum(countries[countri[i].countries])
                     .attr("class", "liie_"+ countri[i].geo + " liie" )
                     .attr("fill", "none")
                     .attr("stroke", color[this.value])
                     .attr("stroke-linejoin", "round")    
                     .attr("stroke-linecap", "round")
                     .attr("stroke-width", 1.5)
                     .style("opacity", 0)
                     .on('mouseover', function (d, i) {
                        d3.selectAll(".liie")
                        .style("opacity", 0.1)
                        var name = $(this).attr("class").split(" ")[0].split("_")[1];
                        d3.selectAll(".liie_"+ name)
                        .style("opacity", 1)
                        d3.selectAll(".circle_"+ name)
                        .style("opacity", 1)
                        d3.selectAll(".text_"+ name)
                              .style("opacity", 1)
                        })
                        .on('mouseout', function (d, i) {
                           d3.selectAll(".liie")
                           .style("opacity", opacity/100);
                     })
                     .transition().delay(1000).ease(d3.easeSin).duration(1500)
                     .style("opacity", opacity/100)
                     
                     .attr("d", line(countries[countri[i].countries]));

                     // draw circle at initial location
                     circle = svg.append('circle')
                     .attr("class", "circle_"+countri[i].geo + " liie" )
                     .attr('fill', color[this.value])
                     .style('opacity',0)
                     .attr("cx", x(new Date(countries[countri[i].countries].at(-1).Year,0,1)))
                     .attr("cy", y(countries[countri[i].countries].at(-1)[attr]))
                     .on('mouseover', function (d, i) {
                        d3.selectAll(".liie")
                           .style("opacity", 0.1)
                        var name = $(this).attr("class").split(" ")[0].split("_")[1];
                        d3.selectAll(".liie_"+ name)
                        .style("opacity", 1)
                        d3.selectAll(".circle_"+ name)
                        .style("opacity", 1)
                        d3.selectAll(".text_"+ name)
                              .style("opacity", 1)
                     })
                     .on('mouseout', function (d, i) {
                        d3.selectAll(".liie")
                        .style("opacity", opacity/100);
                     })
                     .transition().delay(1000).ease(d3.easeSin).duration(1500)
                     .style("opacity", opacity/100)
                     .attr('r', 5);

                     svg.append("text")
                     .attr("class", "text_"+countri[i].geo + " liie")
                     .attr("x", x(new Date(countries[countri[i].countries].at(-1).Year,0,1)))
                     .attr("y", y(countries[countri[i].countries].at(-1)[attr]))
                     .attr("dx", ".35em")
                     .style("opacity", 0)
                     .attr("text-anchor", "start")
                     .style("fill", color[this.value])
                     .on('mouseover', function (d, i) {
                        d3.selectAll(".liie")
                           .style("opacity", 0.1)
                        var name = $(this).attr("class").split(" ")[0].split("_")[1];
                        d3.selectAll(".liie_"+ name)
                        .style("opacity", 1)
                        d3.selectAll(".circle_"+ name)
                        .style("opacity", 1)
                        d3.selectAll(".text_"+ name)
                              .style("opacity", 1)
                     })
                     .on('mouseout', function (d, i) {
                        d3.selectAll(".liie")
                        .style("opacity", opacity/100);
                     })
                     .transition().delay(1000).ease(d3.easeSin).duration(3500)
                     .style("opacity", opacity/100)
                     .text(countri[i].countries);
                  }    
               }
            }
         }
      });

      uncheckedboxes.each(function() {
         if(this.name == "regions"){
            var countri = regions[this.value];
            for (var i=0; i<countri.length; i++){
               if(countries[countri[i].countries]){
                  var a = ".liie_"+ countri[i].geo;
                  var selection = svg.selectAll(a);
                  if(!(selection.empty())){
                     svg.selectAll(a).transition().duration(1000).ease(d3.easeLinear).style('opacity',0).remove();
                  }
                  a = ".circle_"+ countri[i].geo;
                  selection = svg.selectAll(a);
                  if(!(selection.empty())){
                     selection.transition().duration(1000).ease(d3.easeLinear).style('opacity',0).remove();
                  }

                  a = ".text_"+ countri[i].geo;
                  selection = svg.selectAll(a);
                  if(!(selection.empty())){
                     selection.transition().duration(1000).ease(d3.easeLinear).style('opacity',0).remove();
                  }
               }
            }
         }
      });

}

function translateAlong(path) {
   const length = path.getTotalLength();
   return function() {
      var r = d3.interpolate(0, length); //Set up interpolation from 0 to the path length
      return function(t){
         var point = path.getPointAtLength(r(t)); // Get the next point along the path
         d3.select(this) // Select the circle
            .attr("cx", point.x) // Set the cx
            .attr("cy", point.y) // Set the cy
      }
   }
 }

 function translateAlongLabels(path) {
   const length = path.getTotalLength();
   return function() {
      var r = d3.interpolate(0, length); //Set up interpolation from 0 to the path length
      return function(t){
         var point = path.getPointAtLength(r(t)); // Get the next point along the path
         d3.select(this) // Select the circle
            .attr("x", point.x) // Set the cx
            .attr("y", point.y) // Set the cy
      }
   }
 }

function redrawline(){
   svg.selectAll(".liie").remove();

   var boxes = d3.selectAll("input[type='checkbox']:checked");
   
   var attr = d3.select("#global_indicator").node().value;
   opacity = d3.select("#opacity").node().value;

   newYaxis = [];
   boxes.each(function() {
      if(this.name == "regions"){
         var countri = regions[this.value];
         for (var i=0; i<countri.length; i++){
            if(countries[countri[i].countries]){
               newYaxis = d3.merge([newYaxis, countries[countri[i].countries]]);
            }
         }
      }
   });

   var path, circle;
   
   y.domain([0, d3.max(newYaxis, function(d) { return +d[attr]; })])
   yAxis.transition().duration(1000).call(d3.axisLeft(y).tickFormat(d3.format(".2")));

   boxes.each(function() {   
      if(this.name == "regions"){
         var countri = regions[this.value];
         for (var i=0; i<countri.length; i++){
            if(countries[countri[i].countries]){
               // line generator
               var x1 = new Date(countries[countri[i].countries].at(-1).Year,0,1);
               var  y1 = countries[countri[i].countries].at(-1)[attr];

               const line = d3.line()
               .x(function(d) { return x(new Date(d.Year,0,1)); })
               .y(function(d) { return y(d[attr]) }) ;

               // Add the line
               path = svg.append("path")
               .datum(countries[countri[i].countries])
               .attr("class", "liie_"+ countri[i].geo + " liie" )
               .attr("fill", "none")
               .attr("stroke", color[this.value])
               .style("opacity", 0)
               // .attr()
               .attr("stroke-linejoin", "round")    
               .attr("stroke-linecap", "round")
               .attr("stroke-width", 1.5)
               .attr("d", line(countries[countri[i].countries]))
               .on('mouseover', function (d, i) {
                  d3.selectAll(".liie")
                     .style("opacity", 0.1)
                  var name = $(this).attr("class").split(" ")[0].split("_")[1];
                  d3.selectAll(".liie_"+ name)
                  .style("opacity", 1)
                  d3.selectAll(".circle_"+ name)
                  .style("opacity", 1)
                  d3.selectAll(".text_"+ name)
                        .style("opacity", 1)
               })
               .on('mouseout', function (d, i) {
                  d3.selectAll(".liie")
                  .style("opacity", opacity/100);
               });

               // draw circle at initial location
               circle = svg.append('circle')
               .attr("class", "circle_"+countri[i].geo + " liie" )
               .attr('fill', color[this.value])
               .style('opacity',opacity/100)
               .attr('r', 5)
               .attr("tempx", x1)
               .attr("tempy", y1)
               .on('mouseover', function (d, i) {
                  d3.selectAll(".liie")
                     .style("opacity", 0.1)
                  var name = $(this).attr("class").split(" ")[0].split("_")[1];
                  d3.selectAll(".liie_"+ name)
                  .style("opacity", 1)
                  d3.selectAll(".circle_"+ name)
                  .style("opacity", 1)
                  d3.selectAll(".text_"+ name)
                        .style("opacity", 1)
               })
               .on('mouseout', function (d, i) {
                  d3.selectAll(".liie")
                  .style("opacity", opacity/100);
               });

               const transitionPath = d3    .transition()    .ease(d3.easeSin)    .duration(2500);
               var pathLength = path.node().getTotalLength();
               path.attr("stroke-dashoffset", pathLength)    
                     .attr("stroke-dasharray", pathLength)
                     .transition(transitionPath) 
                     .delay(1100)   
                     .attr("stroke-dashoffset", 0)
                     .style('opacity',opacity/100)
                     .on("end", function(d, i){
                        $(this).attr("stroke-dashoffset", null)    
                        .attr("stroke-dasharray", null)
                        .attr("stroke-dashoffset", null)
                     });

                  // animate
               circle.transition().delay(1100) 
               .ease(d3.easeSin)
               .duration(2500)
               .attrTween('pathTween', translateAlong(path.node()))
               .on("end", function(d, i){
                     $(this).attr('pathTween', null);
                     $(this).attr('x', x($(this).tempx) );
                     $(this).attr('y', y($(this).tempy));
                     console.log(this);
                     $(this).attr("tempx", null);
                     $(this).attr("tempy", null);
               });
               
              
               var text = svg.append("text")
               .attr("class", "text_"+countri[i].geo + " liie")
               // .attr("transform", "translate(" + x(new Date(countries[countri[i].countries].at(-1).Year,0,1)) + "," + y(countries[countri[i].countries].at(-1)[attr]) + ")")
               .attr("dx", ".35em")
               .style("opacity", opacity/100)
               .attr("text-anchor", "start")
               .attr("tempx", x1)
               .attr("tempy", y1)
               .style("fill", color[this.value])
               .on('mouseover', function (d, i) {
                  d3.selectAll(".liie")
                  .style("opacity", 0.1)
                  var name = $(this).attr("class").split(" ")[0].split("_")[1];
                  d3.selectAll(".liie_"+ name)
                  .style("opacity", 1)
                  d3.selectAll(".circle_"+ name)
                  .style("opacity", 1)
                  d3.selectAll(".text_"+ name)
                        .style("opacity", 1)
               })
               .on('mouseout', function (d, i) {
                  d3.selectAll(".liie")
                  .style("opacity", opacity/100);
               })
               .text(countri[i].countries)
               .transition().delay(1100).ease(d3.easeSin).duration(2500)
               .attrTween('pathTween', translateAlongLabels(path.node()))
               .on("end", function(d, i){
                  console.log(x1, y1);
                  $(this).attr('pathTween', null);
                  $(this).attr('x', x($(this).tempx) );
                  $(this).attr('y', y($(this).tempy));
                  console.log(this);
                  $(this).attr("tempx", null);
                  $(this).attr("tempy", null);
               });

               // // circle.attrTween('pathTween', null);
               // path.attr("stroke-dashoffset", null)    
               //       .attr("stroke-dasharray", null)
                      
               //       .attr("stroke-dashoffset", null);
            }
         }
      }
   });
}

function populate_regions_dropdown(){
   // creating inputs in dropdown
   var keys = Object.keys(regions);
   var ul = document.getElementById("regions_ul");
   for( var i = 0; i < keys.length; i++ )
   { 
      var li = document.createElement("li");
      var label = document.createElement("label");
      var input = document.createElement("input");
      input.type = "checkbox";
      input.name = "regions";
      input.value = keys[i];
      label.appendChild(input);
      label.insertAdjacentText('beforeend', keys[i]);
      li.appendChild(label);
      ul.appendChild(li);   
   }
}

function get_countries_data(data){
   // creating a dict of regions
   data.forEach(data => {
      //console.log(+data["Year"]);
      if (+data["Year"] >= 1980 && +data["Year"] <= 2013){
         
         var row = {
            Year : +data["Year"],
            BirthRate : +data["Data.Health.Birth Rate"],
            DeathRate : +data["Data.Health.Death Rate"],
            FertilityRate : +data["Data.Health.Fertility Rate"],
            LifeExpenctancyTotal : +data["Data.Health.Life Expectancy at Birth, Total"],
            LifeExpenctancyMale : +data["Data.Health.Life Expectancy at Birth, Male"],
            LifeExpenctancyFeMale : +data["Data.Health.Life Expectancy at Birth, Female"],
            TotalPopulation : +data["Data.Health.Total Population"],
            UrbanPopulationPercent : +data["Data.Urban Development.Urban Population Percent"],
            UrbanPopulationDensity : +data["Data.Urban Development.Population Density"],
            RuralDevelopmentSurfaceArea : +data["Data.Rural Development.Surface Area"]
         };

         if(!(data["Country"] in countries)){
            countries[data["Country"]] = [];
         }
         var val = countries[data["Country"]];
         val.push(row);
         countries[data["Country"]] = val;
      }
   });
}

function get_region_data(values){
   // creating a dict of regions
   colors = ["red", "green", "blue", "brown", "purple", "orange", "black"]
   i =0;
   values.forEach(data => {
      var row = {
         geo : data["geo"],
         countries : data["name"]
      };
      if(!(data["World bank region"] in regions)){
         regions[data["World bank region"]] = [];
         color[data["World bank region"]] = colors[i];
         i++;
      }
      var val = regions[data["World bank region"]];
      val.push(row);
      regions[data["World bank region"]] = val;
   });
}