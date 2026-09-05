import re

with open('src/components/AntigravitySection.jsx', 'r') as f:
    content = f.read()

new_api = """const api = {
  getCurrentUser: () => { try { return JSON.parse(localStorage.getItem('majed_user')); } catch { return null; } },
  login: async (username, email) => {
    await delay();
    const users = JSON.parse(localStorage.getItem('majed_users') || '[]');
    let user = users.find(u => u.email === email);
    if (!user) {
      user = { id: Date.now(), username, email };
      users.push(user);
      localStorage.setItem('majed_users', JSON.stringify(users));
    }
    localStorage.setItem('majed_user', JSON.stringify(user));
    return user;
  },
  logout: () => localStorage.removeItem('majed_user'),
  async getGallery() {
    if (supabase) {
      const { data, error } = await supabase.from('sketches').select('*').order('created_at', { ascending: false });
      if (!error && data) return data;
    }
    await delay();
    return JSON.parse(localStorage.getItem('majed_artworks') || '[]');
  },
  async getLikes() {
    if (supabase) return {};
    await delay();
    return JSON.parse(localStorage.getItem('majed_likes') || '{}');
  },
  async saveArtwork(title, caption, imageUrl) {
    const user = api.getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    const art = {
      id: Date.now().toString(),
      title,
      caption,
      image_url: imageUrl,
      author_name: user?.username || 'Anonymous',
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
};"""

content = re.sub(r'const api = \{.*?\n\};\n', new_api + "\n", content, flags=re.DOTALL)

with open('src/components/AntigravitySection.jsx', 'w') as f:
    f.write(content)

