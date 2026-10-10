import { RuntimeLoader } from '@rive-app/react-canvas';
import riveWasmUrl from '@rive-app/canvas/rive.wasm';

// Serve the Rive runtime's .wasm from our own bundle instead of a CDN,
// so the animations still work offline. This must run before any <Rive> loads.
RuntimeLoader.setWasmUrl(riveWasmUrl);
