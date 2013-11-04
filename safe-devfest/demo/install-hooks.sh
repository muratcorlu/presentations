#!/bin/sh

ln -sf ../../pre-commit.sh .git/hooks/pre-commit
ln -sf ../../post-merge.sh .git/hooks/post-merge

echo Hooks installed.
