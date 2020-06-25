# `/api/team/create`

Create a team. **Requires authentication.**

## Request

**Type:** HTTP `POST`

**Requires authentication.**

**POST Data (JSON):**

- **`name`:** The team name to register

## Response

**Fields**:

- **`field`:** Some fiel

## Errors

The following errors can be returned:

- **`500 Internal Error`:** A server error has occured

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