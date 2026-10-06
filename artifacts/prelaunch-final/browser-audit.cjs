const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const zlib = require('node:zlib');
const path = require('node:path');
const root = process.cwd();
const output = path.join(root, 'artifacts/prelaunch-final');
const routes = ['/', '/courses/', '/news/', '/announcements/', '/community/', '/about/', '/research/', '/privacy/', '/courses/cybersecurity-foundations/', '/courses/cybersecurity-foundations/lessons/what-is-cybersecurity/', '/courses/cybersecurity-foundations/checkpoints/introduction-to-cybersecurity/'];
(async () => {
 const browser = await chromium.launch();
 const results = { accessibility: [], responsive: [], performance: [], exceptions: [], metadata: [], network: [] };
 for (const theme of ['light', 'dark']) {
  const context = await browser.newContext({ viewport: { width:390, height:844 }, reducedMotion:'reduce' });
  await context.addInitScript(t => localStorage.setItem('nest-theme', t), theme);
  const page = await context.newPage();
  page.on('pageerror', e => results.exceptions.push({theme, message:e.message}));
  const destinations = new Set();
  page.on('request', r => { if (!r.url().startsWith('http://127.0.0.1:4173')) destinations.add(new URL(r.url()).origin); });
  for (const route of routes) {
   await page.goto('http://127.0.0.1:4173'+route); await page.waitForTimeout(150);
   await page.addScriptTag({path:require.resolve('axe-core')});
   const axe = await page.evaluate(async () => {const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length}))};});
   results.accessibility.push({route,theme,...axe});
   if(theme==='light') results.metadata.push({route,...await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name="description"]')?.content,canonical:document.querySelector('link[rel="canonical"]')?.href,robots:document.querySelector('meta[name="robots"]')?.content,ogImage:document.querySelector('meta[property="og:image"]')?.content,h1:document.querySelectorAll('h1').length}))});
   for(const width of [320,375,430,768,1024,1440,1920]) {
    await page.setViewportSize({width,height:width<768?844:900});
    results.responsive.push({route,theme,width,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+2,scrollWidth:document.documentElement.scrollWidth}))});
   }
   await page.setViewportSize({width:390,height:844});
  }
  results.network.push({theme,externalOrigins:[...destinations]});
  await page.goto('http://127.0.0.1:4173/courses/cybersecurity-foundations/checkpoints/introduction-to-cybersecurity/');
  await page.evaluate(()=>{Storage.prototype.setItem=()=>{throw new DOMException('Storage blocked','SecurityError');};});
  await page.getByRole('button',{name:'Start checkpoint'}).click();
  for(let i=0;i<3;i++){await page.locator('.quiz-choice').first().click();await page.getByRole('button',{name:i===2?'View results':'Next question'}).click();}
  results.exceptions.push({theme,case:'blocked storage',resultsVisible:await page.locator('.quiz-results').count(),questionVisible:await page.locator('.quiz-question').count()});
  await page.screenshot({path:path.join(output, 'checkpoint-storage-'+theme+'.png')});
  await context.close();
 }
 for(const route of ['/', '/courses/', '/about/']) {
  for(let run=1;run<=3;run++) {
   const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:1});
   await context.addInitScript(()=>{window.__audit={lcp:0,cls:0};new PerformanceObserver(l=>{for(const e of l.getEntries())window.__audit.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__audit.cls+=e.value;}).observe({type:'layout-shift',buffered:true});});
   const page=await context.newPage();const cdp=await context.newCDPSession(page);
   await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
   await page.goto('http://127.0.0.1:4173'+route);await page.waitForTimeout(6500);
   results.performance.push({route,run,...await page.evaluate(()=>({...window.__audit,resources:performance.getEntriesByType('resource').map(r=>({name:r.name,transfer:r.transferSize,bytes:r.encodedBodySize,type:r.initiatorType})),dom:document.querySelectorAll('*').length}))});
   await context.close();
  }
 }
 const files=[];function walk(d){for(const item of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,item.name);if(item.isDirectory())walk(p);else files.push(p);}}
 walk(path.join(root,'out'));results.assets={totalBytes:files.reduce((s,p)=>s+fs.statSync(p).size,0),js:files.filter(p=>p.endsWith('.js')).map(p=>({path:path.relative(root,p),bytes:fs.statSync(p).size,gzip:zlib.gzipSync(fs.readFileSync(p)).length})),largestImages:files.filter(p=>/\.(webp|png|jpg|jpeg)$/.test(p)).map(p=>({path:path.relative(root,p),bytes:fs.statSync(p).size})).sort((a,b)=>b.bytes-a.bytes).slice(0,12)};
 fs.writeFileSync(path.join(output,'browser-results.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify({axeRuns:results.accessibility.length,violations:results.accessibility.filter(r=>r.violations.length).map(r=>({route:r.route,theme:r.theme,ids:r.violations.map(v=>v.id)})),overflows:results.responsive.filter(r=>r.overflow),exceptions:results.exceptions,performance:results.performance.map(({route,run,lcp,cls,dom})=>({route,run,lcp,cls,dom})),assets:results.assets}));
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
