import os
import re
import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

# Try downloading Oyama Koh-Ichiro using a modern user agent
output_dir = r"C:\Users\ncc\Desktop\HMSSTC-Web-1\src\content\images\members"
oyama_url = "https://i1.rgstatic.net/ii/profile.image/277771273162764-1443237240698_Q128/Koh-Ichiro-Oyama.jpg"
oyama_path = os.path.join(output_dir, "oyama-koh-ichiro.jpg")
try:
    req = urllib.request.Request(oyama_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req) as response, open(oyama_path, 'wb') as out_file:
        data = response.read()
        out_file.write(data)
    print(f"Downloaded oyama-koh-ichiro.jpg")
except Exception as e:
    print(f"Failed to download oyama-koh-ichiro.jpg from {oyama_url}: {e}")

members_dir = r"C:\Users\ncc\Desktop\HMSSTC-Web-1\src\content\members"
images_dir = r"C:\Users\ncc\Desktop\HMSSTC-Web-1\src\content\images\members"

image_files = os.listdir(images_dir)
# Build a dictionary mapping base name to the actual image string
images_map = {}
for img in image_files:
    base = os.path.splitext(img)[0]
    # In case there are duplicates like .webp and .jpg, pick jpg as preference or whatever we read last
    if base not in images_map or not images_map[base].endswith('.webp'):
        images_map[base] = img

for fn in os.listdir(members_dir):
    if fn.endswith(".md"):
        # e.g., chen-bing-zhi.en.md -> chen-bing-zhi
        base_name = fn.split('.')[0]
        if base_name in images_map:
            img_filename = images_map[base_name]
            file_path = os.path.join(members_dir, fn)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()

            new_image_line = f'image: "../images/members/{img_filename}"'

            # Replace or insert
            if re.search(r'^image:.*$', content, re.MULTILINE):
                content = re.sub(r'^image:.*$', new_image_line, content, flags=re.MULTILINE)
            else:
                # Insert after the last frontmatter entry (e.g., category: "regular")
                content = re.sub(r'(^---.*?)^---', lambda m: m.group(1) + new_image_line + '\n---', content, flags=re.MULTILINE | re.DOTALL)
                
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated {fn} with {img_filename}")
