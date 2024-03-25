import React from 'react';
import {Alert} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import * as Console from '@libs/actions/Console';
import {parseStringifyMessages} from '@libs/Console';
import localFileDownload from '@libs/localFileDownload';
import ONYXKEYS from '@src/ONYXKEYS';
import BaseClientSideLoggingToolMenu from './BaseClientSideLoggingToolMenu';
import type {ClientSideLoggingToolMenuOnyxProps, ClientSideLoggingToolProps} from './types';

function ClientSideLoggingToolMenu({capturedLogs, shouldStoreLogs}: ClientSideLoggingToolProps) {
    const onToggle = () => {
        if (!shouldStoreLogs) {
            Console.setShouldStoreLogs(true);
            return;
        }

        if (!capturedLogs) {
            Alert.alert('No logs to share', 'There are no logs to share');
            Console.disableLoggingAndFlushLogs();
            return;
        }

        const logs = Object.values(capturedLogs);
        const logsWithParsedMessages = parseStringifyMessages(logs);

        localFileDownload('logs', JSON.stringify(logsWithParsedMessages, null, 2));
        Console.disableLoggingAndFlushLogs();
    };

    return (
        <BaseClientSideLoggingToolMenu
            onToggleSwitch={onToggle}
            shouldStoreLogs={shouldStoreLogs}
        />
    );
}

ClientSideLoggingToolMenu.displayName = 'ClientSideLoggingToolMenu';

export default withOnyx<ClientSideLoggingToolProps, ClientSideLoggingToolMenuOnyxProps>({
    capturedLogs: {
        key: ONYXKEYS.LOGS,
    },
    shouldStoreLogs: {
        key: ONYXKEYS.SHOULD_STORE_LOGS,
    },
})(ClientSideLoggingToolMenu);
