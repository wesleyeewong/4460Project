window.onload = start;

function turnToInt(d) {
	d.FTHG = +d.FTHG;
	d.FTAG = +d.FTAG;
	d.HTHG = +d.HTHG;
	d.HS = +d.HS;
	d.AS = +d.AS;
	d.HST = +d.HST;
	d.AST = +d.AST;
	d.HF = +d.HF;
	d.AF = +d.AF;
	d.HC = +d.HC;
	d.AC = +d.AC;
	d.HY = +d.HY;
	d.AY = +d.AY;
	d.HR = +d.HR;
	d.AR = +d.AR;
};

function generateStatObject(d, team) {

	var homeWin = 0;
	var homeLoss = 0;
	var homeDraw = 0;
	var awayWin = 0;
	var awayLoss = 0;
	var awayDraw = 0;
	var total = 0;
	var homeStats = [];
	var awayStats = [];
	var homeTotalGoalScored = 0;
	var homeTotalGoalConceded = 0;
	var awayTotalGoalScored = 0;
	var awayTotalGoalConceded = 0;

	d.forEach(function(e) {

		if (e.HomeTeam == team) {
			if (e.FTR == "H") {
				homeWin += 1;
			} else if (e.FTR == "A") {
				homeLoss += 1;
			} else {
				homeDraw += 1;
			}
			total += 1;

			var statsObject = {
				date: e.Date, homeGoals: e.FTHG, awayGoals: e.FTAG, homeShots: e.HS, awayShots: e.AS, 
				homeShotsOnTarget: e.HST, awayShotsOnTarget: e.AST, homeFoul: e.HF, awayFoul: e.AF,
				homeCorner: e.HC, awayCorner: e.AC, homeYellow: e.HY, awayYellow: e.AY, homeRed: e.HR, awayRed: e.AR};

			homeStats.push(statsObject);

			homeTotalGoalScored += e.FTHG;
			homeTotalGoalConceded += e.FTAG;
		}
		if (e.AwayTeam == team) {
			if (e.FTR == "A") {
				awayWin += 1;
			} else if (e.FTR == "H") {
				awayLoss += 1;
			} else {
				awayDraw += 1;
			}
			total += 1;

			var statsObject = {
				date: e.Date, homeGoals: e.FTHG, awayGoals: e.FTAG, homeShots: e.HS, awayShots: e.AS, 
				homeShotsOnTarget: e.HST, awayShotsOnTarget: e.AST, homeFoul: e.HF, awayFoul: e.AF,
				homeCorner: e.HC, awayCorner: e.AC, homeYellow: e.HY, awayYellow: e.AY, homeRed: e.HR, awayRed: e.AR};

			awayStats.push(statsObject);

			awayTotalGoalScored += e.FTAG;
			awayTotalGoalConceded += e.FTHG;
		}

	});

	return {homeW:homeWin, homeL:homeLoss, homeD:homeDraw, 
		awayW:awayWin, awayL:awayLoss, awayD:awayDraw, totalG:total, hStats: homeStats, aStats: awayStats, 
		homeTGS: homeTotalGoalScored, homeTGC: homeTotalGoalConceded, awayTGS: awayTotalGoalScored, awayTGC: awayTotalGoalConceded};

}

function totalStats(d) {

	var totalShots = 0;
	var totalShotsOnTarget = 0;
	var totalFouls = 0;
	var totalCorners = 0;
	var totalYellows = 0;
	var totalReds = 0;
	var stats = [];

	d.aStats.forEach(function(e) {
		totalShots += e.awayShots;
		totalShotsOnTarget += e.awayShotsOnTarget;
		totalFouls += e.awayFoul;
		totalCorners += e.awayCorner;
		totalYellows += e.awayYellow;
		totalReds += e.awayRed;
	});
	d.hStats.forEach(function(e) {
		totalShots += e.homeShots
		totalShotsOnTarget += e.homeShotsOnTarget;
		totalFouls += e.homeFoul;
		totalCorners += e.homeCorner;
		totalYellows += e.homeYellow;
		totalReds += e.homeRed;
	});

	stats.push({key:"tShots", value:totalShots});
	stats.push({key:"tShotsOnTarget", value:totalShotsOnTarget});
	stats.push({key:"tFouls", value:totalFouls});
	stats.push({key:"tCorners", value:totalCorners});
	stats.push({key:"tYellows", value:totalYellows});
	stats.push({key:"tReds", value:totalReds});

	return stats;

}

function start() {

	var lineGraph = document.getElementById("graph");
	var stats = document.getElementById("stats");
	var scatterGraph = document.getElementById("graph2");

	// Constants
	var margin = {top:40, right:40, left:40, bottom:40};
	// var cWidth = 650;
	var h = window.innerHeight;
	console.log(h);
	var g = document.getElementsByClassName("divWraps")[0];
	var cWidth = g.clientWidth;
	console.log(g.clientHeight);
	var sWidth = cWidth/2;
	var cHeight = h-267;
	var width = cWidth - margin.left - margin.right - 50;
	var height = h-317 - margin.top - margin.bottom;
	var xOffset = 25;
	var yOffset = 25;
	var totalSeasons = 5;
	var totalGamesPerSeason = 380;
	var totalTeamsInLeague = 20;
	var gamesPlayedPerTeam = 38;
	var targetTeams = ["Arsenal", "Tottenham", "Man United"];
	var targetSeason = ["10/11", "11/12", "12/13", "13/14", "14/15"];
	var statsList = ["Shots", "Shots On Target", "Fouls", "Corners", "Yellow Cards", "Red Cards"];
	var circleRadius = 10;
	var legendSlection = 5;
	var dotSelection = 6;
	// End constants

	var scatterClicked = false;

	// START SCATTER GRAPH DEFINITION

	var scatterDiv = d3.select(scatterGraph);
	scatterDiv.append("h2").attr("id", "scatter_title").text("Season individual game win/loss and goal diffs");
	scatterSvg = scatterDiv.append("svg")
		.attr("width", (cWidth*2))
		.attr("height", cHeight)
		.append("g");

	var scatterXScale = d3.scale.ordinal().rangeRoundBands([0, ((cWidth*2)-margin.left-margin.right)]);
	var uniqueDate = function(d) { return d3.map(d, function(e) { return e["Date"]; }).keys() };
	var scatterXMap = function(d) { return scatterXScale(d["Date"]); };
	var scatterXAxis =	d3.svg.axis().scale(scatterXScale).orient("bottom");

	var scatterYValue = function(d, team) { 
		if(d["HomeTeam"] == team || d["AwayTeam"] == team) {
			return d["HomeTeam"]; 
		}
	};
	var scatterYScale = d3.scale.ordinal().rangeRoundBands([0, height],1), // value -> display
			scatterYMap = function(d) { return scatterYScale(scatterYValue(d));}, // data -> display
			scatterYAxis = d3.svg.axis().scale(scatterYScale).orient("left");


	// START LINE GRAPH DEFINITION
	var lineSvg = d3.select(lineGraph)
		.append("svg")
		.attr("width", cWidth)
		.attr("height", cHeight)
		.append("g");

	var statsTable = d3.select(stats);

	statsTable.append("h2").attr("id", "stats_title").text("Season averaged stats");

	var statsSvg = statsTable.append("svg")
		.attr("width", cWidth)
		.attr("height", cHeight)
		.append("g");

	// X and Y scalings
	var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.3);
	var yScale = d3.scale.linear().range([height, 0]);

	// X and Y bar stats scalings
	var xBarScale = d3.scale.linear().range([0, (width/3)]);
	var xBarShotsScale = d3.scale.linear().range([0, (width/3)]);
	var xBarShotsOnTargetScale = d3.scale.linear().range([0, (width/3)]);
	var xBarFoulsScale = d3.scale.linear().range([0, (width/3)]);
	var xBarCornersScale = d3.scale.linear().range([0, (width/3)]);
	var xBarYellowsScale = d3.scale.linear().range([0, (width/3)]);
	var xBarRedsScale = d3.scale.linear().range([0, (width/3)]);
	var yBarScale = d3.scale.ordinal().rangeRoundBands([(height/3), 0], 0.5);

	// // X and Y bar axis
	var yBarAxis = d3.svg.axis().scale(yBarScale).orient("left").tickFormat("");

	// Axis
	var xAxis = function(d) { return d3.svg.axis().scale(d).orient("bottom"); };
	var yAxis = d3.svg.axis().scale(yScale).orient("left");

	// setup x
	var xValue = function(d) { return d.key; };
	var xMap = function(d) { return xScale(xValue(d)); };

	// setup y TODO: fix y mapping
	var yValueManU = function(d) { return ((d.manU.homeW + d.manU.awayW)*3+d.manU.homeD+d.manU.awayD); };
	var yValueTott = function(d) { return ((d.tott.homeW + d.tott.awayW)*3+d.tott.homeD+d.tott.awayD) ;};
	var yValueOther = function(d) { return ((d.other.homeW + d.tott.awayW)*3+d.other.homeD+d.other.awayD)/16; };
	var yMapManU = function(d) { return yScale(yValueManU(d)); };
	var yMapTott = function(d) { return yScale(yValueTott(d)); };
	var yMapOther = function(d) { return yScale(yValueOther(d)); };

	// New y Setup
	var yValueArsenal = function(d) { return ((d.arsenal.homeW + d.arsenal.awayW)*3 + d.arsenal.homeD + d.arsenal.awayD); };
	var yValueManUnited = function(d) { return ((d.manUnited.homeW + d.manUnited.awayW)*3 + d.manUnited.homeD + d.manUnited.awayD); };
	var yValueTottenham = function(d) { return ((d.tottenham.homeW + d.tottenham.awayW)*3 + d.tottenham.homeD + d.tottenham.awayD); };
	var yMapArsenal = function(d) { return yScale(yValueArsenal(d)); };
	var yMapManUnited = function(d) { return yScale(yValueManUnited(d)); };
	var yMapTottenham = function(d) { return yScale(yValueTottenham(d)); };

	// Color
	var color = d3.scale.ordinal().range(["#d62728", "#2983F1", "#C49E57"]);
	// END LINE GRAPH

	var lineFunction = d3.svg.line()
							.x(function(d) {return d.x;})
							.y(function(d) {return d.y;})
							.interpolate("linear");

	// add tooltip area 
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("z-index", 10)
		.style("opacity", 0);

	d3.csv("10-11.csv", function(d) {
		turnToInt(d);
		return d;
	}, function(error, data1011) {
		d3.csv("11-12.csv", function(d) {
			turnToInt(d);
			return d;
		}, function(error2, data1112) {
			d3.csv("12-13.csv", function(d) {
				turnToInt(d);
				return d;
			}, function(error3, data1213) {
				d3.csv("13-14.csv", function(d) {
					turnToInt(d);
					return d;
				}, function(error4, data1314) {
					d3.csv("14-15.csv", function(d) {
						turnToInt(d);
						return d;
					}, function(error5, data1415) {

						// New data object, use this one instead
						// Contains all the stats, and dates
						// Please refer to generateStatObject function at the top too see additional stat it has

						// Generate arsenal stats
						var arsenalStat1011 = generateStatObject(data1011, "Arsenal");
						var arsenalStat1112 = generateStatObject(data1112, "Arsenal");
						var arsenalStat1213 = generateStatObject(data1213, "Arsenal");
						var arsenalStat1314 = generateStatObject(data1314, "Arsenal");
						var arsenalStat1415 = generateStatObject(data1415, "Arsenal");

						// Generate man united stats
						var manUnitedStat1011 = generateStatObject(data1011, "Man United");
						var manUnitedStat1112 = generateStatObject(data1112, "Man United");
						var manUnitedStat1213 = generateStatObject(data1213, "Man United");
						var manUnitedStat1314 = generateStatObject(data1314, "Man United");
						var manUnitedStat1415 = generateStatObject(data1415, "Man United");

						// Generate tottenham stats
						var tottenhamStat1011 = generateStatObject(data1011, "Tottenham");
						var tottenhamStat1112 = generateStatObject(data1112, "Tottenham");
						var tottenhamStat1213 = generateStatObject(data1213, "Tottenham");
						var tottenhamStat1314 = generateStatObject(data1314, "Tottenham");
						var tottenhamStat1415 = generateStatObject(data1415, "Tottenham");

						var parsedData = [
						{
							key: "10/11",
							arsenal: arsenalStat1011,
							manUnited: manUnitedStat1011,
							tottenham: tottenhamStat1011,
							raw: data1011
						}, {
							key: "11/12",
							arsenal: arsenalStat1112,
							manUnited: manUnitedStat1112,
							tottenham: tottenhamStat1112,
							raw: data1112
						}, {
							key: "12/13",
							arsenal: arsenalStat1213,
							manUnited: manUnitedStat1213,
							tottenham: tottenhamStat1213,
							raw: data1213
						}, {
							key: "13/14",
							arsenal: arsenalStat1314,
							manUnited: manUnitedStat1314,
							tottenham: tottenhamStat1314,
							raw: data1314
						}, {
							key: "14/15",
							arsenal: arsenalStat1415,
							manUnited: manUnitedStat1415,
							tottenham: tottenhamStat1415,
							raw: data1415
						}];

						// X and Y scaling domains
						xScale.domain(targetSeason.map(function(d) {
							// console.log(d);
							return d;
						}));
						yScale.domain([55, 95]);

						yBarScale.domain(targetTeams.map(function(d) {
							return d;
						}));
						xBarScale.domain([0,20]);
						xBarShotsScale.domain([0,20]);
						xBarShotsOnTargetScale.domain([0,14]);
						xBarFoulsScale.domain([0,16]);
						xBarCornersScale.domain([0,12]);
						xBarYellowsScale.domain([0,6]);
						xBarRedsScale.domain([0,1]);

						// Drawing x and y axis
						lineSvg.append("g")
							.attr("class", "x-axis")
							.attr("id", "scatter-x-axis")
							.attr("transform", "translate("+xOffset+", "+(yOffset+height+30)+")")
							.call(xAxis(xScale))
							.style("font-size", 15)
							.attr("fill", "white")
							.append("text")
							.attr("x", (cWidth)-100 )
							.attr("y", 28 )
							.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
							.text("Seasons");

						lineSvg.append("g")
							.attr("class", "y-axis")
							.attr("transform", "translate("+xOffset+", "+yOffset+")")
							.call(yAxis)
							.style("font-size", 15)
							.attr("fill", "white")
							.append("text")
							.attr("class", "label")
							.attr("transform", "rotate(0)")
							.attr("y", -18)
							.attr("x", 26)
							.attr("dy", ".71em")
							.attr("fill", "white")
							.style("text-anchor", "end")
							.text("Points");

						

						var bars = lineSvg.append("g")
							.selectAll(".bar")
							.data(parsedData)
							.enter();

						bars.append("rect")
							.attr("class", "areaBar")
							.attr("id", function(d) {
								return "bar_" + d.key.replace(" Season", "").replace("/", "_");
							})
							.attr("clicked", "F")
							.attr("x", function(d) {
								return xMap(d) + xOffset;
							})
							.attr("y", yOffset)
							.attr("width", 105)
							.attr("height", height)
							.attr("fill", "black")
							.style("opacity", 0)
							.on("mouseover", function(d) {
								lineSvg.select("#" + "bar_" + d.key.replace(" Season", "").replace("/", "_")).transition().duration(500).style("opacity", 0.5);
							})
							.on("mouseout", function(d) {
								var thisBar = lineSvg.select("#" + "bar_" + d.key.replace(" Season", "").replace("/", "_"));
								if (thisBar.attr("clicked") == "F") {
									thisBar.transition().duration(250).style("opacity", 0); 
								}
							})
							.on("click", function(d) {

								lineSvg.selectAll(".areaBar").style("opacity", 0).attr("clicked", "F");
								lineSvg.select("#" + "bar_" + d.key.replace(" Season", "").replace("/", "_")).attr("clicked", "T").style("opacity", 0.5);

								statsTable.select("#stats_title")
									.text(d.key + " season averaged stats");
								scatterDiv.select("#scatter_title")
									.text(d.key + " season | Individual game win/loss and goal diffs");

								statsSvg.selectAll("*").remove();
								
								var arsenalTotalStats = totalStats(d.arsenal);
								var manUnitedTotalStats = totalStats(d.manUnited);
								var tottenhamTotalStats = totalStats(d.tottenham);
								console.log(arsenalTotalStats);

								// Arsenal bars
								var arsenal = statsSvg.append("g")
									.selectAll(".arsenal")
									.data(arsenalTotalStats)
									.enter();
								arsenal.append("rect")
									.attr("class", function(d) { return d.key + " " + "arsenal"; })
									.attr("id", function(d) { return d.key + "_arsenal"; })
									.attr("x", 0)
									.attr("y", function(d) {
										return yBarScale("Arsenal");
									})
									.attr("height", 30)
									.attr("fill", color("other"));

								// Tottenham bars
								var tottenham = statsSvg.append("g")
									.selectAll(".tottenham")
									.data(tottenhamTotalStats)
									.enter(); 
								tottenham.append("rect")
									.attr("class", function(d) { return d.key + " " + "tottenham"; })
									.attr("id", function(d) { return d.key + "_tottenham"; })
									.attr("x", 0)
									.attr("y", function(d) {
										return yBarScale("Tottenham");
									})
									.attr("height", 30)
									.attr("fill", color("tott"));

								// Manchester United bar
								var manUnited = statsSvg.append("g")
									.selectAll(".manUnited")
									.data(manUnitedTotalStats)
									.enter()
								manUnited.append("rect")
									.attr("class", function(d) { return d.key + " " + "manUnited"; })
									.attr("id", function(d) { return d.key + "_manUnited"; })
									.attr("x", 0)
									.attr("y", function(d) {
										return yBarScale("Man United");
									})
									.attr("height", 30)
									.attr("fill", color("manU"));

								// Adjust bars
								var shots = statsSvg.selectAll(".tShots")
									.attr("transform", "translate("+xOffset+", "+yOffset+")")
									.attr("width", function(d) {
										return xBarShotsScale((d.value/gamesPlayedPerTeam));
									})
									.attr("originalWidth", function(d) {
										return xBarShotsScale((d.value/gamesPlayedPerTeam));
									});
								var shotsOnTarget = statsSvg.selectAll(".tShotsOnTarget")
									.attr("transform", "translate("+(xOffset+(width/3)+90)+", "+yOffset+")")
									.attr("width", function(d) {
										return xBarShotsOnTargetScale((d.value/gamesPlayedPerTeam));
									})
									.attr("originalWidth", function(d) {
										return xBarShotsOnTargetScale((d.value/gamesPlayedPerTeam));
									});
								var fouls = statsSvg.selectAll(".tFouls")
									.attr("transform", "translate("+xOffset+", "+(yOffset+(height/3)+40)+")")
									.attr("width", function(d) {
										return xBarFoulsScale((d.value/gamesPlayedPerTeam));
									})
									.attr("originalWidth", function(d) {
										return xBarFoulsScale((d.value/gamesPlayedPerTeam));
									});
								var corners = statsSvg.selectAll(".tCorners")
									.attr("transform", "translate("+(xOffset+(width/3)+90)+", "+(yOffset+(height/3)+40)+")")
									.attr("width", function(d) {
										return xBarCornersScale((d.value/gamesPlayedPerTeam));
									})
									.attr("originalWidth", function(d) {
										return xBarCornersScale((d.value/gamesPlayedPerTeam));
									});
								var yellows = statsSvg.selectAll(".tYellows")
									.attr("transform", "translate("+xOffset+", "+(yOffset+((height/3)*2)+80)+")")
									.attr("width", function(d) {
										return xBarYellowsScale((d.value/gamesPlayedPerTeam));
									})
									.attr("originalWidth", function(d) {
										return xBarYellowsScale((d.value/gamesPlayedPerTeam));
									});
								var reds = statsSvg.selectAll(".tReds")
									.attr("transform", "translate("+(xOffset+(width/3)+90)+", "+(yOffset+((height/3)*2)+80)+")")
									.attr("width", function(d) {
										return xBarRedsScale((d.value/gamesPlayedPerTeam));
									})
									.attr("originalWidth", function(d) {
										return xBarRedsScale((d.value/gamesPlayedPerTeam));
									});


								// Left side
								// statsSvg.append("g")
								// 	.attr("class", "y-axis")
								// 	.attr("id", "s_y-axis")
								// 	.attr("transform", "translate("+xOffset+", "+yOffset+")")
								// 	.call(yBarAxis)
								// 	.attr("fill", "white");

								statsSvg.append("g")
									.attr("class", "x-axis tShots")
									.attr("id", "s_x-axis")
									.attr("transform", "translate("+xOffset+", "+(yOffset+(height/3))+")")
									// .call(xBarShotsAxis)
									.call(xAxis(xBarShotsScale))
									.attr("fill", "white")
									.append("text")
									.attr("x", 0)
									.attr("y", -(height/3.3))
									.style("font-size", 15)
									.attr("class", "statsHeader")
									.text("Shots");

								// statsSvg.append("g")
								// 	.attr("class", "y-axis")
								// 	.attr("id", "F_y-axis")
								// 	.attr("transform", "translate("+xOffset+", "+(yOffset+(height/3)+40)+")")
								// 	.call(yBarAxis)
								// 	.attr("fill", "white");

								statsSvg.append("g")
									.attr("class", "x-axis tFouls")
									.attr("id", "F_x-axis")
									.attr("transform", "translate("+xOffset+", "+(yOffset+((height/3)*2)+40)+")")
									.call(xAxis(xBarFoulsScale))
									.attr("fill", "white")
									.append("text")
									.attr("x", 0)
									.attr("y", -(height/3.3))
									.style("font-size", 15)
									.attr("class", "statsHeader")
									.text("Fouls");

								// statsSvg.append("g")
								// 	.attr("class", "y-axis")
								// 	.attr("id", "Y_y-axis")
								// 	.attr("transform", "translate("+xOffset+", "+(yOffset+((height/3)*2)+80)+")")
								// 	.call(yBarAxis)
								// 	.attr("fill", "white");

								statsSvg.append("g")
									.attr("class", "x-axis tYellows")
									.attr("id", "Y_x-axis")
									.attr("transform", "translate("+xOffset+", "+(yOffset+((height/3)*3)+80)+")")
									.call(xAxis(xBarYellowsScale))
									.attr("fill", "white")
									.append("text")
									.attr("x", 0)
									.attr("y", -(height/3.3))
									.style("font-size", 15)
									.attr("class", "statsHeader")
									.text("Yellow Cards");

								// Right side
								// statsSvg.append("g")
								// 	.attr("class", "y-axis")
								// 	.attr("id", "SOT_y-axis")
								// 	.attr("transform", "translate("+(xOffset+(width/3)+90)+", "+yOffset+")")
								// 	.call(yBarAxis)
								// 	.attr("fill", "white");

								statsSvg.append("g")
									.attr("class", "x-axis tShotsOnTarget")
									.attr("id", "SOT_x-axis")
									.attr("transform", "translate("+(xOffset+(width/3)+90)+", "+(yOffset+(height/3))+")")
									.call(xAxis(xBarShotsOnTargetScale))
									.attr("fill", "white")
									.append("text")
									.attr("x", 0)
									.attr("y", -(height/3.3))
									.style("font-size", 15)
									.attr("class", "statsHeader")
									.text("Shots On Target");

								// statsSvg.append("g")
								// 	.attr("class", "y-axis")
								// 	.attr("id", "C_y-axis")
								// 	.attr("transform", "translate("+(xOffset+(width/3)+90)+", "+(yOffset+(height/3)+40)+")")
								// 	.call(yBarAxis)
								// 	.attr("fill", "white");

								statsSvg.append("g")
									.attr("class", "x-axis tCorners")
									.attr("id", "C_x-axis")
									.attr("transform", "translate("+(xOffset+(width/3)+90)+", "+(yOffset+((height/3)*2)+40)+")")
									.call(xAxis(xBarCornersScale))
									.attr("fill", "white")
									.append("text")
									.attr("x", 0)
									.attr("y", -(height/3.3))
									.style("font-size", 15)
									.attr("class", "statsHeader")
									.text("Corners");

								// statsSvg.append("g")
								// 	.attr("class", "y-axis")
								// 	.attr("id", "R_y-axis")
								// 	.attr("transform", "translate("+(xOffset+(width/3)+90)+", "+(yOffset+((height/3)*2)+80)+")")
								// 	.call(yBarAxis)
								// 	.attr("fill", "white");

								statsSvg.append("g")
									.attr("class", "x-axis tReds")
									.attr("id", "R_x-axis")
									.attr("transform", "translate("+(xOffset+(width/3)+90)+", "+(yOffset+((height/3)*3)+80)+")")
									.call(xAxis(xBarRedsScale))
									.attr("fill", "white")
									.append("text")
									.attr("x", 0)
									.attr("y", -(height/3.3))
									.style("font-size", 15)
									.attr("class", "statsHeader")
									.text("Red Cards");

								// END MULTI STAT BAR CHART

								// START SCATTERPLOT
								scatterSvg.selectAll("*").remove();
								scatterXScale.domain(uniqueDate(d.raw));
								scatterYScale.domain(targetTeams.map(function(d) {
									return d;
								}));

								scatterSvg.append("g")
									.attr("class", "x-axis")
									.attr("id", "x-scatter")
									.attr("transform", "translate("+xOffset+", "+(height)+")")
									.call(scatterXAxis)
									.attr("fill", "white")
									.selectAll("text")
									.attr("fill", "white")
									.style("text-anchor", "end")
									.attr("dx", "-.8em")
									.attr("dy", ".15em")
									.attr("transform", function(d) {
										return "rotate(-65)";
									})
									.append("text")
									.attr("class", "label")
									.attr("x", width)
									.attr("y", -6)
									.attr("fill", "white");
								
								// draw legend
								scatterLegend = d3.scale.ordinal()
														.domain(["WIN", "LOSS", "DRAW"])
														.range(["green", "black", "white"]);

								var legend = scatterSvg.selectAll(".legend")
									.data(scatterLegend.domain())
									.enter().append("g")
									.attr("class", "legend")
									.attr("transform", function(d, i) { return "translate(" + i * 60 + ",0)"; });

								// draw legend colored rectangles
								legend.append("rect") // FIX
									.attr("x", width - 75)
									.attr("y", 2)
									.attr("rx", 100)
									.attr("ry", 100)
									.attr("stroke", "white")
									.attr("stroke-width", 1)
									.attr("width", 16)
									.attr("height", 16)
									.style("fill", scatterLegend);

								// draw legend text
								legend.append("text")
									.attr("x", width - 24)
									.attr("y", 9)
									.attr("dy", ".35em")
									.attr("fill", "white")
									.style("text-anchor", "end")
									.text(function(d) { return d;});
														
								// Draw team rects
								var scatterRects = scatterSvg.append("g")
									.selectAll(".scatterRects")
									.data(targetTeams)
									.enter()
									.append("rect")
									.attr("transform", "translate(0,-40)")
									.attr("class", "scatterRects")
									.attr("class", function(e) { return e + "_scatterRects"; })
									.attr("x", 0)
									.attr("y", function(e) { return scatterYScale(e); })
									.attr("width", (cWidth*1.965))
									.attr("height", 80)
									.style("fill", function(e) {
										if (e == "Arsenal") {
											return color("other");
										} else if (e == "Man United") {
											return color("manU");
										}
										return color("tott");
									});

								// Draw dots
								var MDot = scatterSvg.append("g")
									.selectAll(".dot")
									.data(d.raw)
									.enter()
									.append("circle")
									.filter(function(e) { 
												if (e.HomeTeam == "Man United" || e.AwayTeam == "Man United") {
													return "Man United";
												}
											})
									.attr("class", "M-dot")
									.attr("id", function(e) {
										return "manUnited_" + e["Date"];
									})
									.attr("clicked", "F")
									.attr("r", function(e){
												  if(e["FTR"] == "D") {
													return 8;
												  }else{
													return 10 + Math.abs(e.FTHG-e.FTAG)*2.5;
												  }
									})
									.attr("cx", function(e) { return scatterXMap(e)+xOffset; })
									.attr("cy", scatterYScale("Man United"))
									.style("opacity", 1)
									.style("fill", function(e){
													if(e["FTR"] == "H") {
														if(e["HomeTeam"] == "Man United") {
															return "#00AD00";
														} else {
															return "black"
														}
													} else if(e["FTR"] == "A") {
														if(e["AwayTeam"] == "Man United") {
															return "#00AD00";
														} else {
															return "black"
														}
													} else if(e["FTR"] == "D") {
														return "white";
													} 
									})
									.on("mouseover", function(e) {
										tooltip.transition()        
											.duration(200)      
											.style("opacity", .8);      
											tooltip.html(e["HomeTeam"] + " VS "+ e["AwayTeam"] + "<br/>"  + e["FTHG"] + " : "+ e["FTAG"]+ "<br/>" + e["Date"])
											.style("left", (d3.event.pageX + 15) + "px")     
											.style("top", (d3.event.pageY + 15) + "px")
											.style('font-size', '15px');  

										console.log(d3.select(this).attr("cx"));
										scatterSvg.append("rect")
											.attr("id", "referenceLine")
											.attr("height", height-d3.select(this).attr("cy")+25)
											.attr("width", 2)
											.attr("x", d3.select(this).attr("cx"))
											.attr("y", d3.select(this).attr("cy"))
											.style("fill", "yellow")
											.style("opacity", 0.5);

										if (!scatterClicked) {
											d3.selectAll(".M-dot").style("opacity", 0.2);
											d3.selectAll(".A-dot").style("opacity", 1);
											d3.selectAll(".T-dot").style("opacity", 1);
											d3.select(this).style("opacity", 1);
										}
									})
									.on("mouseout", function(e) {
										tooltip.transition()        
											.duration(500)      
											.style("opacity", 0);  

										scatterSvg.select("#referenceLine").remove(); 

										if (!scatterClicked) {
											d3.selectAll(".M-dot").style("opacity", 1);
											d3.selectAll(".A-dot").style("opacity", 1);
											d3.selectAll(".T-dot").style("opacity", 1);
										}
									})
									.on("click", function(e) {
										var thisDot = d3.select(this);
										var data = thisDot[0][0].__data__;
										window.dmy=data.Date;
										window.ht=data.HomeTeam;
										window.at=data.AwayTeam;
										console.log(window.ht);
										window.open ('radar.html', 'newwindow', 'height=800, width=800, top=0,left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes') ;
										statsSvg.select("#tShots_manUnited").attr("width", statsSvg.select("#tShots_manUnited").attr("originalWidth"));
										statsSvg.select("#tShotsOnTarget_manUnited").attr("width", statsSvg.select("#tShotsOnTarget_manUnited").attr("originalWidth"));
										statsSvg.select("#tFouls_manUnited").attr("width", statsSvg.select("#tFouls_manUnited").attr("originalWidth"));
										statsSvg.select("#tCorners_manUnited").attr("width", statsSvg.select("#tCorners_manUnited").attr("originalWidth"));
										statsSvg.select("#tYellows_manUnited").attr("width", statsSvg.select("#tYellows_manUnited").attr("originalWidth"));
										statsSvg.select("#tReds_manUnited").attr("width", statsSvg.select("#tReds_manUnited").attr("originalWidth"));

										statsSvg.select("#tShots_arsenal").attr("width", statsSvg.select("#tShots_arsenal").attr("originalWidth"));
										statsSvg.select("#tShotsOnTarget_arsenal").attr("width", statsSvg.select("#tShotsOnTarget_arsenal").attr("originalWidth"));
										statsSvg.select("#tFouls_arsenal").attr("width", statsSvg.select("#tFouls_arsenal").attr("originalWidth"));
										statsSvg.select("#tCorners_arsenal").attr("width", statsSvg.select("#tCorners_arsenal").attr("originalWidth"));
										statsSvg.select("#tYellows_arsenal").attr("width", statsSvg.select("#tYellows_arsenal").attr("originalWidth"));
										statsSvg.select("#tReds_arsenal").attr("width", statsSvg.select("#tReds_arsenal").attr("originalWidth"));

										statsSvg.select("#tShots_tottenham").attr("width", statsSvg.select("#tShots_tottenham").attr("originalWidth"));
										statsSvg.select("#tShotsOnTarget_tottenham").attr("width", statsSvg.select("#tShotsOnTarget_tottenham").attr("originalWidth"));
										statsSvg.select("#tFouls_tottenham").attr("width", statsSvg.select("#tFouls_tottenham").attr("originalWidth"));
										statsSvg.select("#tCorners_tottenham").attr("width", statsSvg.select("#tCorners_tottenham").attr("originalWidth"));
										statsSvg.select("#tYellows_tottenham").attr("width", statsSvg.select("#tYellows_tottenham").attr("originalWidth"));
										statsSvg.select("#tReds_tottenham").attr("width", statsSvg.select("#tReds_tottenham").attr("originalWidth"));

										statsSvg.selectAll(".tottenham").style("opacity", 1);
										statsSvg.selectAll(".arsenal").style("opacity", 1);
										statsSvg.selectAll(".manUnited").style("opacity", 1);

										console.log("manU dot clicked");
										if (thisDot.attr("clicked") == "F") {
											d3.selectAll(".M-dot").style("opacity", 0.2).attr("clicked", "F");
											d3.selectAll(".A-dot").style("opacity", 1).attr("clicked", "F");
											d3.selectAll(".T-dot").style("opacity", 1).attr("clicked", "F");
											thisDot.attr("clicked", "T");
											thisDot.style("opacity", 1);
											scatterClicked = true;

											

											if (data.homeTeam == "Man United") {
												statsSvg.select("#tShots_manUnited").transition().duration(500).attr("width", xBarShotsScale(data.HS));
												statsSvg.select("#tShotsOnTarget_manUnited").transition().duration(500).attr("width", xBarShotsScale(data.HST));
												statsSvg.select("#tFouls_manUnited").transition().duration(500).attr("width", xBarShotsScale(data.HF));
												statsSvg.select("#tCorners_manUnited").transition().duration(500).attr("width", xBarShotsScale(data.HC));
												statsSvg.select("#tYellows_manUnitedl").transition().duration(500).attr("width", xBarShotsScale(data.HY));
												statsSvg.select("#tReds_manUnited").transition().duration(500).attr("width", xBarShotsScale(data.HR));
												statsSvg.selectAll(".tottenham").transition().duration(500).style("opacity", 0.05);
												statsSvg.selectAll(".arsenal").transition().duration(500).style("opacity", 0.05);	
											}
											else {
												statsSvg.select("#tShots_manUnited").transition().duration(500).attr("width", xBarShotsScale(data.AS));
												statsSvg.select("#tShotsOnTarget_manUnited").transition().duration(500).attr("width", xBarShotsScale(data.AST));
												statsSvg.select("#tFouls_manUnited").transition().duration(500).attr("width", xBarShotsScale(data.AF));
												statsSvg.select("#tCorners_manUnited").transition().duration(500).attr("width", xBarShotsScale(data.AC));
												statsSvg.select("#tYellows_manUnited").transition().duration(500).attr("width", xBarShotsScale(data.AY));
												statsSvg.select("#tReds_manUnited").transition().duration(500).attr("width", xBarShotsScale(data.AR));
												statsSvg.selectAll(".tottenham").transition().duration(500).style("opacity", 0.05);
												statsSvg.selectAll(".arsenal").transition().duration(500).style("opacity", 0.05);
											}
										}
										else if (thisDot.attr("clicked") == "T") {
											d3.selectAll(".M-dot").attr("clicked", "F");
											d3.selectAll(".A-dot").attr("clicked", "F");
											d3.selectAll(".T-dot").attr("clicked", "F");
											d3.selectAll(".M-dot").style("opacity", 1);
											d3.selectAll(".A-dot").style("opacity", 1);
											d3.selectAll(".T-dot").style("opacity", 1);
											scatterClicked = false;

											statsSvg.select("#tShots_manUnited").transition().duration(500).attr("width", statsSvg.select("#tShots_manUnited").attr("originalWidth"));
											statsSvg.select("#tShotsOnTarget_manUnited").transition().duration(500).attr("width", statsSvg.select("#tShotsOnTarget_manUnited").attr("originalWidth"));
											statsSvg.select("#tFouls_manUnited").transition().duration(500).attr("width", statsSvg.select("#tFouls_manUnited").attr("originalWidth"));
											statsSvg.select("#tCorners_manUnited").transition().duration(500).attr("width", statsSvg.select("#tCorners_manUnited").attr("originalWidth"));
											statsSvg.select("#tYellows_manUnited").transition().duration(500).attr("width", statsSvg.select("#tYellows_manUnited").attr("originalWidth"));
											statsSvg.select("#tReds_manUnited").transition().duration(500).attr("width", statsSvg.select("#tReds_manUnited").attr("originalWidth"));
											statsSvg.selectAll(".tottenham").transition().duration(500).style("opacity", 1);
											statsSvg.selectAll(".arsenal").transition().duration(500).style("opacity", 1);
										}
										
									});

								var ADot = scatterSvg.append("g")
									.selectAll(".dot")
									.data(d.raw)
									.enter()
									.append("circle")
									.filter(function(e) { 
												if (e.HomeTeam == "Arsenal" || e.AwayTeam == "Arsenal") {
													return "Arsenal";
												}
											})
									.attr("class", "A-dot")
									.attr("id", function(e) {
										return "arsenal_" + e["Date"]
									})
									.attr("clicked", "F")
									.attr("r", function(e){
												  if(e["FTR"] == "D") {
													return 8;
												  }else{
													return 10 + Math.abs(e.FTHG-e.FTAG)*2.5;
												  }
									})
									.attr("cx", function(e) { return scatterXMap(e)+xOffset; })
									.attr("cy", scatterYScale("Arsenal"))
									.style("opacity", 1)
									.style("fill", function(e){
													if(e["FTR"] == "H") {
														if(e["HomeTeam"] == "Arsenal") {
															return "#00AD00";
														} else {
															return "black"
														}
													} else if(e["FTR"] == "A") {
														if(e["AwayTeam"] == "Arsenal") {
															return "#00AD00";
														} else {
															return "black"
														}
													} else if(e["FTR"] == "D") {
														return "white";
													} 
									})
									.on("mouseover", function(e) {
										tooltip.transition()        
											.duration(200)      
											.style("opacity", .8);      
											tooltip.html(e["HomeTeam"] + " VS "+ e["AwayTeam"] + "<br/>"  + e["FTHG"] + " : "+ e["FTAG"]+ "<br/>" + e["Date"])
											.style("left", (d3.event.pageX + 15) + "px")     
											.style("top", (d3.event.pageY + 15) + "px")
											.style('font-size', '15px');  

										scatterSvg.append("rect")
											.attr("id", "referenceLine")
											.attr("height", height-d3.select(this).attr("cy")+25)
											.attr("width", 2)
											.attr("x", d3.select(this).attr("cx"))
											.attr("y", d3.select(this).attr("cy"))
											.style("fill", "yellow")
											.style("opacity", 0.5); 

										if (!scatterClicked) {
											d3.selectAll(".M-dot").style("opacity", 1);
											d3.selectAll(".A-dot").style("opacity", 0.2);
											d3.selectAll(".T-dot").style("opacity", 1);
											d3.select(this).style("opacity", 1);
										}	
									})
									.on("mouseout", function(e) {
										tooltip.transition()        
											.duration(500)      
											.style("opacity", 0);

										scatterSvg.select("#referenceLine").remove();

										if (!scatterClicked) {
											d3.selectAll(".M-dot").style("opacity", 1);
											d3.selectAll(".A-dot").style("opacity", 1);
											d3.selectAll(".T-dot").style("opacity", 1);   
										}
									})
									.on("click", function(e) {
										var thisDot = d3.select(this);
										var data = thisDot[0][0].__data__;
										window.dmy=data.Date;
										window.ht=data.HomeTeam;
										window.at=data.AwayTeam;
										window.open ('radar.html', 'newwindow', 'height=800, width=800, top=0,left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes') ;
										statsSvg.select("#tShots_manUnited").attr("width", statsSvg.select("#tShots_manUnited").attr("originalWidth"));
										statsSvg.select("#tShotsOnTarget_manUnited").attr("width", statsSvg.select("#tShotsOnTarget_manUnited").attr("originalWidth"));
										statsSvg.select("#tFouls_manUnited").attr("width", statsSvg.select("#tFouls_manUnited").attr("originalWidth"));
										statsSvg.select("#tCorners_manUnited").attr("width", statsSvg.select("#tCorners_manUnited").attr("originalWidth"));
										statsSvg.select("#tYellows_manUnited").attr("width", statsSvg.select("#tYellows_manUnited").attr("originalWidth"));
										statsSvg.select("#tReds_manUnited").attr("width", statsSvg.select("#tReds_manUnited").attr("originalWidth"));

										statsSvg.select("#tShots_arsenal").attr("width", statsSvg.select("#tShots_arsenal").attr("originalWidth"));
										statsSvg.select("#tShotsOnTarget_arsenal").attr("width", statsSvg.select("#tShotsOnTarget_arsenal").attr("originalWidth"));
										statsSvg.select("#tFouls_arsenal").attr("width", statsSvg.select("#tFouls_arsenal").attr("originalWidth"));
										statsSvg.select("#tCorners_arsenal").attr("width", statsSvg.select("#tCorners_arsenal").attr("originalWidth"));
										statsSvg.select("#tYellows_arsenal").attr("width", statsSvg.select("#tYellows_arsenal").attr("originalWidth"));
										statsSvg.select("#tReds_arsenal").attr("width", statsSvg.select("#tReds_arsenal").attr("originalWidth"));

										statsSvg.select("#tShots_tottenham").attr("width", statsSvg.select("#tShots_tottenham").attr("originalWidth"));
										statsSvg.select("#tShotsOnTarget_tottenham").attr("width", statsSvg.select("#tShotsOnTarget_tottenham").attr("originalWidth"));
										statsSvg.select("#tFouls_tottenham").attr("width", statsSvg.select("#tFouls_tottenham").attr("originalWidth"));
										statsSvg.select("#tCorners_tottenham").attr("width", statsSvg.select("#tCorners_tottenham").attr("originalWidth"));
										statsSvg.select("#tYellows_tottenham").attr("width", statsSvg.select("#tYellows_tottenham").attr("originalWidth"));
										statsSvg.select("#tReds_tottenham").attr("width", statsSvg.select("#tReds_tottenham").attr("originalWidth"));

										statsSvg.selectAll(".tottenham").style("opacity", 1);
										statsSvg.selectAll(".arsenal").style("opacity", 1);
										statsSvg.selectAll(".manUnited").style("opacity", 1);

										console.log("Arsenal clicked");
										if (thisDot.attr("clicked") == "F") {
											d3.selectAll(".M-dot").style("opacity", 1).attr("clicked", "F");
											d3.selectAll(".A-dot").style("opacity", 0.2).attr("clicked", "F");
											d3.selectAll(".T-dot").style("opacity", 1).attr("clicked", "F");
											thisDot.attr("clicked", "T");
											thisDot.style("opacity", 1);
											scatterClicked = true;

											

											if (data.homeTeam == "Arsenal") {
												statsSvg.select("#tShots_arsenal").transition().duration(500).attr("width", xBarShotsScale(data.HS));
												statsSvg.select("#tShotsOnTarget_arsenal").transition().duration(500).attr("width", xBarShotsScale(data.HST));
												statsSvg.select("#tFouls_arsenal").transition().duration(500).attr("width", xBarShotsScale(data.HF));
												statsSvg.select("#tCorners_arsenal").transition().duration(500).attr("width", xBarShotsScale(data.HC));
												statsSvg.select("#tYellows_arsenal").transition().duration(500).attr("width", xBarShotsScale(data.HY));
												statsSvg.select("#tReds_arsenal").transition().duration(500).attr("width", xBarShotsScale(data.HR));
												statsSvg.selectAll(".tottenham").transition().duration(500).style("opacity", 0.05);
												statsSvg.selectAll(".manUnited").transition().duration(500).style("opacity", 0.05);
											}
											else {
												statsSvg.select("#tShots_arsenal").transition().duration(500).attr("width", xBarShotsScale(data.AS));
												statsSvg.select("#tShotsOnTarget_arsenal").transition().duration(500).attr("width", xBarShotsScale(data.AST));
												statsSvg.select("#tFouls_arsenal").transition().duration(500).attr("width", xBarShotsScale(data.AF));
												statsSvg.select("#tCorners_arsenal").transition().duration(500).attr("width", xBarShotsScale(data.AC));
												statsSvg.select("#tYellows_arsenal").transition().duration(500).attr("width", xBarShotsScale(data.AY));
												statsSvg.select("#tReds_arsenal").transition().duration(500).attr("width", xBarShotsScale(data.AR));
												statsSvg.selectAll(".tottenham").transition().duration(500).style("opacity", 0.05);
												statsSvg.selectAll(".manUnited").transition().duration(500).style("opacity", 0.05);
											}
										}
										else if (thisDot.attr("clicked") == "T") {
											d3.selectAll(".M-dot").attr("clicked", "F");
											d3.selectAll(".A-dot").attr("clicked", "F");
											d3.selectAll(".T-dot").attr("clicked", "F");
											d3.selectAll(".M-dot").style("opacity", 1);
											d3.selectAll(".A-dot").style("opacity", 1);
											d3.selectAll(".T-dot").style("opacity", 1);
											scatterClicked = false;

											statsSvg.select("#tShots_arsenal").transition().duration(500).attr("width", statsSvg.select("#tShots_arsenal").attr("originalWidth"));
											statsSvg.select("#tShotsOnTarget_arsenal").transition().duration(500).attr("width", statsSvg.select("#tShotsOnTarget_arsenal").attr("originalWidth"));
											statsSvg.select("#tFouls_arsenal").transition().duration(500).attr("width", statsSvg.select("#tFouls_arsenal").attr("originalWidth"));
											statsSvg.select("#tCorners_arsenal").transition().duration(500).attr("width", statsSvg.select("#tCorners_arsenal").attr("originalWidth"));
											statsSvg.select("#tYellows_arsenal").transition().duration(500).attr("width", statsSvg.select("#tYellows_arsenal").attr("originalWidth"));
											statsSvg.select("#tReds_arsenal").transition().duration(500).attr("width", statsSvg.select("#tReds_arsenal").attr("originalWidth"));
											statsSvg.selectAll(".tottenham").transition().duration(500).style("opacity", 1);
											statsSvg.selectAll(".manUnited").transition().duration(500).style("opacity", 1);
										}
										
									});

								var TDot = scatterSvg.append("g")
									.selectAll(".dot")
									.data(d.raw)
									.enter()
									.append("circle")
									.filter(function(e) { 
												if (e.HomeTeam == "Tottenham" || e.AwayTeam == "Tottenham") {
													return "Tottenham";
												}
											})
									.attr("class", "T-dot")
									.attr("id", function(e) {
										return "tottenham_" + e["Date"]
									})
									.attr("clicked", "F")
									.attr("r", function(e){
												  if(e["FTR"] == "D") {
													return 8;
												  }else{
													return 10 + Math.abs(e.FTHG-e.FTAG)*2.5;
												  }
									})
									.attr("cx", function(e) { return scatterXMap(e)+xOffset; })
									.attr("cy", scatterYScale("Tottenham"))
									.style("opacity", 1)
									.style("fill", function(e){
													if(e["FTR"] == "H") {
														if(e["HomeTeam"] == "Tottenham") {
															return "#00AD00";
														} else {
															return "black"
														}
													} else if(e["FTR"] == "A") {
														if(e["AwayTeam"] == "Tottenham") {
															return "#00AD00";
														} else {
															return "black"
														}
													} else if(e["FTR"] == "D") {
														return "white";
													} 
									})
									.on("mouseover", function(e) {
										tooltip.transition()        
											.duration(200)      
											.style("opacity", .8);      
											tooltip.html(e["HomeTeam"] + " VS "+ e["AwayTeam"] + "<br/>"  + e["FTHG"] + " : "+ e["FTAG"]+ "<br/>" + e["Date"])
											.style("left", (d3.event.pageX + 15) + "px")     
											.style("top", (d3.event.pageY + 15) + "px")
											.style('font-size', '15px');
											 if (!scatterClicked) {
												d3.selectAll(".M-dot").style("opacity", 1);
												d3.selectAll(".A-dot").style("opacity", 1);
												d3.selectAll(".T-dot").style("opacity", 0.2);
												d3.select(this).style("opacity", 1);
											}

											scatterSvg.append("rect")
												.attr("id", "referenceLine")
												.attr("height", height-d3.select(this).attr("cy")+25)
												.attr("width", 2)
												.attr("x", d3.select(this).attr("cx"))
												.attr("y", d3.select(this).attr("cy"))
												.style("fill", "yellow")
												.style("opacity", 0.5);

									})
									.on("mouseout", function(e) {
										tooltip.transition()        
											.duration(500)      
											.style("opacity", 0);  

										scatterSvg.select("#referenceLine").remove();

										if (!scatterClicked) {
											d3.selectAll(".M-dot").style("opacity", 1);
											d3.selectAll(".A-dot").style("opacity", 1);
											d3.selectAll(".T-dot").style("opacity", 1);
										}
									})
									.on("click", function(e) {
										var thisDot = d3.select(this);
										var data = thisDot[0][0].__data__;
										window.dmy=data.Date;
										window.ht=data.HomeTeam;
										window.at=data.AwayTeam;
										window.open ('radar.html', 'newwindow', 'height=800, width=800, top=0,left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes') ;
										statsSvg.select("#tShots_manUnited").attr("width", statsSvg.select("#tShots_manUnited").attr("originalWidth"));
										statsSvg.select("#tShotsOnTarget_manUnited").attr("width", statsSvg.select("#tShotsOnTarget_manUnited").attr("originalWidth"));
										statsSvg.select("#tFouls_manUnited").attr("width", statsSvg.select("#tFouls_manUnited").attr("originalWidth"));
										statsSvg.select("#tCorners_manUnited").attr("width", statsSvg.select("#tCorners_manUnited").attr("originalWidth"));
										statsSvg.select("#tYellows_manUnited").attr("width", statsSvg.select("#tYellows_manUnited").attr("originalWidth"));
										statsSvg.select("#tReds_manUnited").attr("width", statsSvg.select("#tReds_manUnited").attr("originalWidth"));

										statsSvg.select("#tShots_arsenal").attr("width", statsSvg.select("#tShots_arsenal").attr("originalWidth"));
										statsSvg.select("#tShotsOnTarget_arsenal").attr("width", statsSvg.select("#tShotsOnTarget_arsenal").attr("originalWidth"));
										statsSvg.select("#tFouls_arsenal").attr("width", statsSvg.select("#tFouls_arsenal").attr("originalWidth"));
										statsSvg.select("#tCorners_arsenal").attr("width", statsSvg.select("#tCorners_arsenal").attr("originalWidth"));
										statsSvg.select("#tYellows_arsenal").attr("width", statsSvg.select("#tYellows_arsenal").attr("originalWidth"));
										statsSvg.select("#tReds_arsenal").attr("width", statsSvg.select("#tReds_arsenal").attr("originalWidth"));

										statsSvg.select("#tShots_tottenham").attr("width", statsSvg.select("#tShots_tottenham").attr("originalWidth"));
										statsSvg.select("#tShotsOnTarget_tottenham").attr("width", statsSvg.select("#tShotsOnTarget_tottenham").attr("originalWidth"));
										statsSvg.select("#tFouls_tottenham").attr("width", statsSvg.select("#tFouls_tottenham").attr("originalWidth"));
										statsSvg.select("#tCorners_tottenham").attr("width", statsSvg.select("#tCorners_tottenham").attr("originalWidth"));
										statsSvg.select("#tYellows_tottenham").attr("width", statsSvg.select("#tYellows_tottenham").attr("originalWidth"));
										statsSvg.select("#tReds_tottenham").attr("width", statsSvg.select("#tReds_tottenham").attr("originalWidth"));

										statsSvg.selectAll(".tottenham").style("opacity", 1);
										statsSvg.selectAll(".arsenal").style("opacity", 1);
										statsSvg.selectAll(".manUnited").style("opacity", 1);

										console.log("Tottenham clicked");
										
										if (thisDot.attr("clicked") == "F") {
											d3.selectAll(".M-dot").style("opacity", 1).attr("clicked", "F");
											d3.selectAll(".A-dot").style("opacity", 1).attr("clicked", "F");
											d3.selectAll(".T-dot").style("opacity", 0.2).attr("clicked", "F");
											thisDot.attr("clicked", "T");
											thisDot.style("opacity", 1);
											scatterClicked = true;

											
						
											if (data.homeTeam == "Tottenham") {
												statsSvg.select("#tShots_tottenham").tranition().duration(500).attr("width", xBarShotsScale(data.HS));
												statsSvg.select("#tShotsOnTarget_tottenham").transition().duration(500).attr("width", xBarShotsScale(data.HST));
												statsSvg.select("#tFouls_tottenham").transition().duration(500).attr("width", xBarShotsScale(data.HF));
												statsSvg.select("#tCorners_tottenham").transition().duration(500).attr("width", xBarShotsScale(data.HC));
												statsSvg.select("#tYellows_tottenham").transition().duration(500).attr("width", xBarShotsScale(data.HY));
												statsSvg.select("#tReds_tottenham").transition().duration(500).attr("width", xBarShotsScale(data.HR));
												statsSvg.selectAll(".arsenal").transition().duration(500).style("opacity", 0.05);
												statsSvg.selectAll(".manUnited").transition().duration(500).style("opacity", 0.05);
											}
											else {
												statsSvg.select("#tShots_tottenham").transition().duration(500).attr("width", xBarShotsScale(data.AS));
												statsSvg.select("#tShotsOnTarget_tottenham").transition().duration(500).attr("width", xBarShotsScale(data.AST));
												statsSvg.select("#tFouls_tottenham").transition().duration(500).attr("width", xBarShotsScale(data.AF));
												statsSvg.select("#tCorners_tottenham").transition().duration(500).attr("width", xBarShotsScale(data.AC));
												statsSvg.select("#tYellows_tottenham").transition().duration(500).attr("width", xBarShotsScale(data.AY));
												statsSvg.select("#tReds_tottenham").transition().duration(500).attr("width", xBarShotsScale(data.AR));
												statsSvg.selectAll(".arsenal").transition().duration(500).style("opacity", 0.05);
												statsSvg.selectAll(".manUnited").transition().duration(500).style("opacity", 0.05);
											}
										}
										else if (thisDot.attr("clicked") == "T") {
											d3.selectAll(".M-dot").attr("clicked", "F");
											d3.selectAll(".A-dot").attr("clicked", "F");
											d3.selectAll(".T-dot").attr("clicked", "F");
											d3.selectAll(".M-dot").style("opacity", 1);
											d3.selectAll(".A-dot").style("opacity", 1);
											d3.selectAll(".T-dot").style("opacity", 1);
											scatterClicked = false;

											statsSvg.select("#tShots_tottenham").transition().duration(500).attr("width", statsSvg.select("#tShots_tottenham").attr("originalWidth"));
											statsSvg.select("#tShotsOnTarget_tottenham").transition().duration(500).attr("width", statsSvg.select("#tShotsOnTarget_tottenham").attr("originalWidth"));
											statsSvg.select("#tFouls_tottenham").transition().duration(500).attr("width", statsSvg.select("#tFouls_tottenham").attr("originalWidth"));
											statsSvg.select("#tCorners_tottenham").transition().duration(500).attr("width", statsSvg.select("#tCorners_tottenham").attr("originalWidth"));
											statsSvg.select("#tYellows_tottenham").transition().duration(500).attr("width", statsSvg.select("#tYellows_tottenham").attr("originalWidth"));
											statsSvg.select("#tReds_tottenham").transition().duration(500).attr("width", statsSvg.select("#tReds_tottenham").attr("originalWidth"));
											statsSvg.selectAll(".arsenal").transition().duration(500).style("opacity", 1);
											statsSvg.selectAll(".manUnited").transition().duration(500).style("opacity", 1);
											
										}
										
									});
								

							});

						var manUDot = lineSvg.append("g")
							.selectAll(".dot")
							// .data(parsedDataOld)
							.data(parsedData)
							.enter();

						var tottDot = lineSvg.append("g")
							.selectAll(".dot")
							// .data(parsedDataOld)
							.data(parsedData)
							.enter();

						var otherDot = lineSvg.append("g")
							.selectAll(".dot")
							// .data(parsedDataOld)
							.data(parsedData)
							.enter();


							
						manUDot.append("circle")
							.attr("class", "dot manU")
							.attr("id", function(d) {
								return "manU_" + d.key.replace(" Season", "").replace("/", "_");
							})
							.attr("clicked", "F")
							.attr("r", circleRadius)
							.attr("cx", function(d) {
								return xMap(d) + xOffset + 50;
							})
							.attr("cy", function(d) {
								return yMapManUnited(d) + yOffset;
							})
							.attr("fill", color("manU"))
							.on("mouseover", function(d) {

								tooltip.style("opacity", 1)
								tooltip.html("<b>Manchester United</b> <br/>" + "Home W/L/D: " + d.manUnited.homeW + "/" + d.manUnited.homeL + "/" + d.manUnited.homeD + "<br/> Away W/L/D&nbsp: " + d.manUnited.awayW + "/" + d.manUnited.awayL+ "/" + d.manUnited.awayD )
									.style("left", d3.event.pageX + 3 + "px")
									.style("top", d3.event.pageY + 3 + "px");

							})
							.on("mouseout", function(d) {

								tooltip.style("opacity", 0);
								// lineSvg.select("#manU-line").remove();

							})
							.on("click", function(d) {

								// var id = "#manU_"+d.key.replace(" Season", "").replace("/", "_");
								// var targetCircle = lineSvg.select(id);
								// console.log(id);

								// var statSvg = d3.select(stats);

								// if (targetCircle.attr("clicked") == "F") {
								// 	targetCircle.transition()
								// 		.duration(250)
								// 		.style("stroke", "white")
								// 		.style("stroke-width", "2.5")
								// 		.attr("clicked", "T");

										

								// } else {

								// 	targetCircle.transition()
								// 		.duration(250)
								// 		.style("stroke", null)
								// 		.style("stroke-width", null)
								// 		.attr("clicked", "F");

								// 	// d3.select(document.getElementById(id.replace("#", "")+"_info_and_graph_wrap")).remove();

								// }
									
							});

							var manUDotClass = document.getElementsByClassName("manU");
							var manULineData = [];
							for (var i = 0; i < manUDotClass.length; i++) {
								var data = {"x": manUDotClass.item(i).cx.baseVal.value, "y": manUDotClass.item(i).cy.baseVal.value}
								manULineData.push(data);
							}

							manULineData.push({"x": (manULineData[4].x+154), "y": manULineData[4].y});

							lineSvg.append("path")
								.attr("d", lineFunction(manULineData))
								.attr("id", "manU-line")
								.attr("stroke", color("manU"))
								.attr("stroke-width", 2)
								.attr("fill", "none");

							lineSvg.append("text")
								.attr("class", "teamText")
								.attr("x", (manULineData[4].x+xOffset))
								.attr("y", (manULineData[4].y-5))
								.text("Manchester United")
								.attr("fill", color("manU"))
								.style("font-size", 15);


						tottDot.append("circle")
							.attr("class", "dot tott")
							.attr("clicked", "F")
							.attr("id", function(d) {
								return "tott_" + d.key.replace(" Season", "").replace("/", "_");
							})
							.attr("r", circleRadius)
							.attr("cx", function (d) {
								return xMap(d) + xOffset + 50;
							})
							.attr("cy", function(d) {	
								return yMapTottenham(d) + yOffset;
							})
							.attr("fill", color("tott"))
							.on("mouseover", function(d) {

								tooltip.style("opacity", 1)
								tooltip.html("<b>Tottenham</b> <br/>" + "Home W/L/D: " + d.tottenham.homeW + "/" + d.tottenham.homeL + "/" + d.tottenham.homeD + "<br/> Away W/L/D: " + d.tottenham.awayW + "/" + d.tottenham.awayL+ "/" + d.tottenham.awayD )
									.style("left", d3.event.pageX + 3 + "px")
									.style("top", d3.event.pageY + 3 + "px");

							})
							.on("mouseout", function(d) {

								tooltip.style("opacity", 0);

							})
							.on("click", function(d) {

								// var id = "#tott_"+d.key.replace(" Season", "").replace("/", "_");
								// var targetCircle = lineSvg.select(id);
								// console.log(id);

								// var statSvg = d3.select(stats);

								// if (targetCircle.attr("clicked") == "F") {
								// 	targetCircle.transition()
								// 		.duration(250)
								// 		.style("stroke", "white")
								// 		.style("stroke-width", "2.5")
								// 		.attr("clicked", "T");

								// } else {

								// 	targetCircle.transition()
								// 		.duration(250)
								// 		.style("stroke", null)
								// 		.style("stroke-width", null)
								// 		.attr("clicked", "F");
								// }

							});

							var tottDotClass = document.getElementsByClassName("tott");
							var tottLineData = [];
							for (var i = 0; i < tottDotClass.length; i++) {
								var data = {"x": tottDotClass.item(i).cx.baseVal.value, "y": tottDotClass.item(i).cy.baseVal.value}
								tottLineData.push(data);
							}

							tottLineData.push({"x": (tottLineData[4].x+97), "y": tottLineData[4].y});

							lineSvg.append("path")
								.attr("d", lineFunction(tottLineData))
								.attr("id", "tott-line")
								.attr("stroke", color("tott"))
								.attr("stroke-width", 2)
								.attr("fill", "none");

							lineSvg.append("text")
								.attr("class", "teamText")
								.attr("x", (tottLineData[4].x+xOffset))
								.attr("y", (tottLineData[4].y-5))
								.text("Tottenham")
								.attr("fill", color("tott"))
								.style("font-size", 15);
								
							// Legend Working
							var legend = lineSvg.selectAll(".legend")
								.data(["other", "manU", "tott"])
								.enter().append("g")
								.attr("class", "legend")
								.attr("transform", function(d, i) { return "translate(" + i * 90 + ", 0)"; });

							// draw legend colored rectangles
							legend.append("rect")
								.attr("x", width - 390)
								.attr("y", 8)
								.attr("width", 18)
								.attr("height", 2)
								.style("fill", color);

							// draw legend text
							legend.append("text")
								.attr("x", width - 315)
								.attr("y", 9)
								.attr("dy", ".35em")
								.attr("fill", "white")
								.style("text-anchor", "end")
								.text(function(d) { 
									if (d=="other") {
										return "Arsenal";
									} else if (d=="manU") {
										return "Man United";
									} else {
										return "Tottenham";
									}
								});

						otherDot.append("circle")
							.attr("class", "dot ars")
							.attr("clicked", "F")
							.attr("id", function(d) {
								return "other_" + d.key.replace(" Season", "").replace("/", "_");
							})
							.attr("r", circleRadius)
							.attr("cx", function(d) {
								return xMap(d) + xOffset + 50;
							})
							.attr("cy", function(d) {
								return yMapArsenal(d) + yOffset;
							})
							.attr("fill", color("other"))
							.on("mouseover", function(d) {

								tooltip.style("opacity", 1)
								tooltip.html("<b>Arsenal</b> <br/>" + "Home W/L/D: " + d.arsenal.homeW + "/" + d.arsenal.homeL + "/" + d.arsenal.homeD + "<br/> Away W/L/D: " + d.arsenal.awayW + "/" + d.arsenal.awayL + "/" + d.arsenal.awayD )
									.style("left", d3.event.pageX + 3 + "px")
									.style("top", d3.event.pageY + 3 + "px");

							})
							.on("mouseout", function(d) {

								tooltip.style("opacity", 0);

							})
							.on("click", function(d) {
								

							});

							var arsenalDotClass = document.getElementsByClassName("ars");
							var arsenalLineData = [];
							for (var i = 0; i < arsenalDotClass.length; i++) {
								var data = {"x": arsenalDotClass.item(i).cx.baseVal.value, "y": arsenalDotClass.item(i).cy.baseVal.value}
								arsenalLineData.push(data);
							}

							arsenalLineData.push({"x": (arsenalLineData[4].x+80), "y": arsenalLineData[4].y});

							lineSvg.append("path")
								.attr("d", lineFunction(arsenalLineData))
								.attr("id", "ars-line")
								.attr("stroke", color("other"))
								.attr("stroke-width", 2)
								.attr("fill", "none");

							lineSvg.append("text")
								.attr("class", "teamText")
								.attr("x", (arsenalLineData[4].x+xOffset))
								.attr("y", (arsenalLineData[4].y-5))
								.text("Arsenal")
								.attr("fill", color("other"))
								.style("font-size", 15);
						
						
					})
				})
			})
		})
	});
	
};

