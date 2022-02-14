import $ from 'mol_wire_lib'

export {
  $mol_fail_hidden as remolFail,
  $mol_wire_mem as mem,
  $mol_wire_field as field,
  $mol_wire_sync as remolSync,
  $mol_wire_async as remolAsync,
  $mol_compare_deep as remolCompareDeep,
} from 'mol_wire_lib'

export const remolWaitTimeout = $.$mol_wait_timeout.bind($)
export const remolWaitTimeoutAsync = $.$mol_wait_timeout_async.bind($)

export { remolEventFactory } from './event/factory'
export { remolAction as action } from './action/action'
export { RemolContext, RemolContextKey, RemolContextUpdater } from './context/context'
export { RemolError } from './error/error'
export { remolFuncName } from './func/name'
export { remolMiddlewareAsync } from './middleware/async'
export { RemolWire, RemolWireHost } from './wire/wire'
export { RemolWireFunc } from './wire/func'
export { remolComponentCopy } from './component/copy'
