// SPDX-License-Identifier: MIT
// Copyright (c) 2021-2024 The Pybricks Authors

// import './settings.scss';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import { Generate, Key, Updated } from '@blueprintjs/icons';
import { Octokit } from '@octokit/core';
import React from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Button } from '../components/Button';

const Git: React.FunctionComponent = () => {
    const [settingGithubAuth, setSettingGithubAuth] = useLocalStorage(
        'setting.githubAuth',
        '',
    );

    // const { isDarkMode, setTernaryDarkMode } = useTernaryDarkMode();

    // const dispatch = useDispatch();

    // const i18n = useI18n();

    //function create

    // dispatch --> sagas -> actions

    async function handleCreateRepo() {
        alert('alma');
        const settingGithubAuth = JSON.parse(
            localStorage.getItem('setting.githubAuth') || '',
        );
        const octokit = new Octokit({
            auth: settingGithubAuth,
        });

        const response: unknown = await octokit.request(`POST /user/repos`, {
            name: 'test-repo2',
            private: false,
        });
        console.log(response);
        console.log('handleExplorerGithubSyncAllFiles', 1);

        // ,....
        /*
        0. create repo
        0a. get commit tree / base
        ----
        * list files
        * check any conflicts / store with each file last update?
        ----
        1. Create blob
        2. Create tree 
        3. Create a Commit
        4. Update Reference
        */
    }

    return (
        <div className="pb-git">
            <FormGroup label="GitHub details">
                <InputGroup
                    placeholder="Authentication token"
                    type="password"
                    value={settingGithubAuth}
                    onChange={(e) => setSettingGithubAuth(e.currentTarget.value)}
                    leftIcon={<Key />}
                />
                <InputGroup placeholder="Repository link" type="text" />
                <InputGroup placeholder="Gist link" type="text" />
                <Button
                    id="pb-settings-flash-pybricks-button"
                    minimal={false}
                    icon={<Updated />}
                    // intent="primary"
                    // text="Sync now"
                    // onPress={() => dispatch(firmwareInstallPybricks())}
                    label="Pull"
                ></Button>
                <Button
                    id="pb-settings-flash-pybricks-button"
                    minimal={false}
                    icon={<Updated />}
                    // intent="primary"
                    // text="Sync now"
                    // onPress={() => dispatch(firmwareInstallPybricks())}
                    label="Push"
                ></Button>
                <Button
                    id="pb-git-create-repo-button"
                    minimal={false}
                    icon={<Generate />}
                    // intent="primary"
                    // text="Sync now"
                    // onPress={() => dispatch(firmwareInstallPybricks())}
                    onPress={async () => await handleCreateRepo()}
                    label="Create Repo"
                ></Button>
            </FormGroup>
            <FormGroup label="GitHub authentication">
                <InputGroup placeholder="Authentication token" type="token" />
            </FormGroup>
        </div>
    );
};

export default Git;
