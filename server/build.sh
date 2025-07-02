#!/usr/bin/env bash
# exit on error
set -o errexit

# Install build-essential and python development headers
apt-get update && apt-get install -y build-essential python3-dev

# Set the path for the Rust compiler (still needed)
export PATH=/usr/local/cargo/bin:$PATH

# Install python dependencies
pip install -r requirements.txt