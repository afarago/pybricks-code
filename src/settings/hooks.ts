// SPDX-License-Identifier: MIT
// Copyright (c) 2022-2024 The Pybricks Authors

import { useCallback, useEffect } from 'react';
import { useEffectOnce, useLocalStorage, useSessionStorage } from 'usehooks-ts';

/** Hook for "showDocs" setting. */
export function useSettingIsShowDocsEnabled(): {
    isSettingShowDocsEnabled: boolean;
    setIsSettingShowDocsEnabled: (value: boolean) => void;
    toggleIsSettingShowDocsEnabled: () => void;
} {
    const [isLastSettingShowDocsEnabled, setIsLastSettingShowDocsEnabled] =
        useLocalStorage('setting.showDocs', window.innerWidth >= 1024);

    const [isSettingShowDocsEnabled, setIsSettingShowDocsEnabled] = useSessionStorage(
        'setting.showDocs',
        isLastSettingShowDocsEnabled,
    );

    // Force writing to session storage since default value is not constant.
    useEffectOnce(() => setIsSettingShowDocsEnabled(isSettingShowDocsEnabled));

    useEffect(() => {
        setIsLastSettingShowDocsEnabled(isSettingShowDocsEnabled);
    }, [isSettingShowDocsEnabled, setIsLastSettingShowDocsEnabled]);

    const toggleIsSettingShowDocsEnabled = useCallback(
        () => setIsSettingShowDocsEnabled((x) => !x),
        [setIsSettingShowDocsEnabled],
    );

    return {
        isSettingShowDocsEnabled,
        setIsSettingShowDocsEnabled,
        toggleIsSettingShowDocsEnabled,
    };
}

export function useSettingGithubAuth(): {
    settingGithubAuth: string;
    setSettingGithubAuth: (value: string) => void;
} {
    const [settingGithubAuth, setSettingGithubAuth] = useLocalStorage(
        'setting.githubAuth',
        '',
    );

    return {
        settingGithubAuth,
        setSettingGithubAuth,
    };
}

export function useSettingGithubGist(): {
    settingGithubGist: string;
    setSettingGithubGist: (value: string) => void;
} {
    const [settingGithubGist, setSettingGithubGist] = useLocalStorage(
        'setting.githubGist',
        '',
    );

    return {
        settingGithubGist,
        setSettingGithubGist,
    };
}
