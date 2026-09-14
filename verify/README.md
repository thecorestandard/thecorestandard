# Certificate verifier

Public page that confirms a TCS Certified certificate by its ID. The lookup form lives at
`https://thecorestandard.co.uk/verify`. The subdomain `verify.thecorestandard.co.uk` is attached:
its root redirects to that form, and `verify.thecorestandard.co.uk/<ID>` opens a certificate directly.

Both of these resolve the same certificate:

- `https://thecorestandard.co.uk/verify/TCS-2026-A7K3PQ`
- `https://verify.thecorestandard.co.uk/TCS-2026-A7K3PQ`

Print the second form on certificates and badges.

## Adding a certificate

1. Choose an ID. Use `TCS-<year>-<six random characters>`, letters and digits only,
   for example `TCS-2026-A7K3PQ`. Random, so nobody can guess another candidate's ID
   by counting up. Upper case.
2. Create `verify/certs/<ID>.json` with this shape:

```json
{
  "id": "TCS-2026-A7K3PQ",
  "status": "issued",
  "name": "Full Name",
  "levelNumber": 2,
  "level": "EA to Senior Leadership",
  "band": "Strong",
  "issued": "2026-09-14",
  "reviewer": "Emily Partridge"
}
```

- `status`: `issued` (normal), `revoked` (shows a withdrawn notice; add an optional
  `"note"` field with the reason), or `specimen` (demo only).
- `levelNumber` is 1, 2 or 3. `level` is the name: Operational EA, EA to Senior
  Leadership, Executive Business Partner.
- `band`: Developing, Proficient, Strong, Distinctive or Exemplary.
- `issued`: ISO date, `YYYY-MM-DD`.

3. Commit and merge to `main`. Vercel publishes it within a minute.

To withdraw a certificate, change `status` to `revoked` rather than deleting the file,
so the ID reports as withdrawn instead of "not found".

Each certificate is its own file and Vercel does not list directories, so the only way
to reach a record is to know its ID. `TCS-SPECIMEN.json` is a demo record and is safe
to leave in place.

## Subdomain (already attached, 14 September 2026)

`verify.thecorestandard.co.uk` is a domain on the Vercel project, with a GoDaddy CNAME
`verify` pointing at Vercel. The redirect and rewrites in `vercel.json` route it to this page.
If the domain ever needs re-adding, do it under Vercel, Settings, Domains, and use the CNAME
value Vercel shows there.
