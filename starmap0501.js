var screen_pos = 1000;

  var $window = $(window);
  var scrollTop = 250;
  $window.scrollTop(scrollTop);

  var sphereRadius = 1000;　// 天球の半径
  var height = Math.floor(window.innerHeight*0.75),　// 画面の高さ
      width = window.innerWidth ;  // 画面の幅
  var pi = Math.PI,
      aDegree = pi / 180;
  var thetaX = -aDegree*35,
      thetaY = 0,
      thetaZ = pi;
  var lang = "JP";    

  function Point3d(id, x, y, z, label, jlabel, r, mag, col, h){
    this.id = id;
    this.x = x;
    this.y = y;
    this.z = z;
    this.label = label;
    this.jlabel = jlabel;
    this.r = r;
    this.mag = mag;
    this.col = col;
    this.h = h;
  };
  jname = 
  {
"   308":"北極星",
" 28737":"ミザール",
" 38592":"アルゴル",
" 40186":"カペラ",
" 49941":"デネブ",
" 67174":"ベガ",
" 60198":"カストル",
" 79666":"61Cyg",
" 79666":"ポルックス",
" 99809":"デネボラ",
" 94027":"アルデバラン",
" 98967":"レグルス",
"100944":"アルクツールス",
"113271":"ベテルギュース", 
"115756":"プロキオン",
"125122":"アルタイル",
"131907":"リゲル", 
"136871":"アルファード",
"147420":"クジラ座ベータ",
"151881":"シリウス", 
"157923":"スピカ",
"184415":"アンタレス",
"191524":"フォーマルハウト",
"232481":"アケルナル",
"234480":"カノープス",
"252838":"αケンタウリ",
"":""
}
  // 点のデータ
  var points0 = [];
  var points = [];
  var pathEquator0 = [];
  var pathEquator = [];

  var Theta = 253.03262168375653 * aDegree;  // 恒星時
  var phi = aDegree * 35.788;　//　緯度
  var cos_phi = Math.cos(phi);
  console.log(cos_phi);
  var sin_phi = Math.sin(phi);
  console.log(sin_phi);

  d3.json("SAO/sao1950.json", function(error, data){

    console.log(error);
 
    var count = data.length;
    var x = sphereRadius;
    var y = 0;
    var z = 0;

    var x0,y0,z0,x1,y1,z1;
    var alpha,delta,mag,label,jlabel,r,col,saoId;
    var inc = aDegree * 0;

    for (var i = 0; i < count; i++) {

          jlabel = "";
   
          for (var id in jname) {
            if (id == data[i].id){
              jlabel = jname[id];
            }
          }
          
          saoId = data[i].id;
          alpha = data[i].RA;
          delta = data[i].dec;
          mag = data[i].mag;
          label = data[i].label;
          r = data[i].r;
          col = data[i].color 

          var Theta_alpha = Theta - alpha;
          var cos_Theta_alpha = Math.cos(Theta_alpha);
          var sin_Theta_alpha = Math.sin(Theta_alpha);
          var cos_delta = Math.cos(delta);
          var sin_delta = Math.sin(delta);
          var sin_phi_sin_delta = sin_phi * sin_delta;
          var cos_phi_cos_delta_cos_Theta_alpha = cos_phi * cos_delta * cos_Theta_alpha;
          var sin_h = sin_phi_sin_delta + cos_phi_cos_delta_cos_Theta_alpha;
          var h = Math.asin(sin_h);
          var minus_cos_phi_sin_delta = -cos_phi * sin_delta;
          var sin_phi_cos_delta_cos_Theta_alpha = sin_phi * cos_delta * cos_Theta_alpha;
          var cos_h_cos_A = minus_cos_phi_sin_delta + sin_phi_cos_delta_cos_Theta_alpha;
          var cos_h_sin_A =cos_delta * sin_Theta_alpha;
          var tan_A = cos_h_sin_A / cos_h_cos_A;
          var A1 = Math.atan(tan_A);
          var RA = (cos_h_cos_A<0)?A1+pi:A1+2*pi;
          var dec = h;

          if (saoId == "70919") {
            //console.log(cos_Theta_alpha);
            //console.log(sin_Theta_alpha);
            console.log(cos_phi_cos_delta_cos_Theta_alpha);
            console.log(RA/aDegree);
            console.log(dec/aDegree);
          }



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
/*
          x2 = x1;
          y2 = y1 * Math.cos(inc) + z1 * Math.sin(inc);
          z2 = -y1 * Math.sin(inc) + z1 * Math.cos(inc);
*/
          points0.push( new Point3d( saoId, x1, y1, z1, label, jlabel, r , mag, col, h) );
//          if (label != "") {console.log(points0[i])};
    }      

    // equator data
    for (var i = 0; i <= pi*2; i+=aDegree*3) {
          var x = sphereRadius;
          var y = 0;
          var z = 0;
          var delta = 0;
          var alpha = i; 
          var Theta_alpha = Theta - alpha;
          var cos_Theta_alpha = Math.cos(Theta_alpha);
          var sin_Theta_alpha = Math.sin(Theta_alpha);
          var cos_delta = Math.cos(delta);
          var sin_delta = Math.sin(delta);
          var sin_phi_sin_delta = sin_phi * sin_delta;
          var cos_phi_cos_delta_cos_Theta_alpha = cos_phi * cos_delta * cos_Theta_alpha;
          var sin_h = sin_phi_sin_delta + cos_phi_cos_delta_cos_Theta_alpha;
          var h = Math.asin(sin_h);
          var minus_cos_phi_sin_delta = -cos_phi * sin_delta;
          var sin_phi_cos_delta_cos_Theta_alpha = sin_phi * cos_delta * cos_Theta_alpha;
          var cos_h_cos_A = minus_cos_phi_sin_delta + sin_phi_cos_delta_cos_Theta_alpha;
          var cos_h_sin_A =cos_delta * sin_Theta_alpha;
          var tan_A = cos_h_sin_A / cos_h_cos_A;
          var A1 = Math.atan(tan_A);
          var RA = (cos_h_cos_A<0)?A1+pi:A1+2*pi;
          var dec = h;

          x0 = x * Math.cos(dec) - z * Math.sin(dec);
          y0 = y;
          z0 = -x * Math.sin(dec) + z * Math.cos(dec);

          x1 = x0 * Math.cos(RA) + y0 * Math.sin(RA);
          y1 = -x0 * Math.sin(RA) + y0 * Math.cos(RA);
          z1 = z0;

      pathEquator0.push( new Point3d( "", x1, y1, z1, "", "", 2 , 1, "#f00", h) );
    
    };


    for (var i = 0; i < points0.length; i++) {
      if (isInBound(points0[i].x,points0[i].y,points0[i].z,points0[i].mag,points0[i].h)){
        pathEquator.push(points0[i]);
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

  var factor = 2,
      factorY;
  var mag = 5.2;
  var speed = 2; 
  var declination=0;   
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
  d3.selectAll("path").remove();

  var equator = d3.line()
                .x(function(d) { 
                  var x = sphereRadius *  d.x / (-sphereRadius - d.y) 
                  return xScale(-x); })
                .y(function(d) { 
                  var z = sphereRadius *  d.z / (-sphereRadius - d.y)
                  return yScale(-z); });
                //.interpolate("linear");  
    var pathString = equator(pathEquator);
    svg01.append("path")
    .attr('d', pathString)
    .attr("stroke","#f0f")
    .attr("stroke-width","2px");


  /** add circles */
  svg01.selectAll("circle")
                .data(points)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                        var x = screen_pos *  d.x / (-sphereRadius - d.y) ;
                        return xScale(-x);
                })
                .attr("cy", function (d) { 
                        var z = screen_pos *  d.z / (-sphereRadius - d.y) ;
                        return yScale(-z); })
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
                var x = screen_pos * d.x / (-sphereRadius - d.y);
                return xScale(-x);} ) // x座標の位置
   .attr("y", function(d) {
                var z = screen_pos * d.z / (-sphereRadius - d.y); 
            return yScale(-z - 5);}) // y座標の位置
   .text(function(d) {
      if (d.label=="Canopus") {
        //console.log(d.x + ":" + d.y + ":" + d.z)
      }
      var lang = $("#starname").children(':selected').val(); 
      ////console.log(lang);
      if (lang == "Non"){ return ""; }
      else if (lang == "JP"){ return d.jlabel; }
      else if (lang == "EN"){ return d.label; }
      else if (lang == "Id"){ return d.id; };

      })  // 文字列の設定
   .attr("font-family", "sans-serif") // font属性
   .attr("font-size", "14px") // fontｻｲｽﾞ
   .style("fill","#fff")
   .exit()
   .remove();

}

  // 初期描画
  rotation();
  draw();

  //　回転
  var x_r,y_r,z_r,x0_r,y0_r,z0_r,x1_r,y1_r,z1_r,x2_r,y2_r,z2_r,mag_r;
  function rotation(){


      points = [];
      pathEquator = [];

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

          if ( isInBound( x2_r, y2_r, z2_r, mag_r,1 )){
            points.push( new Point3d( points0[i].id,
                                      x2_r, y2_r, z2_r, 
                                      points0[i].label, points0[i].jlabel, 
                                      points0[i].r,
                                      points0[i].mag, points0[i].col,
                                      points0[i].h ));
          }
      };

      count = pathEquator0.length;

      for (var i = 0; i < count; i++) {

          x_r = pathEquator0[i].x;
          y_r = pathEquator0[i].y;
          z_r = pathEquator0[i].z;
          mag_r = pathEquator0[i].mag;

          x0_r = x_r * Math.cos(thetaZ) + y_r * Math.sin(thetaZ);
          y0_r = -x_r * Math.sin(thetaZ) + y_r * Math.cos(thetaZ);
          z0_r = z_r;

          x1_r = x0_r * Math.cos(thetaY) - z0_r * Math.sin(thetaY);
          y1_r = y0_r;
          z1_r = -x0_r * Math.sin(thetaY) + z0_r * Math.cos(thetaY);

          x2_r = x1_r;
          y2_r = y1_r * Math.cos(thetaX) + z1_r * Math.sin(thetaX);
          z2_r = -y1_r * Math.sin(thetaX) + z1_r * Math.cos(thetaX);

          if ( true /*isInBound( x2_r, y2_r, z2_r, mag_r,1 )*/){
            pathEquator.push( new Point3d( pathEquator0[i].id,
                                      x2_r, y2_r, z2_r, 
                                      pathEquator0[i].label, pathEquator0[i].jlabel, 
                                      pathEquator0[i].r,
                                      pathEquator0[i].mag, pathEquator0[i].col,
                                      pathEquator0[i].h ));
          }
      };


//      console.log(points);

  }

  function isInBound( x, y, z, m, h ){
    //console.log(z);
      if ( h > 0 && m <= mag) { return true}
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
  //thetaX += (pi / 3600) * speed;
  thetaZ += (pi / 3600) * speed;
  rotation();
  draw();
  t.stop();
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
    $("#speed-value").html( val );
    speed = ui.value;
    rotation();
    draw();
  } );

$( "#slider-dec" ).slider({min: -180, max: 180, value:-thetaX/aDegree, step:0.1, animate: "fast"});
$("#dec-value").html(-thetaX/aDegree);
$( "#slider-dec" ).on( "slidechange", function( event, ui ) {
    var val = Math.floor(ui.value*10)/10; 
    $("#dec-value").html( val );
    thetaX = -ui.value * aDegree;
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
  $( "#slider-dec" ).slider({value:-thetaX/aDegree});
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

function starnameChange(){
  var lang = $("#starname").value;
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