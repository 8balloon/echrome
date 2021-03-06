/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {ProjectConfig} from 'echrome-core/types';

import mock from 'jest-mock';
import {installCommonGlobals} from 'jest-util';

// this is pulling from the end-user's jest installation,
// not the jest dep of this package, since @jest/fake-timers
// is not an explicit dependency of this package.
// we should consider making @jest/fake-timers an explicit dep
// of this package when/if jest is upgraded in this package.
import {LegacyFakeTimers as FakeTimers} from '@jest/fake-timers';

export default class ElectronEnvironment {
  global: Object;
  moduleMocker: Object;
  fakeTimers: Object;

  constructor(config: ProjectConfig) {
    this.global = global;
    this.moduleMocker = new mock.ModuleMocker(global);

    const timerConfig = {
      idToRef: (id) => id,
      refToId: (ref) => ref,
    };

    // https://github.com/facebook-atom/jest-electron-runner/pull/67 
    this.fakeTimers = new FakeTimers({
      config,
      global,
      moduleMocker: this.moduleMocker,
      timerConfig
    });

    installCommonGlobals(global, config.globals);
  }

  async setup() {}

  async teardown() {}

  runScript(script: any): ?any {
    // Since evrey tests runs in a new window we don't need any extra isolation
    // as we need in Jest node runner
    return script.runInThisContext();
  }
}
