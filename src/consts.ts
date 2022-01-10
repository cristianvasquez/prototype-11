// @ts-ignore
import {DateTimeFormatOptions} from "luxon";

const PLUGIN_NAME = 'prototype-11'

const dateTimeFormat:DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
}

const ID_PROPERTY = 'id'
export {PLUGIN_NAME, dateTimeFormat, ID_PROPERTY}