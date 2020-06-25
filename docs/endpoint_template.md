# `/api/endpoint`

Short description.

## Request

**Type:** HTTP `REQUEST TYPE (e.g. GET/POST/PUT/DELETE)`

**Express Routing Notation:** `/api/endpoint/notation/if_relevant`

**Parameters:**

- **`parameter`:** Some parameter

## Response

**Fields**:

- **`success`:** Always `true` if there are no [errors](#errors)
- **`field`:** Some field

## Errors

The following errors can be returned:

- **`123 Some Error`:** Some Error

## Examples

Some example relevant to the endpoint if relevant

## Pseudocode

```js
let { param } = request;
respond({
  some: "pseudocode",
  that: "mirrors roughly",
  how: "the endpoint",
  works: "(simplified)"
})
```