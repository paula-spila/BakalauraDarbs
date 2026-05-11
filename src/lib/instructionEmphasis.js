/**
 * @param {string} instruction
 * @returns {{ type: "text" | "em", value: string }[]}
 */
export function parseInstructionEmphasis(instruction) {
  if (!instruction) return [{ type: "text", value: "" }];

  const parts = [];
  let last = 0;
  let m;
  const re = /(?:\u201c|\u201e)([^\u201d]+)\u201d/g;

  while ((m = re.exec(instruction)) !== null) {
    if (m.index > last) {
      parts.push({ type: "text", value: instruction.slice(last, m.index) });
    }

    parts.push({ type: "em", value: m[1] });
    last = m.index + m[0].length;
  }

  if (last < instruction.length) {
    parts.push({ type: "text", value: instruction.slice(last) });
  }

  return parts.length ? parts : [{ type: "text", value: instruction }];
}
