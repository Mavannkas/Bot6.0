import { resolveTriggerDeps } from '../../triggers/deps';
import { preSignUpTrigger } from '../../triggers/pre-signup-trigger';
import { basicHandler } from '../basic-handler-wrapper';

const deps = resolveTriggerDeps();

export const handler = basicHandler(deps)(preSignUpTrigger);
