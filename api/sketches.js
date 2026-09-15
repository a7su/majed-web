export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GH_TOKEN;
  const REPO = 'a7-su/majed-web'; // The repository to store the sketches in

  if (req.method === 'GET') {
    try {
      // 1. Get list of files in the sketches directory
      const response = await fetch(`https://api.github.com/repos/${REPO}/contents/sketches`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (response.status === 404) {
        return res.status(200).json([]); // Directory doesn't exist yet
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch from GitHub');
      }
      
      const files = await response.json();
      
      // 2. Fetch the content of each file in parallel
      const filePromises = files
        .filter(f => f.name.endsWith('.json'))
        .sort((a, b) => b.name.localeCompare(a.name)) // Sort descending (newest first)
        .slice(0, 50) // Limit to latest 50 sketches
        .map(async (file) => {
          try {
            const contentRes = await fetch(file.download_url);
            const content = await contentRes.json();
            return content;
          } catch (e) { return null; }
        });
        
      const artworks = (await Promise.all(filePromises)).filter(Boolean);
      
      return res.status(200).json(artworks);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, username, userId, caption, imageUrl } = req.body;
      
      const id = Date.now().toString();
      const artwork = {
        id,
        userId,
        username,
        title,
        caption,
        imageUrl,
        createdAt: new Date().toISOString()
      };
      
      const content = Buffer.from(JSON.stringify(artwork)).toString('base64');
      const filename = `sketches/sketch_${id}.json`;

      const response = await fetch(`https://api.github.com/repos/${REPO}/contents/${filename}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Add sketch: ${title} by ${username}`,
          content: content
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create file');
      }

      return res.status(201).json({ success: true, artwork });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
