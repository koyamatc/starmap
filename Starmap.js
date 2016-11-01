// require('./dice.css');
var $ = require('jquery');
//var $ = require('jquery-ui');
var d3 = require('d3');

var screen_pos = 700;

var Starmap = function(){

  var $window = $(window);
  var scrollTop = 250;
  $window.scrollTop(scrollTop);

  var sphereRadius = 1000;　// 天球の半径
  var height = 700,　// 画面の高さ
      width = 900;  // 画面の幅
  var pi = Math.PI,
      aDegree = pi / 180;
  var thetaX = 0,
      thetaY = 0,
      thetaZ = 0;

  function Point3d(x, y, z, label, r){
    this.x = x;
    this.y = y;
    this.z = z;
    this.label = label;
    this.r = r;
  };
  // 点のデータ
  var points0 = [];
  var points = [];

  d3.json("SAO/sao.json", function(error, data){
 
    var count = data.length;
    var x = sphereRadius;
    var y = 0;
    var z = 0;

    for (var i = 0; i < count; i++) {

          var RA = -data[i].RA;
          var dec = -data[i].dec;
          var mag = data[i].mag;
          var label = data[i].label;
          var r = (mag<0)?6:(mag<1.5)?5:(mag<2.5)?3:(mag<3.5)?2:1;


          var x0 = x * Math.cos(RA) + y * Math.sin(RA);
          var y0 = -x * Math.sin(RA) + y * Math.cos(RA);
          var z0 = z;

          var x1 = x0 * Math.cos(dec) - z0 * Math.sin(dec);
          var y1 = y0;
          var z1 = -x0 * Math.sin(dec) + z0 * Math.cos(dec);

          points0.push( new Point3d( x1, y1, z1, label, r ) );
          if (label != "") {console.log(points0[i])};
    }      

  });

  for (var i = 0; i < points0.length; i++) {
    if (isInBound(points0[i].x,points0[i].y,points0[i].z)){
      points.push(points0[i]);
    }
  };

  // svg空間作成
  var svg01 =  d3.select("#svg01")
                 .append("svg:svg")
                 .attr("height", height)
                 .attr("width", width)
                 .style("background","#111");

  // scale
  var xScale = d3.scaleLinear()
                       .domain([-width/2, width/2])
                       .range([0, width]);
  var yScale = d3.scaleLinear()
                       .domain([-height/2, height/2])
                       .range([0,height]);

// 描画処理
function draw(){

  d3.selectAll("circle").remove();
  d3.selectAll("text").remove();

  /** add circles */
  var circle = svg01.selectAll("circle")
                .data(points)
                .enter()
                .append("circle");
  // 属性
  var circleAttributes = circle
       .attr("cx", function (d) {
          var x = screen_pos * d.x / d.y;
          return xScale(x);
        })
       .attr("cy", function (d) { return yScale(d.z); })
       .attr("r", function (d) { return d.r; })
       .style("fill", function(d) { return "#fff";});

  svg01.selectAll("text")
   .data(points)
   .enter()
   .append("text")
   .attr("x", function(d) {
      var x = screen_pos * d.x / d.y;
      return xScale(x);} ) // x座標の位置
   .attr("y", function(d) { return yScale(d.z -30);}) // y座標の位置
   .text(function(d) {return d.label;})  // 文字列の設定
   .attr("font-family", "sans-serif") // font属性
   .attr("font-size", "20px") // fontｻｲｽﾞ
   .style("fill","#fff");

   var angles = "x= " + Math.floor(thetaZ/aDegree)
             + " z= " + Math.floor(thetaX/aDegree);
   $("#angles").html(angles);
}

  // 初期描画
  draw();

  //　回転
  function rotation(){

      points = [];

      var count = points0.length;

      for (var i = 0; i < count; i++) {

          var x = points0[i].x;
          var y = points0[i].y;
          var z = points0[i].z;

          var x0 = x * Math.cos(thetaZ) + y * Math.sin(thetaZ);
          var y0 = -x * Math.sin(thetaZ) + y * Math.cos(thetaZ);
          var z0 = z;

          var x1 = x0 * Math.cos(thetaY) - z0 * Math.sin(thetaY);
          var y1 = y0;
          var z1 = -x0 * Math.sin(thetaY) + z0 * Math.cos(thetaY);

          var x2 = x1;
          var y2 = y1 * Math.cos(thetaX) + z1 * Math.sin(thetaX);
          var z2 = -y1 * Math.sin(thetaX) + z1 * Math.cos(thetaX);

          if ( isInBound( x2, y2, z2) ){
            points.push( new Point3d( x2, y2, z2, points0[i].label, points0[i].r ));
          }
      };

  }

  function isInBound( x, y, z ){

    //console.log(x);

    if ( y > 0 ) { return true}
    else { return false}

  }

  var keyPressed = {};

  d3.select("body")
  .on('keydown', function() {
    keyPressed[d3.event.keyCode] = true;
  })
  .on('keyup', function() {
    keyPressed[d3.event.keyCode] = false;
  });

  var rad = aDegree * 1;
var keyEvent = function() {
  $("#btnUp").focus();
  // left
  if (keyPressed[37]) {
    thetaZ -= rad;
    rotation();
  }
  // up
  if (keyPressed[38]) {
    $window.scrollTop(scrollTop);
    thetaX += rad;
    rotation();
  }
  // right
  if (keyPressed[39]) {
    thetaZ += rad;
    rotation();
  }
  // down
  if (keyPressed[40]) {
    $window.scrollTop(scrollTop);
    thetaX -= rad;
    rotation();
  }
  draw();
};

d3.timer(keyEvent);

// button event
d3.select("#btnUp").on("click", function(){
    thetaX += rad;
    rotation();
})
d3.select("#btnDown").on("click", function(){
    thetaX -= rad;
    rotation();
})
d3.select("#btnLeft").on("click", function(){
    thetaZ -= rad;
    rotation();
})
d3.select("#btnRight").on("click", function(){
    thetaZ += rad;
    rotation();
})

/*
// slider
$( "#slider" ).slider({min: 100, max: 20000, value:screen_pos, step:10, animate: "fast"});
$("#slider-value").html(screen_pos);
$( "#slider" ).on( "slidechange", function( event, ui ) {
    $("#slider-value").html(ui.value);
    screen_pos = ui.value;
  } );
*/

}

module.exports = Starmap;
