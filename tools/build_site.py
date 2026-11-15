"""Reproducible static redesign. Run from any directory; no runtime dependencies."""
from pathlib import Path
from bs4 import BeautifulSoup
from html import escape as esc
import json, re, shutil, argparse, zipfile, hashlib
from section_image_layout import add_section_images

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'content/pages.json'
ORIGINAL=json.loads((SOURCE if SOURCE.exists() else ROOT/'docs/original-content.json').read_text(encoding='utf-8'))
DOMAIN='https://www.maslawfirm.org'
LOGO='/MAS_LOGO_Nov15_2026.jpg'
EMAIL='mastaxfirm@gmail.com'
PHONE='+92 332 7771392'
WA='https://wa.me/923327771392'
MAP='https://www.google.com/maps/search/?api=1&query=Khanpur+Road+Opposite+UET+Taxila+Main+Gate+Taxila+Pakistan'
GROUPS={
 'Business registration':[
 ('company_registration','Company registration'),('sole_proprietorship','Sole proprietorship'),('partnership_firm_registration','Partnership firms'),('register_LLP','Limited liability partnership'),('manufacturing_company_registration','Manufacturing businesses'),('real_estate_construction_company_registration','Real estate & construction'),('IT_company_registration','IT companies & call centers')],
 'Tax & compliance':[
 ('income_tax_return_filing','Income tax returns'),('sales_tax_registration_sales_tax_return','Sales tax registration & returns'),('NTN_registration','NTN registration'),('registration_return_filing','Punjab Revenue Authority'),('tax_notice_audit_assessment','Tax notices & audits'),('tax_appeals_litigation_services','Tax appeals & litigation')],
 'Legal & intellectual property':[
 ('register_trademark','Trademark registration'),('copyright_registration','Copyright registration'),('legal_agreements_contracts','Agreements & contracts')],
 'Practical guides':[
 ('become_tax_filer','Becoming a tax filer'),('difference_between_firm_company','Partnership firm or company?'),('weboc_registration','WEBOC registration'),('chamber_of_commerce_registration','Chamber of Commerce membership')]
}
LABELS={slug:label for rows in GROUPS.values() for slug,label in rows}
TITLES={
 'company_registration':'A strong foundation for your business.',
 'sole_proprietorship':'Your business. Your first step.',
 'partnership_firm_registration':'Build your partnership on clarity.',
 'register_LLP':'Partnership, with a considered structure.',
 'manufacturing_company_registration':'Set your manufacturing business in motion.',
 'real_estate_construction_company_registration':'Build on a sound legal foundation.',
 'IT_company_registration':'A clear start for your technology business.',
 'income_tax_return_filing':'Make your tax return a considered decision.',
 'sales_tax_registration_sales_tax_return':'Stay clear on sales tax compliance.',
 'NTN_registration':'Start with the right tax registration.',
 'registration_return_filing':'Navigate provincial tax with clarity.',
 'tax_notice_audit_assessment':'A considered response to your tax notice.',
 'tax_notice_audit_assesement':'A considered response to your tax notice.',
 'tax_appeals_litigation_services':'A clear way through a tax dispute.',
 'register_trademark':'Give your brand the protection it deserves.',
 'copyright_registration':'Your original work deserves protection.',
 'legal_agreements_contracts':'Clear agreements. Stronger relationships.',
 'become_tax_filer':'Understand your path to becoming a filer.',
 'difference_between_firm_company':'Choose a structure that fits your business.',
 'weboc_registration':'Prepare your business for international trade.',
 'chamber_of_commerce_registration':'Connect your business to its next opportunity.'
}
NOTES={
 'become_tax_filer':'The original guide below describes weekly ATL updates. FBR announced daily ATL updates under S.R.O. 1638(I)/2024. Late-filing surcharges, statutory references and tax benefits also need confirmation for your tax year.',
 'company_registration':'Company requirements vary by structure. SECP also permits single-member companies; the original two-director and capital examples below are not universal requirements. Confirm capital, liability and post-registration obligations for your business.',
 'weboc_registration':'The source guide mixes Taxila with a Thokar Niaz Baig customs-office address. Confirm the correct customs station, Pakistan Single Window / WEBOC route, current fees, financial criteria and documents before applying.',
 'chamber_of_commerce_registration':'The source guide uses “LCCI” alongside Taxila. Confirm the appropriate chamber, membership eligibility, current fee and import/export requirements directly before applying.',
 'about':'The descriptions of practitioner experience and court representation below come from the existing website. Confirm the lawyer and scope of representation for your matter during consultation.'
}

def icon(name='arrow'):
 paths={'arrow':'M4 12h16M14 6l6 6-6 6','diag':'M5 19 19 5M5 5h14v14','plus':'M5 12h14M12 5v14','menu':'M3 7h18M3 17h18','phone':'M6 3h4l2 5-3 2a13 13 0 0 0 5 5l2-3 5 2v4c-9 3-20-8-15-15Z','close':'m6 6 12 12M6 18 18 6','chevron':'m7 10 5 5 5-5'}
 return f'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="{paths.get(name,paths["arrow"])}"/></svg>'

def link(slug,label,cls=''):
 return f'<a class="{cls}" href="/{slug}/">{esc(label)}{icon("diag")}</a>'

def logo():
 return f'<img src="{LOGO}" width="1254" height="1254" alt="MAS Tax Firm — Artistry in Tax Planning" class="brand-logo" decoding="async">'

def directory(menu=False):
 return '<div class="service-directory">'+''.join(f'<section class="directory-group"><h3>{esc(group)}</h3><ul>'+''.join(f'<li>{link(s,l)}</li>' for s,l in rows)+'</ul></section>' for group,rows in GROUPS.items())+'</div>'

def header(current):
 def nav(href,label):
  mark=' aria-current="page"' if current==href else ''
  return f'<a href="{href}"{mark}>{label}</a>'
 return f'''<a class="skip-link" href="#main-content">Skip to content</a>
 <div class="utility" role="region" aria-label="Location and telephone"><div class="wrap"><span>Taxila, Pakistan · Serving clients nationwide</span><a href="tel:+923327771392">{PHONE}</a></div></div>
 <header class="site-header"><div class="wrap header-inner">
 <a href="/" class="brand">{logo()}<span class="brand-name">MAS Law Firm<small>Tax & legal advisory</small></span></a>
 <button class="mobile-toggle" aria-controls="main-navigation" aria-expanded="false">Menu {icon('menu')}</button>
 <nav class="main-nav" id="main-navigation" aria-label="Main navigation">
 {nav('/about/','The firm')}<details class="nav-disclosure"><summary>Our expertise {icon('chevron')}</summary><div class="mega-panel"><div class="mega-heading"><p>Advice for every stage<br>of your business.</p><a class="text-link" href="/services/">Explore all services {icon()}</a></div>{directory(True)}</div></details>
 <details class="nav-disclosure guide-disclosure"><summary>Guides {icon('chevron')}</summary><div class="guide-panel">{''.join(link(s,l) for s,l in GROUPS['Practical guides'])}{link('NTN_registration','NTN registration guide')}</div></details>
 {nav('/contact/','Contact')}<a class="button nav-button" href="/contact/#enquiry">Discuss your matter {icon('diag')}</a>
 </nav></div></header>'''

def footer():
 return f'''<section class="consultation" aria-labelledby="consultation-heading"><div class="wrap consult-inner"><div><h2 id="consultation-heading">Let’s make your<br>next step a clear one.</h2><p>Tell us what you need. We’ll help you understand the way forward.</p></div><a class="button light" href="/contact/">Start a conversation {icon('diag')}</a></div></section>
 <footer class="site-footer"><div class="wrap"><div class="footer-grid"><div class="footer-brand"><a href="/" class="brand">{logo()}<span class="brand-name">MAS Law Firm<small>Tax & legal advisory</small></span></a><p>Khanpur Road, Opposite UET Taxila Main Gate<br>Tehsil Taxila, District Rawalpindi<br>Punjab, Pakistan</p><a href="{MAP}" target="_blank" rel="noopener noreferrer">Find directions {icon('diag')}</a></div>
 <div><h3>Explore</h3><a href="/about/">The firm</a><a href="/services/">Our expertise</a><a href="/become_tax_filer/">Practical guides</a><a href="/contact/">Contact & office hours</a></div>
 <div><h3>Our expertise</h3><a href="/company_registration/">Business registration</a><a href="/income_tax_return_filing/">Tax & compliance</a><a href="/register_trademark/">Intellectual property</a><a href="/tax_appeals_litigation_services/">Tax disputes</a></div>
 <div><h3>Speak with us</h3><a href="tel:+923327771392">{PHONE}</a><a href="tel:03327771392">03327771392 (Pakistan)</a><a href="mailto:{EMAIL}">{EMAIL}</a><a href="{WA}" target="_blank" rel="noopener noreferrer">Message on WhatsApp {icon('diag')}</a></div></div>
 <div class="footer-bottom"><p>© 2026 MAS Law Firm. All rights reserved.</p><p>General information. Advice depends on your circumstances.</p><a href="#top">Back to top {icon('diag')}</a></div></div></footer>'''

def photo(cls='',priority=False):
 return f'<img class="{cls}" src="/assets/design/architecture-1000.webp" srcset="/assets/design/architecture-640.webp 640w, /assets/design/architecture-1000.webp 1000w, /assets/design/architecture-1600.webp 1600w" sizes="(max-width: 700px) 100vw, 48vw" alt="Upward view of contemporary architecture" width="1600" height="2000" {"fetchpriority="+chr(34)+"high"+chr(34) if priority else "loading="+chr(34)+"lazy"+chr(34)} decoding="async">'

def home(old):
 families=[('Tax & compliance','From your first NTN to ongoing returns and complex tax matters.','income_tax_return_filing'),('Business registration','A considered structure for your next business chapter.','company_registration'),('Legal & intellectual property','Agreements that work. Protection for what you create.','register_trademark')]
 family_html=''.join(f'<a class="family" href="/{slug}/"><h2>{title}</h2><p>{text}</p>{icon("diag")}</a>' for title,text,slug in families)
 return f'''<main id="main-content"><section class="home-hero"><div class="hero-copy"><div class="hero-copy-inner"><h1><span>Clarity in law.</span><span>Confidence in</span><span>what’s next.</span></h1><p>Tax, business and legal advice that helps you move forward. Based in Taxila. Working with individuals and businesses across Pakistan.</p><div class="hero-actions"><a class="button" href="/contact/">Discuss your matter {icon('diag')}</a><a class="quiet-link" href="/services/">Explore our expertise</a></div><div class="hero-foot"><span>A considered approach.<br>A clear way forward.</span><a href="#expertise" aria-label="Explore expertise below">{icon('arrow')}</a></div></div></div><figure class="hero-image">{photo(priority=True)}<figcaption>Perspective changes what’s possible.</figcaption><span class="image-corner" aria-hidden="true"></span></figure></section>
 <section id="expertise" class="wrap family-grid" aria-label="Areas of expertise">{family_html}</section>
 <section class="wrap introduction"><h2>Complex matters.<br>Personal attention.</h2><div><p class="large-copy">A business to build. A return to file. A decision that deserves careful thought.</p><p>MAS Law Firm is a tax and legal consultancy based in Taxila, Pakistan. We help individuals, startups and established businesses navigate company registration, tax compliance, intellectual property and regulatory matters.</p><a class="text-link" href="/about/">Get to know the firm {icon('diag')}</a></div></section>
 <section class="expertise-feature"><div class="wrap expertise-layout"><div class="expertise-heading"><h2>Good advice starts<br>with understanding.</h2><p>Explore the support that fits your situation, from establishing a business to resolving a tax dispute.</p><a class="text-link" href="/services/">View all services {icon('diag')}</a></div><div class="expertise-rows">{''.join(link(s,l,'expertise-row') for s,l in [('company_registration','Establish your business'),('income_tax_return_filing','Manage your tax obligations'),('register_trademark','Protect your ideas & identity'),('tax_appeals_litigation_services','Resolve a tax dispute'),('legal_agreements_contracts','Put your agreements in writing')])}</div></div></section>
 <section class="wrap approach"><div class="approach-title"><h2>Clarity at<br>every step.</h2><p>A straightforward way to begin working together.</p></div><ol class="approach-steps"><li><h3>Tell us about your matter</h3><p>Start with a call, an email or a WhatsApp conversation. Share your goals and the questions on your mind.</p></li><li><h3>Understand your options</h3><p>Discuss the information, documents and next steps relevant to your circumstances.</p></li><li><h3>Move forward with a plan</h3><p>Agree the scope of support before proceeding with your tax, registration or legal matter.</p></li></ol></section>
 <section class="guide-feature"><div class="wrap"><div class="section-intro"><h2>A little knowledge.<br>A clearer decision.</h2><p>Practical starting points from our existing guides. Confirm current rules before acting.</p></div><div class="guide-grid">{''.join(f'<a class="guide-item" href="/{s}/"><span>{tag}</span><h3>{l}</h3><p>{d}</p><span class="text-link">Read the guide {icon("diag")}</span></a>' for s,l,tag,d in [('become_tax_filer','Your path to becoming a tax filer','Tax guidance','Registration, filing and the documents to prepare.'),('difference_between_firm_company','Partnership firm or company?','Business structures','Understand the differences before choosing a structure.'),('weboc_registration','Preparing for import & export','Trade & customs','An introduction to WEBOC and registration documents.')])}</div></div></section>
 <details class="wrap preserved-overview"><summary>More about our tax & legal services</summary><div class="article-content">{old}</div></details></main>'''

def normalize_content(raw):
 raw=raw.replace('mastaxlawfirm@gmail.com',EMAIL).replace('�','•')
 soup=BeautifulSoup(raw,'html.parser')
 main=soup.find('main') or soup
 # Keep IDs, structure, text and links; remove only presentational legacy markup.
 for e in list(main.find_all(['script','style','iframe'])): e.decompose()
 for e in list(main.select('i.fa, i.fas, .eyebrow')):
  if e.get_text(strip=True):
   e['class']=['source-label']
  else: e.decompose()
 for e in main.find_all(True):
  e.attrs.pop('style',None)
  if e.get('class'): e['class']=[c for c in e['class'] if not c.startswith('anjum-reveal') and not c.startswith('animate-')]
 for form in main.find_all('form'):
  form['class']=['enquiry-form']; form['data-enquiry']=''
  for field in form.find_all(['input','textarea']):
   if field.get('type')=='email': field['spellcheck']='false'
   if field.get('type')=='tel': field['inputmode']='tel'
  for btn in form.find_all(['button','input']):
   if btn.get('type')=='submit':
    if btn.name=='button': btn.string='Send enquiry'
    else: btn['value']='Send enquiry'
  info=soup.new_tag('p',attrs={'class':'form-help'}); info.string='Your enquiry is sent via Formspree. Please do not include passwords, CNIC copies or confidential documents.'; form.insert(0,info)
  status=soup.new_tag('p',attrs={'class':'form-status','role':'status','aria-live':'polite'}); form.append(status)
  wa=soup.new_tag('button',attrs={'type':'button','class':'text-link whatsapp-request'}); wa.string='Prepare this enquiry on WhatsApp'; form.append(wa)
 for table in main.find_all('table'):
  if not table.find('caption'):
   caption=soup.new_tag('caption',attrs={'class':'sr-only'}); caption.string='Reference information'; table.insert(0,caption)
  for th in table.find_all('th'):
   if not th.get('scope'): th['scope']='col'
  if not table.parent or 'table-wrap' not in table.parent.get('class',[]):
   wrap=soup.new_tag('div',attrs={'class':'table-wrap','tabindex':'0','role':'region','aria-label':'Scrollable reference table'}); table.wrap(wrap)
 for number,wrap in enumerate(main.select('.table-wrap'),1):
  wrap['tabindex']='0'; wrap['role']='region'; wrap['aria-label']=f'Scrollable reference table {number}'
 for img in list(main.find_all('img')):
  src=img.get('src','')
  if src and not src.startswith(('http:','https:','data:','/')) and not (ROOT/src).exists():
   placeholder=soup.new_tag('p',attrs={'class':'missing-reference'}); placeholder.string='Template media not supplied: '+img.get('alt',src); img.replace_with(placeholder); continue
  img['loading']='lazy'; img['decoding']='async'
  if 'anjum-infographic' in img.get('class',[]):
   detail=soup.new_tag('details',attrs={'class':'reference-figure'})
   summary=soup.new_tag('summary'); summary.string='View visual reference: '+img.get('alt','service overview')
   img.wrap(detail); detail.insert(0,summary)
 for a in main.find_all('a',href=True):
  if a.get('target')=='_blank': a['rel']='noopener noreferrer'
  if a['href'].startswith('mailto:'): a['href']='mailto:'+EMAIL
  # Preserve missing historic downloads as explicit external source links.
  if 'weboc' in a.get_text().lower() and ('Download' in a.get_text()) and a['href'].startswith('/') and not (ROOT/a['href'].lstrip('/')).exists():
   a['href']='https://www.fbr.gov.pk/'; a.string='Check WEBOC registration forms with FBR'
 for e in main.select('.grid-3'): e['class']=[c if c!='grid-3' else 'grid-2' for c in e['class']]
 for grid in main.select('.grid'):
  children=grid.find_all(recursive=False)
  if len(children)==2:
   media=[child for child in children if child.select_one('.reference-figure') and not child.find(['h2','h3','p'])]
   if len(media)==1:
    grid['class']=['reference-grid']
    grid.append(media[0].extract())
 for h in main.select('.step-content > h4, .card-body > h4'): h.name='h3'
 # Existing section headings become navigable while retaining old anchor IDs.
 headings=[]; seen={e['id'] for e in main.find_all(id=True)}
 for h in main.find_all('h2'):
  text=h.get_text(' ',strip=True)
  if not h.get('id'):
   base=re.sub(r'[^a-z0-9]+','-',text.lower()).strip('-'); anchor=base; n=2
   while anchor in seen: anchor=f'{base}-{n}'; n+=1
   h['id']=anchor; seen.add(anchor)
  headings.append((h['id'],text))
 # Old templates jump from section h2 directly to process h4; repair semantics.
 last=2
 for heading in main.find_all(re.compile('^h[2-6]$')):
  level=int(heading.name[1])
  if level>last+1: level=last+1; heading.name=f'h{level}'
  last=level
 return ''.join(str(c) for c in main.contents),headings

def page_hero(title,subtitle,category='Our expertise',slug=''):
 current=LABELS.get(slug,'Tax notices & audits' if slug=='tax_notice_audit_assesement' else '')
 crumb=f'<a href="/services/">{esc(category)}</a><span aria-hidden="true">/</span><span aria-current="page">{esc(current)}</span>' if current else f'<span aria-current="page">{esc(category)}</span>'
 return f'''<section class="interior-hero"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span>{crumb}</nav><div class="interior-heading"><h1>{esc(title)}</h1><div><p>{esc(subtitle)}</p><a class="text-link" href="/contact/">Discuss your matter {icon('diag')}</a></div></div></div></section>'''

def review_note(slug):
 note=NOTES.get(slug,'This guide preserves information from our existing website. Fees, filing dates, eligibility and legal requirements can change. Confirm the current rules and their application to your circumstances before acting.')
 source='<a href="https://www.fbr.gov.pk/press-release/174151" target="_blank" rel="noopener noreferrer">FBR’s ATL announcement</a>' if slug=='become_tax_filer' else '<a href="https://www.secp.gov.pk/company-formation/registration-of-company/" target="_blank" rel="noopener noreferrer">SECP incorporation guidance</a>' if slug=='company_registration' else '<a href="/contact/">Ask about your circumstances</a>'
 heading='About this firm information' if slug=='about' else 'Before you rely on this guide'
 return f'<aside class="review-note"><h2>{heading}</h2><p>{esc(note)} {source}.</p></aside>'

def article_page(slug,body,headings):
 toc=''.join(f'<li><a href="#{esc(i)}">{esc(t)}</a></li>' for i,t in headings)
 return f'<div class="wrap article-layout"><aside class="article-sidebar"><div class="sidebar-inner"><details class="contents" open><summary>On this page</summary><ol>{toc}</ol></details><div class="sidebar-contact"><h2>Advice for your situation.</h2><p>Talk through your questions with MAS Law Firm.</p><a href="tel:+923327771392">{PHONE}</a><a class="text-link" href="/contact/">Get in touch {icon("diag")}</a></div></div></aside><article class="article-content">{review_note(slug)}{body}<section class="related"><h2>Continue exploring</h2>{link("services","All services & guides")}{link("contact","Speak with MAS Law Firm")}</section></article></div>'

def contact(body):
 # Keep the original service choices, native action, labels and original hours.
 source=BeautifulSoup(body,'html.parser'); form=str(source.find('form'))
 parsed_form=BeautifulSoup(form,'html.parser')
 for a in parsed_form.select('a[href*="wa.me"]'): a.decompose()
 form=str(parsed_form)
 source.find('form').decompose()
 return f'''<section class="wrap contact-layout"><div class="contact-details"><h2>A conversation is<br>a good place to start.</h2><p>Tell us about your tax, registration or legal matter. Choose the way that suits you.</p><dl><div><dt>Call us</dt><dd><a href="tel:+923327771392">{PHONE}</a><small>Within Pakistan: <a href="tel:03327771392">03327771392</a></small></dd></div><div><dt>Write to us</dt><dd><a href="mailto:{EMAIL}">{EMAIL}</a></dd></div><div><dt>WhatsApp</dt><dd><a href="{WA}" target="_blank" rel="noopener noreferrer">Start a conversation {icon('diag')}</a></dd></div><div><dt>Visit the office</dt><dd>Khanpur Road, Opposite UET Taxila Main Gate<br>Tehsil Taxila, District Rawalpindi<br>Punjab, Pakistan<a class="text-link" href="{MAP}" target="_blank" rel="noopener noreferrer">Open directions {icon('diag')}</a></dd></div></dl></div><div class="contact-form-panel" id="enquiry"><h2>How can we help?</h2><p>Share a brief outline and your contact details.</p>{form}<noscript><p>The form opens Formspree when submitted. You can also email or call us directly.</p></noscript></div></section>
 <section class="wrap office-hours"><h2>Plan your visit.</h2><div><h3>Office hours</h3><dl><div><dt>Monday – Friday</dt><dd>9:00 AM – 6:00 PM</dd></div><div><dt>Saturday</dt><dd>10:00 AM – 4:00 PM</dd></div><div><dt>Sunday</dt><dd>Closed</dd></div></dl><p>Hours retained from the existing website. Please call before visiting. Consultations outside regular hours can be discussed by appointment.</p></div></section><details class="wrap preserved-overview"><summary>Our consultation & contact information</summary><div class="article-content">{str(source).replace(form,'')}</div></details>'''

def document(path,title,description,content,noindex=False):
 canonical='/tax_notice_audit_assessment/' if path=='/tax_notice_audit_assesement/' else path
 schema={'@context':'https://schema.org','@type':'LegalService','@id':DOMAIN+'/#firm','name':'MAS Law Firm','url':DOMAIN+'/','logo':DOMAIN+LOGO,'image':DOMAIN+LOGO,'telephone':'+923327771392','email':EMAIL,'address':{'@type':'PostalAddress','streetAddress':'Khanpur Road, Opposite UET Taxila Main Gate','addressLocality':'Taxila','addressRegion':'Punjab','addressCountry':'PK'},'areaServed':'Pakistan'}
 bread={'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':DOMAIN+'/'}]}
 if path!='/': bread['itemListElement'].append({'@type':'ListItem','position':2,'name':title.split('|')[0].strip(),'item':DOMAIN+canonical})
 return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(title)}</title><meta name="description" content="{esc(description)}"><meta name="theme-color" content="#0a233b"><link rel="canonical" href="{DOMAIN+canonical}">{'<meta name="robots" content="noindex,follow">' if noindex else ''}
<meta property="og:type" content="website"><meta property="og:site_name" content="MAS Law Firm"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{DOMAIN+canonical}"><meta property="og:image" content="{DOMAIN+LOGO}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)}"><meta name="twitter:description" content="{esc(description)}"><meta name="twitter:image" content="{DOMAIN+LOGO}">
<script>document.documentElement.classList.add('enhanced');setTimeout(function(){{if(!window.masNavReady)document.documentElement.classList.remove('enhanced')}},3000)</script><link rel="icon" type="image/jpeg" href="{LOGO}"><link rel="preload" href="/assets/design/display.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/design/body.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/assets/design/site.css"><script src="/assets/design/site.js" defer></script><script type="application/ld+json">{json.dumps(schema)}</script><script type="application/ld+json">{json.dumps(bread)}</script></head><body id="top">{header(path)}{content}{footer()}</body></html>'''

def build():
 for doc in ['WEBSITE_REPOSITORY_AUDIT.md','DESIGN_RESEARCH.md','CREATIVE_DIRECTION.md','IMPLEMENTATION_PLAN.md']:
  assert (ROOT/'docs'/doc).exists(), 'Planning gate incomplete'
 (ROOT/'content').mkdir(exist_ok=True)
 (ROOT/'content/pages.json').write_text(json.dumps(ORIGINAL,ensure_ascii=False,indent=2).replace('mastaxlawfirm@gmail.com',EMAIL),encoding='utf-8')
 for data in ORIGINAL:
  filename=data['file']; slug=filename.split('/')[0] if '/' in filename else ''
  path='/'+slug+'/' if slug else '/' if filename=='index.html' else '/'+filename
  body,headings=normalize_content(data['main_html'])
  soup=BeautifulSoup((ROOT/filename).read_text(encoding='utf-8'),'html.parser')
  # Reproducible heroes use the preserved metadata, not an already-generated page.
  subtitle=data['description']; title=TITLES.get(slug,'')
  if filename=='index.html': content=home(body)
  elif slug=='contact': content='<main id="main-content">'+page_hero('Your next step starts here.','A tax question, a business idea, a legal matter. Let’s talk.','Contact')+contact(body)+'</main>'
  elif slug=='services': content='<main id="main-content">'+page_hero('Considered advice.<br>For what comes next.'.replace('<br>',' '),'Explore tax, business and legal support for individuals and businesses across Pakistan.')+'<section class="wrap full-directory"><h2>Find the support you need.</h2>'+directory()+'</section><details class="wrap preserved-overview"><summary>Our approach to business compliance</summary><div class="article-content">'+body+'</div></details></main>'
  elif filename=='404.html': content='<main id="main-content">'+page_hero('Let’s get you back on course.','The page you requested could not be found. Explore our services or contact the firm.','Page not found')+'<section class="wrap error-page"><p class="error-number">404</p><a class="button" href="/">Return to the homepage '+icon()+'</a><div class="article-content">'+body.replace('<h1','<h2').replace('</h1>','</h2>')+'</div></section></main>'
  else:
   if slug=='about': title='Perspective. Purpose. Personal attention.'; subtitle='A tax and legal consultancy in Taxila, supporting individuals and businesses across Pakistan.'
   if filename=='PORTFOLIO_TEMPLATE.html': title='Portfolio template reference'; subtitle='This retained template contains placeholder content. It is not a biography or a statement of MAS Law Firm credentials.'
   category='The firm' if slug=='about' else 'Practical guides' if slug in [s for s,l in GROUPS['Practical guides']] else 'Our expertise'
   content='<main id="main-content">'+page_hero(title or data['title'].split('|')[0],subtitle,category,slug)+article_page(slug,body,headings)+'</main>'
  content=add_section_images(content,filename)
  (ROOT/filename).write_text(document(path,data['title'],data['description'] or subtitle,content,filename in ['404.html','PORTFOLIO_TEMPLATE.html']),encoding='utf-8')
 # Normalize dormant code too; no old contact may resurface.
 for p in (ROOT/'assets/shared').glob('*.js'):
  text=p.read_text(encoding='utf-8'); updated=text.replace('mastaxlawfirm@gmail.com',EMAIL)
  if updated!=text: p.write_text(updated,encoding='utf-8')
 (ROOT/'.nojekyll').touch()
 paths=['/' if d['file']=='index.html' else '/'+d['file'].removesuffix('index.html') for d in ORIGINAL if d['file'] not in ['404.html','PORTFOLIO_TEMPLATE.html','tax_notice_audit_assesement/index.html']]
 (ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+DOMAIN+p+'</loc></url>' for p in paths)+'</urlset>',encoding='utf-8')
 (ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+DOMAIN+'/sitemap.xml\n',encoding='utf-8')
 print('Rendered',len(ORIGINAL),'static HTML files; CNAME preserved.')

def package():
 out=ROOT/'dist'; out.mkdir(exist_ok=True)
 for d in ORIGINAL:
  p=Path(d['file']); (out/p).parent.mkdir(parents=True,exist_ok=True); shutil.copy2(ROOT/p,out/p)
 shutil.copytree(ROOT/'assets',out/'assets',dirs_exist_ok=True)
 for name in ['CNAME','.nojekyll','robots.txt','sitemap.xml',LOGO.lstrip('/')]: shutil.copy2(ROOT/name,out/name)
 print('GitHub Pages static artifact prepared in dist/')

def archive():
 out=ROOT/'artifacts'; out.mkdir(exist_ok=True)
 target=out/'mas-law-firm-github-pages.zip'
 with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for p in sorted((ROOT/'dist').rglob('*')):
   if p.is_file(): z.write(p,p.relative_to(ROOT/'dist').as_posix())
 hashes={name:hashlib.sha256((ROOT/name).read_bytes()).hexdigest() for name in ['CNAME',LOGO.lstrip('/')]}
 for name,digest in hashes.items(): assert hashlib.sha256((ROOT/'dist'/name).read_bytes()).hexdigest()==digest
 checks={'source_and_packaged_match':hashes,'archive_sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'archive_bytes':target.stat().st_size}
 (ROOT/'docs/artifact-checksums.json').write_text(json.dumps(checks,indent=2),encoding='utf-8')
 print('Deployment archive prepared:',target.relative_to(ROOT))

if __name__=='__main__':
 parser=argparse.ArgumentParser(); parser.add_argument('--package',action='store_true'); parser.add_argument('--archive',action='store_true'); args=parser.parse_args(); build()
 if args.package or args.archive: package()
 if args.archive: archive()
