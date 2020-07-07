# Generates test data as some JSON files

"""
Files:

../data/challenges.json
Name/Description : `Debug Challenge #[number]`
Hints            : [`Flag is [flag]`]
Case Sensitive   : False
Points           : 420
Flag             : rgbCTF{debug[number]}
Category         : `Debug`

../data/users.json
Username : `debug[number]`
Email    : `debug[number]@example.com`
Password : `rgbCTF-debug`

User `debug0` is set as an admin

../data/teams.json
Team Name   : `debug[number]`
Email       : `debug[number]@example.com`
Invite Code : `rgbCTF-debug`

"""
from datetime import datetime
# Often bundled with pymongo
from bson.objectid import ObjectId
import pandas as pd
import bcrypt
import os, binascii, random

def random_hex(byte_len):
  return binascii.b2a_hex(os.urandom(byte_len)).decode('utf-8')

base_counter = random.randrange(0, 256**3)
process_unique = random_hex(5)

def inc_counter(c):
  return (c + 2) % ((256**3) - 1)

# Generate a valid ObjectID without having to enter
# it into a database
# (Mostly) follows the spec
# https://github.com/mongodb/specifications/blob/master/source/objectid.rst
def generate_objectid():
  global base_counter
  global process_unique
  base_id = str(ObjectId.from_datetime(datetime.now()))
  timestamp = base_id[0:8]
  base_counter = inc_counter(base_counter)
  base_counter_hex = '%06x' % base_counter
  return '%s%s%s' % (timestamp, process_unique, base_counter_hex)

def gen_users_teams():
  users = pd.DataFrame(columns=['_id', 'name', 'hash', 'teamId', 'email', 'confirmedEmail', 'admin'])
  teams = pd.DataFrame(columns=['_id', 'name', 'inviteCode', 'members', 'points', 'solves'])
  for i in range(0, 100):
    salt = bcrypt.gensalt(rounds=10)
    teamid = generate_objectid()
    userid = generate_objectid()
    team = {
      '_id': { '$oid': teamid },
      'name': 'debug%d' % i,
      'inviteCode': 'rgbCTF-debug',
      'members': [userid],
      'points': 0,
      'solves': []
    }
    user = {
      '_id': { '$oid': userid },
      'name': 'debug%d' % i,
      'teamId': teamid,
      'email': 'debug%d@example.com' % i,
      'confirmedEmail': True,
      'admin': i == 0,
      'hash': bcrypt.hashpw(b'rgbCTF-debug', salt)
    }
    users = users.append(user, ignore_index=True)
    teams = teams.append(team, ignore_index=True)
    print("\rUser/Team #%02d" % i, end='')
  print()
  return (users, teams)

def gen_challs():
  challs = pd.DataFrame(columns=['_id', 'name', 'description', 'hints', 'flagCaseSensitive', 'points', 'flag', 'category'])
  for i in range(0, 100):
    chall = {
      '_id': { '$oid': generate_objectid() },
      'name': 'Debug Challenge #%d' % i,
      'description': 'Debug Challenge #%d' % i,
      'category': 'Debug',
      'hints': ['Flag is rgbCTF{debug%d}' % i],
      'flagCaseSensitive': False,
      'flag': 'rgbCTF{debug%d}' % i,
      'points': 420,
    }
    challs = challs.append(chall, ignore_index=True)
    print("\rChall: #%02d" % i, end='')
  print()
  return challs

if __name__ == "__main__":
  print("Generating users and teams, this may take a while...")
  users, teams = gen_users_teams()

  print("Generating challenges, this may take a while...")
  challs = gen_challs()

  with open('../data/users.json', 'w') as f:
    f.write(users.to_json(orient='records'))
  
  with open('../data/teams.json', 'w') as f:
    f.write(teams.to_json(orient='records'))

  with open('../data/challenges.json', 'w') as f:
    f.write(challs.to_json(orient='records'))

  print("Done!")