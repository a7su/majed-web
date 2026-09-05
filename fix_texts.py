import re

with open('src/components/AntigravitySection.jsx', 'r') as f:
    content = f.read()

content = content.replace("Made by people who stopped by · Like your favourites", "{isAr ? 'رُسمت بواسطة زوار الموقع · أعجب برسوماتك المفضلة' : 'Made by people who stopped by · Like your favourites'}")
content = content.replace(">{f}<", ">{isAr && f === 'LATEST' ? 'الأحدث' : isAr && f === 'POPULAR' ? 'الأكثر إعجاباً' : isAr && f === 'MY SKETCHES' ? 'رسوماتي' : f}<")
content = content.replace("All rights reserved.", "{isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}")

with open('src/components/AntigravitySection.jsx', 'w') as f:
    f.write(content)
