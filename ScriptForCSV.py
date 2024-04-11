import csv

def remove_null_entries(csv_file):
    # Open the CSV file for reading and a temporary file for writing
    with open(csv_file, 'r') as file, open('temp.csv', 'w', newline='') as temp_file:
        reader = csv.reader(file)
        writer = csv.writer(temp_file)
        
        # Write header
        header = next(reader)
        writer.writerow(header)
        
        # Iterate through rows and write non-null entries to the temporary file
        for row in reader:
            if row[2] != '':
                writer.writerow(row)
    
    # Replace the original file with the temporary file
    import os
    os.replace('temp.csv', csv_file)

# Example usage:
csv_file = 'data1.csv'  # Replace 'example.csv' with your CSV file path
remove_null_entries(csv_file)
print("Null entries removed successfully.")
