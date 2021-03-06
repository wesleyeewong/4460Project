var margin = {top: 100, right: 100, bottom: 100, left: 100},
width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

var color = d3.scale.ordinal()
	.range(["#d62728", "#2983F1", "#C49E57"]); //red Man United   blue Tottenham   yellow Arsenal 

if( (window.opener.ht == "Man United" ) && ( window.opener.at == "Tottenham") ){var color = d3.scale.ordinal().range(["#d62728", "#2983F1"]);}
else if ( (window.opener.at == "Man United" ) && ( window.opener.ht == "Tottenham") ){var color = d3.scale.ordinal().range(["#2983F1","#d62728"]);}
else if ( (window.opener.ht == "Man United" ) && ( window.opener.at == "Arsenal") ){var color = d3.scale.ordinal().range(["#d62728","#C49E57"]);}
else if ( (window.opener.at == "Man United" ) && ( window.opener.ht == "Arsenal") ){var color = d3.scale.ordinal().range(["#C49E57","#d62728"]);}
else if ( (window.opener.ht == "Tottenham" ) && ( window.opener.at == "Arsenal") ){var color = d3.scale.ordinal().range(["#2983F1","#C49E57"]);}
else if ( (window.opener.at == "Tottenham" ) && ( window.opener.ht == "Arsenal") ){var color = d3.scale.ordinal().range(["#C49E57","#2983F1"]);}

else if ( window.opener.ht == "Man United" ){var color = d3.scale.ordinal().range(["#d62728","white"]);}
else if ( window.opener.ht == "Arsenal"    ){var color = d3.scale.ordinal().range(["#C49E57","white"]);}
else if ( window.opener.ht == "Tottenham"  ){var color = d3.scale.ordinal().range(["#2983F1","white"]);}

else if ( window.opener.at == "Man United" ){var color = d3.scale.ordinal().range(["white","#d62728"]);}
else if ( window.opener.at == "Arsenal"    ){var color = d3.scale.ordinal().range(["white","#C49E57"]);}
else if ( window.opener.at == "Tottenham"  ){var color = d3.scale.ordinal().range(["white","#2983F1"]);}

var radarChartOptions = {
  w: width,
  h: height,
  margin: margin,
  maxValue: 0.5,
  levels: 5,
  roundStrokes: true,
  color: color
};
//Call function to draw the Radar chart

inputdata(window.opener.dmy,window.opener.ht);

function inputdata(dmy,ht){
	console.log(ht);
	year=+dmy.substring(dmy.length-2,dmy.length);
	month=+dmy.substring(dmy.length-7,dmy.length-5);
	//console.log(year);
	i=1;
	data = [
		  [//home
			{axis:"Full time goal",value:0.16},
			{axis:"Half time goal",value:0.35},
			{axis:"Shot",value:0.13},
			{axis:"Shots on target",value:0.20},
			{axis:"Foul",value:0.13},
			{axis:"Corner",value:0.35},
			{axis:"Yellow card",value:0.38},
			{axis:"Red card",value:0.38}
		  ],[//away
			{axis:"Full time goal",value:0.10},
			{axis:"Half time goal",value:0.30},
			{axis:"Shot",value:0.14},
			{axis:"Shots on target",value:0.22},
			{axis:"Foul",value:0.04},
			{axis:"Corne",value:0.41},
			{axis:"Yellow card",value:0.30},
			{axis:"Red card",value:0.38}
		  ]
		];
	if( (year==10 && month>7) || (year==11 && month<7) ){
		d3.csv("10-11.csv",function(d) {
	
				return d;
		
	    		},function(error,csvdata){  
			for(k=0;k<csvdata.length;k++){
				if( (csvdata[k].Date == dmy) && (csvdata[k].HomeTeam==ht) ){
				i=k;
				console.log(dmy);
				}			
			}
			console.log(i);
	    		if(error){  
				console.log(error);  
	    		}  

			data[0][0].value= calhper(+csvdata[i].FTHG , +csvdata[i].FTAG);
			data[1][0].value= calaper(+csvdata[i].FTHG , +csvdata[i].FTAG);

			data[0][1].value= calhper(+csvdata[i].HTHG , +csvdata[i].HTAG);
			data[1][1].value= calaper(+csvdata[i].HTHG , +csvdata[i].HTAG);

			data[0][2].value= calhper(+csvdata[i].HS , +csvdata[i].AS);
			data[1][2].value= calaper(+csvdata[i].HS , +csvdata[i].AS);

			data[0][3].value= calhper(+csvdata[i].HST , +csvdata[i].AST);
			data[1][3].value= calaper(+csvdata[i].HST , +csvdata[i].AST);

			data[0][4].value= calhper(+csvdata[i].HF , +csvdata[i].AF);
			data[1][4].value= calaper(+csvdata[i].HF , +csvdata[i].AF);

			data[0][5].value= calhper(+csvdata[i].HC , +csvdata[i].AC);
			data[1][5].value= calaper(+csvdata[i].HC , +csvdata[i].AC);

			data[0][6].value= calhper(+csvdata[i].HY , +csvdata[i].AY);
			data[1][6].value= calaper(+csvdata[i].HY , +csvdata[i].AY);

			data[0][7].value= calhper(+csvdata[i].HR , +csvdata[i].AR);
			data[1][7].value= calaper(+csvdata[i].HR , +csvdata[i].AR);

	 		RadarChart(".radarChart", data, radarChartOptions);
		});}

	if( (year==11 && month>7) || (year==12 && month<7) ){
		d3.csv("11-12.csv",function(d) {
	
				return d;
		
	    		},function(error,csvdata){  
			for(k=0;k<csvdata.length;k++){
				if( (csvdata[k].Date == dmy) && (csvdata[k].HomeTeam==ht) ){
				i=k;
				console.log(dmy);
				}			
			}
			console.log(i);
	    		if(error){  
				console.log(error);  
	    		}  

			data[0][0].value= calhper(+csvdata[i].FTHG , +csvdata[i].FTAG);
			data[1][0].value= calaper(+csvdata[i].FTHG , +csvdata[i].FTAG);

			data[0][1].value= calhper(+csvdata[i].HTHG , +csvdata[i].HTAG);
			data[1][1].value= calaper(+csvdata[i].HTHG , +csvdata[i].HTAG);

			data[0][2].value= calhper(+csvdata[i].HS , +csvdata[i].AS);
			data[1][2].value= calaper(+csvdata[i].HS , +csvdata[i].AS);

			data[0][3].value= calhper(+csvdata[i].HST , +csvdata[i].AST);
			data[1][3].value= calaper(+csvdata[i].HST , +csvdata[i].AST);

			data[0][4].value= calhper(+csvdata[i].HF , +csvdata[i].AF);
			data[1][4].value= calaper(+csvdata[i].HF , +csvdata[i].AF);

			data[0][5].value= calhper(+csvdata[i].HC , +csvdata[i].AC);
			data[1][5].value= calaper(+csvdata[i].HC , +csvdata[i].AC);

			data[0][6].value= calhper(+csvdata[i].HY , +csvdata[i].AY);
			data[1][6].value= calaper(+csvdata[i].HY , +csvdata[i].AY);

			data[0][7].value= calhper(+csvdata[i].HR , +csvdata[i].AR);
			data[1][7].value= calaper(+csvdata[i].HR , +csvdata[i].AR);

	 		RadarChart(".radarChart", data, radarChartOptions);
		});}
	
	if( (year==12 && month>7) || (year==13 && month<7) ){
		d3.csv("12-13.csv",function(d) {
	
				return d;
		
	    		},function(error,csvdata){  
			for(k=0;k<csvdata.length;k++){
				if( (csvdata[k].Date == dmy) && (csvdata[k].HomeTeam==ht) ){
				i=k;
				console.log(dmy);
				}			
			}
			console.log(i);
	    		if(error){  
				console.log(error);  
	    		}  

			data[0][0].value= calhper(+csvdata[i].FTHG , +csvdata[i].FTAG);
			data[1][0].value= calaper(+csvdata[i].FTHG , +csvdata[i].FTAG);

			data[0][1].value= calhper(+csvdata[i].HTHG , +csvdata[i].HTAG);
			data[1][1].value= calaper(+csvdata[i].HTHG , +csvdata[i].HTAG);

			data[0][2].value= calhper(+csvdata[i].HS , +csvdata[i].AS);
			data[1][2].value= calaper(+csvdata[i].HS , +csvdata[i].AS);

			data[0][3].value= calhper(+csvdata[i].HST , +csvdata[i].AST);
			data[1][3].value= calaper(+csvdata[i].HST , +csvdata[i].AST);

			data[0][4].value= calhper(+csvdata[i].HF , +csvdata[i].AF);
			data[1][4].value= calaper(+csvdata[i].HF , +csvdata[i].AF);

			data[0][5].value= calhper(+csvdata[i].HC , +csvdata[i].AC);
			data[1][5].value= calaper(+csvdata[i].HC , +csvdata[i].AC);

			data[0][6].value= calhper(+csvdata[i].HY , +csvdata[i].AY);
			data[1][6].value= calaper(+csvdata[i].HY , +csvdata[i].AY);

			data[0][7].value= calhper(+csvdata[i].HR , +csvdata[i].AR);
			data[1][7].value= calaper(+csvdata[i].HR , +csvdata[i].AR);

	 		RadarChart(".radarChart", data, radarChartOptions);
		});}

	if( (year==13 && month>7) || (year==14 && month<7) ){
		d3.csv("13-14.csv",function(d) {
	
				return d;
		
	    		},function(error,csvdata){  
			for(k=0;k<csvdata.length;k++){
				if( (csvdata[k].Date == dmy) && (csvdata[k].HomeTeam==ht) ){
				i=k;
				console.log(dmy);
				}			
			}
			console.log(i);
	    		if(error){  
				console.log(error);  
	    		}  

			data[0][0].value= calhper(+csvdata[i].FTHG , +csvdata[i].FTAG);
			data[1][0].value= calaper(+csvdata[i].FTHG , +csvdata[i].FTAG);

			data[0][1].value= calhper(+csvdata[i].HTHG , +csvdata[i].HTAG);
			data[1][1].value= calaper(+csvdata[i].HTHG , +csvdata[i].HTAG);

			data[0][2].value= calhper(+csvdata[i].HS , +csvdata[i].AS);
			data[1][2].value= calaper(+csvdata[i].HS , +csvdata[i].AS);

			data[0][3].value= calhper(+csvdata[i].HST , +csvdata[i].AST);
			data[1][3].value= calaper(+csvdata[i].HST , +csvdata[i].AST);

			data[0][4].value= calhper(+csvdata[i].HF , +csvdata[i].AF);
			data[1][4].value= calaper(+csvdata[i].HF , +csvdata[i].AF);

			data[0][5].value= calhper(+csvdata[i].HC , +csvdata[i].AC);
			data[1][5].value= calaper(+csvdata[i].HC , +csvdata[i].AC);

			data[0][6].value= calhper(+csvdata[i].HY , +csvdata[i].AY);
			data[1][6].value= calaper(+csvdata[i].HY , +csvdata[i].AY);

			data[0][7].value= calhper(+csvdata[i].HR , +csvdata[i].AR);
			data[1][7].value= calaper(+csvdata[i].HR , +csvdata[i].AR);

	 		RadarChart(".radarChart", data, radarChartOptions);
		});}

	if( (year==14 && month>7) || (year==15 && month<7) ){
		d3.csv("14-15.csv",function(d) {
	
				return d;
		
	    		},function(error,csvdata){  
			for(k=0;k<csvdata.length;k++){
				if( (csvdata[k].Date == dmy) && (csvdata[k].HomeTeam==ht) ){
				i=k;
				console.log(dmy);
				}			
			}
			console.log(i);
	    		if(error){  
				console.log(error);  
	    		}  

			data[0][0].value= calhper(+csvdata[i].FTHG , +csvdata[i].FTAG);
			data[1][0].value= calaper(+csvdata[i].FTHG , +csvdata[i].FTAG);

			data[0][1].value= calhper(+csvdata[i].HTHG , +csvdata[i].HTAG);
			data[1][1].value= calaper(+csvdata[i].HTHG , +csvdata[i].HTAG);

			data[0][2].value= calhper(+csvdata[i].HS , +csvdata[i].AS);
			data[1][2].value= calaper(+csvdata[i].HS , +csvdata[i].AS);

			data[0][3].value= calhper(+csvdata[i].HST , +csvdata[i].AST);
			data[1][3].value= calaper(+csvdata[i].HST , +csvdata[i].AST);

			data[0][4].value= calhper(+csvdata[i].HF , +csvdata[i].AF);
			data[1][4].value= calaper(+csvdata[i].HF , +csvdata[i].AF);

			data[0][5].value= calhper(+csvdata[i].HC , +csvdata[i].AC);
			data[1][5].value= calaper(+csvdata[i].HC , +csvdata[i].AC);

			data[0][6].value= calhper(+csvdata[i].HY , +csvdata[i].AY);
			data[1][6].value= calaper(+csvdata[i].HY , +csvdata[i].AY);

			data[0][7].value= calhper(+csvdata[i].HR , +csvdata[i].AR);
			data[1][7].value= calaper(+csvdata[i].HR , +csvdata[i].AR);

	 		RadarChart(".radarChart", data, radarChartOptions);
		});}
}

function calhper(h,a){
	if((h+a)==0){return 0.5;}
	return h/(a+h);
}

function calaper(h,a){
	if((h+a)==0){return 0.5;}
	return a/(a+h);
}
	
function RadarChart(id, data, options) {
	
	var cfg = {
	 w: 600,				//Width of the circle
	 h: 600,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scale.category10()	//Color function
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format('%'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scale.linear()
		.range([0, radius])
		.domain([0, maxValue]);

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);


	var texttitle = svg.append("text")
		.attr("class", "title")
		.attr('transform', 'translate(90,0)') 
		.attr("x", 150)
		.attr("y", 25)
		.attr("font-size", "12px")
		.attr("fill", "white")
		.text( window.opener.dmy+" "+window.opener.ht+" vs "+window.opener.at);

	var LegendOptions = [window.opener.ht+' (hometeam)',window.opener.at+' (awayteam)'];

	var colorscale = d3.scale.category10();	

	var legend = svg.append("g")
		.attr("class", "legend")
		.attr("height", 100)
		.attr("width", 200)
		.attr('transform', 'translate(90,20)') 
		;
		//Create colour squares
	legend.selectAll('rect')
		  .data(LegendOptions)
		  .enter()
		  .append("rect")
		  .attr("x", 500 - 65)
		  .attr("y", function(d, i){ return i * 20;})
		  .attr("width", 10)
		  .attr("height", 10)
		  .style("fill", function(d, i){ return color(i);})
		  ;
		//Create text next to squares
	legend.selectAll('text')
		  .data(LegendOptions)
		  .enter()
		  .append("text")
		  .attr("x", 500 - 52)
		  .attr("y", function(d, i){ return i * 20 + 9;})
		  .attr("font-size", "11px")
		  .attr("fill", "white")
		  .text(function(d) { return d; })
		  ;


	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "white")
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });
	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);
	
	//The radial line function
	var radarLine = d3.svg.line.radial()
		.interpolate("linear-closed")
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(cfg.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);	
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { return cfg.color(j); })
		.style("fill-opacity", 0.8);
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { console.log(d); return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(Format(d.value))
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function(){
			tooltip.transition().duration(200)
				.style("opacity", 0);
		});
		
	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);


	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	
	
}
