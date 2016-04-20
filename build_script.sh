#!/bin/bash

git checkout develop
git checkout feature/update-dependencies
git submodule init
git submodule update
cd lib/jsorolla
npm install
cd ../..
npm install
grunt 
