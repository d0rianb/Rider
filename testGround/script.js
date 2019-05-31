let path = document.querySelector('.cls-1')

let a = Matter.Svg.pathToVertices(path)

let pointsArray = a.map(vector => vector.x.toString() + ',' + vector.y.toString())

var svgNS = "http://www.w3.org/2000/svg";

var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
svg.setAttribute('viewBox', "0 0 300 300")
svg.setAttribute('transform', "translate(-55.2 -16.5)")
var poly = document.createElementNS(svgNS, 'polygon')
poly.setAttribute('points', pointsArray.join(' '))

svg.appendChild(poly)
document.body.appendChild(svg)




//copy(JSON.stringify(temp1));