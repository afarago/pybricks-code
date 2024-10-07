// SPDX-License-Identifier: MIT
// Copyright (c) 2022-2024 The Pybricks Authors

import { createAction } from '../actions';

export const settingsGetGithubAuth = createAction(() => ({
    type: 'settings.action.getGithubAuth',
}));

export const settingsDidGetGithubAuth = createAction((githubAuth: string) => ({
    type: 'settings.action.didGetGithubAuth',
    githubAuth,
}));
