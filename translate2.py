import re

with open('src/components/AntigravitySection.jsx', 'r') as f:
    content = f.read()

# Replace inner text using regex
content = re.sub(r'>\s*DRAW SOMETHING\s*<', '>{isAr ? "ارسم شيئاً" : "DRAW SOMETHING"}<', content)
content = re.sub(r'>\s*PUBLISH TO GALLERY ✦\s*<', '>{isAr ? "انشر في المعرض ✦" : "PUBLISH TO GALLERY ✦"}<', content)
content = re.sub(r'>\s*THE SKETCH GALLERY\s*<', '>{isAr ? "معرض الرسومات" : "THE SKETCH GALLERY"}<', content)
content = re.sub(r'>\s*MADE BY PEOPLE WHO STOPPED BY • LIKE YOUR FAVOURITES\s*<', '>{isAr ? "رُسمت بواسطة زوار الموقع • أعجب برسوماتك المفضلة" : "MADE BY PEOPLE WHO STOPPED BY • LIKE YOUR FAVOURITES"}<', content)
content = re.sub(r'>\s*LATEST\s*<', '>{isAr ? "الأحدث" : "LATEST"}<', content)
content = re.sub(r'>\s*POPULAR\s*<', '>{isAr ? "الأكثر إعجاباً" : "POPULAR"}<', content)
content = re.sub(r'>\s*MY SKETCHES\s*<', '>{isAr ? "رسوماتي" : "MY SKETCHES"}<', content)
content = re.sub(r'>\s*Publish Sketch\s*<', '>{isAr ? "نشر الرسمة" : "Publish Sketch"}<', content)
content = re.sub(r'>\s*Cancel\s*<', '>{isAr ? "إلغاء" : "Cancel"}<', content)
content = re.sub(r'>\s*Delete\s*<', '>{isAr ? "حذف" : "Delete"}<', content)
content = re.sub(r'>\s*Name\s*<', '>{isAr ? "الاسم" : "Name"}<', content)
content = re.sub(r'>\s*Email\s*<', '>{isAr ? "البريد الإلكتروني" : "Email"}<', content)
content = re.sub(r'>\s*Artwork Title\s*<', '>{isAr ? "عنوان الرسمة" : "Artwork Title"}<', content)
content = re.sub(r'>\s*Story / Caption \(Optional\)\s*<', '>{isAr ? "القصة / الوصف (اختياري)" : "Story / Caption (Optional)"}<', content)
content = re.sub(r'placeholder="e.g. A Quiet Morning"', 'placeholder={isAr ? "مثال: صباح هادئ" : "e.g. A Quiet Morning"}', content)
content = re.sub(r'placeholder="Tell the story behind your sketch..."', 'placeholder={isAr ? "أخبرنا بقصة رسمتك..." : "Tell the story behind your sketch..."}', content)
content = re.sub(r'>\s*Download\s*<', '>{isAr ? "تنزيل" : "Download"}<', content)
content = re.sub(r'>\s*Share\s*<', '>{isAr ? "مشاركة" : "Share"}<', content)

with open('src/components/AntigravitySection.jsx', 'w') as f:
    f.write(content)

