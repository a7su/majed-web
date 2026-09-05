import re

with open('src/components/AntigravitySection.jsx', 'r') as f:
    content = f.read()

replacements = {
    '>DRAW SOMETHING<': '>{isAr ? "ارسم شيئاً" : "DRAW SOMETHING"}<',
    'title="Pencil"': 'title={isAr ? "قلم رصاص" : "Pencil"}',
    'title="Pen"': 'title={isAr ? "قلم حبر" : "Pen"}',
    'title="Marker"': 'title={isAr ? "قلم عريض" : "Marker"}',
    'title="Eraser"': 'title={isAr ? "ممحاة" : "Eraser"}',
    'title="Pan"': 'title={isAr ? "تحريك" : "Pan"}',
    'title="Undo"': 'title={isAr ? "تراجع" : "Undo"}',
    'title="Redo"': 'title={isAr ? "إعادة" : "Redo"}',
    'title="Clear Canvas"': 'title={isAr ? "مسح اللوحة" : "Clear Canvas"}',
    '>Download<': '>{isAr ? "تنزيل" : "Download"}<',
    '>Share<': '>{isAr ? "مشاركة" : "Share"}<',
    '>PUBLISH TO GALLERY ✦<': '>{isAr ? "انشر في المعرض ✦" : "PUBLISH TO GALLERY ✦"}<',
    '>THE SKETCH GALLERY<': '>{isAr ? "معرض الرسومات" : "THE SKETCH GALLERY"}<',
    '>MADE BY PEOPLE WHO STOPPED BY • LIKE YOUR FAVOURITES<': '>{isAr ? "رُسمت بواسطة زوار الموقع • أعجب برسوماتك المفضلة" : "MADE BY PEOPLE WHO STOPPED BY • LIKE YOUR FAVOURITES"}<',
    '>LATEST<': '>{isAr ? "الأحدث" : "LATEST"}<',
    '>POPULAR<': '>{isAr ? "الأكثر إعجاباً" : "POPULAR"}<',
    '>MY SKETCHES<': '>{isAr ? "رسوماتي" : "MY SKETCHES"}<',
    'placeholder="e.g. Ahmed"': 'placeholder={isAr ? "مثال: أحمد" : "e.g. Ahmed"}',
    'placeholder="e.g. A Quiet Morning"': 'placeholder={isAr ? "مثال: صباح هادئ" : "e.g. A Quiet Morning"}',
    'placeholder="Tell the story behind your sketch..."': 'placeholder={isAr ? "أخبرنا بقصة رسمتك..." : "Tell the story behind your sketch..."}',
    '>Publish Sketch<': '>{isAr ? "نشر الرسمة" : "Publish Sketch"}<',
    '>Cancel<': '>{isAr ? "إلغاء" : "Cancel"}<',
    '>Delete<': '>{isAr ? "حذف" : "Delete"}<',
}

for k, v in replacements.items():
    content = content.replace(k, v)

# Update Name, Email, Artwork Title, Story / Caption (Optional)
content = content.replace('>Name<', '>{isAr ? "الاسم" : "Name"}<')
content = content.replace('>Email<', '>{isAr ? "البريد الإلكتروني" : "Email"}<')
content = content.replace('>Artwork Title<', '>{isAr ? "عنوان الرسمة" : "Artwork Title"}<')
content = content.replace('>Story / Caption (Optional)<', '>{isAr ? "القصة / الوصف (اختياري)" : "Story / Caption (Optional)"}<')

# Add font-family conditional to the top-level container
content = content.replace('className="sketch-container"', 'className="sketch-container" style={{ fontFamily: isAr ? "var(--font-arabic)" : "inherit", direction: isAr ? "rtl" : "ltr" }}')

# Write back
with open('src/components/AntigravitySection.jsx', 'w') as f:
    f.write(content)

