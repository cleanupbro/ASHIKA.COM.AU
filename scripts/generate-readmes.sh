#!/bin/bash

# Find all directories, excluding hidden ones and node_modules
find . -type d -not -path '*/.*' -not -path './node_modules*' | while read dir; do
  # Skip if README.md already exists
  if [ ! -f "$dir/README.md" ]; then
    echo "Creating README.md for $dir"
    dirname=$(basename "$dir")
    
    # Generate content based on directory name
    cat << EOM > "$dir/README.md"
# $dirname

This directory contains files related to **$dirname**.

## Purpose
Part of the ASHIKA project structure.

## Contents
Auto-generated documentation for this module.
EOM
  fi
done
