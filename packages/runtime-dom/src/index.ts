export * from "@vue/reactivity";

import { nodeOps } from "./nodeOps";
import patchProp from "./patchProp";

let rendererOptions = Object.assign(nodeOps, { patchProp });

function createRenderer(options) {}

// createRenderer(rendererOptions)
