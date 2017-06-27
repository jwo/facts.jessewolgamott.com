var audioElement = document.querySelector("audio")

var handlePlay = function(event){
  event.preventDefault();

  fetch("/speak", {method: "POST"})
  .then( (r) => r.json() )
  .then( (json) => {
    var uInt8Array = new Uint8Array(json.AudioStream.data);
    var arrayBuffer = uInt8Array.buffer;
    var blob = new Blob([arrayBuffer]);
    var url = URL.createObjectURL(blob);
    audioElement.src = url;
    audioElement.play();
  })

}

document.querySelector("[data-role='play']").addEventListener("click", handlePlay);
