var audioElement = document.querySelector("audio")

var handlePlay = function(event){
  event.preventDefault();
  var url = "/speak/" + (new Date).getTime();
  audioElement.src= url;
}

document.querySelector("[data-role='play']").addEventListener("click", handlePlay);
