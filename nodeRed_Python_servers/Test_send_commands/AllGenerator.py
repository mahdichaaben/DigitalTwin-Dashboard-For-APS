import json
import os

# Function to process a single JSON object
def process_object(obj):
    if 'payload' in obj and 'nodes' in obj['payload'] and len(obj['payload']['nodes']) > 0:
        nodes = obj['payload']['nodes']
        path = nodes[0]['id'] + "-" + nodes[-1]['id']
        obj['path'] = path
    return obj

# Main function to concatenate all JSON files
def concatenate_jsons(root_dir, output_file):
    all_objects = []
    
    # Walk through the directory structure
    for subdir, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.json'):
                file_path = os.path.join(subdir, file)
                try:
                    with open(file_path, 'r') as f:
                        data = json.load(f)
                        if isinstance(data, list):
                            for obj in data:
                                processed_obj = process_object(obj)
                                all_objects.append(processed_obj)
                        else:
                            # If it's not a list, treat it as a single object
                            processed_obj = process_object(data)
                            all_objects.append(processed_obj)
                except json.JSONDecodeError:
                    print(f"Error decoding JSON in file: {file_path}")
                except Exception as e:
                    print(f"Error processing file {file_path}: {e}")
    
    # Write all objects to the output file as a JSON array
    with open(output_file, 'w') as out_f:
        json.dump(all_objects, out_f, indent=4)

# Usage
root_directory = 'AllPaths'  # Replace with the actual path if needed
output_filename = 'allCommands.json'
concatenate_jsons(root_directory, output_filename)