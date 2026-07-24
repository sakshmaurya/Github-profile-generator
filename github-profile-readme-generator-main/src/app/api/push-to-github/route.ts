import { NextRequest, NextResponse } from 'next/server';

interface PushToGitHubBody {
  token: string;
  owner: string;
  repo: string;
  content: string;
  filename?: string;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PushToGitHubBody = await request.json();
    const { token, owner, repo, content, filename = 'README.md', message = 'Update README.md' } = body;

    if (!token || !owner || !repo || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: token, owner, repo, content' },
        { status: 400 }
      );
    }

    let sha: string | undefined;
    try {
      const checkResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filename}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (checkResponse.ok) {
        const fileData = await checkResponse.json();
        sha = fileData.sha;
      }
    } catch {
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filename}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          content: Buffer.from(content).toString('base64'),
          sha,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to push to GitHub' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      message: `Successfully pushed to ${owner}/${repo}`,
      url: data.content?.html_url,
    });
  } catch (error) {
    console.error('Error pushing to GitHub:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
