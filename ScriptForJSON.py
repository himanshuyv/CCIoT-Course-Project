import json

def clean_json_file(json_file):
    with open(json_file, 'r') as file:
        data = json.load(file)
        
        # Parse the JSON string into a list of dictionaries if needed
        if isinstance(data, str):
            data = json.loads(data)
        
        # Iterate through entries and remove 'field2' and entries with null 'field1'
        cleaned_data = [entry for entry in data]
        print(cleaned_data)
    #     for entry in cleaned_data:
    #         entry.pop('field2', None)
    
    # # Write cleaned data back to the file
    # with open(json_file, 'w') as file:
    #     json.dump(cleaned_data, file, indent=4)

# Example usage:
json_file = 'data1.json'  # Replace 'example.json' with your JSON file path
clean_json_file(json_file)
print("Data cleaned successfully.")
