   let ffmpeg; // Čuvanje FFmpeg procesa
    socket.on('start_stream', () => {
        console.log('Pokretanje audio stream-a...');

        ffmpeg = spawn('ffmpeg', [
            '-f', 'dshow',
            '-i', 'audio="CABLE Output (VB-Audio Virtual Cable)"', 
            '-f', 'dshow',
            '-i', 'audio="Mikrofon (Realtek High Definition Audio)"', 
            '-f', 'dshow',
            '-i', 'audio="Stereomix (Realtek High Definition Audio)"', 
            '-filter_complex', '[0:a][1:a][2:a]amix=inputs=3[a]',
            '-map', '[a]',
            'output.wav'
        ]);

        ffmpeg.stdout.on('data', (data) => {
            console.log('Audio streaming u toku...');
        });

        ffmpeg.stderr.on('data', (data) => {
            console.error(`FFmpeg stderr: ${data.toString()}`);
        });

        ffmpeg.on('close', (code) => {
            console.log(`FFmpeg proces je zatvoren sa kodom ${code}`);
            ffmpeg = null;
        });
    });

    socket.on('stop_stream', () => {
        if (ffmpeg) {
            ffmpeg.kill();
            console.log('Audio stream je zaustavljen.');
            ffmpeg = null;
        }
    });

    socket.on('signal', (data) => {
        socket.broadcast.emit('signal', data);
    });
