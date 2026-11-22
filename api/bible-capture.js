import { createHandler } from './study-capture.js';
import { editionCapture } from '../website/bibbia-2/order-core.mjs';
export default createHandler({payloadBuilder:editionCapture});
