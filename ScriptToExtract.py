import csv

def read_last_n_entries(csv_file, n):
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

csv_file_path = './data2.csv'
last_30000_entries = read_last_n_entries(csv_file_path, 30000)


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


# Write the filtered data to new CSV files
field1_file = 'WM4_data.csv'
field2_file = 'WM3_data.csv'

def write_data_to_csv(data, csv_file):
    with open(csv_file, 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)

write_data_to_csv(field1_data, field1_file)
write_data_to_csv(field2_data, field2_file)