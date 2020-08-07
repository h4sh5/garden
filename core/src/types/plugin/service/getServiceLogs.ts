/*
 * Copyright (C) 2018-2020 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Stream } from "ts-stream"
import { PluginServiceActionParamsBase, serviceActionParamsSchema } from "../base"
import { dedent } from "../../../util/string"
import { Module } from "../../module"
import { runtimeContextSchema } from "../../../runtime-context"
import { joi } from "../../../config/common"

export interface GetServiceLogsParams<M extends Module = Module, S extends Module = Module>
  extends PluginServiceActionParamsBase<M, S> {
  stream: Stream<ServiceLogEntry>
  follow: boolean
  tail: number
  startTime?: Date
}

export interface ServiceLogEntry {
  serviceName: string
  timestamp?: Date
  msg: string
}

export const serviceLogEntrySchema = () =>
  joi
    .object()
    .keys({
      serviceName: joi
        .string()
        .required()
        .description("The name of the service the log entry originated from."),
      timestamp: joi
        .date()
        .required()
        .description("The time when the log entry was generated by the service."),
      msg: joi
        .string()
        .required()
        .description("The content of the log entry."),
    })
    .description("A log entry returned by a getServiceLogs action handler.")

export interface GetServiceLogsResult {}

export const getServiceLogs = () => ({
  description: dedent`
    Retrieve a stream of logs for the specified service, optionally waiting listening for new logs.

    Called by the \`garden logs\` command.
  `,

  paramsSchema: serviceActionParamsSchema().keys({
    runtimeContext: runtimeContextSchema(),
    stream: joi.object().description("A Stream object, to write the logs to."),
    follow: joi.boolean().description("Whether to keep listening for logs until aborted."),
    tail: joi
      .number()
      .description("Number of lines to get from end of log. Defaults to -1, showing all log lines.")
      .default(-1),
    startTime: joi
      .date()
      .optional()
      .description("If set, only return logs that are as new or newer than this date."),
  }),

  resultSchema: joi.object().keys({}),
})