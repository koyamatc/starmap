var screen_pos = 1000;

  var $window = $(window);
  var scrollTop = 250;
  $window.scrollTop(scrollTop);

  var sphereRadius = 1000;　// 天球の半径
  var height = Math.floor(window.innerHeight*0.75),　// 画面の高さ
      width = window.innerWidth ;  // 画面の幅
  var pi = Math.PI,
      aDegree = pi / 180;
  var thetaX = 0,
      thetaY = 0,
      thetaZ = 0;

  function Point3d(x, y, z, label, r, mag, col){
    this.x = x;
    this.y = y;
    this.z = z;
    this.label = label;
    this.r = r;
    this.mag = mag;
    this.col = col;
  };
  // 点のデータ
  var points0 = [];
  var points = [];

  d3.json("SAO/sao.json", function(error, data){

    console.log(error);
 
    var count = data.length;
    var x = sphereRadius;
    var y = 0;
    var z = 0;

    var x0,y0,z0,x1,y1,z1;
    var RA,dec,mag,label,r,col;

    for (var i = 0; i < count; i++) {

          RA = -data[i].RA;
          dec = data[i].dec;
          mag = data[i].mag;
          label = data[i].label;
          r = data[i].r;
          col = data[i].color 

/*

          x1 = x0 * Math.cos(dec) - z0 * Math.sin(dec);
          y1 = y0;
          z1 = -x0 * Math.sin(dec) + z0 * Math.cos(dec);
*/
          x0 = x * Math.cos(dec) - z * Math.sin(dec);
          y0 = y;
          z0 = -x * Math.sin(dec) + z * Math.cos(dec);

          x1 = x0 * Math.cos(RA) + y0 * Math.sin(RA);
          y1 = -x0 * Math.sin(RA) + y0 * Math.cos(RA);
          z1 = z0;

          points0.push( new Point3d( x1, y1, z1, label, r , mag, col) );
//          if (label != "") {console.log(points0[i])};
    }      

    for (var i = 0; i < points0.length; i++) {
      if (isInBound(points0[i].x,points0[i].y,points0[i].z,points0[i].mag)){
        points.push(points0[i]);
      }
    };
  
  });


  // svg空間作成
  var svg01 =  d3.select("#svg01")
                 .append("svg:svg")
                 .attr("height", height)
                 .attr("width", width)
                 .style("background","#000")
                 .on("mousedown", mouseDown)
                 .on("mouseup", mouseUp)
                 .on("touchstart", touchStart)
                 .on("touchmove", touchMove)
                 .on("touchend", touchEnd);

  var factor = 3,
      factorY;
  var mag = 5.2;
  var speed = 1;    
  var xScale, yScale, circle, circleAttributes;
  var angles;   

// 描画処理
function draw(){

 // console.log(points);

  // scale
  xScale = d3.scaleLinear()
             .domain([factor*-width/2, factor*width/2])
             .range([0, width]);
  yScale = d3.scaleLinear()
             .domain([factor*-height/2, factor*height/2])
             .range([0,height]);

  d3.selectAll("circle").remove();
  d3.selectAll("text").remove();

  /** add circles */
  svg01.selectAll("circle")
                .data(points)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                        var x = screen_pos *  d.x / d.y ;
                        return xScale(x);
                })
                .attr("cy", function (d) { return yScale(d.z); })
                .attr("r", function (d) { return d.r; })
                .style("fill", function(d) { 
                  //console.log(d);
                  return d.col;
                })
                .attr("opacity",function(d){
                  var opacity=1;
                  if ( d.mag>=5.5 && d.mag <6.5) {
                    opacity = 0.7
                  } 
                  if ( d.mag>=6.5 ) {
                    opacity = 0.4
                  } 
                  return opacity;
                })
                .exit()
                .remove();

  svg01.selectAll("text")
   .data(points)
   .enter()
   .append("text")
   .attr("x", function(d) {
      var x = screen_pos * d.x / d.y;
      return xScale(x);} ) // x座標の位置
   .attr("y", function(d) { return yScale(d.z -5);}) // y座標の位置
   .text(function(d) {
      if (d.label=="Canopus") {
        //console.log(d.x + ":" + d.y + ":" + d.z)
      }
      return d.label;})  // 文字列の設定
   .attr("font-family", "sans-serif") // font属性
   .attr("font-size", "20px") // fontｻｲｽﾞ
   .style("fill","#fff")
   .exit()
   .remove();


   angles = "RA= " + Math.floor(thetaZ/aDegree)
             + " dec= " + Math.floor(-thetaX/aDegree);
   $("#angles").html(angles);
}

  // 初期描画
  rotation();
  draw();

  //　回転
  var x_r,y_r,z_r,x0_r,y0_r,z0_r,x1_r,y1_r,z1_r,x2_r,y2_r,z2_r,mag_r;
  function rotation(){


      points = [];

      var count = points0.length;

      for (var i = 0; i < count; i++) {

          x_r = points0[i].x;
          y_r = points0[i].y;
          z_r = points0[i].z;
          mag_r = points0[i].mag;

          x0_r = x_r * Math.cos(thetaZ) + y_r * Math.sin(thetaZ);
          y0_r = -x_r * Math.sin(thetaZ) + y_r * Math.cos(thetaZ);
          z0_r = z_r;

          x1_r = x0_r * Math.cos(thetaY) - z0_r * Math.sin(thetaY);
          y1_r = y0_r;
          z1_r = -x0_r * Math.sin(thetaY) + z0_r * Math.cos(thetaY);

          x2_r = x1_r;
          y2_r = y1_r * Math.cos(thetaX) + z1_r * Math.sin(thetaX);
          z2_r = -y1_r * Math.sin(thetaX) + z1_r * Math.cos(thetaX);

          if ( isInBound( x2_r, y2_r, z2_r, mag_r) ){
            points.push( new Point3d( x2_r, y2_r, z2_r, 
                                      points0[i].label, points0[i].r,
                                      points0[i].mag, points0[i].col ));
          }
      };

//      console.log(points);

  }

  function isInBound( x, y, z, m ){
    //console.log(z);
      if ( y > 0 && m <= mag) { return true}
      else { return false}
  }

  var rad = aDegree * 1;

  var keyPressed = {};

  d3.select("body")
  .on('keydown', function() {
    keyPressed[d3.event.keyCode] = true;
  })
  .on('keyup', function() {
    keyPressed[d3.event.keyCode] = false;
  });

var keyEvent = function() {
  $("#btnUp").focus();
  // left
  if (keyPressed[37]) {
    thetaZ -= rad;
    rotation();
  draw();
  }
  // up
  if (keyPressed[38]) {
 //   $window.scrollTop(scrollTop);
    thetaX += rad;
    rotation();
  draw();
  }
  // right
  if (keyPressed[39]) {
    thetaZ += rad;
    rotation();
  draw();

  }
  // down
  if (keyPressed[40]) {
//    $window.scrollTop(scrollTop);
    thetaX -= rad;
    rotation();
  draw();
  }
    draw();
    t.stop();
};

var t = d3.timer(autoRotation);

function autoRotation(){
  thetaZ += (pi / 3600) * speed;
  rotation();
  draw();
}

// button event
d3.select("#btnUp").on("click", function(){
    thetaX += rad;
    rotation();
    draw();
})
d3.select("#btnDown").on("click", function(){
    thetaX -= rad;
    rotation();
    draw();
})
d3.select("#btnLeft").on("click", function(){
    thetaZ -= rad;
    rotation();
    draw();
})
d3.select("#btnRight").on("click", function(){
    thetaZ += rad;
    rotation();
    draw();
})

d3.select("#autoStart").on("click", function(){
  t.restart(autoRotation);
})
d3.select("#autoStop").on("click", function(){
  t.stop();
})

// slider
$( "#slider" ).slider({min: 0.1, max: 5, value:factor, step:0.1, animate: "fast"});
$("#slider-value").html(4-factor);
$( "#slider" ).on( "slidechange", function( event, ui ) {
    var val = Math.floor((5 - ui.value)*10)/10; 
    $("#slider-value").html( val);
    factor = ui.value;
    draw();
  } );

$( "#slider-mag" ).slider({min: 3.0, max: 7.0, value:mag, step:0.1, animate: "fast"});
$("#mag-value").html(mag);
$( "#slider-mag" ).on( "slidechange", function( event, ui ) {
    var val = Math.floor(ui.value*10)/10; 
    $("#mag-value").html( val);
    mag = ui.value;
    rotation();
    draw();
  } );

$( "#slider-speed" ).slider({min: 1.0, max: 60.0, value:speed, step:1, animate: "fast"});
$("#speed-value").html(speed);
$( "#slider-speed" ).on( "slidechange", function( event, ui ) {
    var val = Math.floor(ui.value*10)/10; 
    $("#speed-value").html( val);
    speed = ui.value;
    rotation();
    draw();
  } );

var mousePos1, mousePos2;

function mouseDown(){
  mousePos1 = d3.mouse(this);
}
function mouseUp(){
  mousePos2 = d3.mouse(this);

  var deltaX = mousePos2[0] - mousePos1[0];
  var deltaY = mousePos2[1] - mousePos1[1];

  thetaZ += deltaX / 1000;
  thetaX -= deltaY / 1000;
  rotation();
  draw();

}
function touchStart(){

  // 検知の対象となる指のIDを指定する (ここでは1本目の指)

  touchId = d3.event.changedTouches[0].identifier ;
  mousePos1 = d3.touch(this, touchId);
  //alert(mousePos1);
}

function touchMove(){
  //mousePos1 = d3.touch(this);
}
function touchEnd(){
  touchId = d3.event.changedTouches[0].identifier ;
  mousePos2 = d3.touch(this, touchId);
  //alert(mousePos2);
  var deltaX = mousePos2[0] - mousePos1[0];
  var deltaY = mousePos2[1] - mousePos1[1];

  thetaZ += deltaX / 1000;
  thetaX -= deltaY / 1000;
  rotation();
  draw();
}

function resize() {
  height = Math.floor(window.innerHeight*0.75);
  width = window.innerWidth
  svg01.attr("height",height)
       .attr("width",width);
}
window.onresize = resize;