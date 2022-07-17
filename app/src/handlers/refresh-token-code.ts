import { getRefreshToken } from '../auth/auth-tokens';
import { resolveAuthDeps } from '../auth/deps';
import { basicHandler } from './basic-handler-wrapper';

const deps = resolveAuthDeps();

export const handler = basicHandler(deps)(getRefreshToken);
