import { verifyAuthCode } from '../auth/verify';
import { basicHandler } from './basic-handler-wrapper';

export const handler = basicHandler(verifyAuthCode);
