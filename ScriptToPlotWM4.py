import csv
import matplotlib.pyplot as plt

def read_first_n_entries(csv_file, n):
    data = []
    with open(csv_file, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for _ in range(n):
            data.append(next(reader))
    
    return data


csv_file_path = './WM4_data.csv'

entries = read_first_n_entries(csv_file_path, 20000)

dict1 = {}
for i in range(0, len(entries)-5):
    avg1 = (float(entries[i]['field1']) + float(entries[i+1]['field1']) + float(entries[i+2]['field1']) + float(entries[i+3]['field1']) + float(entries[i+4]['field1']))/5
    if (avg1 > 0.15):
        dict1[entries[i]['created_at']] = 1
    else:
        dict1[entries[i]['created_at']] = 0

timestamps = list(dict1.keys())
values = list(dict1.values())

plt.figure(figsize=(10, 6))
plt.plot(timestamps, values)
plt.xlabel('Timestamp')
plt.ylabel('Status')
plt.title('WM 3 Status Over Time')
plt.grid(True)
plt.show()