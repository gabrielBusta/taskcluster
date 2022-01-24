audience: deployers
level: patch
reference: issue 5079
---
The new `app.rate_limit_max_requests` configuration value allows setting the maximum number of web server requests per minute to help mitigate DoS attacks. Default is 200.
