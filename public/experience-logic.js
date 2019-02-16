AFRAME.registerComponent('cursor-listener', {
  init: function () {
    var el = this.el;

    function sendExperimentData(data){
      const datapointAddRequest = new XMLHttpRequest();
      datapointAddRequest.onload = function() { console.log(this.responseText, " Check result at " + window.location.origin + "/results.html "); };
      datapointAddRequest.open('get', '/addDatapoint' + "?datapoint=" + encodeURIComponent(data), true );
      datapointAddRequest.send();
    }
    
    document.querySelector("#camera-rig").setAttribute("animation", "dur", experiment.animationDuration)
    document.querySelector("#camera-rig").setAttribute("animation__left", "dur", experiment.animationDuration)
    document.querySelector("#camera-rig").setAttribute("animation__right", "dur", experiment.animationDuration)
    
    this.el.addEventListener('click', function (evt) {
      console.log( el.id, 'was clicked at' ); 
      switch ( el.id ){
        case "engine-start-button" :
          el.emit("pushed");
          document.querySelector("#camera-rig").components.sound.playSound();
          document.querySelector("#camera-rig").emit("go");
          setTimeout(function(){ 
            if ( experiment.pushedLever ){
              el.emit("goleft");
              sendExperimentData("Left");
            } else {
              el.emit("goright");
              sendExperimentData("Right");
            }
          }, experiment.animationDuration);
          for (instruction of document.querySelectorAll(".instructions") )
            instruction.setAttribute("visible", false);
          break;
        case "lever" :
          // could be conditional on experiment.ready
          el.emit("pushedlever");
          experiment.pushedLever = true;
        break;
      }
    }); // end of event listener
    
  }
});

/* 
assets
trolley https://poly.google.com/view/9r3vGMUz2Hc
humans https://poly.google.com/view/46UhpqiHmS- 
track https://poly.google.com/view/covd74kLslj
 
unused
 https://poly.google.com/view/77Jr8NGPtHE
 https://poly.google.com/view/12EHxMhKrbo
 https://poly.google.com/view/3YDLMGCBKnL
*/