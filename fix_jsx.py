import os
import glob

voting_folder = r'd:\Voting\src\voting'
jsx_files = glob.glob(os.path.join(voting_folder, '*.jsx'))

fixed_count = 0
for jsx_file in jsx_files:
    with open(jsx_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if it starts with 'vote =' instead of 'const vote ='
    if content.startswith('vote ='):
        content = 'const ' + content
        with open(jsx_file, 'w', encoding='utf-8') as f:
            f.write(content)
        fixed_count += 1
        print(f'Fixed: {os.path.basename(jsx_file)}')

print(f'\nTotal fixed: {fixed_count} files')
