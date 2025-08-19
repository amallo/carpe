fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios beta

```sh
[bundle exec] fastlane ios beta
```

Build and upload to TestFlight

### ios release

```sh
[bundle exec] fastlane ios release
```

Build for App Store

### ios test

```sh
[bundle exec] fastlane ios test
```

Run tests

### ios clean

```sh
[bundle exec] fastlane ios clean
```

Clean build artifacts

### ios setup_certificates

```sh
[bundle exec] fastlane ios setup_certificates
```

Setup certificates and provisioning profiles

### ios debug_config

```sh
[bundle exec] fastlane ios debug_config
```

Debug environment and API key

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
