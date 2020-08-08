
/*
 * PRIMERO DECLARAMOS LAS CONSTANTES DE NUESTRA APLICACION
 */
const GYPHY_UPLOAD_URL = "https://upload.giphy.com/v1/gifs";
//const API_KEY = "9D2bUv4FYyl2KVVDIZyIcZQD1aUSUBU2";
const GYPHY_USERNAME = "marryabbora";

/*
 * ARMAMOS LA URL DE GYPHY
 */
const GYPHY_BUILT_URL =
  GYPHY_UPLOAD_URL +
  API_KEY +
  "&username=" +
  GYPHY_USERNAME;

// Elementos necesarios
let stream;
let recorderVideo, recorderGif;
let blobGif, blobVideo;
let recording = false;
let uploadedGifs = [];
let uploadedUrl;

let liveVideo = document.querySelector("#img-video");
let gifImg = document.querySelector("#img-gif");

let myGifs = localStorage.getItem("myGifs");
if(myGifs) {
  uploadedGifs = JSON.parse(myGifs);
}

async function mostrarVideo() {
  stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  liveVideo.srcObject = stream;
  liveVideo.play();
}

async function grabarVideo() {
  recorderVideo = new RecordRTCPromisesHandler(stream, {
    type: "video",
    frameRate: 1,
    quality: 10,
    width: 360,
    height: 240,
  });
  recorderGif = new RecordRTCPromisesHandler(stream, {
    type: "gif",
    frameRate: 1,
    quality: 10,
    width: 360,
    height: 240,
  });
  recorderVideo.startRecording();
  recorderGif.startRecording();
  
  liveVideo.classList.add("video-recording");
  
  const sleep = (m) => new Promise((r) => setTimeout(r, m));
  await sleep(3000);
  detenerGrabacion();
  cambiarPaso(3);
}

async function detenerGrabacion() {
  if ((await recorderVideo.getState()) === "recording") {
    await recorderVideo.stopRecording();
    await recorderGif.stopRecording();
    blobVideo = await recorderVideo.getBlob();
    blobGif = await recorderGif.getBlob();

    liveVideo.classList.remove("video-recording");
    mostrarGrabacion(blobGif);
  }
}

function mostrarGrabacion(blob) {
  if(!blob) {
    alert("Error!");
    cambiarPaso(0);
  }

  const gif = URL.createObjectURL(blob);
  gifImg.src = gif;
  uploadedUrl = gif;
}

function updateProgress() {
  const progress = document.getElementById("progress");
  let value = 0;
  if (recordedVideo.currentTime > 0) {
    value = Math.floor(
      (100 / recordedVideo.duration) * recordedVideo.currentTime
    );
  }
  progress.style.width = value + "%";
}

function reproducirVideoGrabado() {
  liveVideo.play();
}

async function subirGif() {
  if (blobGif) {
    let form = new FormData();
    const gifName = "migif";
    form.append("file", blobGif, gifName + ".gif");

    try {
      const response = await fetch(GYPHY_BUILT_URL, {
        mode: "cors",
        method: "POST",
        body: form,
      });
      const parsedResponse = await response.json();
      console.log(parsedResponse);
      uploadedGifs.push(parsedResponse.data);
      localStorage.setItem("myGifs", JSON.stringify(uploadedGifs));
      alert("Felicitaciones se subió tu gif 👏 👏");
      cambiarPaso(5);
    } catch (e) {
      console.log(e);
      alert("Error algo salio mal 😭");
    }
  } else {
    alert("👁 no has grabado nada para subir");
  }
}

mostrarVideo();