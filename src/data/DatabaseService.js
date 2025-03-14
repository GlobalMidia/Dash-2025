const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const REPO_OWNER = 'GlobalMidia';
const REPO_NAME = 'Dashinterna';
const DATA_BRANCH = 'data';

const headers = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
};

export async function fetchRemoteData(key) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/${key}.json?ref=${DATA_BRANCH}`,
      { headers }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const content = JSON.parse(atob(data.content));
    return content;
  } catch (error) {
    console.error('fetchRemoteData error:', error);
    return null;
  }
}

export async function updateRemoteData(key, data) {
  try {
    // Get current file (if exists) to get its SHA
    const currentFile = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/${key}.json?ref=${DATA_BRANCH}`,
      { headers }
    );
    
    const currentData = currentFile.ok ? await currentFile.json() : null;
    
    const content = btoa(JSON.stringify(data, null, 2));
    
    await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/data/${key}.json`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: `Update ${key} data`,
          content,
          sha: currentData?.sha,
          branch: DATA_BRANCH
        })
      }
    );
  } catch (error) {
    console.error('updateRemoteData error:', error);
  }
}
