import re

with open('src/components/AntigravitySection.jsx', 'r') as f:
    content = f.read()

replacements = {
    "معرض الرسومات": "معرض السكيتشات",
    "رسوماتي": "سكيتشاتي",
    "عنوان الرسمة": "عنوان السكيتش",
    "أخبرنا بقصة رسمتك...": "أخبرنا بقصة السكيتش...",
    "نشر الرسمة": "نشر السكيتش",
    "أعجب برسوماتك المفضلة": "أعجب بالسكيتشات المفضلة"
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open('src/components/AntigravitySection.jsx', 'w') as f:
    f.write(content)
