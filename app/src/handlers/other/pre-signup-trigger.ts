import { resolveTriggerDeps } from '../../triggers/pre-signup/deps';
import { preSignUpTrigger } from '../../triggers/pre-signup/pre-signup-trigger';
import { basicHandler } from '../basic-handler-wrapper';

const deps = resolveTriggerDeps();

export const handler = basicHandler(deps)(preSignUpTrigger, true);
