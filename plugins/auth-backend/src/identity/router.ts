/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Router from 'express-promise-router';
import { Logger } from 'winston';
import { KeyStore } from './types';

export type Options = {
  logger: Logger;
  baseUrl: string;
  keyStore: KeyStore;
};

export function createOidcRouter(options: Options) {
  const {
    logger: baseLogger,
    keyStore,
    baseUrl = 'http://localhost:7000/auth',
  } = options;
  const logger = baseLogger.child({ router: 'identity' });

  const router = Router();

  const config = {
    issuer: baseUrl,
    token_endpoint: `${baseUrl}/v1/token`,
    userinfo_endpoint: `${baseUrl}/v1/userinfo`,
    jwks_uri: `${baseUrl}/v1/certs`,
    response_types_supported: ['id_token'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    scopes_supported: ['openid'],
    token_endpoint_auth_methods_supported: [],
    claims_supported: ['sub'],
    grant_types_supported: [],
  };

  router.get('/.well-known/openid-configuration', (_req, res) => {
    logger.info('request configuration');
    res.json(config);
  });

  router.get('/.well-known/jwks.json', async (_req, res) => {
    logger.info('request certs');
    const keys = await keyStore.listPublicKeys();
    res.json(keys);
  });

  router.get('/v1/token', (_req, res) => {
    logger.info('request token');
    res.status(501).send('Not Implemented');
  });

  router.get('/v1/userinfo', (_req, res) => {
    logger.info('request userinfo');
    res.status(501).send('Not Implemented');
  });

  return router;
}
