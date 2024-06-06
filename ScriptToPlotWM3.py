import csv
import matplotlib.pyplot as plt
import datetime

def read_first_n_entries(csv_file, n):
    data = []
    with open(csv_file, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for _ in range(n):
            data.append(next(reader))
    
    return data


csv_file_path = './WM3_data.csv'

entries = read_first_n_entries(csv_file_path, 20000)


dict1 = {}
for i in range(0, len(entries)-5):
    avg1 = (float(entries[i]['field2']) + float(entries[i+1]['field2']) + float(entries[i+2]['field2']) + float(entries[i+3]['field2']) + float(entries[i+4]['field2']))/5
    if (avg1 > 0.14):
        dict1[entries[i]['created_at']] = 1
    else:
        dict1[entries[i]['created_at']] = 0

timestamps = list(dict1.keys())
values = list(dict1.values())

plt.figure(figsize=(10, 6))
plt.plot(timestamps, values)
plt.xlabel('Timestamp')
plt.ylabel('Value (0 or 1)')
plt.title('Values Over Time')
plt.grid(True)
plt.show()