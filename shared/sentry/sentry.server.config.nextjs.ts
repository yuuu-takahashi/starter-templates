import * as Sentry from '@sentry/nextjs';

import { sentryConfig } from './src/config/sentry.config';

Sentry.init(sentryConfig);
