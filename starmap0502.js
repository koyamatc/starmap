var screen_pos = 1000;

  var $window = $(window);
  var scrollTop = 250;
  $window.scrollTop(scrollTop);

  var sphereRadius = 1000;　// 天球の半径
  var height = Math.floor(window.innerHeight*0.75),　// 画面の高さ
      width = window.innerWidth ;  // 画面の幅
  var pi = Math.PI,
      aDegree = pi / 180;
  var declination = 35.664,
      longitudeDeg = 139,
      longitudeMin = 30,
      longitudeSec = 20.5;    
  var thetaX = -aDegree*90,
      thetaY = 0,
      thetaZ = pi;
  var lang = "JP";    
  var factor = 3.0,
      factorY;
  var mag = 5.2;
  var speed = 5;
  var horizon_radius; 

// formating Date yyyy-mm-dd
function formatDate(year,month,day){

  var yeat0 = year.toString();
  var month0 = month.toString();
  var day0 = day.toString(); 
  if (month0.length < 2){
     month0 = "0" + month0; 
  }
  if (day0.length < 2){
     day0 = "0" + day0; 
  }

  var formatDateString = 
        yeat0 + "-" + month0 + "-" + day0;

  return formatDateString;
}

// formating Time hh:mm 
function formatTime(hour,minute){

  var hour0 = hour.toString();
  var minute0 = minute.toString(); 
  if (hour0.length < 2){
     hour0 = "0" + hour0; 
  }
  if (minute0.length < 2){
     minute0 = "0" + minute0; 
  }

  var formatTimeString = 
        hour0 + ":" + minute0;

  return formatTimeString;
}

// 日付変数
var year_,month_,day_,hour_,minute_,date_;
// 日付表示用オプション
var options = {
    weekday: "long", year: "numeric", month: "2-digit",
    day: "2-digit", hour: "2-digit", minute: "2-digit"
};

// 画面初期設定
//日時の取得
  date_ = new Date();
  year_ = date_.getFullYear();
  month_ = date_.getMonth()+1;
  day_ = date_.getDate();
  hour_ = date_.getHours();
  minute_ = date_.getMinutes();
// 初期値設定
  var dateString = formatDate(year_, month_, day_);
  $("#inputDate").val(dateString);
  var timeString = formatTime(hour_, minute_);
  $("#inputTime").val(timeString);
  $("#inputDif").val(-9);
  // 緯度、経度　取得
  if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        function(position){
          var lat = position.coords.latitude;
          var lng  = position.coords.longitude;
          /*
          var txt = "緯度："+lat+"<br />経度："+lng;
          document.getElementById("pos").innerHTML = txt;
        */
        },
      function( error )
      {
      // エラーコード(error.code)の番号
      // 0:UNKNOWN_ERROR        原因不明のエラー
      // 1:PERMISSION_DENIED      利用者が位置情報の取得を許可しなかった
      // 2:POSITION_UNAVAILABLE   電波状況などで位置情報が取得できなかった
      // 3:TIMEOUT          位置情報の取得に時間がかかり過ぎた…

      // エラー番号に対応したメッセージ
      var errorInfo = [
        "原因不明のエラーが発生しました…。" ,
        "位置情報の取得が許可されませんでした…。" ,
        "電波状況などで位置情報が取得できませんでした…。" ,
        "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。"
      ] ;

      // エラー番号
      var errorNo = error.code ;

      // エラーメッセージ
      var errorMessage = "[エラー番号: " + errorNo + "]\n" + errorInfo[ errorNo ] ;

      // アラート表示
      alert( errorMessage ) ;

    });
  } else {
  };
  $("#inputDec").val(declination);
  $("#inputDeg").val(longitudeDeg);
  $("#inputMin").val(longitudeMin);
  $("#inputSec").val(longitudeSec);

  function Point3d(id, RA, dec, x, y, z, label, jlabel, r, mag, col, h){
    this.id = id;
    this.RA = RA;
    this.dec = dec
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

  //  JED
  var datetime = new Date(year_, month_, day_, hour_,minute_, 0);
  var dif = Math.floor($("#inputDif").val());
  var result = getJED(datetime, dif );
  T = result.T;
  $("#JED").html("JED= " + result.JED + " T= " + T);
  datetime.setMonth (datetime.getMonth() - 1 );
  //$("#JST").html( datetime.toLocaleDateString("ja-JP", options) );

  //観測日
  //var date = new Date(1978,6,10,21,20,0,0);
  // 平均恒星時
  var meanSidereal = getMeanSiderealTime(datetime);
  var h = meanSidereal.time.hours;
  var m = meanSidereal.time.minutes;
  var s = meanSidereal.time.seconds;
  var l = meanSidereal.time.milliseconds;

  var theta0 = new Date(0,0,0,h,m,s,l);
  var sidereal = getSiderealTime(datetime,139,31,53.6,theta0);
  $("#theta").html(sidereal.total +"°");   
  var theta_rad = sidereal.radians;
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
  var points1 = [];
  var points = [];
  var pathEquator0 = [];
  var pathEquator = [];
  var pathHorizon0 = [];
  var pathHorizon = [];
  var pathSigo0 = [];
  var pathSigo = [];

  // 地方恒星時　theta を求める
  //var Theta = 270.03262168375653 * aDegree;  // 恒星時
  var Theta = sidereal.radians;
  //var Theta = pi * 2 * T * 100 + (3 * pi) / 4 ;
  
  var phi = aDegree * ( 90 - declination　);　//　緯度
  var cos_phi = Math.cos(phi);
  var sin_phi = Math.sin(phi);

function calc(alpha, delta){
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

    return {RA:RA,dec:h}
}

/** 星データを取り込む　**/
  d3.json("SAO/sao.json", function(error, data){

    console.log(error);
 
    var count = data.length;
    var x = sphereRadius;
    var y = 0;
    var z = 0;

    var x0,y0,z0,x1,y1,z1;
    var alpha,delta,mag,label,jlabel,r,col,saoId;
    var inc = aDegree * -90;

    for (var i = 0; i < count; i++) {

          jlabel = "";
   
          for (var id in jname) {
            if (id == data[i].id){
              jlabel = jname[id];
            }
          }
          
          saoId = data[i].id;
          RA = data[i].RA;
          dec = data[i].dec;
          mag = data[i].mag;
          label = data[i].label;
          r = data[i].r;
          col = data[i].color 

          var result = calc(RA, dec);
          var alpha = result.RA;
          var delta = result.dec;

          x0 = x * Math.cos(delta) - z * Math.sin(delta);
          y0 = y;
          z0 = -x * Math.sin(delta) + z * Math.cos(delta);

          x1 = -x0 * Math.sin(alpha) + y0 * Math.cos(alpha);
          y1 = x0 * Math.cos(alpha) + y0 * Math.sin(alpha);
          z1 = z0;

          if (saoId == "  308") {
            console.log(RA/aDegree);
            console.log(dec/aDegree);
            console.log("x=" + x1 + " y="+y1 + " z="+z1);
          }
         if (saoId == " 28737") {
            console.log(RA/aDegree);
            console.log(dec/aDegree);
            console.log("x=" + x1 + " y="+y1 + " z="+z1);
          }
         if (saoId == " 67174") {
            console.log(RA/aDegree);
            console.log(dec/aDegree);
            console.log("x=" + x1 + " y="+y1 + " z="+z1);
          }

          points0.push( new Point3d( saoId, RA, dec, x1, -y1, z1, 
                                     label, jlabel, r , mag, col, h) );
//          if (label != "") {console.log(points0[i])};
    }      
    for (var i = 0; i < points0.length; i++) {
      if (isInBound(points0[i].x,points0[i].y,points0[i].z,
                    points0[i].mag,points0[i].h)){
        points.push(points0[i]);
      }
    };

    // equator data
    for (var i = 0; i <= pi*2; i+=aDegree*3) {
          var x = sphereRadius;
          var y = 0;
          var z = 0;
          var dec = 0;
          var RA = i; 
     /*     
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
*/
          x0 = x * Math.cos(dec) - z * Math.sin(dec);
          y0 = y;
          z0 = -x * Math.sin(dec) + z * Math.cos(dec);

          x1 = -x0 * Math.sin(RA) + y0 * Math.cos(RA);
          y1 = x0 * Math.cos(RA) + y0 * Math.sin(RA);
          z1 = z0;

          pathEquator0.push( new Point3d( "", RA, dec, x1, -y1, z1,
                                          "", "", 2 , 1, "#f00", h) );
    
    };

    for (var i = 0; i < pathEquator0.length; i++) {
      if (isInBound(pathEquator0[i].x,pathEquator0[i].y,pathEquator0[i].z,pathEquator0[i].mag,pathEquator0[i].h)){
        pathEquator.push(pathEquator0[i]);
      }
    };

    // horizon data
    for (var i = 0; i <= pi*2; i+=aDegree*3) {
 
          var x = sphereRadius * Math.cos(i);
          var y = 0;
          var z = sphereRadius * Math.sin(i);
          var dec = 0;
          var RA = i; 

          if ( i == 0 ) { horizon_radius = x };
/*
          var result = calc(RA, dec);
          var alpha = result.RA;
          var delta = result.dec;

          x0 = x * Math.cos(delta) - z * Math.sin(delta);
          y0 = y;
          z0 = -x * Math.sin(delta) + z * Math.cos(delta);

          x1 = -x0 * Math.sin(alpha) + y0 * Math.cos(alpha);
          y1 = x0 * Math.cos(alpha) + y0 * Math.sin(alpha);
          z1 = z0;
*/
          pathHorizon0.push( new Point3d( "",RA, dec, x, y, z, 
                                          "", "", 2 , 1, "#0f0", 1) );
    
    };
/*
    for (var i = 0; i < pathHorizon0.length; i++) {
      if (isInBound(pathHorizon0[i].x,pathHorizon0[i].y,pathHorizon0[i].z,pathHorizon0[i].mag,pathHorizon0[i].h)){
        pathHorizon.push(pathHorizon0[i]);
      }
    };
*/
    // 子午線 data
    for (var i = 0; i <= pi*2; i+=aDegree*3) {
 
          var x = sphereRadius;
          var y = 0;
          var z = 0;
          var dec = i;
          var RA = 0; 
/*          
          var Theta_alpha = 0;//Theta - alpha;
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
*/
          x0 = x * Math.cos(dec) - z * Math.sin(dec);
          y0 = y;
          z0 = -x * Math.sin(dec) + z * Math.cos(dec);

          x1 = -x0 * Math.sin(RA) + y0 * Math.cos(RA);
          y1 = x0 * Math.cos(RA) + y0 * Math.sin(RA);
          z1 = z0;

          pathSigo0.push( new Point3d( "", RA, dec,x1, -y1, z1, 
                                       "", "", 2 , 1, "#00f", 1) );
    
    };
    for (var i = 0; i < pathSigo0.length; i++) {
      if (isInBound(pathSigo0[i].x,pathSigo0[i].y,pathSigo0[i].z,pathSigo0[i].mag,pathSigo0[i].h)){
        pathSigo.push(pathSigo0[i]);
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
/*
  var equator = d3.line()
                .x(function(d) { 
                  var x = sphereRadius *  d.x / (-sphereRadius - d.y) 
                  return xScale(-x); })
                .y(function(d) { 
                  var z = sphereRadius *  d.z / (-sphereRadius - d.y)
                  return yScale(-z); });

    var pathString = equator(pathEquator) + "Z";
    svg01.append("path")
    .attr('d', pathString)
    .attr("stroke","#f0f")
    .attr("stroke-width","10px");
*/
    var horizon = d3.line()
                .x(function(d) { 
                  var x = sphereRadius *  d.x / (-sphereRadius - d.y) 
                  return xScale(-x); })
                .y(function(d) { 
                  var z = sphereRadius *  d.z / (-sphereRadius - d.y)
                  return yScale(-z); });

    var pathString = horizon(pathHorizon) + "Z";
//    console.log("horizon" + pathString);
    svg01.append("path")
    .attr('d', pathString)
    .attr("stroke","#0f0")
    .style("fill","none")
    .attr("stroke-width","2px");
/*
    var sigo = d3.line()
                .x(function(d) { 
                  var x = sphereRadius *  d.x / (-sphereRadius - d.y) 
                  return xScale(-x); })
                .y(function(d) { 
                  var z = sphereRadius *  d.z / (-sphereRadius - d.y)
                  return yScale(-z); });

    var pathString = sigo(pathSigo) + "Z";
//    console.log("sigo" + pathString);
    svg01.append("path")
    .attr('d', pathString)
    .attr("stroke","#00f")
    .style("fill","none")
    .attr("stroke-width","2px");
*/
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
  
  var dateTimePos = [{"x":30,"y":20}];
  svg01.selectAll("#dateTime")
   .data(dateTimePos)
   .enter()
   .append("text")
   .attr("x", function(d) { return d.x })
   .attr("y", function(d) { return d.y })
   .attr("id","dateTime")
   .text(function(d) {
       return date_.toLocaleDateString("ja-JP", options)
      })  // 文字列の設定
   .attr("font-family", "sans-serif") // font属性
   .attr("font-size", "14px") // fontｻｲｽﾞ
   .style("fill","#fff")
   .exit()
   .remove();
  
  var declinationPos = [{"x":30,"y":45}];
  svg01.selectAll("#declination")
   .data(declinationPos)
   .enter()
   .append("text")
   .attr("x", function(d) { return d.x })
   .attr("y", function(d) { return d.y })
   .attr("id","declination")
   .text(function(d) {
       return "緯度= "　+ declination;
      })  // 文字列の設定
   .attr("font-family", "sans-serif") // font属性
   .attr("font-size", "14px") // fontｻｲｽﾞ
   .style("fill","#fff")
   .exit()
   .remove();

  var longitudePos = [{"x":30,"y":70}];
  svg01.selectAll("#longitude")
   .data(longitudePos)
   .enter()
   .append("text")
   .attr("x", function(d) { return d.x })
   .attr("y", function(d) { return d.y })
   .attr("id","longitude")
   .text(function(d) {
       return "経度= " + longitudeDeg + "° "
                      + longitudeMin + "m  "
                      + Math.floor(longitudeSec*100)/100 + "s";
      })  // 文字列の設定
   .attr("font-family", "sans-serif") // font属性
   .attr("font-size", "14px") // fontｻｲｽﾞ
   .style("fill","#fff")
   .exit()
   .remove();

}

  // 初期描画
//  rotation();
  draw();

  //　回転
  var RA_r,dec_r,x_r,y_r,z_r,x0_r,y0_r,z0_r,x1_r,y1_r,z1_r,x2_r,y2_r,z2_r,mag_r;
  function rotation(){


      points = [];
      pathEquator = [];
      pathHorizon = [];
      pathSigo = [];

      var count = points0.length;

      for (var i = 0; i < count; i++) {

          RA_r = points0[i].RA;
          dec_r = points0[i].dec;
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
                                      RA_r, dec_r,
                                      x2_r, y2_r, z2_r, 
                                      points0[i].label, points0[i].jlabel, 
                                      points0[i].r,
                                      points0[i].mag, points0[i].col,
                                      points0[i].h ));
          }
      };
/*
      count = pathEquator0.length;

      for (var i = 0; i < count; i++) {

          RA_r = pathEquator0[i].RA;
          dec_r = pathEquator0[i].dec;
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

          if ( true ){
            pathEquator.push( new Point3d( pathEquator0[i].id,
                                      RA_r, dec_r,
                                      x2_r, y2_r, z2_r, 
                                      pathEquator0[i].label, pathEquator0[i].jlabel, 
                                      pathEquator0[i].r,
                                      pathEquator0[i].mag, pathEquator0[i].col,
                                      pathEquator0[i].h ));
          }
      };

     count = pathHorizon0.length;

      for (var i = 0; i < count; i++) {

          RA_r = pathHorizon0[i].RA;
          dec_r = pathHorizon0[i].dec;
          x_r = pathHorizon0[i].x;
          y_r = pathHorizon0[i].y;
          z_r = pathHorizon0[i].z;
          mag_r = pathHorizon0[i].mag;

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
            pathHorizon.push( new Point3d( pathHorizon0[i].id,
                                      RA_r, dec_r, x2_r, y2_r, z2_r, 
                                      pathHorizon0[i].label, pathHorizon0[i].jlabel, 
                                      pathHorizon0[i].r,
                                      pathHorizon0[i].mag, pathHorizon0[i].col,
                                      pathHorizon0[i].h ));
          }
      };

   count = pathSigo0.length;

      for (var i = 0; i < count; i++) {

          RA_r = pathSigo0[i].RA;
          dec_r = pathSigo0[i].dec;
          x_r = pathSigo0[i].x;
          y_r = pathSigo0[i].y;
          z_r = pathSigo0[i].z;
          mag_r = pathSigo0[i].mag;

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
            pathSigo.push( new Point3d( pathSigo0[i].id,
                                      RA_r, dec_r, x2_r, y2_r, z2_r, 
                                      pathSigo0[i].label, pathSigo0[i].jlabel, 
                                      pathSigo0[i].r,
                                      pathSigo0[i].mag, pathSigo0[i].col,
                                      pathSigo0[i].h ));
          }
      };
*/
//
//      console.log(points);

  }

  function isInBound( x, y, z, m, h ){
    //console.log(z);
      if ( h > 0 && m <= mag) { return true}
      else { return false}
    /*
      var h_r = xScale(horizon_radius);
      //console.log("x=" + x + " y=" + y + " z=" + z + " r=" + h_r );
      if ( ( (x*x + z*z) <= h_r * h_r ) && m <= mag )
        { return true }
      else
        { return false };
    */
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
  convert(1);
  draw();
}


d3.select("#autoStart").on("click", function(){
  t.restart(autoRotation);
})
d3.select("#autoStop").on("click", function(){
  t.stop();
})

// slider
$( "#slider" ).slider({min: 0.1, max: 5, value:factor, step:0.1, animate: "fast"});
$("#slider-value").html(Math.floor((5 - factor)*10)/10);
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
//    rotation();
    convert(0);
    draw();
  } );

$( "#slider-speed" ).slider({min: 1.0, max: 60.0, value:speed, step:1, animate: "fast"});
$("#speed-value").html(speed);
$( "#slider-speed" ).on( "slidechange", function( event, ui ) {
    var val = Math.floor(ui.value*10)/10; 
    $("#speed-value").html( val );
    speed = ui.value;
//    rotation();
    draw();
  } );

$( "#slider-dec" ).slider({min: -90, max: 90, value:declination, step:0.01, animate: "fast"});
$("#dec-value").html(declination);
$( "#slider-dec" ).on( "slidechange", function( event, ui ) {
    var val = Math.floor(ui.value*100)/100; 
    $("#dec-value").html( val );
    declination = ui.value;

 //   rotation();
    convert(0);
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
//  rotation();
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
//  rotation();
  draw();
}

function starnameChange(){
  var lang = $("#starname").value;
//  rotation();
  draw();

}


function resize() {
  height = Math.floor(window.innerHeight*0.75);
  width = window.innerWidth
  svg01.attr("height",height)
       .attr("width",width);
}
window.onresize = resize;

$("#run").on("click", function(){
  //  JED
  var date_text = $("#inputDate").val().split('-');
  var time_text = $("#inputTime").val().split(':');
  var year = date_text[0];
  var month = date_text[1];
  var day = date_text[2];
  var hour = time_text[0];
  var minute = time_text[1];
  date_ = new Date(year,month,day,hour,minute,0);
  date_.setMonth (date_.getMonth() - 1 );

  convert(0);
  draw();
})

function convert(pSeconds){

  phi = aDegree * ( 90 - declination );
  cos_phi = Math.cos(phi);
  sin_phi = Math.sin(phi);

  //date_.setMinutes (date_.getMinutes() + pMinutes);
  date_.setSeconds (date_.getSeconds() + pSeconds * speed );

/*
  year_ = date_.getFullYear();
  month_ = date_.getMonth();
  day_ = date_.getDate();
  hour_ = date_.getHours();
  minute_ = date_.getMinutes();

  var dateString = formatDate(year_, month_, day_);
//  $("#inputDate").val(dateString);
  var timeString = formatTime(hour_, minute_);
 // $("#inputTime").val(timeString);
*/  
  var dif = Math.floor($("#inputDif").val());
  var result = getJED(date_, dif );
  T = result.T;
  Theta = pi * 2 * T * 36000;

  $("#JED").html("JED= " + result.JED + " T= " + result.T);
//  $("#JST").html( date_.toLocaleDateString("ja-JP", options) );
//
  var meanSidereal = getMeanSiderealTime(date_);
  var h = meanSidereal.time.hours;
  var m = meanSidereal.time.minutes;
  var s = meanSidereal.time.seconds;
  var l = meanSidereal.time.milliseconds;

  var theta0 = new Date(0,0,0,h,m,s,l);
  var sidereal = getSiderealTime(date_,139,31,53.6,theta0);
  var theta = sidereal.radians;

  // Clear star data for display
  points = [];
  points1 = [];
  var count = points0.length;
  var x0,y0,z0,x1,y1,z1;
  var alpha,delta,mag,label,jlabel,r,col,saoId;
  var inc = aDegree * -90;
    
  for (var i = 0; i < count; i++) {

    var result = calc(points0[i].RA, points0[i].dec);
    var alpha = result.RA;
    var delta = result.dec;

    var x = sphereRadius;
    var y = 0;
    var z = 0;
          
    x0 = x * Math.cos(delta) - z * Math.sin(delta);
    y0 = y;
    z0 = -x * Math.sin(delta) + z * Math.cos(delta);

    y1 = x0 * Math.cos(alpha) + y0 * Math.sin(alpha);
    x1 = -x0 * Math.sin(alpha) + y0 * Math.cos(alpha);
    z1 = z0;


          points1.push( new Point3d( points0[i].id, 
                                     points0[i].RA, 
                                     points0[i].dec, 
                                     x1, -y1, z1, 
                                     points0[i].label, 
                                     points0[i].jlabel, 
                                     points0[i].r , 
                                     points0[i].mag, 
                                     points0[i].col, 
                                     points0[i].h) );
    } // end for

    count = points1.length;      
    for (var i = 0; i < count; i++) {
      if (isInBound(points1[i].x,points1[i].y,points1[i].z,
                    points1[i].mag,points1[i].h)){
        points.push(points1[i]);
      }
    };

  // 地平線(Horizon)  
  pathHorizon = [];

  count = pathHorizon0.length;      
  for (var i = 0; i < count; i++) {

    if ( i == 0 ) { horizon_radius = xScale(x) };

    if (isInBound(pathHorizon0[i].x,pathHorizon0[i].y,pathHorizon0[i].z,
                  pathHorizon0[i].mag,pathHorizon0[i].h)){
      pathHorizon.push(pathHorizon0[i]);
    }

  };

}