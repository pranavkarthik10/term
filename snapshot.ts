import { createTestRenderer } from "@opentui/core/testing";
import { mount } from "./index";

const cols = Number(process.argv[2] ?? 110);
const rows = Number(process.argv[3] ?? 34);

const { renderer, captureCharFrame, renderOnce } = await createTestRenderer({ width: cols, height: rows });
mount(renderer as any);
await renderOnce();
console.log(captureCharFrame());
process.exit(0);
