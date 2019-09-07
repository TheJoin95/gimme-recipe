# vue-typescript-boilerplate

*A Vue boilerplate written in TypeScript.*

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Localization workflow

- Install [POEditor](https://poeditor.com/)
- Add POEditor's `"extract tool"` (`C:\Program Files (x86)\Poedit\GettextTools\bin`) to Environment Variables
- check vue-gettext [documentation](https://github.com/Polyconseil/vue-gettext) for in-code usage, in general:
  - use the `v-translate` directive and add a `v-translate-comment` for translators
  - use `this.$gettext('Something')` when in Javascript and add a js comment above
- run `yarn locale:extract` when done coding
- open `\locale\template.pot` in POEditor
- translate and create a `.po` file
- save it in `\locale\translated`
- run `yarn locale:compile`
