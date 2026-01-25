import os
import json
import glob

def is_valid_record(record):
    """Check if a record is valid (no NaN, NOT_FOUND, null, or missing key fields)"""
    # Key fields that must be valid
    key_fields = ["S.No", "Name", "ID Code", "Age"]
    
    for field in key_fields:
        value = record.get(field)
        if value is None:
            return False
        if isinstance(value, str):
            val_lower = value.strip().lower()
            if val_lower in ["nan", "not_found", "null", ""]:
                return False
        if isinstance(value, float) and str(value).lower() == "nan":
            return False
    
    # Check Name specifically - should not be empty or invalid
    name = record.get("Name", "")
    if not name or str(name).strip().lower() in ["nan", "not_found", "null", ""]:
        return False
    
    return True

def clean_data(data):
    """Remove invalid records from data"""
    return [record for record in data if is_valid_record(record)]

def json_to_jsx_content(data):
    """Convert JSON data to JSX module content"""
    # Pretty print the JSON with proper indentation
    json_str = json.dumps(data, ensure_ascii=False, indent=2)
    
    jsx_content = f"""const vote = {json_str};

export default vote;
"""
    return jsx_content

def process_file(json_path):
    """Process a single JSON file and create corresponding JSX file"""
    try:
        # Read JSON file
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Clean data
        cleaned_data = clean_data(data)
        
        # Generate JSX content
        jsx_content = json_to_jsx_content(cleaned_data)
        
        # Create JSX file path (same name, different extension)
        jsx_path = json_path.replace('.json', '.jsx')
        
        # Write JSX file
        with open(jsx_path, 'w', encoding='utf-8') as f:
            f.write(jsx_content)
        
        print(f"✓ Processed: {os.path.basename(json_path)} -> {os.path.basename(jsx_path)}")
        print(f"  Original records: {len(data)}, Cleaned records: {len(cleaned_data)}")
        
        return True
    except Exception as e:
        print(f"✗ Error processing {json_path}: {e}")
        return False

def main():
    voting_folder = r"d:\Voting\src\voting"
    
    # Find all JSON files
    json_files = glob.glob(os.path.join(voting_folder, "*.json"))
    
    print(f"Found {len(json_files)} JSON files to process\n")
    
    success_count = 0
    for json_file in sorted(json_files):
        if process_file(json_file):
            success_count += 1
    
    print(f"\n{'='*50}")
    print(f"Completed: {success_count}/{len(json_files)} files processed successfully")

if __name__ == "__main__":
    main()
