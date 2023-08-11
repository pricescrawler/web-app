/* eslint-disable */

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'flowtype',
    'jest',
    'mocha',
    'new-with-error',
    'react-hooks',
    'react',
    'sort-class-members',
    'sort-destructure-keys',
    'sql-template',
    'switch-case'
  ],
  root: true,
  rules: {
    'accessor-pairs': 'error',
    'array-bracket-spacing': 'error',
    'arrow-spacing': 'error',
    'block-scoped-var': 'error',
    'block-spacing': 'off',
    'brace-style': [
      'error',
      '1tbs',
      {
        allowSingleLine: true
      }
    ],
    camelcase: 'off',
    'capitalized-comments': [
      'error',
      'always',
      {
        ignoreConsecutiveComments: true
      }
    ],
    'comma-dangle': 'error',
    'comma-spacing': 'error',
    'comma-style': 'error',
    complexity: 'off',
    'computed-property-spacing': 'error',
    'consistent-return': 'off',
    'consistent-this': ['error', 'self'],
    curly: 'error',
    'default-case': 'error',
    'dot-location': ['error', 'property'],
    'dot-notation': 'error',
    'eol-last': 'error',
    eqeqeq: ['error', 'smart'],
    'flowtype/boolean-style': 'error',
    'flowtype/define-flow-type': 'error',
    'flowtype/delimiter-dangle': ['error', 'never', 'always'],
    'flowtype/generic-spacing': 'error',
    'flowtype/no-dupe-keys': 'error',
    'flowtype/require-valid-file-annotation': ['error', 'always'],
    'flowtype/semi': 'error',
    'flowtype/sort-keys': 'error',
    'flowtype/space-after-type-colon': 'error',
    'flowtype/space-before-generic-bracket': 'error',
    'flowtype/union-intersection-spacing': 'error',
    'flowtype/use-flow-type': 'error',
    'func-names': 'off',
    'func-style': [
      'error',
      'declaration',
      {
        allowArrowFunctions: true
      }
    ],
    'generator-star-spacing': ['error', 'before'],
    'id-length': [
      'error',
      {
        exceptions: ['_', 'e', 'i']
      }
    ],
    'id-match': [
      'error',
      '^_$|^[a-zA-Z][a-zA-Z0-9]*$|^[A-Z][_A-Z0-9]+[A-Z0-9]$',
      {
        onlyDeclarations: true,
        properties: true
      }
    ],
    indent: [
      'error',
      2,
      {
        SwitchCase: 1
      }
    ],
    'jest/no-disabled-tests': 'error',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jsx-quotes': ['error', 'prefer-single'],
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'linebreak-style': 'error',
    'lines-around-comment': 'off',
    'max-depth': 'error',
    'max-nested-callbacks': 'off',
    'max-params': ['error', 4],
    'mocha/no-exclusive-tests': 'error',
    'new-cap': 'error',
    'new-parens': 'error',
    'new-with-error/new-with-error': 'error',
    'newline-before-return': 'error',
    'no-alert': 'error',
    'no-array-constructor': 'error',
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-catch-shadow': 'off',
    'no-cond-assign': ['error', 'always'],
    'no-confusing-arrow': ['error', { allowParens: true }],
    'no-console': 'error',
    'no-div-regex': 'error',
    'no-duplicate-imports': 'error',
    'no-else-return': 'error',
    'no-empty': 'error',
    'no-empty-label': 'off',
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-extend-native': 'error',
    'no-extra-bind': 'error',
    'no-floating-decimal': 'error',
    'no-implied-eval': 'error',
    'no-inline-comments': 'error',
    'no-iterator': 'error',
    'no-label-var': 'off',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'error',
    'no-loop-func': 'error',
    'no-mixed-requires': 'error',
    'no-multi-spaces': 'error',
    'no-multi-str': 'error',
    'no-multiple-empty-lines': [
      'error',
      {
        max: 1
      }
    ],
    'no-native-reassign': 'error',
    'no-nested-ternary': 'error',
    'no-new': 'error',
    'no-new-func': 'error',
    'no-new-object': 'error',
    'no-new-require': 'error',
    'no-new-wrappers': 'error',
    'no-octal-escape': 'error',
    'no-path-concat': 'error',
    'no-process-env': 'error',
    'no-process-exit': 'error',
    'no-proto': 'error',
    'no-restricted-modules': 'error',
    'no-return-assign': 'error',
    'no-script-url': 'error',
    'no-self-compare': 'error',
    'no-sequences': 'error',
    'no-shadow': 'off',
    'no-shadow-restricted-names': 'error',
    'no-spaced-func': 'error',
    'no-sync': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-undefined': 'off',
    'no-underscore-dangle': 'error',
    'no-unexpected-multiline': 'error',
    'no-unneeded-ternary': 'error',
    'no-use-before-define': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-var': 'error',
    'no-void': 'error',
    'no-warning-comments': 'off',
    'no-with': 'error',
    'object-curly-spacing': ['error', 'always'],
    'object-shorthand': 'error',
    'one-var': ['error', 'never'],
    'one-var-declaration-per-line': ['error', 'always'],
    'operator-assignment': 'error',
    'operator-linebreak': ['error', 'none'],
    'padded-blocks': ['error', { blocks: 'never', classes: 'always', switches: 'never' }],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', next: '*', prev: ['const', 'let', 'var'] },
      {
        blankLine: 'any',
        next: ['const', 'let', 'var'],
        prev: ['const', 'let', 'var']
      }
    ],
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'quote-props': ['error', 'as-needed'],
    quotes: [
      'error',
      'single',
      {
        allowTemplateLiterals: true
      }
    ],
    radix: 'error',
    'react/display-name': 'error',
    'react/jsx-boolean-value': 'error',
    'react/jsx-closing-bracket-location': 'error',
    'react/jsx-curly-brace-presence': [
      'error',
      {
        children: 'ignore',
        props: 'always'
      }
    ],
    'react/jsx-curly-spacing': 'error',
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-key': 'error',
    'react/jsx-max-props-per-line': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-literals': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-sort-props': 'error',
    'react/jsx-tag-spacing': [
      'error',
      {
        afterOpening: 'never',
        beforeClosing: 'never',
        beforeSelfClosing: 'always',
        closingSlash: 'never'
      }
    ],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-wrap-multilines': 'error',
    'react/no-danger': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-string-refs': 'error',
    'react/no-unknown-property': 'error',
    'react/prefer-stateless-function': 'error',
    'react/react-in-jsx-scope': 'error',
    'react/self-closing-comp': 'error',
    'react/prop-types': 'off',
    'react/sort-comp': [
      'error',
      {
        groups: {
          initialization: [
            'displayName',
            'propTypes',
            'contextTypes',
            'childContextTypes',
            'mixins',
            'statics',
            'defaultProps',
            'constructor',
            'getDefaultProps',
            'state',
            'getInitialState',
            'getChildContext'
          ],
          lifecycle: [
            'componentWillMount',
            'UNSAFE_componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'UNSAFE_componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'UNSAFE_componentWillUpdate',
            'getSnapshotBeforeUpdate',
            'componentDidUpdate',
            'componentDidCatch',
            'componentWillUnmount'
          ]
        },
        order: [
          'static-methods',
          'initialization',
          'everything-else',
          '/^handle.+$/',
          'lifecycle',
          '/^render.+$/',
          'render'
        ]
      }
    ],
    'react/sort-prop-types': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'require-await': 'error',
    'require-yield': 'error',
    semi: 'error',
    'semi-spacing': 'error',
    'sort-destructure-keys/sort-destructure-keys': [
      'error',
      {
        caseSensitive: true
      }
    ],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
      }
    ],
    'sort-keys': [
      'error',
      'asc',
      {
        natural: true
      }
    ],
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', { anonymous: 'never', named: 'never' }],
    'space-in-parens': 'error',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'spaced-comment': 'error',
    'sql-template/no-unsafe-query': 'error',
    strict: 'off',
    'switch-case/newline-between-switch-case': ['error', 'always', { fallthrough: 'never' }],
    'template-curly-spacing': 'error',
    'valid-jsdoc': 'error',
    'vars-on-top': 'error',
    'wrap-iife': ['error', 'inside'],
    yoda: 'error',
    'id-length': ['error', { exceptions: ['t'] }],
    'lines-around-comment': ['error', { afterBlockComment: true, beforeBlockComment: false }],
    'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
    'react/prop-types': ['error', { ignore: ['form', 'i18n', 'onSubmit'] }],
    'react/jsx-no-literals': ['off', { noStrings: false }],
    'no-console': ['error'],
    'import/no-unresolved': ['off', { caseSensitive: false }],
    'react/jsx-filename-extension': ['off']
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true
    }
  }
};
