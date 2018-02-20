# app-é-tite

Discover and rate restaurants nearby

## Development

### Dependencies
- [Yarn](https://yarnpkg.com/)

### Run
To run the application:

    yarn
    yarn start

### Coding standards
 - ESLint is used to enforece the [airbnb/javascript](https://github.com/airbnb/javascript/) style guide.
 - SCSS files are linted using [sass-lint](https://github.com/sasstools/sass-lint)
 - [Erlang guidelines](https://github.com/erlang/otp/wiki/writing-good-commit-messages) for commit messages.

## Distribution
To make a build, run `yarn dist`, which will create a build for the platform (Windows, Linux etc) in which the build job is being run. The built artifacts will be present in the `dist folder`

    yarn dist

Packaging builds are handled by [electron-builder](http://electron.build/).

### Continuous Integration
A CI platform such as Jenkins can pull code from a branch and make daily builds by running the `yarn dist` command which will create an executable file.

## Design considerations
### Electron.js
While using Electron.js made certain things easy (such as not having to use an ES2015 transpiler, not having to worry about bundling resources to optimize loading performance etc), it did bring up a small set of problems of it's own, such as having to find a solution to sync data between clients etc, which wouldn't have been an issue in the case of a regular web app.

### Vue.js
A library that provided data binding was essential and I decided to use Vue.js after reading a bit on it. This is the first time I'm using Vue, so I hope I didn't make a lot of vue-novice errors.

### Sycing
My original plan was to make a separate Node.js/MongoDB server that acts as a data store that syncs with all the app instances. But as I realized that I wouldn't get time for that, I considered using Firebase's [Realtime Database](https://firebase.google.com/products/realtime-database/) which has JSON syncing. But this also remains pending.

## Testing
_See **Pending** below_

## Pendng :(
### Coding
 - **Unit testing** - I really wanted to do this, but the 'within a week' time limit was a little tight. So I prioritized the functionality and am left without tests.
 - **Decouple API key** - The Google API key is currently hard-coded at once place in the index.html file. This need to be taken out of there and inserted back programmatically during the build step.

### Functional
 - **Place search** - Currently unable to input a location using the text field. Location can be input only through Geolocation at the moment.
 - **Set user name** - No facility to set the user's name.
 - **Sycing** - No syncing with other clients.