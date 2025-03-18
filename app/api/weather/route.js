export async function GET() {
  try {
    const githubUrl =
      "https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-meteo/master/data/latest.json";
    const apiUrl =
      "https://api.github.com/repos/MrSunshyne/mauritius-dataset-meteo/commits?path=data/latest.json";

    const response = await fetch(githubUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();

    const commitsResponse = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    let lastUpdated = "Unknown";
    if (commitsResponse.ok) {
      const commits = await commitsResponse.json();
      if (commits.length > 0) {
        lastUpdated = new Date(
          commits[0].commit.committer.date
        ).toLocaleString();
      }
    }

    return Response.json({
      lastUpdated,
      data,
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to load weather data" },
      { status: 500 }
    );
  }
}
