export async function GET(req, { params }) {
  if (!params.filename) return new Response("Filename is required", { status: 400 });

  const response = await fetch(`http://localhost:5000/upload/${params.filename}`);
  if (!response.ok) return new Response("File not found", { status: 404 });

  return new Response(await response.blob(), {
    headers: { "Content-Type": response.headers.get("Content-Type") || "application/octet-stream" },
  });
}
