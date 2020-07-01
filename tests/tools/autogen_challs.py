# Automatically generates 500 challenges
# Usage: python3 autogen_challs.py admin_user admin_pass

# Name/Description : `Debug Challenge #[number]`
# Hints            : [`Flag is [flag]`]
# Case Sensitive   : False
# Points           : 420
# Flag             : rgbCTF{debug[number]}
# Category         : `Debug`

import requests
import time
import sys

if len(sys.argv) != 3:
  print('Usage: python3 %s admin_user admin_pass' % sys.argv[0])
  exit(-1)

username = sys.argv[1]
password = sys.argv[2]

payload = {
  'name': username,
  'password': password
}

request = requests.post('http://localhost:5000/api/user/login', json=payload)
response = request.json()
if not response.get('success'):
  print("ERR!: Failed to log in: %s" % response.get('err'))
  exit(-1)

cookies = request.cookies

for i in range(0, 500):
  payload2 = {
	  'name': 'Debug Challenge #%s' % i,
    'description': 'Debug Challenge #%s' % i,
    'category': 'Debug',
    'hints': ['Flag is rgbCTF{debug%s}' % i],
    'flagCaseSensitive': False,
    'flag': 'rgbCTF{debug%s}' % i,
    'points': 420
  }
  request2 = requests.post('http://localhost:5000/api/challenge/add', json=payload2, cookies=cookies)
  response2 = request.json()
  if not response2.get('success'):
    print("WARN: Failed to generate chall #%d: %s" % (i, response2.get('err')))
  else:
    print("DEBG: Generated chall #%d" % i)

