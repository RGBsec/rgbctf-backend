# `/api/scoreboard`

Get top teams starting with an index.

## Request

**Type:** HTTP `GET`

**Express Routing Notation:** `/api/scoreboard/:index`

**Parameters:**

- **`index`:** Get top 100 teams beginning with this index ([see examples](#examples))

## Response

**Fields**:

- **`success`:** Always `true` if there are no [errors](#errors)
- **`totalTeams`:** The number of teams in this response (anywhere from 0 to 100)
- **`teams`:** An array of team objects in sorted order by place minus one. Teams contain the following fields:
  - **`name`:** The team name
  - **`points`:** The amount of points

## Errors

The following errors can be returned:

- **`404 Bad Index`:** The index provided is invalid (it is either a negative number, not provided, or not a number)
- **`500 Internal Error`:** A server error has occured

## Examples

For this example, assume that there are 50 teams, all with 0 points, each with a name of `debug[number]`, and there are 2 challenges, each valued at 50 points.

To get the top 100 teams, use the following request:

```http
GET /api/scoreboard/0
```

As there are only 50 teams, only 50 will be returned:

```json
{
    success: true,
    totalTeams: 50,
    maxPoints: 100,
    teams: [
        {
            name: "debug0",
            points: 0
        },
        {
            name: "debug1",
            points: 0
        },
        // ... //
        {
            name: "debug49",
            points: 0
        }
    ]
}
```

To get the top 100 teams starting with index 15 (i.e. teams from 16th place to 50th place), use the following request:

```http
GET /api/scoreboard/15
```

As there are only 35 teams left (`50 - 15`), only those teams will be returned:

```json
{
    success: true,
    totalTeams: 35,
    maxPoints: 100,
    teams: [
        {
            name: "debug15",
            points: 0
        },
        {
            name: "debug16",
            points: 0
        },
        // ... //
        {
            name: "debug49",
            points: 0
        }
    ]
}
```

## Pseudocode

```js
let { index } = request;
Teams.get({
    index,
    limit: 100,
}).ok(( teams ) => {
    respond({
        success: true,
        totalTeams: teams.length,
        maxPoints: Challenges.getMaximumPoints(),
        teams,
    })
}).err(handleError);
```