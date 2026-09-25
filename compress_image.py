with open('src/components/AntigravitySection.jsx', 'r') as f:
    content = f.read()

old_save = "const dataUrl = compCanvas.toDataURL('image/png');"
new_save = "const dataUrl = compCanvas.toDataURL('image/webp', 0.2);"

content = content.replace(old_save, new_save)

with open('src/components/AntigravitySection.jsx', 'w') as f:
    f.write(content)
