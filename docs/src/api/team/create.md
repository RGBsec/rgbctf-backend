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

The following request will register a team `RGBsec` with invite code `example`:

```http
POST /api/team/create

Content-Type: application/json

{"name": "RGBsec", "inviteCode": "example"}
```

If it worked, the response would be something similar to the following:

```json
{
    "success": true,
    "msg": "team created"
}
```



## Pseudocode

```js
let { name, inviteCode } = request;
Team.create({
    name,
    inviteCode
}).ok(() => {
   respond({
       success: true,
       msg: "team created"
   }) 
});
```