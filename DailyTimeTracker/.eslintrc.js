module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['security'],
  rules: {
    'security/detect-object-injection': 'warn',
    'security/detect-unsafe-regex': 'error',
  }
};