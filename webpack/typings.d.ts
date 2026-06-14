import { Configuration } from 'webpack'

export type Args = Pick<Configuration, 'mode' | 'name'>
