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
			}
			if (e.HomeTeam == rival && e.AwayTeam == "Arsenal") {
				if (e.FTR == "A") {
					awayWin += 1;
				} else if (e.FTR == "H") {
					awayLoss += 1;
				} else {
					awayDraw += 1;
				}
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
			}
		}

	});

	return {homeW:homeWin, homeL:homeLoss, homeD:homeDraw, 
		awayW:awayWin, awayL:awayLoss, awayD:awayDraw};
}

function start() {

	var lineGraph = document.getElementById("graph");

	// Constants
	var margin = {top:40, right:40, left:40, bottom:40};
	var width = 850 - margin.left - margin.right;
	var height = 700 - margin.top - margin.bottom;
	var totalSeasons = 5;
	var totalGamesPerSeason = 380;
	var totalTeamsInLeague = 20;
	var targetTeams = ["Arsenal", "Tottenham", "Man United"];
	var targetSeason = ["10/11 Season", "11/12 Season", "12/13 Season", "13/14 Season", "14/15 Season"];
	// End constants

	// START LINE GRAPH DEFINITION
	var lineSvg = d3.select(lineGraph)
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	// X and Y scalings
	var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.3);
	var yScale = d3.scale.linear().range([height, 0]);

	// Axis
	var xAxis = d3.svg.axis().scale(xScale).orient("top");
	var yAxis = d3.svg.axis().scale(yScale).orient("right");

	// Color
	var color = d3.scale.category10();
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
							key: "1011"
							value: [vsManU1011, vsTott1011, vsOther1011]
						}, {
							key: "1112"
							value: [vsManU1112, vsTott1112, vsOther1112]
						}, {
							key: "1213"
							value: [vsManU1213, vsTott1213, vsOther1213]
						}, {
							key: "1314"
							value: [vsManU1314, vsTott1314, vsOther1314]
						}, {
							key: "1415"
							value: [vsManU1415, vsTott1415, vsOther1415]
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
							.attr("transform", "translate(0, "+height+")")
							.call(xAxis);

						lineSvg.append("g")
							.attr("class", "y-axis")
							.call(yAxis);

						var dot = lineSvg.append("g")
							.selectAll(".dot")
							.data(parsedData)
							.enter();

						dot.append("circle")
							.attr("class", "dot")
							.attr("r", 10)


					})
				})
			})
		})
	});

};