#!/usr/bin/env node

var SuckThrough = require("./");

var st = new SuckThrough({url: "http://127.0.0.1:4649/somebucket/somefile"});

process.stdin.pipe(st).pipe(process.stdout);
