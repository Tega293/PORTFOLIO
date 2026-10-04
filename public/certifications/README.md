# Certification documents

Add certificate PDFs or images to this folder. Then add an item to the `certificationDocuments` array near the top of `src/App.js`:

```js
{
  title: 'Certificate title',
  issuer: 'Issuing organization',
  year: '2026',
  file: 'certificate-file.pdf',
}
```

Use the exact filename, including its extension. The portfolio will create a link to `/certifications/<filename>` in its Certifications section.
