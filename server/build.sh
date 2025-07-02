#!/usr/bin/env bash
# exit on error
set -o errexit

export PATH=/usr/local/cargo/bin:$PATH

pip install -r requirements.txt