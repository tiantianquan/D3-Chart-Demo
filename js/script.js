var testData = [
  ['DEC', 300],
  ['JAN', 600],
  ['FEB', 1100],
  ['MAR', 1200],
  ['APR', 860],
  ['MAY', 1200],
  ['JUN', 1450],
  ['JUL', 1800],
  ['AUG', 1200],
  ['SEP', 600]
];
var T;
var Data = function(data) {
  this.originData = data

  this.createArray()
}
Data.prototype.createArray = function() {
  this.numArray = []
  this.strArray = []
  var that = this
  this.originData.forEach(function(d, i) {
    if (typeof d === 'object') {
      for (var s = 0; s < d.length; s++) {
        if (typeof d[s] === 'number') {
          that.numArray[i] = d[s]
        } else {
          that.strArray[i] = d[s]
        }
      }
    }
  })
}

var data = new Data(testData);

var barWidth = 30
var height = 200
var radius = 5

//坐标比例 scale:刻度
var y = d3.scale
  //线性的
  .linear()
  //数据大小范围
  .domain([0, d3.max(data.numArray)])
  //数值越大,坐标越小,svg Y轴与普通坐标系是相反的
  .range([height, 0])

var xSale = d3.scale
  // .ordinal()
  // .domain([0,1, 2, 3])
  // .rangeBands([0, barWidth * data.strArray.length])
  .linear()
  .domain([1, 10])
  .range([0, barWidth * (data.numArray.length - 1)])

var ySale = d3.scale
  // .ordinal()
  // .domain([0, 1000, 2000])
  // .rangeBands([height, 0])
  .linear()
  .domain([0, 2000])
  .range([height, 0]);



var xAxis = d3.svg.axis()
  .scale(xSale)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(ySale)
  .ticks(4)
  .orient("left")



var chart = d3.select('.main-box')
  .append('svg')
  .attr('height', height + 50)
  .attr('width', barWidth * data.numArray.length + 70)
  .append('g')
  .attr('class', 'chart')
  // .attr('width', barWidth * data.numArray.length)
  .attr('height', height)
  .attr('transform', 'translate(' + (radius + 50) + ',' + (radius + 10) + ')')

var area = d3.svg.area()
  .interpolate("linear")
  .x(function(d, i) {
    return i * barWidth
  })
  .y0(height)
  .y1(function(d) {
    return y(d);
  })

chart.append("path")
  .attr("class", "area")
  .attr("d", area(data.numArray));

var circlePoint = chart.selectAll('circlePoint')
  .data(data.numArray)
  .enter()
  .append('circle')
  .attr('r', radius)
  .attr('cx', function(d, i) {
    return i * barWidth
  })
  .attr('cy', function(d, i) {
    return y(d)
  })


var xLine = chart
  .append('g')
  .attr('class', 'axis')
  .call(xAxis)
  .attr('transform', 'translate(0,' + height + ')')
  .selectAll('text')
  .data(data.strArray)
  .text(function(d, i) {
    return d;
  })

var yLine = chart
  .append('g')
  .attr('class', 'axis')
  .call(yAxis)






var linePath = chart
  .append('path')
  .datum(data.numArray)
  // .attr('d', line)

function getSmoothInterpolation() {
  var interpolate = d3.scale.linear()
    .domain([0, 1])
    .range([1, data.numArray.length + 1]);

  return function(t) {
    var flooredX = Math.floor(interpolate(t));
    var interpolatedLine = data.numArray.slice(0, flooredX);

    if (flooredX > 0 && flooredX < data.numArray.length) {
      var weight = interpolate(t) - flooredX;
      var weightedLineAverage = data.numArray[flooredX] * weight + data.numArray[flooredX - 1] * (1 - weight);
      interpolatedLine.push({
        "x": interpolate(t) - 1,
        "y": weightedLineAverage
      });
    }

    return line(interpolatedLine);
  }
}


var w = (data.numArray.length - 1) * barWidth
var x = d3.scale
  //线性的
  .linear()
  //数据大小范围
  .domain([0, 1])
  //数值越大,坐标越小,svg Y轴与普通坐标系是相反的
  .range([0, w])


function getInterpolation() {

  var interpolate = d3.scale.linear()
    .domain([0, 1])
    .range([1, data.numArray.length + 1]);

  return function(t) {
    var line = d3.svg.line()
      .x(function(d, i) {
        if (d != data.numArray[i])
          return (interpolate(t)-1)*barWidth
        else
          return i * barWidth;
      })
      .y(function(d) {
        return y(d);
      })
      .interpolate('linear');
    var flooredX = Math.floor(interpolate(t));
    var interpolatedLine = data.numArray.slice(0, flooredX);

    if (flooredX > 0 && flooredX < data.numArray.length) {
      var weight = interpolate(t) - flooredX;
      var weightedLineAverage = (data.numArray[flooredX] - data.numArray[flooredX - 1]) * weight + data.numArray[flooredX - 1];
      interpolatedLine.push(weightedLineAverage);
    }
    return line(interpolatedLine);
  }
}

linePath
  .transition()
  .duration(70000)
  .attrTween('d', getInterpolation);

// chart.selectAll("g").filter(function(d) {
//     return d;
//   })
//   .classed("minor", true);




// path.transition().duration(2000).call(function(transition) {
//   transition.attrTween('d', function(d) {
//     var interpolate = d3.interpolate(d[0], d[1]);
//     return function(t) {
//       d[0] = interpolate(t);
//       return line(d);
//     };
//   })
// });