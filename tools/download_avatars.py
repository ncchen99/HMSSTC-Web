import os
import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

output_dir = r"C:\Users\ncc\Desktop\HMSSTC-Web-1\src\content\images\members"
os.makedirs(output_dir, exist_ok=True)

images = {
    "lin-chien-hong": "https://researchoutput.ncku.edu.tw/files-asset/144588268/9902003.jpg?w=160&f=jpg",
    "chen-bing-zhi": "https://researchoutput.ncku.edu.tw/files-asset/16417614/9708007.jpg?w=160&f=jpg",
    "chao-yei-chin": "https://iaa.ncku.edu.tw/var/file/104/1104/img/4478/434702939.jpg",
    "jan-shau-shiun": "https://iaa.ncku.edu.tw/var/file/104/1104/img/4478/540028720.jpg",
    "wu-chih-yung": "https://iaa.ncku.edu.tw/var/file/104/1104/img/4478/804269813.jpg",
    "li-yueh-heng": "https://isse.ncku.edu.tw/var/file/104/1104/img/4670/472445042.jpg",
    "lin-chia-hsiang": "https://www.ee.ncku.edu.tw/upload/people/uploads_teacher/chiahsiang.steven.lin.jpg",
    "lin-chao-hung": "https://researchoutput.ncku.edu.tw/files-asset/144588130/9502003.jpg?w=160&f=jpg",
    "tseng-tzu-pang": "https://researchoutput.ncku.edu.tw/files-asset/182839464/11108032.jpg?w=160&f=jpg",
    "chen-jia-hong": "https://researchoutput.ncku.edu.tw/files-asset/533235050/10608013.jpg?w=160&f=jpg",
    "lin-jia-ting": "https://iaa.ncku.edu.tw/var/file/104/1104/img/4478/813928628.jpg",
    "ip-wing-huen": "https://scholars.ncu.edu.tw/files-asset/2237850351/ip_wing.jpg?w=160&f=jpg",
    "liu-jann-yenq": "https://scholars.ncu.edu.tw/files-asset/2237850835/52896b635f65-2.png?w=160&f=jpg",
    "chao-chi-kuang": "https://scholars.ncu.edu.tw/files-asset/2148698384/35Chi-KuangChao.jpg?w=160&f=jpg",
    "oyama-koh-ichiro": "https://i1.rgstatic.net/ii/profile.image/277771273162764-1443237240698_Q128/Koh-Ichiro-Oyama.jpg"
}

for name, url in images.items():
    ext = url.split("?")[0].split(".")[-1]
    if ext.lower() not in ["jpg", "png", "jpeg", "webp"]:
        ext = "jpg"
    filename = f"{name}.{ext}"
    filepath = os.path.join(output_dir, filename)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(filepath, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Downloaded {filename}")
    except Exception as e:
        print(f"Failed to download {filename} from {url}: {e}")
