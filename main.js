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

function countWinLoss(d, rival) {
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

				var statsObject = {
					date: e.Date, homeGoals: e.FTHG, awayGoals: e.FTAG, homeShots: e.HS, awayShots: e.AS, 
					homeShotsOnTarget: e.HST, awayShotsOnTarget: e.AST, homeFoul: e.HF, awayFoul: e.AF,
					homeCorner: e.HC, awayCorner: e.AC, homeYellow: e.HY, awayYellow: e.AY, homeRed: e.HR, awayRed: e.AR};

				homeStats.push(statsObject);

				homeTotalGoalScored += e.FTHG;
				homeTotalGoalConceded += e.FTAG;
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

				var statsObject = {
					date: e.Date, homeGoals: e.FTHG, awayGoals: e.FTAG, homeShots: e.HS, awayShots: e.AS, 
					homeShotsOnTarget: e.HST, awayShotsOnTarget: e.AST, homeFoul: e.HF, awayFoul: e.AF,
					homeCorner: e.HC, awayCorner: e.AC, homeYellow: e.HY, awayYellow: e.AY, homeRed: e.HR, awayRed: e.AR};

				awayStats.push(statsObject);

				awayTotalGoalScored += e.FTAG;
				awayTotalGoalConceded += e.FTHG;
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
		awayW:awayWin, awayL:awayLoss, awayD:awayDraw, totalG:total, hStats: homeStats, aStats: awayStats, 
		homeTGS: homeTotalGoalScored, homeTGC: homeTotalGoalConceded, awayTGS: awayTotalGoalScored, awayTGC: awayTotalGoalConceded};
}

function start() {

	var lineGraph = document.getElementById("graph");
	var stats = document.getElementById("stats");

	// Constants
	var margin = {top:40, right:40, left:40, bottom:40};
	var cWidth = 800;
	var sWidth = cWidth/2;
	var cHeight = 750;
	var width = 850 - margin.left - margin.right;
	var height = 700 - margin.top - margin.bottom;
	var xOffset = 25;
	var yOffset = 25;
	var totalSeasons = 5;
	var totalGamesPerSeason = 380;
	var totalTeamsInLeague = 20;
	var gamesPlayedPerTeam = 38;
	var targetTeams = ["Arsenal", "Tottenham", "Man United"];
	var targetSeason = ["10/11 Season", "11/12 Season", "12/13 Season", "13/14 Season", "14/15 Season"];
	var statsList = ["Shots", "Shots On Target", "Fouls", "Corners", "Yellow Cards", "Red Cards"];
	var circleRadius = 10;
	var legendSlection = 5;
	var dotSelection = 6;
	// End constants

	// START LINE GRAPH DEFINITION
	var lineSvg = d3.select(lineGraph)
		.append("svg")
		.attr("width", cWidth)
		.attr("height", cHeight)
		.append("g");

	var statsTable = d3.select(stats);

	statsTable.append("h2").attr("id", "stats_title").text("Season averaged stats");

	// var table = statsTable.append("table")
	// 	.attr("id", "stats_table")
	// 	.selectAll(".stats_table_row")
	// 	.data(statsList)
	// 	.enter();
	// var tableRow = table.append("tr")
	// 	.attr("class", function(d) { return "stats_table_row" + " " + d.replace("Shots", "tShots").replace(" On Target", "OnTarget").replace("F", "tF").replace("C", "tC").replace("Yellow Cards", "tYellows").replace("Red Cards", "tReds"); })
	// 	.attr("clicked", "F")
	// 	.attr("id", function(d) {
	// 		return d.replace(" ", "_").replace(" ", "_");
	// 	})
	// 	.text(function(d) { return d; })
	// 	.on("click", function(d) {
	// 		if (d3.select(this).attr("clicked") == "F") {
	// 			d3.select(this).attr("clicked", "T");
	// 			console.log(d3.select(this).attr("class").replace("stats_table_row ", "."));
	// 			var className = d3.select(this).attr("class").replace("stats_table_row ", ".");
	// 			d3.selectAll(className);
	// 		}
	// 		else {
	// 			d3.select(this).attr("clicked", "F");
	// 			d3.selectAll(d3.select(this).attr("class").replace("stats_table_row", "")).style("display", "block");
	// 		}
	// 	});

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

	// X and Y bar axis
	var xBarAxis = d3.svg.axis().scale(xBarScale).orient("bottom");
	var xBarShotsAxis = d3.svg.axis().scale(xBarShotsScale).orient("bottom");
	var xBarShotsOnTargetAxis = d3.svg.axis().scale(xBarShotsOnTargetScale).orient("bottom");
	var xBarFoulsAxis = d3.svg.axis().scale(xBarFoulsScale).orient("bottom");
	var xBarCornersAxis = d3.svg.axis().scale(xBarCornersScale).orient("bottom");
	var xBarYellowsAxis = d3.svg.axis().scale(xBarYellowsScale).orient("bottom");
	var xBarRedsAxis = d3.svg.axis().scale(xBarRedsScale).orient("bottom");
	var yBarAxis = d3.svg.axis().scale(yBarScale).orient("left").tickFormat("");

	// Axis
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
	var yAxis = d3.svg.axis().scale(yScale).orient("left");

	// setup x
	var xValue = function(d) { return d.key; };
	var xMap = function(d) { return xScale(xValue(d)); };

	// setup y TODO: fix y mapping
	// var yValueManU = function(d) { return ((d.manU.homeW + d.manU.awayW)/d.manU.totalG) * 100; };
	// var yValueTott = function(d) { return ((d.tott.homeW + d.tott.awayW)/d.tott.totalG) * 100; };
	// var yValueOther = function(d) { return ((d.other.homeW + d.other.awayW)/d.other.totalG) * 100; };
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
	var color = d3.scale.ordinal().range(["#d62728", "#FFFFFF", "#C49E57"]);
	// END LINE GRAPH

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

						// Checking season game #
						// console.log(data1415.length);
						// console.log(data1314.length);
						// console.log(data1213.length);
						// console.log(data1112.length);
						// console.log(data1011.length);

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
							arsenal: arsenalStat1011,
							manUnited: manUnitedStat1011,
							tottenham: tottenhamStat1011
						}, {
							key: "11/12 Season",
							arsenal: arsenalStat1112,
							manUnited: manUnitedStat1112,
							tottenham: tottenhamStat1112
						}, {
							key: "12/13 Season",
							arsenal: arsenalStat1213,
							manUnited: manUnitedStat1213,
							tottenham: tottenhamStat1213
						}, {
							key: "13/14 Season",
							arsenal: arsenalStat1314,
							manUnited: manUnitedStat1314,
							tottenham: tottenhamStat1314
						}, {
							key: "14/15 Season",
							arsenal: arsenalStat1415,
							manUnited: manUnitedStat1415,
							tottenham: tottenhamStat1415
						}];

						var parsedDataOld = [
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
							.attr("transform", "translate("+xOffset+", "+(yOffset+height+30)+")")
							.call(xAxis)
							.attr("fill", "white")
							.append("text")
							.attr("x", 775 )
							.attr("y", 28 )
							.attr("text-anchor", "end")  // this makes it easy to centre the text as the transform is applied to the anchor
							.text("Seasons");

						lineSvg.append("g")
							.attr("class", "y-axis")
							.attr("transform", "translate("+xOffset+", "+yOffset+")")
							.call(yAxis)
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
							.attr("class", "bar")
							.attr("id", function(d) {
								return "bar_" + d.key.replace(" Season", "").replace("/", "_");
							})
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
								lineSvg.select("#" + "bar_" + d.key.replace(" Season", "").replace("/", "_")).transition().duration(250).style("opacity", 0);
							})
							.on("click", function(d) {

								statsTable.select("#stats_title")
									.text(d.key + " averaged stats");

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
									// .attr("id", function(d) { return d.key; })
									.attr("x", 0)
									.attr("y", function(d) {
										return yBarScale("Arsenal");
									})
									// .attr("width", function(d) {
									// 	return xBarScale((d.value/gamesPlayedPerTeam));
									// })
									.attr("height", 30)
									.attr("fill", color("other"));

								// Tottenham bars
								var tottenham = statsSvg.append("g")
									.selectAll(".tottenham")
									.data(tottenhamTotalStats)
									.enter(); 
								tottenham.append("rect")
									.attr("class", function(d) { return d.key + " " + "tottenham"; })
									// .attr("id", function(d) { return d.key; })
									.attr("x", 0)
									.attr("y", function(d) {
										return yBarScale("Tottenham");
									})
									// .attr("width", function(d) {
									// 	return xBarScale((d.value/gamesPlayedPerTeam));
									// })
									.attr("height", 30)
									.attr("fill", color("tott"));

								// Manchester United bar
								var manUnited = statsSvg.append("g")
									.selectAll(".manUnited")
									.data(manUnitedTotalStats)
									.enter()
								manUnited.append("rect")
									.attr("class", function(d) { return d.key + " " + "manUnited"; })
									// .attr("id", function(d) { return d.key; })
									.attr("x", 0)
									.attr("y", function(d) {
										return yBarScale("Man United");
									})
									// .attr("width", function(d) {
									// 	return xBarScale((d.value/gamesPlayedPerTeam));
									// })
									.attr("height", 30)
									.attr("fill", color("manU"));

								// Adjust bars
								var shots = statsSvg.selectAll(".tShots")
									.attr("transform", "translate("+xOffset+", "+yOffset+")")
									.attr("width", function(d) {
										return xBarShotsScale((d.value/gamesPlayedPerTeam));
									});
								var shotsOnTarget = statsSvg.selectAll(".tShotsOnTarget")
									.attr("transform", "translate("+(xOffset+(width/3)+90)+", "+yOffset+")")
									.attr("width", function(d) {
										return xBarShotsOnTargetScale((d.value/gamesPlayedPerTeam));
									});
								var fouls = statsSvg.selectAll(".tFouls")
									.attr("transform", "translate("+xOffset+", "+(yOffset+(height/3)+40)+")")
									.attr("width", function(d) {
										return xBarFoulsScale((d.value/gamesPlayedPerTeam));
									});
								var corners = statsSvg.selectAll(".tCorners")
									.attr("transform", "translate("+(xOffset+(width/3)+90)+", "+(yOffset+(height/3)+40)+")")
									.attr("width", function(d) {
										return xBarCornersScale((d.value/gamesPlayedPerTeam));
									});
								var yellows = statsSvg.selectAll(".tYellows")
									.attr("transform", "translate("+xOffset+", "+(yOffset+((height/3)*2)+80)+")")
									.attr("width", function(d) {
										return xBarYellowsScale((d.value/gamesPlayedPerTeam));
									});
								var reds = statsSvg.selectAll(".tReds")
									.attr("transform", "translate("+(xOffset+(width/3)+90)+", "+(yOffset+((height/3)*2)+80)+")")
									.attr("width", function(d) {
										return xBarRedsScale((d.value/gamesPlayedPerTeam));
									})


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
									.call(xBarShotsAxis)
									.attr("fill", "white")
									.append("text")
									.attr("x", 0)
									.attr("y", -185)
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
									.call(xBarFoulsAxis)
									.attr("fill", "white")
									.append("text")
									.attr("x", 0)
									.attr("y", -185)
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
									.call(xBarYellowsAxis)
									.attr("fill", "white")
									.append("text")
									.attr("x", 0)
									.attr("y", -185)
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
									.call(xBarShotsOnTargetAxis)
									.attr("fill", "white")
									.append("text")
									.attr("x", 0)
									.attr("y", -185)
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
									.call(xBarCornersAxis)
									.attr("fill", "white")
									.append("text")
									.attr("x", 0)
									.attr("y", -185)
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
									.call(xBarRedsAxis)
									.attr("fill", "white")
									.append("text")
									.attr("x", 0)
									.attr("y", -185)
									.style("font-size", 15)
									.attr("class", "statsHeader")
									.text("Red Cards");

								// Arsenal Bars
								

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

							})
							.on("click", function(d) {

								var id = "#manU_"+d.key.replace(" Season", "").replace("/", "_");
								var targetCircle = lineSvg.select(id);
								console.log(id);

								var statSvg = d3.select(stats);

								if (targetCircle.attr("clicked") == "F") {
									targetCircle.transition()
										.duration(250)
										.style("stroke", "white")
										.style("stroke-width", "2.5")
										.attr("clicked", "T");

										// statSvg.append("div").attr("id", id.replace("#", "")+"_info_and_graph_wrap").attr("class", "info_and_graph_wrap");
										// var outerWrap = d3.select(document.getElementById(id.replace("#", "")+"_info_and_graph_wrap"));

										// // This div wraps 2 divs!
										// // First: Tha table div
										// // Second: Bar graph div
										// outerWrap.append("div")
										// 	.attr("id", id.replace("#", "")+"_stat_wrap")
										// 	.attr("class", "individual_stat_wrap");

										// // We want all table stuff to be in this div
										// var innerTableWrap = d3.select(document.getElementById(id.replace("#", "")+"_stat_wrap"));


										// // TABLE STARTS HERE
										// //innerTableWrap.append("h1").text("hello word").attr("class", "stat_h1");
										// var table_title = d3.select(this).attr("id").replace("manU_", "ManU ").replace("_", "/");

										// var table_data = [ ["", "W/L/D", "scored/conceded"]
										// 				 ,["Home(date)", d.manUnited.homeW + "/" + d.manUnited.homeL + "/" + d.manUnited.homeD, d.manUnited.homeTGS + "/" + d.manUnited.homeTGC]
										// 				 ,["Away (date)", d.manUnited.awayW + "/" + d.manUnited.awayL+ "/" + d.manUnited.awayD, d.manUnited.awayTGS + "/" + d.manUnited.awayTGC]
										// 				];
														
										// innerTableWrap.append("table")
										// 			  //Table Title
										// 			  .append("h1")
										// 			  .style("background-color", "aliceblue")
										// 			  .text(table_title)
										// 			  .style("fill", "#2ca02c")
										// 			  .style("border", "2px black solid")
										// 			  //Filling Table Start
										// 			  .selectAll("tr")
										// 			  .data(table_data)
										// 			  .enter().append("tr")
										// 			  .selectAll("td")
										// 			  .data(function(d){return d;})
										// 			  .enter().append("td")
										// 			  .style("padding", "5px")
										// 			  .on("mouseover", function(){d3.select(this).style("background-color", "white")})
										// 			  .on("mouseout", function(){d3.select(this).style("background-color", "aliceblue")})
										// 			  .style("background-color", "aliceblue")
										// 			  .text(function(d){return d;})
										// 			  .style("fill", "#2ca02c")
										// 			  .style("font-size", "18px");
													  
													  
										/*var table = innerTableWrap.append("table");
										var homeRow = table.append("tr");
										var awayRow = table.append("tr");
										var homeGoals = table.append("tr");
										var awayGoals = table.append("tr");

										homeRow.append("td").html("Home W/L/D");
										homeRow.append("td").html(d.manU.homeW + "/" + d.manU.homeL + "/" + d.manU.homeD);
										awayRow.append("td").html("Away W/L/D");
										awayRow.append("td").html(d.manU.awayW + "/" + d.manU.awayL+ "/" + d.manU.awayD)
										homeGoals.append("td").html("Home goals scored/conceded");
										homeGoals.append("td").html(d.manU.homeTGS + "/" + d.manU.homeTGC);
										awayGoals.append("td").html("Away goals scored/conceded");
										awayGoals.append("td").html(d.manU.awayTGS + "/" + d.manU.awayTGC);*/
										// TABLE ENDS

										// TODO: DATE LIST 

										// END DATE LIST
										

										// statSvg.select(document.getElementById(id+"_stat_wrap"))
										// 	.append("svg")
										// 	.attr("class", "stats")
										// 	.attr("id", id.replace("#", "")+"_stats")
										// 	.attr("width", sWidth)
										// 	.attr("height", cHeight)
										// 	.append("g");

								} else {

									targetCircle.transition()
										.duration(250)
										.style("stroke", null)
										.style("stroke-width", null)
										.attr("clicked", "F");

									// d3.select(document.getElementById(id.replace("#", "")+"_info_and_graph_wrap")).remove();

								}
									// .attr("r", function(e) {
									// 	if (targetR == circleRadius) {
									// 		return +circleRadius + 5;
									// 	} else {
									// 		return circleRadius;
									// 	}
									// });
									// TODO: APPEND ADAVANCE STATS HERE;
								// lineSvg.selectAll(".dot")
								// 	.attr("r", circleRadius);
								// lineSvg.selectAll(".manU")
								// 	.transition()
								// 	.duration(300)
								// 	.attr("r", function(e) {
								// 		if (currentR == circleRadius) {
								// 			return circleRadius + 5;
								// 		} else {
								// 			return circleRadius;
								// 		}
								// 	});

							});

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

								var id = "#tott_"+d.key.replace(" Season", "").replace("/", "_");
								var targetCircle = lineSvg.select(id);
								console.log(id);

								var statSvg = d3.select(stats);

								if (targetCircle.attr("clicked") == "F") {
									targetCircle.transition()
										.duration(250)
										.style("stroke", "white")
										.style("stroke-width", "2.5")
										.attr("clicked", "T");

										statSvg.append("svg")
											.attr("class", "stats")
											.attr("id", id.replace("#", "")+"_stats")
											.attr("width", sWidth)
											.attr("height", cHeight)
											.append("g");

								} else {

									targetCircle.transition()
										.duration(250)
										.style("stroke", null)
										.style("stroke-width", null)
										.attr("clicked", "F");

									d3.select("#"+id.replace("#", "")+"_stats").remove();
								}

								// var id = "#tott_"+d.key.replace(" Season", "").replace("/", "_");
								// var targetCircle = lineSvg.select(id);
								// var targetR = targetCircle.attr("r");
								// console.log(id);

								// targetCircle.transition()
								// 	.duration(300)
								// 	.attr("r", function(e) {
								// 		if (targetR == circleRadius) {
								// 			return circleRadius + 5;
								// 		} else {
								// 			return circleRadius;
								// 		}
								// 	});
									// TODO: APPEND ADAVANCE STATS HERE;

								// var currentR = lineSvg.selectAll(".tott").attr("r");
								// lineSvg.selectAll(".dot")
								// 	.attr("r", circleRadius);
								// lineSvg.selectAll(".tott")
								// 	.transition()
								// 	.duration(300)
								// 	.attr("r", function(e) {
								// 		if (currentR == circleRadius) {
								// 			return circleRadius + 5;
								// 		} else {
								// 			return circleRadius;
								// 		}
								// 	});

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

								var id = "#other_"+d.key.replace(" Season", "").replace("/", "_");
								var targetCircle = lineSvg.select(id);
								console.log(id);

								if (targetCircle.attr("clicked") == "F") {
									targetCircle.transition()
										.duration(250)
										.style("stroke", "white")
										.style("stroke-width", "2.5")
										.attr("clicked", "T");
								} else {
									targetCircle.transition()
										.duration(250)
										.style("stroke", null)
										.style("stroke-width", null)
										.attr("clicked", "F");
								}

								// var id = "#other_"+d.key.replace(" Season", "").replace("/", "_");
								// var targetCircle = lineSvg.select(id);
								// var targetR = targetCircle.attr("r");
								// console.log(id);

								// targetCircle.transition()
								// 	.duration(300)
								// 	.attr("r", function(e) {
								// 		if (targetR == circleRadius) {
								// 			return circleRadius + 5;
								// 		} else {
								// 			return circleRadius;
								// 		}
								// 	});
									// TODO: APPEND ADAVANCE STATS HERE;

								// var currentR = lineSvg.selectAll(".other").attr("r");
								// lineSvg.selectAll(".dot")
								// 	.attr("r", circleRadius);
								// lineSvg.selectAll(".other")
								// 	.transition()
								// 	.duration(300)
								// 	.attr("r", function(e) {
								// 		if (currentR == circleRadius) {
								// 			return circleRadius + 5;
								// 		} else {
								// 			return circleRadius;
								// 		}
								// 	});

							});
						
						// //Label Start
						// var teamName = ["other", "tott", "manU"];
						
						// // draw legend
						// var legend = d3.select('#legendDiv').selectAll(".legend")
						// 	.data(teamName)
						// 	.enter().append("p")
						// 	.attr("class", "legend")
						// 	.attr("id", function(d) { return d; })
						// 	.on("click", function(d) {

						// 		var className = "."+d;
						// 		var currentR = lineSvg.selectAll(className).attr("r");
						// 		lineSvg.selectAll(".dot").attr("r", circleRadius);
						// 		lineSvg.selectAll(className)
						// 			.transition()
						// 			.duration(300)
						// 			.attr("r", function(e) {
						// 				if (currentR == circleRadius) {
						// 					return (+currentR + 5);
						// 				} else {
						// 					return (+currentR - 5);
						// 				}
						// 			})

						// 	});
							
							

						// // draw legend colored rectangles
						// legend.append("span")
						// 	.attr('class', 'colorBox')
						// 	.style('float', 'left')
						// 	.style("background-color", function(d) {return color(d);});

						// // draw legend text
						// legend.append("span")
						// 	.style("color", "white")
						// 	.style("text-anchor", "end")
						// 	.text(function(d) {
						// 		if (d == "other") {
						// 			return "Other";
						// 		} else if (d == "tott") {
						// 			return "Tottenham";
						// 		} else {
						// 			return "Manchester United";
						// 		}
						// 	});
							
						// d3.select('.graph').append('h2').text('Seasons');
					})
				})
			})
		})
	});
	
};

