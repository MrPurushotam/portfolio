const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const CONTRIBUTION_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetches the GitHub contribution calendar for the configured username.
 *
 * @returns {{ totalContributions: number, weeks: Array, username: string }} An object containing the user's total contributions count, an array of weeks with per-day contribution data, and the requested username.
 * @throws {Error} If `GITHUB_TOKEN` or `GITHUB_USERNAME` is not configured.
 * @throws {Error} If the HTTP response from the GitHub API is not OK (includes status and body text).
 * @throws {Error} If the GraphQL response contains `errors`.
 * @throws {Error} If the contribution calendar is not present in the response.
 */
export async function fetchGitHubContributions() {
    const token = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME;

    if (!token || !username) {
        throw new Error('GITHUB_TOKEN / USERNAME is not configured.');
    }

    const res = await fetch(GITHUB_GRAPHQL_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: CONTRIBUTION_QUERY,
            variables: { username },
        }),
        next: { revalidate: 3600, tags: ['githubHeatmapData'] },
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch from GitHub API: ${res.status} ${errorText}`);
    }

    const json = await res.json();
    if (json.errors) {
        throw new Error(`GitHub GraphQL query failed: ${JSON.stringify(json.errors)}`);
    }

    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) {
        throw new Error('GitHub contribution calendar not found.');
    }

    return {
        totalContributions: calendar.totalContributions,
        weeks: calendar.weeks,
        username,
    };
}