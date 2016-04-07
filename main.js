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
	var cWidth = 850;
	var sWidth = cWidth/2;
	var cHeight = 900;
	var width = 850 - margin.left - margin.right;
	var height = 700 - margin.top - margin.bottom;
	var xOffset = 25;
	var yOffset = 25;
	var totalSeasons = 5;
	var totalGamesPerSeason = 380;
	var totalTeamsInLeague = 20;
	var targetTeams = ["Arsenal", "Tottenham", "Man United"];
	var targetSeason = ["10/11 Season", "11/12 Season", "12/13 Season", "13/14 Season", "14/15 Season"];
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
	// var yValueManU = function(d) { return ((d.manU.homeW + d.manU.awayW)/d.manU.totalG) * 100; };
	// var yValueTott = function(d) { return ((d.tott.homeW + d.tott.awayW)/d.tott.totalG) * 100; };
	// var yValueOther = function(d) { return ((d.other.homeW + d.other.awayW)/d.other.totalG) * 100; };
	var yValueManU = function(d) { return ((d.manU.homeW + d.manU.awayW)*3+d.manU.homeD+d.manU.awayD); };
	var yValueTott = function(d) { return ((d.tott.homeW + d.tott.awayW)*3+d.tott.homeD+d.tott.awayD) ;};
	var yValueOther = function(d) { return ((d.other.homeW + d.tott.awayW)*3+d.other.homeD+d.other.awayD)/16; };
	var yMapManU = function(d) { return yScale(yValueManU(d)); };
	var yMapTott = function(d) { return yScale(yValueTott(d)); };
	var yMapOther = function(d) { return yScale(yValueOther(d)); };

	// Color
	var color = d3.scale.ordinal().range(["#d62728", "#636363", "#1f77b4"]);
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

						// Calculate win/loss versus ManU
						var vsManU1011 = countWinLoss(data1011, "Man United");
						console.log(vsManU1011.hStats[0]);
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
						yScale.domain([0, 8]);

						// Drawing x and y axis
						lineSvg.append("g")
							.attr("class", "x-axis")
							.attr("transform", "translate("+xOffset+", "+(yOffset+height+30)+")")
							.call(xAxis)
							.attr("fill", "white")
							.append("text")
							.attr("x", 795 )
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
							.text("Win-Rate");

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
								return yMapManU(d) + yOffset;
							})
							.attr("fill", color("manU"))
							.on("mouseover", function(d) {

								tooltip.style("opacity", 1)
								tooltip.html("<b>Manchester United</b> <br/>" + "Home W/L/D: " + d.manU.homeW + "/" + d.manU.homeL + "/" + d.manU.homeD + "<br/> Away W/L/D&nbsp: " + d.manU.awayW + "/" + d.manU.awayL+ "/" + d.manU.awayD )
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

										statSvg.append("div").attr("id", id.replace("#", "")+"_info_and_graph_wrap").attr("class", "info_and_graph_wrap");
										var outerWrap = d3.select(document.getElementById(id.replace("#", "")+"_info_and_graph_wrap"));

										// This div wraps 2 divs!
										// First: Tha table div
										// Second: Bar graph div
										outerWrap.append("div")
											.attr("id", id.replace("#", "")+"_stat_wrap")
											.attr("class", "individual_stat_wrap");

										// We want all table stuff to be in this div
										var innerTableWrap = d3.select(document.getElementById(id.replace("#", "")+"_stat_wrap"));


										// TABLE STARTS HERE
										innerTableWrap.append("h1").text("hello word").attr("class", "stat_h1");

										var table = innerTableWrap.append("table");
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
										awayGoals.append("td").html(d.manU.awayTGS + "/" + d.manU.awayTGC);
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

									d3.select(document.getElementById(id.replace("#", "")+"_info_and_graph_wrap")).remove();

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
								return yMapTott(d) + yOffset;
							})
							.attr("fill", color("tott"))
							.on("mouseover", function(d) {

								tooltip.style("opacity", 1)
								tooltip.html("<b>Tottenham</b> <br/>" + "Home W/L/D: " + d.tott.homeW + "/" + d.tott.homeL + "/" + d.tott.homeD + "<br/> Away W/L/D: " + d.tott.awayW + "/" + d.tott.awayL+ "/" + d.tott.awayD )
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
							.attr("class", "dot other")
							.attr("clicked", "F")
							.attr("id", function(d) {
								return "other_" + d.key.replace(" Season", "").replace("/", "_");
							})
							.attr("r", circleRadius)
							.attr("cx", function(d) {
								return xMap(d) + xOffset + 50;
							})
							.attr("cy", function(d) {
								return yMapOther(d) + yOffset;
							})
							.attr("fill", color("other"))
							.on("mouseover", function(d) {

								tooltip.style("opacity", 1)
								tooltip.html("<b>Remaining average</b> <br/>" + "Home W/L/D: " + d.other.homeW + "/" + d.other.homeL + "/" + d.other.homeD + "<br/> Away W/L/D: " + d.other.awayW + "/" + d.other.awayL + "/" + d.other.awayD )
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
						
						//Label Start
						var teamName = ["other", "tott", "manU"];
						
						// draw legend
						var legend = d3.select('#legendDiv').selectAll(".legend")
							.data(teamName)
							.enter().append("p")
							.attr("class", "legend")
							.attr("id", function(d) { return d; })
							.on("click", function(d) {

								var className = "."+d;
								var currentR = lineSvg.selectAll(className).attr("r");
								lineSvg.selectAll(".dot").attr("r", circleRadius);
								lineSvg.selectAll(className)
									.transition()
									.duration(300)
									.attr("r", function(e) {
										if (currentR == circleRadius) {
											return (+currentR + 5);
										} else {
											return (+currentR - 5);
										}
									})

							});
							
							

						// draw legend colored rectangles
						legend.append("span")
							.attr('class', 'colorBox')
							.style('float', 'left')
							.style("background-color", function(d) {return color(d);});

						// draw legend text
						legend.append("span")
							.style("color", "white")
							.style("text-anchor", "end")
							.text(function(d) {
								if (d == "other") {
									return "Other";
								} else if (d == "tott") {
									return "Tottenham";
								} else {
									return "Manchester United";
								}
							});
							
						d3.select('.graph').append('h2').text('Seasons');
					})
				})
			})
		})
	});
	
};

