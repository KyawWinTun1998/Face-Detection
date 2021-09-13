
Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(initVideo());

function initVideo(){ 
      navigator.mediaDevices.getUserMedia({
            video:{
                  width: 720,
                  height: 520
            }
      })
      .then((stream)=>{
            video.srcObject = stream;
      })
      .catch((err)=>{
            console.log('error!');
      })
 }

 video.addEventListener('play', function(){

      // Creat Canvas
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);

      // display canvas size
      const displaySize = {width: video.width, height: video.height};

      setInterval(async function(){

            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
            console.log(detections);

            const resizedDetections = faceapi.resizeResults(detections, displaySize) //resize display
            canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height); //clear old canvas
            faceapi.draw.drawDetections(canvas, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
            // faceapi.draw.drawAgeAndGender(canvas, resizedDetections)
            
            const minProbability = 0.05
            faceapi.draw.drawFaceExpressions(canvas, resizedDetections, minProbability)
            faceapi.draw.drawAgeAndGender(canvas, resizedDetections)

            

      }, 100);
 });

