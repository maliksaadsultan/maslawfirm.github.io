"""Check all emitted pages, local links, anchors, contact data and preserved content."""
from pathlib import Path
from urllib.parse import urlparse, unquote
from bs4 import BeautifulSoup
import json, re, sys
PROJECT=Path(__file__).resolve().parents[1]
ROOT=PROJECT/'dist' if '--dist' in sys.argv else PROJECT
data=json.loads((PROJECT/'docs/original-content.json').read_text(encoding='utf-8'))
issues=[]; warnings=[]; parsed={}; totals={'pages':0,'local_links':0,'images':0,'preserved_words':0}
def soup_for(path):
 if path not in parsed: parsed[path]=BeautifulSoup(path.read_text(encoding='utf-8'),'html.parser')
 return parsed[path]
for original in data:
 path=ROOT/original['file']; soup=soup_for(path); totals['pages']+=1
 for tag,n in [('main',1),('h1',1)]:
  if len(soup.find_all(tag))!=n: issues.append(f'{original["file"]}: expected one {tag}')
 if not soup.title or not soup.find('meta',attrs={'name':'description'}): issues.append(f'{path}: missing metadata')
 if 'mastaxlawfirm@gmail.com' in str(soup): issues.append(f'{path}: old email')
 for schema in soup.find_all('script',type='application/ld+json'):
  try: json.loads(schema.string)
  except Exception: issues.append(f'{path}: invalid JSON-LD')
 ids=[x['id'] for x in soup.find_all(id=True)]
 if len(ids)!=len(set(ids)): issues.append(f'{original["file"]}: duplicate IDs')
 for node in soup.find_all(['a','img','script','link']):
  attr='href' if node.name in ['a','link'] else 'src'; url=node.get(attr,'')
  if not url or url.startswith(('mailto:','tel:','data:')): continue
  u=urlparse(url)
  if u.netloc: continue
  dest=(ROOT/unquote(u.path).lstrip('/')) if u.path.startswith('/') else path.parent/unquote(u.path) if u.path else path
  if dest.is_dir(): dest=dest/'index.html'
  if not dest.exists(): issues.append(f'{original["file"]}: missing {url}'); continue
  totals['local_links']+=1
  if u.fragment and dest.suffix=='.html' and not soup_for(dest).find(id=unquote(u.fragment)): issues.append(f'{original["file"]}: missing fragment {url}')
  if node.name=='img':
   totals['images']+=1
   if not all(node.has_attr(a) for a in ['alt','width','height']): issues.append(f'{original["file"]}: image dimensions/alt missing')
 # Original text remains even where layout changes. Form buttons and a missing download label are intentionally revised.
 words=lambda t: set(re.findall(r'[a-z]{3,}',t.lower()))
 old=words(original['content']); new=words(soup.find('main').get_text(' ',strip=True))
 missing=old-new-{'mastaxlawfirm','gmail','send','message','download','us','thanks','khanpur'}
 totals['preserved_words']+=len(old&new)
 if missing: warnings.append({'page':original['file'],'source_words_not_in_render':sorted(missing)})
totals['cname']=(ROOT/'CNAME').read_text().strip()
assert totals['cname']=='www.maslawfirm.org'
result={'totals':totals,'errors':sorted(set(issues)),'content_review':warnings}
if '--report' in sys.argv:
 (PROJECT/('docs/static-dist-verification.json' if '--dist' in sys.argv else 'docs/static-verification.json')).write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result,indent=2))
raise SystemExit(bool(issues))
