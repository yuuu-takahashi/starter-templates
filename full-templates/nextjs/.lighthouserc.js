/** @type {import('@lhci/cli').LighthouseRcConfig} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'yarn start',
      startServerReadyPattern: 'started server on',
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    upload: {
      target: 'temporary-public-storage',
    },
    // TODO(human): Define your score thresholds and assertion rules
    // See: https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#assert
    assert: {},
  },
}
