import requests
from bs4 import BeautifulSoup

url = "https://www.lyrics.com/lyric/35065270/Imagine+Dragons/Thunder"
page = requests.get(url)
soup = BeautifulSoup(page.content, 'html.parser')

result = soup.find('pre', id='lyric-body-text').get_text()
print(result)
