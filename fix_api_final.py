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
  getArtworks: async (filter) => {
    let artworks = [];
    if (supabase) {
      const { data } = await supabase.from('sketches').select('*').order('createdAt', { ascending: false });
      if (data) artworks = data;
    } else {
      await delay();
      artworks = JSON.parse(localStorage.getItem('majed_artworks') || '[]');
    }
    
    let likes = [];
    if (!supabase) {
      likes = JSON.parse(localStorage.getItem('majed_likes') || '[]');
    } else {
      // In a real app we'd fetch likes from db, for now just use local for auth demo if needed
      likes = JSON.parse(localStorage.getItem('majed_likes') || '[]');
    }

    const user = api.getCurrentUser();
    let enriched = artworks.map(a => ({
      ...a,
      isLiked: user ? likes.some(l => l.artworkId === a.id && l.userId === user.id) : false,
      likesCount: likes.filter(l => l.artworkId === a.id).length
    }));

    if (filter === 'POPULAR') return enriched.sort((a, b) => b.likesCount - a.likesCount);
    if (filter === 'MY SKETCHES' && user) return enriched.filter(a => a.userId === user.id);
    return enriched;
  },
  saveArtwork: async (title, caption, imageUrl) => {
    const user = api.getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    const artwork = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      title: title || 'Untitled',
      caption: caption || '',
      imageUrl,
      createdAt: new Date().toISOString(),
    };
    if (supabase) {
      await supabase.from('sketches').insert([artwork]);
    } else {
      await delay();
      const artworks = JSON.parse(localStorage.getItem('majed_artworks') || '[]');
      artworks.unshift(artwork);
      localStorage.setItem('majed_artworks', JSON.stringify(artworks));
    }
    return artwork;
  },
  toggleLike: async (artworkId) => {
    const user = api.getCurrentUser();
    if (!user) return;
    
    // Simplistic like toggle for local fallback
    let likes = JSON.parse(localStorage.getItem('majed_likes') || '[]');
    const existingIndex = likes.findIndex(l => l.artworkId === artworkId && l.userId === user.id);
    if (existingIndex >= 0) {
      likes.splice(existingIndex, 1);
    } else {
      likes.push({ id: Date.now().toString(), artworkId, userId: user.id });
    }
    localStorage.setItem('majed_likes', JSON.stringify(likes));
    // If supabase was used, we'd update db here
  },
  deleteArtwork: async (artworkId) => {
    if (supabase) {
      await supabase.from('sketches').delete().eq('id', artworkId);
    } else {
      await delay();
      let artworks = JSON.parse(localStorage.getItem('majed_artworks') || '[]');
      artworks = artworks.filter(a => a.id !== artworkId);
      localStorage.setItem('majed_artworks', JSON.stringify(artworks));
    }
  }
};"""

content = re.sub(r'const api = \{.*?\n\};\n', new_api + "\n", content, flags=re.DOTALL)

with open('src/components/AntigravitySection.jsx', 'w') as f:
    f.write(content)

