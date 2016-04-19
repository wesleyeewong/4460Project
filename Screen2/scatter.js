window.onload = start;

var default_size = 3;

var sizeForCircle = function(d) {
  return  3 * d["GoalDiff"];
}

function start() {
	var scatter = document.getElementById("scatterplot");
	var margin = {top: 50, right: 10, bottom: 75, left: 150};
	var width = 1500 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;
	
d3.csv("10-11.csv", function(error, data) {
					
		var xValue = function(d) { 
					//console.log(d["Date"]);
					   return d["Date"];
					},
			xScale = d3.scale.ordinal().rangeRoundBands([0, width]), 
			xMap = function(d) { return xScale(xValue(d));}, 
			xAxis = d3.svg.axis().scale(xScale).orient("bottom");
						
	// setup y
		var yValue = function(d) { 
						if(d["HomeTeam"] == "Arsenal" || d["HomeTeam"] == "Man United" || d["HomeTeam"] == "Tottenham") {
							return d["HomeTeam"];
						}
						if(d["AwayTeam"] == "Arsenal"  || d["AwayTeam"] == "Man United" || d["AwayTeam"] == "Tottenham") {
							 return d["AwayTeam"];  
						}
					},
			yScale = d3.scale.ordinal().rangeRoundBands([0, height],1), // value -> display
			yMap = function(d) { return yScale(yValue(d));}, // data -> display
			yAxis = d3.svg.axis().scale(yScale).orient("left");

		var svg1 = d3.select(".scatterplot").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var tooltip = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

		//Scatter Plot Start
		
//SCATTER PLOT==============================================================================================
	// x-axis
	xScale.domain(data.map(function(d) {return d["Date"]; }));
	yScale.domain(data.map(function(d) {
						if(d["HomeTeam"] == "Arsenal" || d["HomeTeam"] == "Man United" || d["HomeTeam"] == "Tottenham") {
							return d["HomeTeam"];
						}
						if(d["AwayTeam"] == "Arsenal"  || d["AwayTeam"] == "Man United" || d["AwayTeam"] == "Tottenham") {
							 return d["AwayTeam"];  
						}
					}));
		svg1.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.attr("fill", "white")
			.call(xAxis)
			.selectAll("text")	
			.attr("fill", "white")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                })
			.append("text")
			.attr("class", "label")
			.attr("x", width)
			.attr("y", -6)
			.attr("fill", "white");
		
		// y-axis
		svg1.append("g")
			.attr("class", "y axis")
			.attr("fill", "white")
			.call(yAxis)
			.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.attr("fill", "white")
			.style("text-anchor", "end")
			.text("Team");
	
	//Tooltip
	var tooltip = d3.select("body").append("div")
					.attr("class", "tooltip")
					.style("opacity", 0);
		
	// Draw Dots
		var MDot = svg1.append("g")
						  .selectAll(".dot")
						  .data(data)
						  .enter()
						  .append("circle")
						  .filter(function(d) { 
										if(yValue(d) == "Man United"){
											return yValue(d);
										}
									})
						  .attr("class", "M dot")
						  .attr("r", function(d){
										  if(d["MATCH"] == "D") {
											return 3;
										  }else{
											return 3 * d["GoalDiff"];
										  }
						  })
						  .attr("cx", xMap)
						  .attr("cy", yMap)
						  .style("opacity", 1)
						  .style("fill", function(d){
											if(d["MATCH"] == "H") {
												if(d["HomeTeam"] == "Man United") {
													return "green";
												} else {
													return "red"
												}
											} else if(d["MATCH"] == "A") {
												if(d["AwayTeam"] == "Man United") {
													return "green";
												} else {
													return "red"
												}
											} else if(d["MATCH"] == "D") {
												return "white";
											} 
						  })
						  .on("mouseover", function(d) {
								tooltip.transition()        
									.duration(200)      
									.style("opacity", .8);      
	   							tooltip.html(d["HomeTeam"] + " VS "+ d["AwayTeam"] + "<br/>"  + d["HG"] + " : "+ d["AG"]+ "<br/>" + d["Date"])
									.style("left", (d3.event.pageX + 15) + "px")     
									.style("top", (d3.event.pageY + 15) + "px")
									.style('font-size', '15px');   
						  })
						  .on("mouseout", function(d) {
								tooltip.transition()        
									.duration(500)      
									.style("opacity", 0);   
						  });

		var ADot = svg1.append("g")
						  .selectAll(".dot")
						  .data(data)
						  .enter()
						  .append("circle")
						  .filter(function(d) { 
										if(yValue(d) == "Arsenal"){
											return yValue(d);
										}
									})
						  .attr("class", "M dot")
						  .attr("r", function(d){
										  if(d["MATCH"] == "D") {
											return 3;
										  }else{
											return 3 * d["GoalDiff"];
										  }
						  })
						  .attr("cx", xMap)
						  .attr("cy", yMap)
						  .style("opacity", 1)
						  .style("fill", function(d){
											console.log("first"+d["MATCH"]);		
												if(d["MATCH"] == "H") {
													if(d["HomeTeam"] == "Arsenal") {
														return "green";
													} else {
														return "red"
													}
												} else if(d["MATCH"] == "A") {
													if(d["AwayTeam"] == "Arsenal") {
														return "green";
													} else {
														return "red"
													}
												} else if(d["MATCH"] == "D") {
													return "white";
												} 
						  })
						  .on("mouseover", function(d) {
								tooltip.transition()        
									.duration(200)      
									.style("opacity", .8);      
	   							tooltip.html(d["HomeTeam"] + " VS "+ d["AwayTeam"] + "<br/>"  + d["HG"] + " : "+ d["AG"]+ "<br/>" + d["Date"])
									.style("left", (d3.event.pageX + 15) + "px")     
									.style("top", (d3.event.pageY + 15) + "px")
									.style('font-size', '15px');   
						  })
						  .on("mouseout", function(d) {
								tooltip.transition()        
									.duration(500)      
									.style("opacity", 0);   
						  });
		var TDot = svg1.append("g")
						  .selectAll(".dot")
						  .data(data)
						  .enter()
						  .append("circle")
						  .filter(function(d) { 
										if(yValue(d) == "Tottenham"){
											return yValue(d);
										}
									})
						  .attr("class", "M dot")
						  .attr("r", function(d){
										  if(d["MATCH"] == "D") {
											return 3;
										  }else{
											return 3 * d["GoalDiff"];
										  }
						  })
						  .attr("cx", xMap)
						  .attr("cy", yMap)
						  .style("opacity", 1)
						  .style("fill", function(d){
											console.log("first"+d["MATCH"]);		
												if(d["MATCH"] == "H") {
													if(d["HomeTeam"] == "Tottenham") {
														return "green";
													} else {
														return "red"
													}
												} else if(d["MATCH"] == "A") {
													if(d["AwayTeam"] == "Tottenham") {
														return "green";
													} else {
														return "red"
													}
												} else if(d["MATCH"] == "D") {
													return "white";
												} 
						  })
						  .on("mouseover", function(d) {
								tooltip.transition()        
									.duration(200)      
									.style("opacity", .8);      
	   							tooltip.html(d["HomeTeam"] + " VS "+ d["AwayTeam"] + "<br/>"  + d["HG"] + " : "+ d["AG"]+ "<br/>" + d["Date"])
									.style("left", (d3.event.pageX + 15) + "px")     
									.style("top", (d3.event.pageY + 15) + "px")
									.style('font-size', '15px');   
						  })
						  .on("mouseout", function(d) {
								tooltip.transition()        
									.duration(500)      
									.style("opacity", 0);   
						  });
	})
}