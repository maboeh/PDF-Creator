const sanitizeHtml = require('sanitize-html');

const dirty = `
  <div class="content" style="color: red;">
    <h1>Hello World</h1>
    <script>alert('XSS')</script>
    <p onclick="stealCookies()">Click me</p>
    <img src="data:image/png;base64,..." alt="image" />
    <a href="javascript:void(0)">Bad Link</a>
    <a href="https://example.com">Good Link</a>
  </div>
`;

const config = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'h1', 'h2', 'span', 'div' ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    '*': ['style', 'class'],
    'img': ['src', 'alt', 'width', 'height']
  },
  allowedSchemes: ['http', 'https', 'data']
};

const clean = sanitizeHtml(dirty, config);

console.log("Original:", dirty);
console.log("Cleaned:", clean);

if (clean.includes('<script>')) {
  console.error("FAIL: script tag not removed");
  process.exit(1);
}
if (clean.includes('onclick')) {
  console.error("FAIL: onclick attribute not removed");
  process.exit(1);
}
if (clean.includes('javascript:')) {
  console.error("FAIL: javascript: link not removed");
  process.exit(1);
}
if (!clean.includes('class="content"')) {
  console.error("FAIL: class attribute removed");
  process.exit(1);
}
if (!clean.includes('style="color: red;"')) { // sanitize-html might parse/reformat styles, check carefully
  // It usually preserves exact string if simple, but let's see.
  // Actually sanitize-html does not parse style content by default, just allows the attribute.
  if (!clean.includes('style="color: red;"') && !clean.includes('style="color:red"')) {
       console.error("FAIL: style attribute removed or mangled");
       process.exit(1);
  }
}
if (!clean.includes('src="data:image/png;base64,..."')) {
  console.error("FAIL: data URI image removed");
  process.exit(1);
}

console.log("SUCCESS: Sanitization works as expected.");
