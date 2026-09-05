import re

with open('src/components/AntigravitySection.jsx', 'r') as f:
    content = f.read()

# Add supabase import
content = content.replace("import { useLanguage } from '../contexts/LanguageContext';", "import { useLanguage } from '../contexts/LanguageContext';\nimport { supabase } from '../lib/supabase';")

new_api = """
const api = {
  async getGallery() {
    if (supabase) {
      const { data, error } = await supabase.from('sketches').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    await delay();
    return JSON.parse(localStorage.getItem('majed_artworks') || '[]');
  },
  async getLikes() {
    if (supabase) return {}; // Handled by db
    await delay();
    return JSON.parse(localStorage.getItem('majed_likes') || '{}');
  },
  async saveArtwork(title, caption, imageUrl) {
    const user = JSON.parse(localStorage.getItem('majed_user'));
    const art = {
      id: Date.now().toString(),
      title,
      caption,
      image_url: imageUrl,
      author_name: user?.name || 'Anonymous',
      author_email: user?.email || '',
      created_at: new Date().toISOString(),
      likes_count: 0
    };
    if (supabase) {
      await supabase.from('sketches').insert([art]);
    } else {
      const arts = JSON.parse(localStorage.getItem('majed_artworks') || '[]');
      arts.unshift(art);
      localStorage.setItem('majed_artworks', JSON.stringify(arts));
    }
    return art;
  },
  async toggleLike(artId) {
    if (supabase) {
      // Very basic toggle without user-specific tracking for demo
      const { data } = await supabase.from('sketches').select('likes_count').eq('id', artId).single();
      if (data) {
        await supabase.from('sketches').update({ likes_count: (data.likes_count || 0) + 1 }).eq('id', artId);
      }
    } else {
      const likes = JSON.parse(localStorage.getItem('majed_likes') || '{}');
      likes[artId] = !likes[artId];
      localStorage.setItem('majed_likes', JSON.stringify(likes));
    }
  },
  async deleteArtwork(artId) {
    if (supabase) {
      await supabase.from('sketches').delete().eq('id', artId);
    } else {
      let arts = JSON.parse(localStorage.getItem('majed_artworks') || '[]');
      arts = arts.filter(a => a.id !== artId);
      localStorage.setItem('majed_artworks', JSON.stringify(arts));
    }
  }
};
"""

content = re.sub(r'const api = \{.*?\n\};\n', new_api, content, flags=re.DOTALL)

with open('src/components/AntigravitySection.jsx', 'w') as f:
    f.write(content)

