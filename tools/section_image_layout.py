"""Attach independently generated imagery to reviewed sections, preserving source copy."""
from pathlib import Path
from bs4 import BeautifulSoup
import json,re
ROOT=Path(__file__).resolve().parents[1]
ASSETS=json.loads((ROOT/'content/section-images.json').read_text(encoding='utf-8'))
RESULTS=json.loads((ROOT/'content/generated-image-results.json').read_text(encoding='utf-8')) if (ROOT/'content/generated-image-results.json').exists() else {}
ALT={
 'home-planning':'Open planning notebook beside architectural drawings and a financial-record folder.',
 'home-filer-guide':'Sorted document wallet and a calculator in navy and off-white.',
 'home-structure-guide':'Two contrasting paper structures representing organizational choices.',
 'home-trade-guide':'Miniature shipping container beside a cargo-document sleeve.',
 'about-approach':'Prepared matter folder, organized notes and a magnifying lens.',
 'company-foundation':'Paper business-building model emerging from an incorporation folder.',
 'sole-owner':'One small paper shopfront on a business folio beside a key.',
 'partnership-deed':'Two pens beside a shared open partnership document.',
 'llp-structure':'Central business model and two separate folders joined by blue ribbons.',
 'manufacturing-setup':'Miniature workshop model and equipment on a business-plan folio.',
 'construction-records':'Unfinished building model, rolled plans and a document binder.',
 'it-business':'Anonymous laptop, cloud model, headset and mobile device.',
 'wealth-records':'Organized trays holding property, savings and obligation records.',
 'sales-tax-records':'Product parcel, purchase folder, invoice folio and a ledger.',
 'ntn-enrollment':'Blank identity-card shape in a record envelope beside an enrollment folio.',
 'pra-services':'Restaurant, workshop, salon and fitness objects around a record folder.',
 'audit-reconciliation':'Parallel financial records and a magnifying lens used for comparison.',
 'appeal-preparation':'Tabbed evidence folder beside a blank chronology notebook.',
 'trademark-identity':'Anonymous packages carrying one consistent fictional blue pattern.',
 'copyright-works':'Book, camera, original abstract artwork and a closed laptop.',
 'contract-review':'Two document drafts with blue review marks and a transparent ruler.',
 'filer-documents':'Employment, banking and property record envelopes around a filing folio.',
 'trade-clearance':'Shipping-container model beside a document wallet and inspection lens.',
 'chamber-connections':'Distinct miniature businesses connected around a shared meeting surface.'
}
def normalize(t):return re.sub(r'\s+',' ',t).strip()
def make_image(soup,asset,thumbnail=False):
 key=asset['id']; result=RESULTS[key]
 img=soup.new_tag('img',attrs={
  'src':result['variants'][1],
  'srcset':', '.join(f'{path} {w}w' for path,w in zip(result['variants'],[480,900,1400])),
  'sizes':'(max-width: 700px) calc(100vw - 44px), 420px' if thumbnail else '(max-width: 700px) calc(100vw - 44px), (max-width: 1100px) 70vw, 940px',
  'width':str(result['width']),'height':str(result['height']),
  'alt':'' if thumbnail else ALT[key]+' Conceptual illustration.',
  'loading':'lazy','decoding':'async','class':'guide-thumbnail' if thumbnail else 'section-image',
  'data-image-id':key
 })
 viewport=soup.new_tag('div',attrs={'class':'image-viewport'})
 viewport.append(img)
 if thumbnail:return viewport
 figure=soup.new_tag('figure',attrs={'class':'section-visual','data-section-image':key})
 figure.append(viewport)
 caption=soup.new_tag('figcaption'); caption.string=asset['caption']+' · Conceptual illustration'; figure.append(caption)
 return figure

def add_section_images(content,filename):
 page='tax_notice_audit_assessment/index.html' if filename=='tax_notice_audit_assesement/index.html' else filename
 selected=[a for a in ASSETS if a['page']==page]
 if not selected:return content
 soup=BeautifulSoup(content,'html.parser')
 for asset in selected:
  if asset['id'] not in RESULTS:raise ValueError('Image generation incomplete: '+asset['id'])
  headings=soup.find_all(re.compile('^h[1-6]$'))
  heading=next((h for h in headings if normalize(h.get_text(' ',strip=True))==normalize(asset['heading'])),None)
  if not heading:raise ValueError('Image placement heading not found: '+asset['heading'])
  if filename=='index.html' and asset['id'].startswith('home-') and 'guide' in asset['id']:
   card=heading.find_parent('a',class_='guide-item');card.insert(0,make_image(soup,asset,True));continue
  figure=make_image(soup,asset)
  if asset['id']=='home-planning':
   intro=heading.find_parent('section');story=intro.find('div',recursive=False)
   story.insert(0,heading.extract());story['class']=['intro-story'];story.extract();intro.clear();intro.append(story);intro.append(figure);intro['class'].append('image-enhanced');continue
  header=heading.find_parent(class_='section-header')
  reference=heading.find_parent(class_='reference-grid')
  if header:header.insert_after(figure)
  elif reference:reference.insert_after(figure)
  else:heading.insert_after(figure)
 return str(soup)
