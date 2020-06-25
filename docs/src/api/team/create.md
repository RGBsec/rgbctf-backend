# `/api/team/create`

Create a team. **Requires authentication.**

## Request

**Type:** HTTP `POST`

**Requires authentication.**

**POST Data (JSON):**

- **`name`:** The team name to register
- **`inviteCode`:** The invite code to use

## Response

**Fields**:

- **`success`:** Always `true` if there are no [errors](#errors)
- **`msg`:** Always `team created` if there are no [errors](#errors)

## Errors

The following errors can be returned:

- **`400 Invalid Payload`:** The request is invalid.
- **`403 Unauthorized`:** Not logged in.
- **`422 Team Exists`:** A team with the name already exists.

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