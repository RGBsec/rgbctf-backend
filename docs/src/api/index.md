# API

This section details rgbCTF's API.
Each subchapter will detail a specific endpoint.

## Errors

All errors will return an object with the following fields:

- **`success`:** Always `false` if there was an error
- **`err`:** A short error message describing the issue

## Common Errors

These following errors are common to almost all possible requests:

- **`400 Request Aborted`:** The request was aborted by the client before the body has been fully received.
- **`413 Request Entity Too Large`:** The request body's size is larger than 100 kilobytes.
- **`400 Request Size did not Match Content Length`:** The `Content-Length` header did not match the size of the request.
- **`413 Too Many Parameters`:** More than 1000 urlencoded parameters were provided.
- **`415 Unsupported Charset "FOO"`:** The charset in the `Content-Type` header is not supported/
- **`415 Unsupported Content Encoding "FOO"`:** The `Content-Encoding` header contained an unsupporting encoding.
- **`500 Internal Error`:** A server error has occurred.

### Error Notation

Errors are notated with the HTTP status code first, then a string that mirrors the `err` field of the response, for example `400 Invalid Payload` means the response will have a status code of 400, and an `err` field similar to `"Invalid Payload"`