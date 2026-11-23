#!/usr/bin/env bash
# The kit must not know its consumers (AGENTS.md, "The kit knows nothing about its
# consumers"). Prints every offending line and exits 1 if there is any.
set -u
cd "$(dirname "$0")/.."

out=$(
  {
    grep -rE "from '@/(src|components|assets|styles)" --include='*.ts*' --include='*.scss' . --exclude-dir=node_modules --exclude-dir=storybook-static
    grep -rE "from '(@mui|@emotion|next)/" --include='*.ts*' . --exclude-dir=node_modules --exclude-dir=storybook-static
    grep -rE "@(use|import) '@/styles" --include='*.scss' . --exclude-dir=node_modules --exclude-dir=storybook-static
    grep -rnE 'className=\{?"[^"]+"' --include='*.tsx' . --exclude-dir=node_modules --exclude-dir=storybook-static | grep -v '.stories.'
  } || true
)

if [ -n "$out" ]; then
  echo "$out"
  exit 1
fi
