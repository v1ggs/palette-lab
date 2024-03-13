module.exports = {
   git: {
      // https://ec.europa.eu/component-library/v1.15.0/eu/docs/conventions/git/#type
      // chore: Changes to the build process or auxiliary tools and
      // libraries such as documentation generation.
      // Compliant with @release-it/conventional-changelog
      commitMessage: 'chore: release v${version}',

      // By default, release-it does not check the number of commits
      // upfront to prevent "empty" releases. Configure
      // "git.requireCommits": true to exit the release-it process
      // if there are no commits since the latest tag.

      requireCommits: true,
   },

   github: {
      // https://github.com/release-it/release-it/blob/HEAD/docs/github-releases.md
      // https://github.com/settings/tokens
      // To automate the release (using the GitHub REST API), the
      // following needs to be configured:
      // Configure github.release: true
      // Obtain a personal access token(release- it only needs "repo"
      // access; no "admin" or other scopes).
      // Make sure the token is available as an environment variable.
      release: true,
   },

   plugins: {
      // https://github.com/release-it/conventional-changelog
      // Use this plugin to get the recommended bump based on
      // the commit messages.
      // Additionally, it can generate a conventional changelog,
      // and optionally update the CHANGELOG.md file in the process.
      '@release-it/conventional-changelog': {
         infile: 'CHANGELOG.md',
         header: '# Changelog',
         preset: {
            name: 'conventionalcommits',

            // https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md#types
            // https://ec.europa.eu/component-library/v1.15.0/eu/docs/conventions/git/#type
            types: [
               {
                  // A new feature
                  type: 'feat',
                  section: 'Features',
                  hidden: false,
               },
               {
                  // A bug fix
                  type: 'fix',
                  section: 'Bug Fixes',
                  hidden: false,
               },
               {
                  // Documentation only changes
                  type: 'docs',
                  section: 'Docs',
                  hidden: false,
               },
               {
                  // Changes that do not affect the meaning of the
                  // code (white-space, formatting, missing semi-colons, etc)
                  type: 'style',
                  section: 'Code Style',
                  hidden: false,
               },
               {
                  // A code change that neither fixes a bug nor adds a feature
                  type: 'refactor',
                  section: 'Refactor',
                  hidden: false,
               },
               {
                  // A code change that improves performance
                  type: 'perf',
                  section: 'Performance',
                  hidden: false,
               },
               {
                  // Adding missing tests
                  type: 'test',
                  section: 'Tests',
                  hidden: false,
               },
               {
                  // Changes to the build process or auxiliary tools and
                  // libraries such as documentation generation
                  type: 'chore',
                  section: 'Chore',
                  hidden: false,
               },
            ],
         },
      },
   },
};
