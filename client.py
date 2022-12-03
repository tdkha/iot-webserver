import http.client
import json
import time
target_hostname = "localhost"
target_port = 8000

headers = {'Content-type': 'application/json'}

toBuyList1 = ['FIstiRsQ6HY7URBnxj']
toBuyList2 = ['Butter','Tomatoes (1kg)','Eggs']
for item in range(0,len(toBuyList1)):
    items ={
        'code' : toBuyList1[item]
    }

    print(items)
    items = json.dumps(items)
    conn = http.client.HTTPConnection(host=target_hostname,port=target_port,timeout=10)
    conn.request("POST", "/add", items ,headers=headers)
    time.sleep(0.5)




