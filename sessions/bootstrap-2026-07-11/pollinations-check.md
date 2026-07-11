# Pollinations Probe — 2026-07-11

Recorded by Coordinator during bootstrap to confirm ADR-0001 viability.

## Probe
- URL: `https://image.pollinations.ai/prompt/test?model=flux&width=64&height=64&seed=1&nologo=true&enhance=false&private=true`
- Tool: `curl -sS -o /tmp/probe.png`
- Result: HTTP 200, 2201 bytes, JPEG image data 64x64, baseline, components 3
- Latency: 2.71 s

## Verdict
Pollinations `flux` endpoint responsive without API key. ADR-0001 viable.

## Notes
- 2.7s for a 64x64 image. Larger images (768x768) will be slower — script sleeps 1.5s between requests as a courtesy.
- Default returned format is JPEG. Script handles JPEG magic bytes; PNG magic also handled.
