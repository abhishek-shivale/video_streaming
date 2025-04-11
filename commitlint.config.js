module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^\[(\w+)\]: (.*)$/,
      headerCorrespondence: ['type', 'subject'],
    },
  },
  rules: {
    'type-enum': [
      2,
      'always',
      ['FEAT', 'FIX', 'CHORE', 'MERGED', 'NEW', 'BUILD', 'BUG'],
    ],
    'type-case': [2, 'always', 'upper-case'],
    'subject-max-length': [2, 'always', 100],
    'subject-case': [2, 'never', 'sentence-case'],
    'subject-empty': [2, 'never', /^.+$/],
    'type-empty': [2, 'never', /^.+$/],
  },
};