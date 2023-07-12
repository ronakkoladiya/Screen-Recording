let stream, audioStream;
let mediaRecorder;
let recordedVideo = []; //stores recordings
let audioRecord = document.getElementById('audiorecord');

//for audio toggle action
const audioToggle = () => {
    $.toast({text: audioRecord.checked ? 'Audio enabled...' : 'Audio disabled...',hideAfter: 1000, position: 'top-right', loaderBg: '#723be9'});
}

// actives screensharing and starts recording
const startRecording = async () => {

    try {
        recordedVideo = [];

        // for video and system audio
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                frameRate: { ideal: 60 },
                videoBitsPerSecond: 80000000
            },
            audio: audioRecord.checked ? true : false,
        });

        // for check if any audioinput device connected
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
        
        // for microphone audio if you don't check system audio
        if(audioRecord.checked){
            if(audioInputDevices != ''){

                audioStream = await navigator.mediaDevices.getUserMedia({
                    audio: true
                });
    
                stream.addTrack(audioStream.getAudioTracks()[0]);
            }
        }

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();

        $.toast({text: 'Recording started...',hideAfter: 1000, position: 'top-right', loaderBg: '#723be9'});

    } 
    catch (error) {
        $.toast({text: error,hideAfter: 2000, position: 'top-right', loaderBg: 'red'});
        console.error(error);
    }
};

//stops recording
const stopRecording = () => {

    try{
        mediaRecorder.stop();
        stream.getTracks().forEach((track) => track.stop());

        $.toast({text: 'Recording stopped...',hideAfter: 1000, position: 'top-right', loaderBg: '#723be9'});
        $.toast({text: 'Download recording for preview',hideAfter: 2000, position: 'top-right', loaderBg: '#723be9'});
    }
    catch(error){
        $.toast({text: error,hideAfter: 2000, position: 'top-right', loaderBg: 'red'});
        console.error(error);
    }
};

//pushes the recorded data 
const handleDataAvailable = (event) => {
    recordedVideo.push(event.data);
};

//downloads the recorded video
const downloadRecording = () => {

    if (recordedVideo != '') {
        const blob = new Blob(recordedVideo, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'Screen_Recording.webm';

        a.click();
        URL.revokeObjectURL(url);

        $.toast({text: 'Downloading...',hideAfter: 1000, position: 'top-right', loaderBg: '#723be9'});
    }
    else {
        $.toast({text: 'net::ERR_FILE_NOT_FOUND Screen_Recording.webm',hideAfter: 2000, position: 'top-right', loaderBg: 'red'});
    }
};