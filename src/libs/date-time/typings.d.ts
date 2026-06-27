export type TimeZone = 'utc' | 'local'

export type DateTimeFormat = 'ru' | 'en-GB' | 'en-US' | 'day.month.year' | 'hours:minutes' | 'day.month.year - hours:minutes'

export type DateTimeOperation = 'add' | 'subtract'

export type DateTimeInterval = keyof typeof Milliseconds

export enum Milliseconds {
  second = 1000,
  minute = 60000,
  hour = 3600000,
  day = 86400000,
  week = 604800000,
}

export enum DateTimePattern {
  date = '[0-9]{4}-[0-9]{2}-[0-9]{2}',
  time = '[0-9]{2}:[0-9]{2}:[0-9]{2}',
  utcOrLocal = `^${DateTimePattern.date}T${DateTimePattern.time}[+/-][0-9]{4}$`,
  utc = `^${DateTimePattern.date}T${DateTimePattern.time}[+][0]{4}$`,
  simple = `^${DateTimePattern.date} ${DateTimePattern.time}$`,
}

export enum UnixDateTime {
  utc = '1970-01-01T00:00:00+0000',
  simple = '1970-01-01 00:00:00',
  date = '01.01.1970',
  time = '00:00:00',
}
