import Docker from 'dockerode';

const docker = new Docker();
const imageName = "jrottenberg/ffmpeg";
const containerName = "video-processor";

async function processVideo() {
  try {
    const images = await docker.listImages();
    const imageExists = images.some( img =>  img.RepoTags.includes(`${imageName}:latest`));

    if(!imageExists) {
      const stream = await docker.pull(imageName);

      await new Promise((resolve, reject) => {
        docker.modem.followProgress(stream, (err, res) => err ? reject(err) : resolve(res));
      })
    }

    const container = await docker.listContainers({all: true})
    const containerExists = container.some(c => c.Names.includes(`/${containerName}`));
    console.log(container)

    if(!containerExists) {

    }

  } catch (error) {
    console.error('Error processing video:', error);
  }
}

processVideo()