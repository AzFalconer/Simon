$(document).ready(function() {
  //Variables
  var context = new window.AudioContext(),
      strict = false,
      counter = 0,
      userCount = 0,
      time = 500,
      lock = false,
      sequence = []; //1=Blue, 2=Yellow, 3=Red, 4=Green

  //Listen
  $("#blue").click(function(){if(lock == false){playSnd(207.652,.4);light('blue');userTurn(1);}});
  $("#yellow").click(function(){if(lock == false){playSnd(247.942,.35);light('yellow');userTurn(2);}});
  $("#red").click(function(){if(lock == false){playSnd(311.127,.3);light('red');userTurn(3);}});
  $("#green").click(function(){if(lock == false){playSnd(415.305,.1);light('green');userTurn(4);}});
  $("#strictBtn").click(function(){
    if(strict==true){strict=false;$("#led").removeClass('led-on');$("#led").addClass('led-off')}
    else{strict=true;$("#led").removeClass('led-off');$("#led").addClass('led-on');}
  });
  $("#resetBtn").click(function(){reset();});
  $("#startBtn").click(function(){
    if (counter > 0 ) {reset();} else {genNextButton();}
  });
  //Execute
  //Functions
  function genNextButton () {
    var nxtBtn = Math.floor((Math.random() * 4) + 1);
    sequence.push(nxtBtn);
    counter = counter + 1;
    if (counter < 21) {
        $("#counter").text(counter);
      if(counter > 4) {time=400;}
      if(counter > 9) {time=300;}
      if(counter > 14) {time=200;}
        playSequence();
    } else { //WINNER!
      winner();
    }
  }

  function playSequence() {
    var n=0;
     setInterval(function() {
        if (sequence[n] == 1){playSnd(207.652,.4);light('blue');}
        if (sequence[n] == 2){playSnd(247.942,.35);light('yellow');}
        if (sequence[n] == 3){playSnd(311.127,.3);light('red');}
        if (sequence[n] == 4){playSnd(415.305,.1);light('green');}
       n = n +1;
       if (n > sequence.length) {return;}
    }, 750);
  }

  function fail(){
    if (strict == true) {$("#counter").text("L");}
    playSnd(100,1);
    setTimeout(function(){playSnd(100,1);}, time+100);
    setTimeout(function(){
    if (strict == true) {$("#resetBtn").click();}
    else {userCount = 0;playSequence();}
    }, 1500);
  }

  function playSnd(freq, vol) {
    var o = context.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    var volume = context.createGain();
    volume.gain.value = vol;
    volume.connect(context.destination) //Connect volume to destination...
    o.connect(volume); //Then connect Oscillator to volume.
    o.start();
    setTimeout(function(){o.stop();}, time);
  }

  function light(color) {
    $('#'+color).addClass('light');
    setTimeout(function(){$('#'+color).removeClass('light');}, time);
  }

  function reset() {
    strict=false; $("#led").removeClass('led-on'); $("#led").addClass('led-off');
    counter = 0; userCount = 0; time=500; lock = false; sequence = [];
    $("#counter").text(counter);
    $("#counter").removeClass('light');
    ctlButtons(false);
  }

  function winner() {
    ctlButtons(true);
    var n = 1;
    $("#counter").text("W");
    var myInt = setInterval(function() {
      if (n == 1 | n == 5){$("#counter").addClass('light');playSnd(207.652,.4);light('blue');}
      if (n == 2 | n == 6){$("#counter").removeClass('light');playSnd(247.942,.35);light('yellow');}
      if (n == 3 | n == 7){$("#counter").addClass('light');playSnd(311.127,.3);light('red');}
      if (n == 4 | n == 8){$("#counter").removeClass('light');playSnd(415.305,.1);light('green');}
      n = n +1;
      if (n > 8) {clearInterval(myInt);$("#resetBtn").click();}
    }, 600);
  }

  function ctlButtons(state) {
    $(':button').prop('disabled', state);
    lock = state;
  }

  function userTurn(press) {
    if (counter == 0) {console.log("counter: "+counter); return;} //free play
    if (press !== sequence[userCount]){userCount=0;setTimeout(function(){fail();}, time+100);}
    else {userCount +=1} //Succesfull press, move to next button in sequence
    if (userCount > sequence.length-1){userCount=0;setTimeout(function(){genNextButton();}, time+100);} //All presses succesful, generate next move
  }

});
