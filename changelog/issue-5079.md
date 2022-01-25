audience: deployers
level: patch
reference: issue 5079
---
The new `app.authRateLimitMaxRequests` configuration value allows setting the maximum number of web server requests per minute to help mitigate DoS attacks. Default is 5. Set to 0 to disable rate limiting.
