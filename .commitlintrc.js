module.exports = {
   // https://github.com/conventional-changelog/commitlint#shared-configuration
   extends: ['@commitlint/config-conventional'],
   ignores: [message => message.includes('Initial commit')],
};
