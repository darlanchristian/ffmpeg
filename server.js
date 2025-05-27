const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 80;

app.use(bodyParser.json());

// Serve arquivos de vídeo
app.use('/videos', express.static(path.join(__dirname, 'videos')));

// Rota para processar o vídeo
app.post('/render', async (req, res) => {
  const data = req.body;

  try {
    const scene = data.scenes[0];  // Pegando a primeira cena para exemplo

    const image = scene.elements.image;
    const subtitles = scene.elements.subtitles;
    const voice = scene.elements.voice;
    const audio = scene.elements.audio;
    const duration = scene.duration;
    
    let width = 1920;
    let height = 1080;

    if (data.resolution === 'hd') {
      width = 1280;
      height = 720;
    }

    const filename = `${scene.id}-${uuidv4()}.mp4`;
    const outputPath = path.join(__dirname, 'videos', filename);

    // Garante que a pasta existe
    if (!fs.existsSync(path.join(__dirname, 'videos'))) {
      fs.mkdirSync(path.join(__dirname, 'videos'));
    }

    const cmd = `ffmpeg -loop 1 -i ${image} -i ${voice} -i ${audio} -vf "scale=${width}:${height},subtitles=${subtitles}" -filter_complex "[1:a][2:a]amix=inputs=2:duration=first:dropout_transition=3" -shortest -t ${duration} -c:v libx264 -pix_fmt yuv420p ${outputPath}`;

    console.log("Executando:", cmd);

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar FFmpeg: ${error.message}`);
        return res.status(500).json({ error: error.message });
      }

      console.log(`FFmpeg stdout: ${stdout}`);
      console.error(`FFmpeg stderr: ${stderr}`);

      return res.json({ 
        message: 'Vídeo gerado com sucesso!',
        url: `/videos/${filename}`
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no processamento.' });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
