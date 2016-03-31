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

function countWinLoss(d, rival) {
	var homeWin = 0;
	var homeLoss = 0;
	var homeDraw = 0;
	var awayWin = 0;
	var awayLoss = 0;
	var awayDraw = 0;
	var total = 0;

	d.forEach(function(e) {

		if (rival != "other") {
			if (e.HomeTeam == "Arsenal" && e.AwayTeam == rival) {
				if (e.FTR == "H") {
					homeWin += 1;
				} else if (e.FTR == "A") {
					homeLoss += 1;
				} else {
					homeDraw += 1;
				}
				total += 1;
			}
			if (e.HomeTeam == rival && e.AwayTeam == "Arsenal") {
				if (e.FTR == "A") {
					awayWin += 1;
				} else if (e.FTR == "H") {
					awayLoss += 1;
				} else {
					awayDraw += 1;
				}
				total += 1;
			}
		} else {
			if (e.HomeTeam == "Arsenal" && ["Man United", "Tottenham"].indexOf(e.AwayTeam) == -1) {
				//console.log(e.AwayTeam);
				if (e.FTR == "H") {
					homeWin += 1;
				} else if (e.FTR == "A") {
					homeLoss += 1;
				} else {
					homeDraw += 1;
				}
				total += 1;
			}
			if (["Man United", "Tottenham"].indexOf(e.HomeTeam) == -1 && e.AwayTeam == "Arsenal") {
				//console.log(e.HomeTeam);
				if (e.FTR == "A") {
					awayWin += 1;
				} else if (e.FTR == "H") {
					awayLoss += 1;
				} else {
					awayDraw += 1;
				}
				total += 1;
			}
		}

	});

	return {homeW:homeWin, homeL:homeLoss, homeD:homeDraw, 
		awayW:awayWin, awayL:awayLoss, awayD:awayDraw, totalG:total};
}

function start() {

	var lineGraph = document.getElementById("graph");

	// Constants
	var margin = {top:40, right:40, left:40, bottom:40};
	var cWidth = 850;
	var cHeight = 700;
	var width = 850 - margin.left - margin.right;
	var height = 700 - margin.top - margin.bottom;
	var xOffset = 25;
	var yOffset = 25;
	var totalSeasons = 5;
	var totalGamesPerSeason = 380;
	var totalTeamsInLeague = 20;
	var targetTeams = ["Arsenal", "Tottenham", "Man United"];
	var targetSeason = ["10/11 Season", "11/12 Season", "12/13 Season", "13/14 Season", "14/15 Season"];
	// End constants

	// START LINE GRAPH DEFINITION
	var lineSvg = d3.select(lineGraph)
		.append("svg")
		.attr("width", cWidth)
		.attr("height", cHeight)
		.append("g");

	// X and Y scalings
	var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.3);
	var yScale = d3.scale.linear().range([height, 0]);

	// Axis
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
	var yAxis = d3.svg.axis().scale(yScale).orient("left");

	// setup x
	var xValue = function(d) { return d.key; };
	var xMap = function(d) { return xScale(xValue(d)); };

	// setup y TODO: fix y mapping
	var yValueManU = function(d) { return ((d.manU.homeW + d.manU.awayW)/d.manU.totalG) * 100; };
	var yValueTott = function(d) { return ((d.tott.homeW + d.tott.awayW)/d.tott.totalG) * 100; };
	var yValueOther = function(d) { return ((d.other.homeW + d.other.awayW)/d.other.totalG) * 100; };
	var yMapManU = function(d) { return yScale(yValueManU(d)); };
	var yMapTott = function(d) { return yScale(yValueTott(d)); };
	var yMapOther = function(d) { return yScale(yValueOther(d)); };

	// Color
	var color = d3.scale.ordinal().range(["#636363", "#d62728", "#1f77b4"]);
	// END LINE GRAPH

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

						// Checking season game #
						// console.log(data1415.length);
						// console.log(data1314.length);
						// console.log(data1213.length);
						// console.log(data1112.length);
						// console.log(data1011.length);

						// Calculate win/loss versus ManU
						var vsManU1011 = countWinLoss(data1011, "Man United");
						var vsManU1112 = countWinLoss(data1112, "Man United");
						var vsManU1213 = countWinLoss(data1213, "Man United");
						var vsManU1314 = countWinLoss(data1314, "Man United");
						var vsManU1415 = countWinLoss(data1415, "Man United");

						// Calculate win/loss versus Tottenham
						var vsTott1011 = countWinLoss(data1011, "Tottenham");
						var vsTott1112 = countWinLoss(data1112, "Tottenham");
						var vsTott1213 = countWinLoss(data1213, "Tottenham");
						var vsTott1314 = countWinLoss(data1314, "Tottenham");
						var vsTott1415 = countWinLoss(data1415, "Tottenham");

						// Calculate win/loss versus Other
						var vsOther1011 = countWinLoss(data1011, "other");
						var vsOther1112 = countWinLoss(data1112, "other");
						var vsOther1213 = countWinLoss(data1213, "other");
						var vsOther1314 = countWinLoss(data1314, "other");
						var vsOther1415 = countWinLoss(data1415, "other");

						// var parsedData = [
						// {
						// 	key: "ManU"
						// 	value: [vsManU1011, vsManU1112, vsManU1213, vsManU1314, vsManU1415]
						// },
						// {
						// 	key: "Tott"
						// 	value: [vsTott1011, vsTott1112, vsTott1213, vsTott1314, vsTott1415]
						// },
						// {
						// 	key: "Other"
						// 	value: [vsOther1011, vsOther1112, vsOther1213, vsOther1314, vsOther1415]
						// }];

						var parsedData = [
						{
							key: "10/11 Season",
							manU: vsManU1011,
							tott: vsTott1011,
							other: vsOther1011
						}, {
							key: "11/12 Season",
							manU: vsManU1112,
							tott: vsTott1112,
							other: vsOther1112
						}, {
							key: "12/13 Season",
							manU: vsManU1213,
							tott: vsTott1213,
							other: vsOther1213
						}, {
							key: "13/14 Season",
							manU: vsManU1314,
							tott: vsTott1314,
							other: vsOther1314
						}, {
							key: "14/15 Season",
							manU: vsManU1415,
							tott: vsTott1415,
							other: vsOther1415
						}];

						// X and Y scaling domains
						xScale.domain(targetSeason.map(function(d) {
							// console.log(d);
							return d;
						}));
						yScale.domain([0, 100]);

						// Drawing x and y axis
						lineSvg.append("g")
							.attr("class", "x-axis")
							.attr("transform", "translate("+xOffset+", "+(yOffset+height+30)+")")
							.call(xAxis);

						lineSvg.append("g")
							.attr("class", "y-axis")
							.attr("transform", "translate("+xOffset+", "+yOffset+")")
							.call(yAxis);

						var manUDot = lineSvg.append("g")
							.selectAll(".dot")
							.data(parsedData)
							.enter();

						var tottDot = lineSvg.append("g")
							.selectAll(".dot")
							.data(parsedData)
							.enter();

						var otherDot = lineSvg.append("g")
							.selectAll(".dot")
							.data(parsedData)
							.enter();

						manUDot.append("circle")
							.attr("class", "dot")
							.attr("r", 7)
							.attr("cx", function(d) {
								return xMap(d) + xOffset;
							})
							.attr("cy", function(d) {
								return yMapManU(d) + yOffset;
							})
							.attr("fill", color("ManU"));

						tottDot.append("circle")
							.attr("class", "dot")
							.attr("r", 7)
							.attr("cx", function (d) {
								return xMap(d) + xOffset;
							})
							.attr("cy", function(d) {
								return yMapTott(d) + yOffset;
							})
							.attr("fill", color("Totten"));

						otherDot.append("circle")
							.attr("class", "dot")
							.attr("r", 7)
							.attr("cx", function(d) {
								return xMap(d) + xOffset;
							})
							.attr("cy", function(d) {
								return yMapOther(d) + yOffset;
							})
							.attr("fill", color("Others"));
						
						//Label Start
						var teamName = ["Others", "ManU", "Totten"];
						
						// draw legend
						var legend = d3.select('#legend').selectAll(".legend")
							.data(teamName)
							.enter().append("p")
							.attr("class", "legend");

						// draw legend colored rectangles
						legend.append("span")
							.attr('class', 'colorBox')
							.style('float', 'left')
							.style("background-color", function(d) {return color(d);});

						// draw legend text
						legend.append("span")
							.style("color", "black")
							.style("text-anchor", "end")
							.text(function(d) { return d; });
					})
				})
			})
		})
	});
	
};

