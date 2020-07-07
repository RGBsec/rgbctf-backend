# How to test rgbctf-backend

## Step 0 - (Re)generate test data

If you would like to, regenerate the test data by running the following commands from the repository root:
```shell
$ cd tests/tools
$ python3 generate_test_data.py
Generating users and teams, this may take a while...
User/Team #99
Generating challenges, this may take a while...
Chall: #99
Done!
$
```
Testing data should now be present in `tests/data`.

Please note that this requires Python 3, `bson` (sometimes bundled with `pymongo` in package managers), `pandas`, and `bcrypt`.

## Step 1 - Create testing database

Create a database in the MongoDB instance configured in your `.env` called `rgbCTF-testdata`.

## Step 2 - Create testing collections and import test data

Create three collections in this database:
- Name: `challenges` - Import data from `tests/data/challenges.json`
- Name: `teams` - Import data from `tests/data/teams.json`
- Name: `users` - Import data from `tests/data/users.json`

## Step 3 - Run tests

Be sure you are in the repository root, then run:
```shell
$ yarn install
$ yarn test
```

If you would like to rerun a specific test, run:
```shell
$ yarn test path/to/test
```