// SPDX-License-Identifier: MIT
// Copyright (c) 2020-2022 The Pybricks Authors

import { Button, IRef, Intent, Spinner, SpinnerSize } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { useI18n } from '@shopify/react-i18n';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { tooltipDelay } from '../app/constants';
import { pointerEventsNone, preventFocusOnClick } from '../utils/react';
import { TooltipId } from './i18n';
import en from './i18n.en.json';

const smallScreenThreshold = 700;
export interface OpenFileButtonProps {
    /** A unique id for each instance. */
    readonly id: string;
    /** The accepted file extension */
    readonly fileExtension: string;
    /** Tooltip text that appears when hovering over the button. */
    readonly tooltip: TooltipId;
    /** Icon shown on the button. */
    readonly icon: string;
    /** When true or undefined, the button is enabled. */
    readonly enabled?: boolean;
    /** Show progress spinner instead of icon. */
    readonly showProgress?: boolean;
    /** The progress value (0 to 1) for the progress spinner. */
    readonly progress?: number;
    /** Callback that is called when a file has been selected and opened for reading. */
    readonly onFile: (data: ArrayBuffer) => void;
    /** Callback that is called when a file has been rejected (e.g. bad file extension). */
    readonly onReject: (file: File) => void;
    /** If defined, will call custom function instead of opening file browser. */
    readonly onClick?: () => void;
}

/**
 * Button that opens a file chooser dialog or accepts files dropped on it.
 */
const OpenFileButton: React.VoidFunctionComponent<OpenFileButtonProps> = ({
    id,
    fileExtension,
    tooltip,
    icon,
    enabled,
    showProgress,
    progress,
    onFile,
    onReject,
    onClick,
}) => {
    const [i18n] = useI18n({
        id: 'openFileButton',
        translations: { en },
        fallback: en,
    });

    const [isSmallScreen, setIsSmallScreen] = useState(
        window.innerWidth <= smallScreenThreshold,
    );

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= smallScreenThreshold);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    const buttonSize = isSmallScreen ? SpinnerSize.SMALL : SpinnerSize.STANDARD;

    const { getRootProps, getInputProps } = useDropzone({
        accept: fileExtension,
        // using File System Access API is blocked by https://github.com/react-dropzone/react-dropzone/issues/1141
        useFsAccessApi: false,
        multiple: false,
        noClick: onClick !== undefined,
        onDropAccepted: (acceptedFiles) => {
            // should only be one file since multiple={false}
            acceptedFiles.forEach((f) => {
                const reader = new FileReader();

                reader.onabort = (): void => console.error('file reading was aborted');
                reader.onerror = (): void => console.error('file reading has failed');
                reader.onload = (): void => {
                    const binaryStr = reader.result;
                    if (binaryStr === null) {
                        throw Error('Unexpected null binaryStr');
                    }
                    if (typeof binaryStr === 'string') {
                        throw Error('Unexpected string binaryStr');
                    }
                    onFile(binaryStr);
                };
                reader.readAsArrayBuffer(f);
            });
        },
        onDropRejected: (fileRejections) => {
            // should only be one file since multiple={false}
            fileRejections.forEach((r) => {
                onReject(r.file);
            });
        },
    });

    return (
        <Tooltip2
            content={i18n.translate(
                tooltip,
                tooltip === TooltipId.FlashProgress
                    ? {
                          percent:
                              progress === undefined
                                  ? ''
                                  : i18n.formatPercentage(progress),
                      }
                    : undefined,
            )}
            placement="bottom"
            hoverOpenDelay={tooltipDelay}
            renderTarget={({
                ref: tooltipTargetRef,
                isOpen: _tooltipIsOpen,
                ...tooltipTargetProps
            }) => (
                <Button
                    {...getRootProps({
                        refKey: 'elementRef',
                        elementRef: tooltipTargetRef as IRef<HTMLButtonElement>,
                        ...tooltipTargetProps,
                        intent: Intent.PRIMARY,
                        disabled: enabled === false,
                        style: enabled === false ? pointerEventsNone : undefined,
                        onMouseDown: preventFocusOnClick,
                        onClick: onClick,
                    })}
                >
                    <input {...getInputProps()} />
                    {showProgress ? (
                        <Spinner
                            value={progress}
                            intent={Intent.PRIMARY}
                            size={buttonSize}
                        />
                    ) : (
                        <img
                            width={`${buttonSize}px`}
                            height={`${buttonSize}px`}
                            src={icon}
                            alt={id}
                            style={pointerEventsNone}
                        />
                    )}
                </Button>
            )}
        />
    );
};

export default OpenFileButton;
