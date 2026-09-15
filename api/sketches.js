export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GH_TOKEN;
  const REPO = 'a7-su/majed-web';

  if (req.method === 'GET') {
    try {
      const response = await fetch(`https://api.github.com/repos/${REPO}/issues?state=open&labels=sketch`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch from GitHub');
      const issues = await response.json();
      
      const artworks = issues.map(issue => {
        try {
          const data = JSON.parse(issue.body);
          return {
            id: issue.id,
            userId: data.userId,
            username: data.username,
            title: issue.title,
            caption: data.caption,
            imageUrl: data.imageUrl,
            createdAt: issue.created_at
          };
        } catch(e) { return null; }
      }).filter(Boolean);

      return res.status(200).json(artworks);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, username, userId, caption, imageUrl } = req.body;
      
      const body = JSON.stringify({
        userId,
        username,
        caption,
        imageUrl
      });

      const response = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          body: body,
          labels: ['sketch']
        })
      });

      if (!response.ok) throw new Error('Failed to create issue');
      const issue = await response.json();
      
      return res.status(201).json({ success: true, artwork: {
        id: issue.id, userId, username, title, caption, imageUrl, createdAt: issue.created_at
      } });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
