// 这个文件会帮我们打包，packages下模块，最后js文件

//   "dev": "node scripts/dev.js reactivity -f esm"
//                               打包的名字 -f 打包的格式

import minimist from "minimist";

import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import esbuild from "esbuild";
// 获取命令行参数 node 中命令行参数通过这个方式来获取
console.log(process.argv, process.argv.slice(2));
// 获取当前文件绝对路径，(fileURLToPath)是file开头的
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

console.log("__filename", __filename, "__dirname", __dirname);
// __filename D:\study\v3\scripts\dev.js __dirname D:\study\v3\scripts
/*
   process.argv： [
    'D:\\nodejs\\node.exe',
    'D:\\study\\v3\\scripts\\dev.js',
    'reactivity',
    '-f',
    'esm'
    ] 
    process.argv.slice(2)：[ 'reactivity', '-f', 'esm' ]
*/
const args = minimist(process.argv.slice(2));
console.log("args", args);
// args { _: [ 'reactivity' ], f: 'esm' }

const target = args._[0] || "reactivity"; // 打包到哪个项目
const format = args.f || "iife"; // 打包后模块规范

console.log(target, format);

// node中esm模块没有 __dirname
// 不解析的时候，__dirname is not defined in ES module scope
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);

// 获取package.json
const pkg = require(`../packages/${target}/package.json`);
// 入口文件
console.log(entry, pkg);

// 更具需要进行打包

esbuild
  .context({
    entryPoints: [entry],
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true, //
    sourcemap: true,
    platform: "browser",
    format: format, // 打包的格式 cjs  esm iife(iife必须要有名字)
    globalName: pkg.buildOptions?.name,
  })
  .then((ctx) => {
    console.log("开始打包");
    ctx.watch(); // 监控入口文件进行打包
  });
