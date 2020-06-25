# Automatically generates 500 teams and users

# User/Team Name   : `debug[number]`
# Email            : `debug[number]@example.com`
# Pass/Invite Code : `rgbCTF-debug`

import requests
import time

for i in range(0, 500):
  payload = {
	  'name': 'debug%d' % i,
	  'email': 'debug%d@example.com' % i,
	  'password': 'rgbCTF-debug',
	  'teamName': 'debug%d' % i,
	  'inviteCode': 'rgbCTF-debug',
	  'createTeam': True
  }
  request = requests.post('http://localhost:5000/api/user/register', json=payload)
  response = request.json()
  if not response.get('success'):
    print("WARN: Failed to generate user #%d: %s" % (i, response.get('err')))
  else:
    print("DEBG: Generated user #%d" % i)

