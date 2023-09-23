#!/bin/sh

mkdir -p ./build/cjs
echo "{ \"type\": \"commonjs\" }" >| ./build/cjs/package.json
npx ttsc -p ./tsconfig.build.cjs.json $1
