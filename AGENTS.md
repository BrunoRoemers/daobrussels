# Agent notes

## Pods

Always create a pod file in `src/content/pods/<slug>.md` when referencing a new pod in an event's frontmatter. Missing pod files cause `getEntries` to return `undefined`, which crashes the event page at render time.

## Event dates

Crypto Wednesday is the first Wednesday of each month at Commons Hub Brussels, Rue de la Madeleine 51. Use this to date event placeholders without asking.
