import { BrowserMultiFormatReader } from '@zxing/library';

/**
 * Scans for barcodes in a video stream from the user's camera.
 *
 * @param {HTMLVideoElement} videoElement - The video element to use for the camera stream.
 * @param {function} onScan - The function to call when a barcode is detected.
 * @param {function} onError - The function to call when an error occurs.
 * @returns nothing
 */

export function barcode(videoElement, onScan, onError) {
  const codeReader = new BrowserMultiFormatReader();

  codeReader
    .listVideoInputDevices()
    .then((videoInputDevices) => {
      if (videoInputDevices.length > 0) {
        codeReader
          .decodeOnceFromVideoDevice(videoInputDevices[0].deviceId, videoElement)
          .then(onScan)
          .catch(onError);
      } else {
        onError('No video input devices found');
      }
    })
    .catch(onError);
}
