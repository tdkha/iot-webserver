import http.client
import json
import time
target_hostname = "localhost"
target_port = 8000
conn = http.client.HTTPConnection(host=target_hostname,port=target_port,timeout=10)
headers = {'Content-type': 'application/json'}

toBuyList1 = ['Fresh Chicken Breast']
toBuyList2 = ['Butter','Tomatoes (1kg)','Eggs']
for item in range(0,len(toBuyList1)):
    items ={
        'item' : toBuyList1[item]
    }
    print(items)
    items = json.dumps(items)
    conn.request("POST", "/", items ,headers=headers)
    time.sleep(0.5)
response = conn.getresponse()
print(response.read().decode('utf-8'))



