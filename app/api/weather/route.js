export async function GET() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/MrSunshyne/mauritius-dataset-meteo/master/data/latest.json"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    // Add the current timestamp to the response data
    const lastUpdated = new Date().toLocaleString(); // This is the timestamp

    return Response.json({
      lastUpdated, // Include last updated timestamp
      data, // Weather data
    });
  } catch (error) {
    return Response.json(
      { error: "Failed to load weather data" },
      { status: 500 }
    );
  }
}
