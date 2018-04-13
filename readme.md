## Directory structure

- lib/ is intended for code that can run as-is
- src/ is intended for code that needs to be manipulated before it can be used
- build/ is for any scripts or tooling needed to build your project
- dist/ is for compiled modules that can be used with other systems.
- bin/ is for any executable scripts, or compiled binaries used with, or built from your module.

## Todo
- Create job for DB cleaning - once a day, clean feeds older than N-days
- Extend jobs API with clean job status (?)
