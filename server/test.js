// Ultra minimal test server
export default function handler(req, res) {
  res.status(200).json({
    message: "Ultra minimal test working",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
