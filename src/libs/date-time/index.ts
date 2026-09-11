import { Utils } from '../utils'
import { StringOrNumber } from '../utils/typings'
import { DateTimeFormat, DateTimeInterval, DateTimeOperation, DateTimePattern, Milliseconds, TimeZone, UnixDateTime } from './typings'

export namespace DateTime {
  const millisecondsByInterval: Record<DateTimeInterval, Milliseconds> = {
    second: Milliseconds.second,
    minute: Milliseconds.minute,
    hour: Milliseconds.hour,
    day: Milliseconds.day,
    week: Milliseconds.week,
  }

  export const toUtc = (dateTime: string): string => {
    const pattern = new RegExp(DateTimePattern.simple)
    return pattern.test(dateTime) ? dateTime.split(' ').join('T').concat('+0000') : UnixDateTime.utc
  }

  export const toSimple = (dateTime: string): string => {
    const pattern = new RegExp(DateTimePattern.utc)
    return pattern.test(dateTime)
      ? dateTime
          .split('T')
          .join(' ')
          .slice(0, dateTime.length - 5)
      : UnixDateTime.simple
  }

  export const toTimeZone = (timeZone: TimeZone, dateTime: StringOrNumber = Date.now()): string => {
    const pattern = new RegExp(DateTimePattern.utcOrLocal)
    const isValid = Utils.isNumber(dateTime) || pattern.test(dateTime)
    const defaultValue = isValid ? dateTime : UnixDateTime.utc
    const defaultTimeZone = isValid ? timeZone : 'utc'
    const date = new Date(defaultValue)
    switch (defaultTimeZone) {
      case 'local':
        const localDate = date.toLocaleDateString().split('.').reverse().join('-')
        const [localTime, offset] = date.toTimeString().split(' ')
        return `${localDate}T${localTime}${offset.slice(3)}`
      case 'utc':
        const [utcDateTime] = date.toISOString().split('.')
        return `${utcDateTime}+0000`
    }
  }

  export const formatBy = (dateTime: string, format: DateTimeFormat): string => {
    const pattern = new RegExp(DateTimePattern.utcOrLocal)
    const value = pattern.test(dateTime) ? dateTime : UnixDateTime.utc
    const locale = new Array<DateTimeFormat>('ru', 'en-GB', 'en-US')
    if (locale.includes(format)) {
      return new Date(value).toLocaleDateString(format, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } else {
      const date = value.split('T').at(0)?.split('-').reverse().join('.') ?? UnixDateTime.date
      const time = value.split('T').at(1)?.split('+').at(0)?.split(':').slice(0, 2).join(':') ?? UnixDateTime.time
      switch (format) {
        case 'day.month.year':
          return date
        case 'hours:minutes':
          return time
        case 'day.month.year - hours:minutes':
          return `${date} - ${time}`
        default:
          return `${UnixDateTime.date} - ${UnixDateTime.time}`
      }
    }
  }

  export const adjust = (timeZone: TimeZone, operation: DateTimeOperation, interval: DateTimeInterval, value: number): string => {
    switch (operation) {
      case 'add':
        return toTimeZone(timeZone, Date.now() + millisecondsByInterval[interval] * value)
      case 'subtract':
        return toTimeZone(timeZone, Date.now() - millisecondsByInterval[interval] * value)
    }
  }

  export const more = (first: string, second: string): boolean => {
    const pattern = new RegExp(DateTimePattern.utcOrLocal)
    const isValid = pattern.test(first) && pattern.test(second)
    if (isValid) {
      return new Date(first) > new Date(second)
    } else {
      throw new Error(pattern.source)
    }
  }
}
