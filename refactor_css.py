import re
import os

def extract_and_remove_styles(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    styles = []
    
    # Find all <style> tags
    def replace_style(match):
        styles.append(match.group(1))
        return ''
    
    new_content = re.sub(r'<style>(.*?)</style>', replace_style, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    return '\n'.join(styles)

def fix_line_numbers(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    new_lines = []
    for line in lines:
        # Match lines like "139:                     <span..."
        match = re.match(r'^\s*\d+:\s(.*)$', line)
        if match:
            new_lines.append(match.group(1) + '\n')
        else:
            new_lines.append(line)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

# 1. Fix line numbers in contact.html
contact_path = r'templates/contact.html'
fix_line_numbers(contact_path)

# 2. Extract styles from index and contact
index_path = r'templates/index.html'
index_styles = extract_and_remove_styles(index_path)
contact_styles = extract_and_remove_styles(contact_path)

# 3. Append to style.css
css_path = r'static/css/style.css'
with open(css_path, 'a', encoding='utf-8') as f:
    if index_styles.strip():
        f.write('\n/* Styles from index.html */\n')
        f.write(index_styles)
    if contact_styles.strip():
        f.write('\n/* Styles from contact.html */\n')
        f.write(contact_styles)

print("CSS refactoring complete.")
