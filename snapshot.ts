import { createTestRenderer } from "@opentui/core/testing";
import { mount } from "./index";

const cols = Number(process.argv[2] ?? 100);
const rows = Number(process.argv[3] ?? 40);
const goShips = process.argv[4] === "ships";

const { renderer, captureCharFrame, renderOnce, mockInput } = await createTestRenderer({
  width: cols,
  height: rows,
});
mount(renderer as any);
await renderOnce();
if (goShips) {
  await mockInput.pressKey("p");
  await renderOnce();
}
console.log(captureCharFrame());
process.exit(0);
