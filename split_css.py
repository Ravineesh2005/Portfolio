import os
import re

style_path = r'static/css/style.css'
with open(style_path, 'r', encoding='utf-8') as f:
    content = f.read()

# The refactored content appended looks like:
# /* Styles from index.html */
# ...
# /* Styles from contact.html */
# ...

parts = content.split('/* Styles from index.html */')
core_css = parts[0]

if len(parts) > 1:
    index_and_contact = parts[1].split('/* Styles from contact.html */')
    index_css = index_and_contact[0].strip()
    
    if len(index_and_contact) > 1:
        contact_css = index_and_contact[1].strip()
    else:
        contact_css = ""
else:
    index_css = ""
    contact_css = ""

# Rewrite core style.css
with open(style_path, 'w', encoding='utf-8') as f:
    f.write(core_css.strip() + '\n')

# Write index.css
with open(r'static/css/index.css', 'w', encoding='utf-8') as f:
    f.write(index_css + '\n')

# Write contact.css
with open(r'static/css/contact.css', 'w', encoding='utf-8') as f:
    f.write(contact_css + '\n')

# Update index.html
index_html_path = r'templates/index.html'
with open(index_html_path, 'r', encoding='utf-8') as f:
    html = f.read()
if '{% block extra_css %}' not in html:
    html = html.replace('{% block content %}', '{% block extra_css %}\n<link rel="stylesheet" href="{{ url_for(\'static\', filename=\'css/index.css\') }}">\n{% endblock %}\n\n{% block content %}')
    with open(index_html_path, 'w', encoding='utf-8') as f:
        f.write(html)

# Update contact.html
contact_html_path = r'templates/contact.html'
with open(contact_html_path, 'r', encoding='utf-8') as f:
    html = f.read()
if '{% block extra_css %}' not in html:
    html = html.replace('{% block content %}', '{% block extra_css %}\n<link rel="stylesheet" href="{{ url_for(\'static\', filename=\'css/contact.css\') }}">\n{% endblock %}\n\n{% block content %}')
    with open(contact_html_path, 'w', encoding='utf-8') as f:
        f.write(html)

print("CSS successfully split into separate files and linked!")
