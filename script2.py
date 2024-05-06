import csv

def read_last_n_entries(csv_file, n):
    """
    Read the last n entries from a CSV file.
    
    Args:
    - csv_file: The path to the CSV file.
    - n: Number of entries to read.
    
    Returns:
    - List of dictionaries, each representing a row in the CSV file.
    """
    data = []
    with open(csv_file, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        total_rows = sum(1 for row in reader)
        file.seek(0)  # Reset file pointer
        
        # Skip header
        next(reader)
        
        # Calculate starting row index
        start_row = max(0, total_rows - n)
        
        # Skip to starting row
        for _ in range(start_row):
            next(reader)
        
        # Read remaining rows
        for row in reader:
            data.append(row)
    
    return data

# Example usage:
csv_file_path = './DataFolder/data3.csv'  # Replace with your CSV file path
last_30000_entries = read_last_n_entries(csv_file_path, 200000)


for entry in last_30000_entries:
    del entry['latitude']
    del entry['longitude']
    del entry['elevation']
    del entry['status']


field1_data = []
field2_data = []

for entry in last_30000_entries:
    if entry['field1'] == '':
        field2_data.append(entry)
    elif entry['field2'] == '':
        field1_data.append(entry)

# remove field1 key from field2_data and field2 key from field1_data
for entry in field2_data:
    del entry['field1']

for entry in field1_data:
    del entry['field2']


no_of_wash_cycles1 = 0

flag = 0
idx = 0
L1 = []
for i in range(20,len(field1_data)):
    countg = 0
    countl = 0
    for j  in range(i-20,i+1):
        if float(field1_data[j]['field1']) > 0.15 :
            countg = countg + 1
        else:
            countl = countl + 1
    if countg>countl:
        if flag == 0:
            no_of_wash_cycles1 = no_of_wash_cycles1 + 1
            flag = 1
            idx = i
    else:
        flag = 0
        L1.append(i-idx)
    

no_of_wash_cycles2 = 0

flag = 0
idx = 0
L2 = []
for i in range(20,len(field2_data)):
    countg = 0
    countl = 0
    for j  in range(i-20,i+1):
        if float(field2_data[j]['field2']) > 0.14 :
            countg = countg + 1
        else:
            countl = countl + 1
    if countg>countl:
        if flag == 0:
            no_of_wash_cycles2 = no_of_wash_cycles2 + 1
            flag = 1
            idx = i
    else:
        if flag == 1:
            L2.append(i-idx)
        flag = 0

print("Number of wash cycles for field1: ",no_of_wash_cycles1)
print("Number of wash cycles for field2: ",no_of_wash_cycles2)
# print(L1)
# print(L2)
