import re

with open('src/components/AntigravitySection.jsx', 'r') as f:
    content = f.read()

# Add renderPending ref
content = content.replace("const canvasRef    = useRef(null);", "const canvasRef    = useRef(null);\n  const renderPending = useRef(false);")

# Update handlePointerMove to throttle composite
original_draw = """      sCtx.moveTo(from.x, from.y);
      sCtx.lineTo(to.x, to.y);
      sCtx.stroke();

      compositeStrokeToMain(tool);
      lastPos.current = to;"""

new_draw = """      sCtx.moveTo(from.x, from.y);
      sCtx.lineTo(to.x, to.y);
      sCtx.stroke();

      if (!renderPending.current) {
        renderPending.current = true;
        requestAnimationFrame(() => {
          compositeStrokeToMain(tool);
          renderPending.current = false;
        });
      }
      lastPos.current = to;"""

content = content.replace(original_draw, new_draw)

# Ensure compositeStrokeToMain handles correct tool (ref value doesn't change here so it's safe)

with open('src/components/AntigravitySection.jsx', 'w') as f:
    f.write(content)

