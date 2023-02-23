import $ from 'mol_wire_lib'

export {
  $mol_guid as guid,
  $mol_after_frame as AfterFrame,
  $mol_after_timeout as AfterTimeout,
  $mol_state_time as StateTime,
  $mol_ambient_ref as ambientRef,
  $mol_fail_hidden as remolFail,
  $mol_wire_solo as solo,
  $mol_wire_plex as plex,
  $mol_wire_field as field,
  $mol_wire_sync as remolSync,
  $mol_wire_async as remolAsync,
  $mol_compare_deep as remolCompareDeep,
} from 'mol_wire_lib'
export const delay = $.$mol_wait_timeout.bind($)
export const delayAsync = $.$mol_wait_timeout_async.bind($)

export { RemolObject } from './object/object'
export { RemolQueue } from './qeue/queue'
export { RemolContext } from './context/context'
export { remolFuncName } from './func/name'
export { remolMiddlewareAsync } from './middleware/async'
export { RemolAtom, remolSyncRender } from './atom/atom'
export { RemolBox, RemolBoxProps } from './box/box'
export { RemolError } from './error/error'
export { action } from './action/action'
