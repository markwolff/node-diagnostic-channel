// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.
import ApplicationInsights = require("applicationinsights");
import {channel, IStandardEvent} from "diagnostic-channel";
import {bunyan} from "diagnostic-channel-publishers";

// Mapping from bunyan levels defined at https://github.com/trentm/node-bunyan/blob/master/lib/bunyan.js#L256
const bunyanToAILevelMap = {};
bunyanToAILevelMap[10] = ApplicationInsights.contracts.SeverityLevel.Verbose;
bunyanToAILevelMap[20] = ApplicationInsights.contracts.SeverityLevel.Verbose;
bunyanToAILevelMap[30] = ApplicationInsights.contracts.SeverityLevel.Information;
bunyanToAILevelMap[40] = ApplicationInsights.contracts.SeverityLevel.Warning;
bunyanToAILevelMap[50] = ApplicationInsights.contracts.SeverityLevel.Error;
bunyanToAILevelMap[60] = ApplicationInsights.contracts.SeverityLevel.Critical;

export const subscriber = (event: IStandardEvent<bunyan.IBunyanData>) => {
    if (ApplicationInsights.client) {
        const AIlevel = bunyanToAILevelMap[event.data.level];
        ApplicationInsights.client.trackTrace(event.data.result, AIlevel);
    }
};

channel.subscribe<bunyan.IBunyanData>("bunyan", subscriber);
