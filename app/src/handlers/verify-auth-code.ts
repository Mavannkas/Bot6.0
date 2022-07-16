import { resolveDeps } from '../auth/deps';
import { verifyAuthCode } from '../auth/verify';
import { basicHandler } from './basic-handler-wrapper';

const deps = resolveDeps();

export const handler = basicHandler(deps)(verifyAuthCode);
