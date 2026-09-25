export default async function handler(req, res) {
  const GITHUB_TOKEN = process.env.GH_TOKEN;
  const REPO = 'a7-su/majed-web';

  if (req.method === 'POST') {
    try {
      const { issueNumber } = req.body;
      if (!issueNumber) return res.status(400).json({ error: 'issueNumber required' });

      // Add +1 reaction to the issue
      const response = await fetch(`https://api.github.com/repos/${REPO}/issues/${issueNumber}/reactions`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.squirrel-girl-preview+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: '+1' })
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error('Failed to like issue: ' + txt);
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
