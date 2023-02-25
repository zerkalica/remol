import {
  $,
  $mol_after_frame,
  $mol_after_timeout,
  $mol_compare_deep,
  $mol_fail_hidden,
  $mol_guid,
  $mol_state_time,
  $mol_wire_async,
  $mol_wire_field,
  $mol_wire_plex,
  $mol_wire_solo,
  $mol_wire_sync,
} from './stub.js'

export {
  $mol_guid as guid,
  $mol_after_frame as AfterFrame,
  $mol_after_timeout as AfterTimeout,
  $mol_state_time as StateTime,
  $mol_fail_hidden as failHidden,
  $mol_wire_solo as solo,
  $mol_wire_plex as plex,
  $mol_wire_field as field,
  $mol_wire_sync as sync,
  $mol_wire_async as rAsync,
  $mol_compare_deep as compareDeep,
}
export const delay = $.$mol_wait_timeout.bind($)
export const delayAsync = $.$mol_wait_timeout_async.bind($)

export { RemolObject } from './object/object.js'
export { RemolQueue } from './qeue/queue.js'
export { RemolContext } from './context/context.js'
export { remolFuncName } from './func/name.js'
export { remolMiddlewareAsync } from './middleware/async.js'
export { RemolAtom, remolSyncRender } from './atom/atom.js'
export { RemolBox, RemolBoxProps } from './box/box.js'
export { RemolError } from './error/error.js'
export { action } from './action/action.js'
