const CDN_BASE = 'https://cdn.jsdelivr.net/gh/xXDLINEXx/serenity';

export function tryRequire(localPath: string): number | { uri: string } {
  console.log(`[tryRequire] Attempting to load: ${localPath}`);
  
  if (!localPath) {
    console.error('[tryRequire] Empty path provided');
    return { uri: '' };
  }
  
  try {
    if (localPath.includes('/audio/')) {
      const filename = localPath.split('/audio/')[1]?.replace('.mp3', '');
      if (!filename) {
        console.error(`[tryRequire] Could not extract filename from: ${localPath}`);
        return { uri: `${CDN_BASE}/media/audio/unknown.mp3` };
      }
      
      console.log(`[tryRequire] Loading audio: ${filename}`);
      
      try {
        let asset: number;
        switch (filename) {
          case 'pluie-douce':
            asset = require('../media/audio/pluie-douce.mp3');
            break;
          case 'vague-de-locean':
            asset = require('../media/audio/vague-de-locean.mp3');
            break;
          case 'feu-de-camp':
            asset = require('../media/audio/feu-de-camp.mp3');
            break;
          case 'foret-paisible':
            asset = require('../media/audio/foret-paisible.mp3');
            break;
          case 'vent-leger':
            asset = require('../media/audio/vent-leger.mp3');
            break;
          case 'orage-apaisant':
            asset = require('../media/audio/orage-apaisant.mp3');
            break;
          case 'riviere-calme':
            asset = require('../media/audio/riviere-calme.mp3');
            break;
          case 'bruit-blanc':
            asset = require('../media/audio/bruit-blanc.mp3');
            break;
          default:
            throw new Error(`Audio file not in switch: ${filename}`);
        }
        console.log(`[tryRequire] Successfully loaded local audio: ${filename}`);
        return asset;
      } catch (requireError) {
        const cdnUrl = `${CDN_BASE}/media/audio/${filename}.mp3`;
        console.log(`[tryRequire] Local audio failed, using CDN: ${cdnUrl}`, requireError);
        return { uri: cdnUrl };
      }
    } else if (localPath.includes('/video/')) {
      const filename = localPath.split('/video/')[1]?.replace('.mp4', '');
      if (!filename) {
        console.error(`[tryRequire] Could not extract filename from: ${localPath}`);
        return { uri: `${CDN_BASE}/media/video/unknown.mp4` };
      }
      
      console.log(`[tryRequire] Loading video: ${filename}`);
      
      try {
        let asset: number;
        switch (filename) {
          case 'pluie-douce':
            asset = require('../media/video/pluie-douce.mp4');
            break;
          case 'vague-de-locean':
            asset = require('../media/video/vague-de-locean.mp4');
            break;
          case 'feu-de-camp':
            asset = require('../media/video/feu-de-camp.mp4');
            break;
          case 'foret-paisible':
            asset = require('../media/video/foret-paisible.mp4');
            break;
          case 'vent-leger':
            asset = require('../media/video/vent-leger.mp4');
            break;
          case 'orage-apaisant':
            asset = require('../media/video/orage-apaisant.mp4');
            break;
          case 'riviere-calme':
            asset = require('../media/video/riviere-calme.mp4');
            break;
          case 'bruit-blanc':
            asset = require('../media/video/bruit-blanc.mp4');
            break;
          case 'frequence':
            asset = require('../media/video/frequence.mp4');
            break;
          default:
            throw new Error(`Video file not in switch: ${filename}`);
        }
        console.log(`[tryRequire] Successfully loaded local video: ${filename}`);
        return asset;
      } catch (requireError) {
        const cdnUrl = `${CDN_BASE}/media/video/${filename}.mp4`;
        console.log(`[tryRequire] Local video failed, using CDN: ${cdnUrl}`, requireError);
        return { uri: cdnUrl };
      }
    } else if (localPath.includes('/frequency/')) {
      const filename = localPath.split('/frequency/')[1]?.replace('.mp3', '');
      if (!filename) {
        console.error(`[tryRequire] Could not extract filename from: ${localPath}`);
        return { uri: `${CDN_BASE}/media/frequency/unknown.mp3` };
      }
      
      console.log(`[tryRequire] Loading frequency: ${filename}`);
      
      try {
        let asset: number;
        switch (filename) {
          case '4-7hz-with-417hz-639hz':
            asset = require('../media/frequency/4-7hz-with-417hz-639hz.mp3');
            break;
          case '8-to-12-hz':
            asset = require('../media/frequency/8-to-12-hz.mp3');
            break;
          case '10hz':
            asset = require('../media/frequency/10hz.mp3');
            break;
          case '33hz':
            asset = require('../media/frequency/33hz.mp3');
            break;
          case '66hz':
            asset = require('../media/frequency/66hz.mp3');
            break;
          case '396-hz-417-hz-639hz':
            asset = require('../media/frequency/396-hz-417-hz-639hz.mp3');
            break;
          case '417hz':
            asset = require('../media/frequency/417hz.mp3');
            break;
          case '852hz':
            asset = require('../media/frequency/852hz.mp3');
            break;
          case '1441hz':
            asset = require('../media/frequency/1441hz.mp3');
            break;
          case '2772hz':
            asset = require('../media/frequency/2772hz.mp3');
            break;
          default:
            throw new Error(`Frequency file not in switch: ${filename}`);
        }
        console.log(`[tryRequire] Successfully loaded local frequency: ${filename}`);
        return asset;
      } catch (requireError) {
        const cdnUrl = `${CDN_BASE}/media/frequency/${filename}.mp3`;
        console.log(`[tryRequire] Local frequency failed, using CDN: ${cdnUrl}`, requireError);
        return { uri: cdnUrl };
      }
    }

    console.warn(`[tryRequire] Invalid path format: ${localPath}`);
    const fallbackPath = localPath.replace('..', '');
    return { uri: `${CDN_BASE}${fallbackPath}` };
  } catch (error) {
    console.error(`[tryRequire] Fatal error loading ${localPath}:`, error);
    const fallbackPath = localPath.replace('..', '');
    return { uri: `${CDN_BASE}${fallbackPath}` };
  }
}
