import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType } from '@zxing/library';

let codeReaderInstance = null;

/**
 * Scans for barcodes in a video stream from the user's camera.
 *
 * Uses `facingMode: environment` so the browser picks the back camera on mobile
 * devices, and restricts decoding to retail barcode formats with TRY_HARDER for
 * better detection in poor lighting.
 *
 * @param {HTMLVideoElement} videoElement - The video element to use for the camera stream.
 * @param {function} onScan - The function to call when a barcode is detected.
 * @param {function} onError - The function to call when an error occurs.
 * @returns nothing
 */

export function barcode(videoElement, onScan, onError) {
  const hints = new Map();

  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
    BarcodeFormat.CODE_128,
    BarcodeFormat.QR_CODE
  ]);
  hints.set(DecodeHintType.TRY_HARDER, true);

  codeReaderInstance = new BrowserMultiFormatReader(hints);

  const constraints = {
    audio: false,
    video: {
      facingMode: { ideal: 'environment' },
      height: { ideal: 720 },
      width: { ideal: 1280 }
    }
  };

  codeReaderInstance
    .decodeOnceFromConstraints(constraints, videoElement)
    .then(onScan)
    .catch(onError);
}

/**
 * Stops the barcode scanning process.
 */

export function stop() {
  if (codeReaderInstance) {
    codeReaderInstance.reset();
    codeReaderInstance = null;
  }
}
