(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function t(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(i){if(i.ep)return;i.ep=!0;const a=t(i);fetch(i.href,a)}})();class B{constructor(e,t,o,i=0){this.container=e,this.items=t,this.onCardClick=o,this.activeIndex=i,this.totalItems=t.length,this.touchStart=null,this.touchEnd=null,this.dragOffset=0,this.isDragging=!1,this.autoPlayTimer=null,this.cardElements=[],this.init()}init(){this.container.innerHTML="",this.container.style.position="relative",this.container.style.width="100%",this.container.style.height="100%",this.container.style.overflow="hidden",this.container.style.perspective="1000px",this.container.style.display="flex",this.container.style.alignItems="center",this.container.style.justifyContent="center",this.items.forEach((e,t)=>{const o=document.createElement("div");o.className="carousel-card",o.style.position="absolute";const i="min(65vh, 80vw)";o.style.width=i,o.style.height=i,o.style.cursor="pointer",o.style.transition="all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)",o.style.transformOrigin="center center",o.innerHTML=`
                <div class="card-inner" style="
                    width: 100%; 
                    height: 100%; 
                    background: #000;
                    border-radius: 4px; 
                    overflow: hidden; 
                    display: flex; 
                    flex-direction: column;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 
                        0 0 0 1px rgba(255, 255, 255, 0.05), /* Inner rim */
                        0 10px 30px rgba(0, 0, 0, 0.8), /* Deep shadow */
                        0 0 20px rgba(255, 255, 255, 0.1); /* Subtle outer glow */
                ">
                    <div class="card-img-wrapper" style="
                        flex: 1; 
                        overflow: hidden; 
                        background: #000; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        padding: 0;
                        position: relative;
                    ">
                        
                        <img src="${e.image}" alt="${e.name}" style="
                            width: 100%; 
                            height: 100%; 
                            object-fit: cover; /* Full bleed as requested */
                            display: block;
                        " />
                        
                        <!-- Tactile Overlay Glare -->
                        <div style="
                            position: absolute;
                            inset: 0;
                            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
                            pointer-events: none;
                            mix-blend-mode: overlay;
                        "></div>
                    </div>
                    
                    <div class="card-meta" style="
                        padding: 15px; 
                        text-align: center;
                        position: absolute;
                        bottom: -50px; 
                        left: 0;
                        right: 0;
                        transition: opacity 0.4s;
                        opacity: 0; 
                    ">
                        <h3 style="
                            margin:0; 
                            font-family:'Space Mono'; 
                            font-size: 1.1rem; 
                            color: #fff; 
                            letter-spacing: 1px;
                            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
                        ">${e.name}</h3>
                    </div>
                </div>
            `,o.addEventListener("click",()=>{this.getDiff(t)===0?this.onCardClick&&this.onCardClick(e):this.setActiveIndex(t)}),this.container.appendChild(o),this.cardElements.push({element:o,index:t})}),this.createControls(),this.addEventListeners(),this.updateStyles(),this.startAutoPlay()}createControls(){const e=document.createElement("button");e.innerHTML='<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>',e.style.cssText=`
            position: absolute; left: 20px; top: 50%; transform: translateY(-50%); z-index: 30;
            background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; transition: color 0.3s;
        `,e.addEventListener("mouseenter",()=>e.style.color="#fff"),e.addEventListener("mouseleave",()=>e.style.color="rgba(255,255,255,0.3)"),e.addEventListener("click",o=>{o.stopPropagation(),this.prev()});const t=document.createElement("button");t.innerHTML='<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>',t.style.cssText=`
            position: absolute; right: 20px; top: 50%; transform: translateY(-50%); z-index: 30;
            background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; transition: color 0.3s;
        `,t.addEventListener("mouseenter",()=>t.style.color="#fff"),t.addEventListener("mouseleave",()=>t.style.color="rgba(255,255,255,0.3)"),t.addEventListener("click",o=>{o.stopPropagation(),this.next()}),this.container.appendChild(e),this.container.appendChild(t)}addEventListeners(){window.addEventListener("keydown",e=>{this.container.offsetParent!==null&&(e.key==="ArrowLeft"&&this.prev(),e.key==="ArrowRight"&&this.next())}),this.container.addEventListener("touchstart",e=>{this.touchEnd=null,this.touchStart=e.touches[0].clientX,this.isDragging=!0,this.dragOffset=0,this.stopAutoPlay(),this.container.style.transition="none",this.cardElements.forEach(t=>t.element.style.transition="none")},{passive:!0}),this.container.addEventListener("touchmove",e=>{if(!this.touchStart)return;const t=e.touches[0].clientX;this.touchEnd=t,this.dragOffset=t-this.touchStart,this.updateStyles()},{passive:!0}),this.container.addEventListener("touchend",()=>{if(this.isDragging=!1,this.cardElements.forEach(t=>t.element.style.transition="all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)"),!this.touchStart||!this.touchEnd){this.dragOffset=0,this.updateStyles(),this.startAutoPlay();return}const e=this.touchStart-this.touchEnd;this.dragOffset=0,e>50?this.next():e<-50?this.prev():this.updateStyles(),this.touchStart=null,this.touchEnd=null,this.startAutoPlay()})}getDiff(e){let t=e-this.activeIndex;return t>this.totalItems/2&&(t-=this.totalItems),t<-this.totalItems/2&&(t+=this.totalItems),t}updateStyles(){this.cardElements.forEach(({element:e,index:t})=>{const o=this.getDiff(t);let i=0,a=0,s="translateX(-50%) scale(0.8)",r="blur(5px) grayscale(100%)",d="none";if(o===0){i=20,a=1,d="auto",r="blur(0px) grayscale(0%)",e.style.left="50%",s=`translateX(calc(-50% + ${this.dragOffset}px)) scale(1)`;const l=e.querySelector(".card-meta");l&&(l.style.opacity="1")}else if(o===-1){i=10,a=.4,d="auto",r="blur(2px) brightness(0.5)",e.style.left="50%",s=`translateX(calc(-130% + ${this.dragOffset}px)) scale(0.85) rotateY(15deg)`;const l=e.querySelector(".card-meta");l&&(l.style.opacity="0")}else if(o===1){i=10,a=.4,d="auto",r="blur(2px) brightness(0.5)",e.style.left="50%",s=`translateX(calc(30% + ${this.dragOffset}px)) scale(0.85) rotateY(-15deg)`;const l=e.querySelector(".card-meta");l&&(l.style.opacity="0")}else{e.style.left="50%";const l=e.querySelector(".card-meta");l&&(l.style.opacity="0")}e.style.zIndex=i,e.style.opacity=a,e.style.transform=s,e.style.filter=r,e.style.pointerEvents=d})}setActiveIndex(e){this.activeIndex=(e+this.totalItems)%this.totalItems,this.updateStyles()}next(){this.setActiveIndex(this.activeIndex+1)}prev(){this.setActiveIndex(this.activeIndex-1)}startAutoPlay(){this.stopAutoPlay(),this.totalItems>1&&(this.autoPlayTimer=setInterval(()=>{this.next()},4e3))}stopAutoPlay(){this.autoPlayTimer&&clearInterval(this.autoPlayTimer)}destroy(){this.stopAutoPlay(),this.container.innerHTML=""}}const c={welcome:{title:"Welcome to Cypherville Ordinals",content:"A mysterious world inscribed on the Bitcoin blockchain forever. Cypherville is inhabited by 16 strange creatures that fight for the future of Bitcoin. Cypherville is in a state of constant war between the good and the bad, and it is up to you to figure out who is who. As you dive deeper into this world, you will find yourself in the midst of a tumultuous battle. The creatures of Cypherville fight relentlessly, using their unique abilities to try to gain the upper-hand in the war. Some creatures have special powers that allow them to take control of the battlefield, while others rely on brute strength to overpower their opponents. You will also discover a unique set of social rules and customs that exist in Cypherville. The creatures interact and combat with one another according to intricate, yet mysterious rules. Your mission is to safeguard the future of Bitcoin. Good luck!"},longevity:{title:"Longevity Concept",content:["Unlike many early Bitcoin ordinal collections, Cypherville takes a different approach to the inscription process. Rather than inscribing all pieces (creatures) of the collection within a short range of inscription numbers and then selling them via auction or other means later, each piece is inscribed exclusively on-demand by the Oracle* as new collectors show up. This process will last until the 16 pieces are sold out.","One of the most exciting aspects of the longevity concept is that it allows for the organic growth of the collection over time. The collection itself is not in a rush to sell out, which provides more options for new collectors without affecting the existing pieces that have already been inscribed with lower inscription numbers. As a result, existing pieces are effectively aging relative to the ones that remain to be revealed. The already immortalized pieces are making a statement of longevity and persistence through time, both relative to the other pieces in the collection and the Bitcoin blockchain itself.","This approach adds an intriguing texture to the rarity of each piece in the collection, while also allowing for unique interactions by the collectors. The flexibility of this approach lets the collectors engage with the Cypherville collection in their own way, whether by collecting older, lower-inscription pieces or by inscribing fresh pieces for the thrill of the drill, until the 16 pieces are sold out.","New collectors who are interested in acquiring a piece from the Cypherville collection have two options. The first option is to request to inscribe the next creature in the collection for 0.069 BTC directly to the Oracle via the official Cypherville Twitter DM. The second option is to acquire an existing, and older creature on the secondary market. Pieces that are already inscribed with lower inscription numbers are generally found for a premium on the secondary market, or they are simply not listed for sale. This is because Cypherville holders tend to be long-term-oriented, pure art collectors attracted by the conceptual and visual art presented. This could be explained by the fact that Cypherville has no roadmap, no utility, and no promises whatsoever other than the art itself (16 creatures) and occasional storytelling. It's worth noting that any storytelling pertaining to Cypherville is at the discretion of the Oracle.","Cypherville launched early, with inscription #12136 on Feb 7th, 2023, at a time when there was no marketplace available. As with most early ordinals projects, Cypherville dealt primarily over-the-counter (OTC) to early collectors. To maintain its focus on exclusivity and unique inscription process, the Oracle continues to use the OTC method to this day. This personalized approach creates proximity between the artist and collectors, while also preserving the original tradition of the collection.","During the purchase process for creatures #1 through #8, collectors were given the option of choosing a creature from a blurred screenshot or leaving the choice of the creature to the Oracle. For creatures #9 and beyond, collectors are invited to identify their two favorite creatures from the existing collection in order to determine which creature the Oracle will inscribe next.","In conclusion, the longevity concept is a simple yet clever approach to add texture to the artwork presented while creating a more complex set of interaction between the artist, the collectors and the collection itself. Cypherville was designed with longevity in mind in order to persist organically through time and offer a fine modern art experience never seen before.","*The Oracle refers to the artist Lemonhaze in the context of Cypherville"]},tales:[{id:"1.01",title:"Rumors of Ordinals",content:["It was a hangover day in Cypherville, and the creatures were still recovering from the previous night's truce, a rare moment of peace in their constant state of war. The streets were quiet, and the sounds of battle had temporarily subsided. You, a newcomer to this world, were tasked with safeguarding the future of Bitcoin, a valuable commodity in this dystopian society.","As you roamed the streets, taking in the sights of the strange and varied creatures that inhabited this world, you couldn't help but feel a sense of unease. You had heard rumors of the dangers that lurked in Cypherville, and you were well aware of the wars that raged between the good and the bad.","You soon stumbled upon a group of creatures that had gathered in the center of town. They were discussing the recent events and rumors of a powerful weapon, called Ordinals, that had fallen into the hands of one of the factions in the war. This weapon, if used correctly, could tip the balance of power and determine the outcome of the war.","You quickly realized that you would have to navigate this dangerous world with caution if you wanted to protect the future of Bitcoin. The creatures of Cypherville fought relentlessly, using their unique abilities to try to gain the upper-hand in the war, and you would have to use all your wits to survive.","You took a deep breath and steeled yourself for the challenges ahead. The future of Bitcoin lay in your hands, and you were determined to do whatever it took to protect it. The hangover day had come and gone, and now it was time to dive into the tumultuous battles of Cypherville."]},{id:"1.02",title:"The First Structures",content:["As the sun rose over Cypherville, you felt a sense of calm wash over you. It was a beautiful day, and for once, the sounds of battle were nowhere to be heard. Instead, you heard the sound of construction, as the creatures of were hard at work building new structures to accommodate the influx of explorers looking for the infamous Ordinals.","As you roamed the streets, you couldn't help but feel a sense of excitement at the innovation and progress being made in the town. New buildings were being erected, each one more impressive than the last. Some were simple and functional, while others were grand and ornate, showcasing the unique styles and personalities of the creatures who built them.","You saw creatures of all shapes and sizes working together to bring their vision to life. They used their unique abilities to design and construct these new structures, each one a testament to their ingenuity and creativity.","You were amazed at how quickly the town was growing and changing. It was clear that the creatures of Cypherville were adapting to the new influx of explorers, and were eager to welcome them into their world.","As you continued to explore, you came across a group of creatures who were discussing their plans for the future. They spoke of new technologies and innovations that would improve the lives of all who lived in Cypherville. They spoke of a world where peace and progress were valued over war and destruction.","You realized that while there were still dangers and challenges ahead, there was also hope and potential for a brighter future. The creatures of Cypherville were hard at work building that future, and you were honored to be a part of their community."]},{id:"1.03",title:"Dust to Dust",content:["As the dust settled over Cypherville, there was a palpable sense of relief in the air. The creatures had finally emerged victorious from the war, and the town was slowly returning to a state of normalcy. The sounds of construction had given way to the familiar sounds of daily life, and the creatures were once again going about their business.","But even as the town returned to normal, there was a sense of unease that lingered. Rumors had begun to spread about the arrival of new creatures in town, creatures that were unlike any that the town had ever seen before. These new arrivals were shrouded in mystery, and no one knew quite what to make of them.","At first, the creatures of Cypherville welcomed the newcomers with open arms. They were eager to learn about these strange and exotic creatures, and to show them the ways of their town. But as time passed, tensions began to rise. The new creatures had their own ways of doing things, and their arrival threatened to upset the delicate balance that had been established in the town.","As the days went on, the new creatures began to reveal their true nature. They were not here to befriend the creatures of Cypherville; they were here to take over. They had their own agenda, and they would stop at nothing to achieve their goals.","The creatures of Cypherville were caught off guard. They had grown complacent in their victory, and had never expected to face a threat like this. But as they realized the true nature of the new arrivals, they began to rally together. They drew on their unique abilities and strengths, and prepared to face the threat head-on.","And so, a new battle began to rage in the streets of Cypherville. The creatures fought fiercely, using their wits and their strength to defend their town and their way of life. It was a battle that would test them to their limits, but they were determined to emerge victorious.","As the sun set over Cypherville, the creatures could feel the tides turning. They had pushed back the new arrivals, and had reclaimed their town. But even as they celebrated their victory, they knew that this was only the beginning. The arrival of the new creatures had changed everything, and the town would never be the same. The creatures of Cypherville would have to remain vigilant, ready to face whatever challenges lay ahead, in order to protect their way of life and the future of Bitcoin."]},{id:"1.04",title:"Sunset Before Darkness",content:["As the Oracle looked upon the dystopian landscape of Cypherville, he felt a deep sorrow within his heart. He had witnessed the rise and fall of many civilizations, and the buzzing wars had only reinforced his belief that patience was a virtue that was all too often overlooked. In his haste to conquer the world the Oracle had lost sight of what was truly important. He had become obsessed.","The creatures that the Oracle had created were not immune to this obsession either. They too had become caught up in the rush, becoming twisted and corrupted by the toxic atmosphere of the world.","With a heavy heart, the Oracle would step back and watch over them. He knew that true progress could only be made by those who were willing to take their time and appreciate the journey, rather than rushing to the destination.","And so, the Oracle left a final message: be patient, dear creatures. Take the time to appreciate what you have, to savor the moments, and to strive for excellence in all that you do. For only then will you truly flourish, and the world will be a better place for it."]},{id:"2.01",title:"The Long Road Ahead",content:["As the weeks went by, it became apparent that the Ordinals weapon was both a blessing and a curse for the creatures of Cypherville. On one hand, it had brought them together and provided them with a powerful tool to advance their town and the future of Bitcoin. On the other hand,there were some individuals who were misusing it and risking the safety of everyone.","The creatures who had embraced the true spirit of Bitcoin and the core values of Cypherville were appalled by these rogue beings who were blindly repeating the mistakes of the past. They knew that the future of Bitcoin depended on their ability to use the Ordinals weapon responsibly and with care.","The original creatures of Cypherville refused to follow the path of reproducing the weapons of others and risking the safety of their town and Bitcoin. Instead, they stuck to their principles and found a way to tackle the situation without compromising their values. They were loud and clear about doing the right thing, and their actions inspired others to do the same. Though the road ahead may be long, the original creatures of Cypherville remain steadfast in their commitment to safeguarding the future of Bitcoin.","It wasn't an easy task, and there were setbacks along the way, but the creatures persevered. They knew that the road ahead of them was long and challenging, but they also knew that they had the determination and the spirit to overcome any obstacle.","And so, they continued to work tirelessly to safeguard the future of Bitcoin and ensure that Cypherville remained a beacon of hope and progress in the world of Bitcoin. The creatures knew that they were just getting started, and they were ready to face whatever challenges came their way. With their unwavering commitment to the core values of Bitcoin, they knew that they would find their way home and pave the way for a brighter future for all."]},{id:"2.02",title:"The Race",content:["As beings from all corners of the galaxy began to settle on Bitcoin, the race to be among the first 1 million residents became more intense. The luxury vessel maker, Bugatti, was one of the latest to lay its eggs using the powerful Ordinals weapon.","As the town of Cypherville continued its process, it became a hub for the brave and curious ones, those who were not afraid to take risks and explore new frontiers. The new settlers brought with them a wealth of knowledge and experiences that contributed to the unique tapestry of the town.","Despite the challenges of building a new civilization on Bitcoin, the creatures of Cypherville persevered, driven by the promise of a better future. They worked tirelessly to create a thriving community that would serve as a beacon of hope for others.","Amidst the bustling activity of the town, rumors began to circulate of a secret society that operated in the shadows, wielding immense power and knowledge. Whispers of their existence spread like wildfire, and many wondered what secrets they held and what their true intentions were.","But despite the mystery and intrigue, the creatures of Cypherville remained focused on their goal of building a better future for themselves and their fellow settlers. And as they looked towards the horizon, they knew that the possibilities were endless and that anything was possible in this strange and wondrous new world."]},{id:"2.03",title:"The Chosen Ones",content:["As the population of Bitcoin reached 1 million, the 16 creatures of Cypherville stood out amongst the crowd. These creatures, unlike the others, had an air of mystery and uniqueness about them. Their participation in the war for the Ordinals weapon had left an indelible mark on the town.","Some whispered that these 16 creatures held the key to unlocking the future of Bitcoin, while others believed that they were the chosen ones, destined for greatness. Their movements and actions were closely watched by the other residents, who knew that there was something special about them.","As the days went by, it became apparent that the 16 creatures were more than just Bitcoin residents. They possessed an intelligence and foresight that surpassed the other residents, and their contributions to the town were invaluable. They seemed to have an innate understanding of the inner workings of Bitcoin and the Ordinals weapon, and their insights and innovations pushed the town forward into uncharted territories.","As the rest of the residents looked on in awe and admiration, the 16 creatures remained humble and unassuming, content to continue their work behind the scenes. Some even whispered that they were not of this world, but had come from somewhere far beyond, with a purpose that only they knew.","And so, the 16 creatures continued to play their part in the future of Cypherville, with their mysterious ways and enigmatic presence. Their contributions and poise would ensure that the town and Bitcoin were safeguarded for generations to come, and their legacy would never be forgotten."]},{id:"2.04",title:"An Invitation to the Unknown",content:["As the sun sets on Cypherville, a new breeze begins to stir. It brings with it the scent of change and the promise of a fresh start. For too long, the creatures of Cypherville have lived in the shadows, struggling to make a life in a world that often seemed hostile to their dreams.","But now, there is a new horizon ahead, a beacon of hope that promises to bring new life and vitality to the city. The Oracle whispers of a new way of living, one that will break free from the old constraints and usher in a new era of freedom and possibility.","For the first time in a long while, the creatures of Cypherville can breathe deeply, filling their lungs with the sweet scent of possibility. With each passing day, the horizon draws closer, promising to bring with it a world that is full of wonder and mystery.","But for now, the creatures of Cypherville must wait and dream, savoring the sweet taste of anticipation and looking forward to the day when the new era begins. And so, with a renewed sense of hope and purpose, they set about preparing for the future, trusting in the Oracle's words and the promise of a brighter tomorrow."]}],techniques:{title:"Techniques & Process",content:["Cypherville's art is created using an AI-powered CLIP-Guided Diffusion (Coherent) model. This process involves using multiple sets of advanced prompts for each piece, which the AI processes with the longest available iteration. Each piece takes between 25 minutes and up to 3 hours to generate. The pieces that take up to 3 hours are processed multiple times with additional prompt tweaks to target different results, resulting in longer processing times.","The work initially involved a fair share of prompt experimentation, followed by optimization and, most importantly, curation. I believe that with AI art, the curation process is one of the most important parts of the creation process. It allows me to integrate myself into the artwork beyond the technical aspects and truly claim the work as my own once I connect with the vision. Curation is a way to distinguish myself from other artists by making a strong statement through my unique style."]},creativeProcess:{title:"Creative Process",content:["Where did it all begin? I created the art for Cypherville between May and June 2022. My initial goal was to create a poster for a fictional sci-fi/fantasy movie as an experimental project. It was odd considering I'm not usually a fan of sci-fi, but that's what I wanted to do given I had recently watched a movie by a famous producer that inspired me, and I found the task to be a challenging one. So I decided to take on the challenge for myself. Why not?",`What happened, however, is that creating with AI can result in cool and unexpected outcomes that do not always align with the artist's original intention or vision. So, I became fixated on achieving my desired outcome, rather than accepting whatever the AI generated. My goal was to make the AI work for me, not the other way around. After 7-10 days of experimentation, I created my first robot, now known as the creatures of type "Cypher". I was so thrilled with the results that I spent the next 15-20 days developing more characters purely for my own enjoyment. However, since I make art as a means of escaping from myself and my life, eventually the novelty wore off, and the dopamine rush subsided to the point where I moved on with my life and left the artwork untouched in a folder with no further intention. That's how the visual aspect of Cypherville came to be.`,"After the ordinals protocol arrived in early February 2023, I found myself swept up in the craze with everything happening fast. While I always hesitated to publish my art on Ethereum due to ideological reasons, I couldn't resist the idea of having my art truly on-chain, on the best chain of all, namely - Bitcoin. I had a few other artwork that I was considering publishing, but when the concept of Cypherville: Tales of Bitcoin maximalism struck me, I went all-in.",'The name "Cypherville" derives from the word "cypherpunk," an integral part of the Bitcoin ethos. The Tales of Cypherville (storytelling) were inspired by the fact that I had always imagined these creatures as being part of a movie, so making stories involving them felt natural. Furthermore, since the art had been created some time ago, I felt that adding storytelling was a good way to introduce new ideas and references to current events. Finally, the longevity concept, which is unique to Cypherville and specific to the ordinals protocol, came from the desire to keep the mystery by not revealing all the pieces of the collection at once and to offer a unique experience to collectors.',"What I like most about Cypherville is that it embodies how I see my own creative process in general. I don't force or impose creation on myself; instead, I let it come to me naturally when I need and feel it. This collection truly captures the essence of how I perceive my art, as something that follows, evolves, and grows with me over time. Sometimes, there are long dormant periods between the seed idea and the publication of the final work, during which I need to live my life to find the missing pieces of the puzzle. It is only then that I can truly understand what the art means to me and allow the vision to find me akin to the Cypherville universe as we know it today."]}};let C=[],v=[],h=null,T=null,p="slideshow",g=null;const O=document.querySelector("#app");function A(){O.innerHTML=`
    <!-- Top Navigation (Hidden on Landing) -->
    <nav class="global-nav" id="global-nav" style="transform: translateY(-100%);">
        <div class="nav-group left">
            <button class="nav-item" id="nav-cypherville">CYPHERVILLE</button>
            <span class="nav-divider">|</span>
            <button class="nav-item" id="nav-deville">DEVILLE</button>
        </div>
        <div class="nav-group center">
            <button class="nav-item" id="nav-intro">INTRO</button>
            <span class="nav-divider">|</span>
            <button class="nav-item" id="nav-history">HISTORY</button>
            <span class="nav-divider">|</span>
            <button class="nav-item" id="nav-tales">TALES</button>
        </div>
        <div class="nav-group right">
            <button class="nav-item active" id="nav-slideshow">SLIDESHOW</button>
            <span class="nav-divider">|</span>
            <button class="nav-item" id="nav-grid">GRID</button>
        </div>
        <button class="mobile-view-toggle" id="mobile-view-toggle">
            <span id="mobile-view-icon">▦</span>
        </button>
    </nav>

    <!-- Dual Landing Screen -->
    <div class="landing-screen" id="landing-screen">
      <div class="panel panel-left" id="panel-cypherville">
        <div class="panel-content">
          <h1>CYPHERVILLE</h1>
          <p>The Guardians</p>
          <button class="explore-btn" id="explore-cypherville">EXPLORE</button>
        </div>
      </div>
      <div class="panel panel-right" id="panel-deville">
        <div class="panel-content">
          <h1>DEVILLE</h1>
          <p>The Architects</p>
          <button class="explore-btn" id="explore-deville">EXPLORE</button>
        </div>
      </div>
    </div>

    <!-- Main Content (Hidden initially) -->
    <div class="main-content" id="main-content" style="display: none;">
      <div class="hero-section">
        <div class="slideshow-container">
          <div class="slideshow" id="slideshow"></div>
        </div>
        <div class="footer">Cypheville &copy; by Lemonhaze</div>
      </div>
    </div>

    <!-- Grid View -->
    <div class="grid-view" id="grid-view" style="display: none;">
      <div class="gallery" id="gallery"></div>
      <div class="footer grid-footer">Cypheville &copy; by Lemonhaze</div>
    </div>

    <!-- Modal -->
    <div class="modal" id="modal">
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <button class="modal-close" id="modal-close">×</button>
        <div class="modal-body" id="modal-body"></div>
      </div>
    </div>

    <!-- History Overlay -->
    <div class="history-overlay" id="history-overlay">
      <div class="history-backdrop"></div>
      <div class="history-content">
        <button class="history-close" id="history-close">×</button>
        <div class="history-container">
          <div class="history-text-content" id="history-text-content"></div>
        </div>
      </div>
    </div>
  `,M(),q()}function M(){const n=document.createElement("style");n.textContent=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

    :root {
      --primary: #888;
      --primary-bright: #fff;
    }

    * {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background: #000;
      color: #fff;
      overflow-x: hidden;
    }

    /* Global Navigation */
    .global-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 40px;
        z-index: 90; /* Below landing (100) but above content */
        background: linear-gradient(to bottom, rgba(0,0,0,0.95), transparent);
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none; /* Let clicks pass through if invisible */
    }

    .nav-group.center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .global-nav.visible {
        transform: translateY(0) !important;
        pointer-events: auto;
    }

    .nav-group {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .nav-item {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.4);
        font-family: 'Space Mono', monospace;
        font-size: 0.8rem;
        cursor: pointer;
        transition: color 0.3s, text-shadow 0.3s;
        padding: 8px 0;
        letter-spacing: 0.1em;
    }

    .nav-item:hover {
        color: rgba(255, 255, 255, 0.8);
    }

    .nav-item.active {
        color: #fff;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }

    .nav-divider {
        color: rgba(255, 255, 255, 0.2);
        font-family: 'Space Mono', monospace;
    }

    /* Landing Split Screen */
    .landing-screen {
      position: fixed;
      inset: 0;
      display: flex;
      z-index: 100;
      background: #000;
      padding: 40px;
      gap: 40px;
      transition: transform 0.8s cubic-bezier(0.85, 0, 0.15, 1);
    }

    .panel {
      flex: 1;
      height: 100%;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      background-color: #000;
      background-size: 102%; /* Small overscan to hide edge pixel gaps */
      background-position: center;
      background-repeat: no-repeat;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1), /* Sharp edge */
                  0 20px 50px rgba(0,0,0,0.5);
    }

    .panel::after {
      content: '';
      position: absolute;
      top: -10px; left: -10px; right: -10px; bottom: -10px;
      background: linear-gradient(to bottom, 
        rgba(0,0,0,0.2) 0%, 
        transparent 20%, 
        transparent 60%, 
        rgba(0,0,0,0.9) 100%);
      box-shadow: inset 0 0 120px rgba(0,0,0,0.8);
      transition: opacity 0.4s;
      z-index: 1;
      pointer-events: none;
    }

    .panel-content {
      position: relative;
      z-index: 2;
      text-align: center;
      transition: transform 0.4s;
    }

    .panel:hover .panel-content { transform: scale(1.1); }

    .panel h1 {
      font-family: 'Space Mono', monospace;
      font-size: clamp(1.5rem, 5vw, 3.5rem);
      letter-spacing: 0.1em;
      margin-bottom: 10px;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
      white-space: nowrap;
    }

    .panel p {
      font-size: 0.875rem;
      letter-spacing: 0.5em;
      text-transform: uppercase;
      opacity: 0.6;
    }

    .explore-btn {
        margin-top: 40px;
        padding: 18px 48px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        font-family: 'Space Mono', monospace;
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.3em;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        opacity: 0.9;
        border-radius: 2px;
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .panel:hover .explore-btn {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0,0,0,0.4);
    }

    .explore-btn:hover {
        background: rgba(255, 255, 255, 0.25) !important;
        color: #fff !important;
        border-color: rgba(255,255,255,0.6) !important;
        transform: translateY(-8px) scale(1.02) !important;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4) !important;
    }

    /* Main Content */
    .hero-section {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .slideshow-container {
      flex: 1;
      position: relative;
    }

    .slideshow {
      height: 100%;
      width: 100%;
      position: relative;
    }

    /* Grid View */
    .grid-view {
      padding: 120px 40px 40px; /* More top padding for nav */
      min-height: 100vh;
      display: none;
    }

    .gallery {
      max-width: 1600px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 32px;
    }

    .portrait-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    .portrait-card:hover {
      transform: translateY(-8px);
      border-color: var(--primary);
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }

    .portrait-img-wrapper { aspect-ratio: 1; width: 100%; }
    .portrait-img { width: 100%; height: 100%; object-fit: cover; }
    .portrait-info { padding: 20px; }
    
    .portrait-name {
        font-family: 'Space Mono', monospace;
        font-weight: 700;
        margin-bottom: 4px;
    }
    
    .portrait-id {
         font-family: 'Space Mono', monospace;
         font-size: 0.7rem;
         opacity: 0.5;
         text-transform: uppercase;
    }

    /* Cyber-Noir Modal Dossier */
    .modal {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    .modal.active { display: flex; }

    /* CITY ORACLE TERMINAL */
    .terminal-toggle {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: #000;
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 12px; /* Square with rounded corners (matches View Toggle style) */
        display: none; /* Hidden by default */
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 2000;
        box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
    }
    .terminal-toggle.visible {
        display: flex;
        opacity: 1;
        transform: translateY(0);
    }
    .terminal-toggle:hover {
        transform: scale(1.05); /* Subtle scale for square */
        box-shadow: 0 0 25px rgba(255, 255, 255, 0.3);
        border-color: #fff;
    }
    .terminal-toggle svg, .terminal-toggle img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 12px; /* Match parent */
    }
    
    .city-terminal {
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 350px;
        height: 500px;
        background: rgba(5, 5, 5, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.3);
        z-index: 2000;
        display: none;
        flex-direction: column;
        font-family: 'Space Mono', monospace;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
    }

    .city-terminal.active { display: flex; }
    
    .terminal-header {
        padding: 10px 15px;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        font-size: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        letter-spacing: 0.1em;
    }
    .terminal-close { cursor: pointer; }
    
    .terminal-output {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        color: #fff;
        font-size: 0.85rem;
        line-height: 1.4;
    }
    
    .terminal-msg { margin-bottom: 15px; }
    .terminal-msg.user { color: #fff; text-align: right; }
    .terminal-msg.oracle { color: #a0a0a0; text-shadow: none; }
    
    .terminal-input-area {
        padding: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
    }
    .terminal-prompt { color: #fff; margin-right: 10px; }
    .terminal-input {
        background: transparent;
        border: none;
        color: #fff;
        font-family: 'Space Mono', monospace;
        flex: 1;
        outline: none;
        font-size: 0.9rem;
    }
    .terminal-send-btn {
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        opacity: 0;
        transition: all 0.2s ease;
        padding: 0 5px;
        font-size: 1.2rem;
        pointer-events: none;
        transform: translateX(-10px);
    }
    .terminal-send-btn.visible {
        opacity: 1;
        pointer-events: all;
        transform: translateX(0);
    }


    @media (max-width: 600px) {
        .city-terminal {
            width: 100%;
            height: 100%;
            bottom: 0;
            right: 0;
            border: none;
        }
        .terminal-toggle { bottom: 20px; right: 20px; }
        
        /* Fix iOS Zoom: Font size must be 16px */
        .terminal-input { font-size: 16px; }
        
        /* Ensure button has space */
        .terminal-send-btn { 
            padding: 10px 15px; /* Larger hit area */
            font-size: 1.4rem;
            flex-shrink: 0; /* Prevent crushing */
        }
        .terminal-input-area {
            padding-right: 5px; /* Adjust padding */
        }
    }
    
    .modal-backdrop { 
        position: absolute; 
        inset: 0; 
        background: #000;
        transition: opacity 0.5s ease;
    }

    .modal-content {
      position: relative;
      background: rgba(10, 10, 10, 0.65);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0;
      max-width: 1400px;
      width: 95%;
      height: 90vh;
      overflow: hidden;
      box-shadow: 0 0 100px rgba(0, 0, 0, 0.9);
      z-index: 2;
      display: flex;
      flex-direction: column;
    }

    .modal-body { 
        padding: 0; 
        display: flex; 
        width: 100%; 
        height: 100%;
    }
    
    /* Image Section */
    .modal-img-container {
        flex: 1.2;
        background: radial-gradient(circle at center, rgba(255,255,255,0.03), transparent 70%);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .modal-img { 
        max-width: 85%; 
        max-height: 85%; 
        object-fit: contain;
        filter: drop-shadow(0 20px 50px rgba(0,0,0,0.6));
        transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .modal-img:hover { transform: scale(1.02); }

    /* Dossier Info Section */
    .modal-info {
        flex: 1;
        padding: 60px;
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* Force start alignment */
        overflow-y: auto;
        background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%);
    }

    .modal-header-group {
        margin-bottom: 40px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 30px;
        width: 100%; /* Ensure full width */
        text-align: left; /* Default left */
    }

    .modal-info h2 {
        color: #fff;
        line-height: 1;
        letter-spacing: -0.02em;
        font-family: 'Space Mono', monospace; 
        margin-bottom: 15px;
        font-size: 3.5rem;
        text-transform: uppercase;
        text-shadow: 0 0 30px rgba(255,255,255,0.15);
    }
    
    .inscription-badge {
        display: inline-block;
        font-family: 'Space Mono', monospace;
        font-size: 0.8rem;
        color: #a0a0a0;
        border: 1px solid rgba(255,255,255,0.15);
        padding: 6px 12px;
        border-radius: 4px;
        background: rgba(255,255,255,0.02);
        letter-spacing: 0.1em;
    }
    .badge-row {
        display: flex;
        gap: 10px;
        margin-top: 10px;
        flex-wrap: wrap;
    }

    .modal-description {
        margin-bottom: auto;
        line-height: 1.8;
        font-size: 1.05rem;
        color: rgba(255, 255, 255, 0.8);
        font-family: 'Inter', sans-serif;
        font-weight: 300;
        padding-right: 20px;
    }

    /* HUD Specs Grid */
    .modal-details {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
        margin-top: 30px;
        background: none;
        padding: 0;
        border: none;
        border-top: 1px solid rgba(255,255,255,0.1);
        padding-top: 20px;
    }

    .detail-row.premium {
        background: rgba(0,0,0,0.2);
        border: 1px solid rgba(255, 255, 255, 0.05); 
        border-left: 2px solid rgba(255,255,255,0.2);
        padding: 8px 15px;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .detail-label {
        color: #666;
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        margin-bottom: 0;
        margin-right: 15px;
    }
    
    .neon-text {
        color: #e0e0e0;
        font-family: 'Space Mono', monospace;
        font-size: 0.65rem;
        text-shadow: none;
        letter-spacing: 0.05em;
        word-break: break-all;
        text-align: right;
        flex: 1;
        min-width: 0;
        line-height: 1.4;
    }

    .modal-link {
        align-self: flex-start;
        margin-top: 30px;
        color: #888;
        font-size: 0.75rem;
        letter-spacing: 0.1em;
        opacity: 0.7;
        border-bottom: 1px solid transparent;
    }
    .modal-link:hover {
        color: #fff;
        opacity: 1;
        border-color: #fff;
    }
    
    .modal-close {
        top: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(0,0,0,0.3);
        z-index: 10;
        color: #fff;
        font-size: 1.5rem;
    }
    .modal-close:hover {
        background: rgba(255,255,255,0.1);
        transform: none;
    }

    @media (max-width: 900px) {
        .modal-body { flex-direction: column; overflow-y: auto; }
        .modal-img-container { flex: none; height: 400px; width: 100%; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .modal-img { max-height: 90%; }
        .modal-content { height: 100%; width: 100%; max-width: none; border-radius: 0; }
        .modal-info { padding: 30px; overflow: visible; align-items: flex-start; }
        .modal-info h2 { font-size: 2rem; text-align: left !important; width: 100%; }
        .modal-header-group { text-align: left !important; margin-bottom: 20px; width: 100%; display: block; }
        .modal-details { grid-template-columns: 1fr; gap: 10px; }
    }
      margin-bottom: 12px;
    }

    .detail-value.cypher {
      color: #0f0 !important; /* Neon Green */
      font-family: 'Space Mono', monospace;
      text-shadow: 0 0 5px rgba(0, 255, 0, 0.6), 0 0 10px rgba(0, 255, 0, 0.4);
      animation: pulsateGreen 2s infinite alternate;
    }

    @keyframes pulsateGreen {
      0% { text-shadow: 0 0 4px rgba(0, 255, 0, 0.6), 0 0 8px rgba(0, 255, 0, 0.4); }
      100% { text-shadow: 0 0 8px rgba(0, 255, 0, 0.9), 0 0 16px rgba(0, 255, 0, 0.7); }
    }

    .modal-close {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: none;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
    }

    .modal-close:hover { transform: rotate(90deg); background: rgba(255,255,255,0.2); }

    .footer {
      position: absolute;
      bottom: 24px;
      width: 100%;
      text-align: center;
      color: rgba(255,255,255,0.4);
      font-size: 0.75rem;
      pointer-events: none;
      z-index: 5;
    }

    .grid-footer {
        position: relative;
        bottom: auto;
        margin-top: 80px;
        padding-bottom: 40px;
    }

    /* History Overlay - Charismatic Redesign */
    .history-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s ease;
    }
    .history-overlay.active {
        opacity: 1;
        pointer-events: auto;
    }
    
    .history-backdrop { 
        position: absolute; 
        inset: 0; 
        background: rgba(0,0,0,0.92); 
        backdrop-filter: blur(15px); 
    }
    
    .history-content {
      position: relative;
      background: #050505;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      max-width: 850px;
      width: 100%;
      height: 80vh;
      overflow: hidden;
      z-index: 2;
      display: flex;
      flex-direction: column;
      box-shadow: 0 40px 100px rgba(0,0,0,0.8);
      transform: translateY(20px);
      transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .history-overlay.active .history-content {
        transform: translateY(0);
    }
    
    .history-container {
      padding: 60px 80px;
      overflow-y: auto;
      height: 100%;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.1) transparent;
    }
    .history-container::-webkit-scrollbar { width: 4px; }
    .history-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

    .history-section-header {
      margin-bottom: 50px;
      text-align: center;
    }
    
    .history-section-header .section-tag {
        font-family: 'Space Mono', monospace;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.4em;
        color: #a0a0a0;
        margin-bottom: 15px;
        display: block;
    }
    
    .history-section-header h2 {
      font-family: 'Space Mono', monospace; 
      font-size: 2.2rem; 
      color: #fff;
      letter-spacing: 0.05em;
      text-shadow: 0 0 30px rgba(255,255,255,0.1);
    }

    .history-text-content {
      line-height: 1.9;
      font-size: 1.05rem;
      color: rgba(255, 255, 255, 0.75);
      font-weight: 300;
    }
    
    .history-text-content p { margin-bottom: 30px; }
    
    .history-text-content h3 { 
      font-family: 'Space Mono', monospace; 
      font-size: 1.5rem; 
      font-weight: 700;
      margin: 60px 0 25px; 
      color: #fff;
      border-left: 2px solid rgba(255,255,255,0.4);
      padding-left: 20px;
      letter-spacing: 0.05em;
    }
    
    .tale-item { 
        margin-bottom: 80px; 
        padding-bottom: 40px;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .tale-item:last-child { border-bottom: none; }
    
    .tale-id { 
        font-family: 'Space Mono', monospace; 
        font-size: 0.75rem; 
        color: #666; 
        margin-bottom: 10px; 
        letter-spacing: 0.2em;
    }
    .tale-title { 
        font-family: 'Space Mono', monospace; 
        font-size: 1.5rem; 
        color: #fff; 
        margin-bottom: 25px; 
        letter-spacing: 0.02em;
    }

    .history-close {
      position: absolute;
      top: 30px;
      right: 30px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      z-index: 10;
    }
    .history-close:hover { background: rgba(255,255,255,0.1); transform: rotate(90deg); }

    .mobile-view-toggle {
        display: none;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #fff;
        width: 44px;
        height: 44px;
        border-radius: 8px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 100;
        transition: all 0.3s ease;
    }
    
    #mobile-view-icon {
        font-size: 1.2rem;
        line-height: 1;
        display: inline-block;
        transition: transform 0.3s ease;
    }
    
    #mobile-view-icon.rotated {
        transform: rotate(90deg);
    }

    @media (max-width: 768px) {
      .landing-screen { flex-direction: column; }
      .panel:hover { flex: 1; }
      .modal-body { grid-template-columns: 1fr; padding: 24px; }
      .modal-img-container { margin-bottom: 20px; }
      .modal-info h2 { font-size: 1.4rem; text-align: center; }
      .modal-link { display: block; text-align: center; width: fit-content; margin: 24px auto 0; }
      
      .global-nav { 
          height: auto; 
          padding: 25px 20px; 
          flex-direction: column; 
          justify-content: center; 
          gap: 10px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.98), rgba(0,0,0,0.9), transparent);
      }

      .nav-group.center {
          position: relative;
          left: auto;
          transform: none;
          margin-top: 5px;
      }

      .nav-group.right { display: none; }
      
      .mobile-view-toggle {
          display: flex;
          position: absolute;
          top: 25px;
          right: 20px;
      }

      .nav-group.left .nav-item {
          font-size: 1.25rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.05em;
      }
      .nav-group.left .nav-item.active {
          color: #fff;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
      }

      .nav-group.left .nav-divider {
          font-size: 1.2rem;
          opacity: 0.3;
          font-weight: 300;
      }

      .nav-group.center .nav-item {
          font-size: 0.8rem;
          opacity: 1;
          letter-spacing: 0.15em;
          color: #fff;
          font-weight: 600;
      }
      .nav-group.center .nav-item.active {
          color: #fff;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
          font-weight: 800;
      }

      .panel h1 { font-size: 2.5rem; letter-spacing: 0.05em; }
      .nav-group.left { order: 1; }
      .nav-group.right { order: 2; }
      .history-container { padding: 40px 30px; }
      .history-content { height: 90vh; width: 95%; }

      /* Mobile Layout Clearing */
      .grid-view { 
          padding-top: 130px !important; 
      }
      .hero-section {
          padding-top: 110px !important;
      }
    }
  `,document.head.appendChild(n)}function q(){document.getElementById("explore-cypherville").addEventListener("click",t=>{t.stopPropagation(),f("Cypherville")}),document.getElementById("explore-deville").addEventListener("click",t=>{t.stopPropagation(),f("DeVille")}),document.getElementById("nav-cypherville").addEventListener("click",()=>f("Cypherville")),document.getElementById("nav-deville").addEventListener("click",()=>f("DeVille")),document.getElementById("nav-slideshow").addEventListener("click",()=>y("slideshow")),document.getElementById("nav-grid").addEventListener("click",()=>y("grid")),document.getElementById("nav-intro").addEventListener("click",()=>I("intro")),document.getElementById("nav-history").addEventListener("click",()=>I("history")),document.getElementById("nav-tales").addEventListener("click",()=>I("tales")),document.getElementById("mobile-view-toggle").addEventListener("click",()=>{y(p==="slideshow"?"grid":"slideshow")});const n=document.getElementById("modal-close");n&&(n.onclick=t=>{t.preventDefault(),t.stopPropagation(),k()});const e=document.getElementById("history-close");e&&(e.onclick=t=>{t.preventDefault(),t.stopPropagation(),E()}),document.querySelectorAll(".modal-backdrop").forEach(t=>{t.addEventListener("click",o=>{o.stopPropagation(),k()})}),document.querySelectorAll(".history-backdrop").forEach(t=>{t.addEventListener("click",o=>{o.stopPropagation(),E()})}),document.addEventListener("keydown",t=>{t.key==="Escape"&&(k(),E())})}function b(){document.getElementById("nav-cypherville").classList.toggle("active",T==="Cypherville"),document.getElementById("nav-deville").classList.toggle("active",T==="DeVille"),document.getElementById("nav-slideshow").classList.toggle("active",p==="slideshow"),document.getElementById("nav-grid").classList.toggle("active",p==="grid");const n=document.getElementById("history-overlay").classList.contains("active");document.getElementById("nav-intro").classList.toggle("active",n&&g==="intro"),document.getElementById("nav-history").classList.toggle("active",n&&g==="history"),document.getElementById("nav-tales").classList.toggle("active",n&&g==="tales");const e=document.getElementById("mobile-view-icon");e&&(e.innerText=p==="slideshow"?"⊞":"≡",e.classList.toggle("rotated",p==="grid"))}function f(n){T=n,p="slideshow",v=C.filter(e=>e.collection===n),b(),document.getElementById("landing-screen").style.transform="translateY(-100%)",document.getElementById("global-nav").classList.add("visible"),y("slideshow")}function y(n){p=n,b(),h&&h.stopAutoPlay(),n==="slideshow"?(document.getElementById("main-content").style.display="block",document.getElementById("grid-view").style.display="none",document.body.style.overflow="hidden",document.documentElement.style.overflow="hidden",document.body.style.position="fixed",document.body.style.width="100%",P()):(document.getElementById("main-content").style.display="none",document.getElementById("grid-view").style.display="block",document.body.style.overflow="",document.documentElement.style.overflow="",document.body.style.position="",document.body.style.width="",h&&h.destroy(),$(v))}function P(){const n=document.getElementById("slideshow");h&&h.destroy();const e=Math.floor(Math.random()*v.length);h=new B(n,v,t=>{openModal(t.id)},e)}function $(n){const e=document.getElementById("gallery");e&&(e.innerHTML=n.map(t=>`
    <div class="portrait-card" onclick="openModal('${t.id}')">
      <div class="portrait-img-wrapper">
        <img class="portrait-img" src="${t.image}" alt="${t.name}" loading="lazy" />
      </div>
      <div class="portrait-info">
        <div class="portrait-name">${t.name}</div>
        <div class="portrait-id">${t.collection} • ${t.id.substring(0,12)}...</div>
      </div>
    </div>
  `).join(""))}function u(n,e,t=30){n.textContent="";let o=0;n.dataset.typingInterval&&clearInterval(parseInt(n.dataset.typingInterval));const i=setInterval(()=>{o<e.length?(n.textContent+=e.charAt(o),o++):clearInterval(i)},t);n.dataset.typingInterval=i}window.openModal=async function(n){const e=C.find(i=>i.id===n),t=document.getElementById("modal-body"),o=document.querySelector(".modal-backdrop");o&&(o.style.background=`url(${e.image}) center/cover no-repeat`,o.style.filter="blur(60px) brightness(0.4)"),t.innerHTML=`
    <div class="modal-img-container">
      <img class="modal-img" src="${e.image}" alt="${e.name}" />
    </div>
    <div class="modal-info">
      <div class="modal-header-group">
        <h2>${e.title}</h2>
        <div class="badge-row">
            ${e.inscription_number?`<span class="inscription-badge">INSCRIPTION #${e.inscription_number}</span>`:""}
            <span class="inscription-badge type-badge">TYPE: ${(e.type||e.collection).toUpperCase()}</span>
        </div>
      </div>
      
      ${e.description?'<div class="modal-description desc-val"></div>':""}
      
      <div class="modal-details">
        <div class="detail-row premium">
          <div class="detail-label">Timestamp</div>
          <div class="detail-value neon-text time-val">Loading...</div>
        </div>
        <div class="detail-row premium">
          <div class="detail-label">Dimensions</div>
          <div class="detail-value neon-text dim-val"></div>
        </div>
        <div class="detail-row premium">
          <div class="detail-label">Size</div>
          <div class="detail-value neon-text size-val"></div>
        </div>
        <div class="detail-row premium">
          <div class="detail-label">Owner</div>
          <div class="detail-value neon-text owner-val">Loading...</div>
        </div>
        <div class="detail-row premium">
          <div class="detail-label">Inscription ID</div>
          <div class="detail-value neon-text id-val"></div>
        </div>
      </div>
      
      <a href="https://ordinals.com/inscription/${e.id}" target="_blank" class="modal-link">
        VIEW ON ORDINALS EXPLORER
      </a>
    </div>
  `,document.getElementById("modal").classList.add("active"),document.body.style.overflow="hidden",e.description&&setTimeout(()=>u(t.querySelector(".desc-val"),e.description,10),100),setTimeout(()=>u(t.querySelector(".id-val"),e.id,10),200),setTimeout(()=>u(t.querySelector(".dim-val"),e.dimensions||"1280x1280",20),400),setTimeout(()=>u(t.querySelector(".size-val"),e.size||"Unknown",20),600);try{const i=await fetch(`https://ordinals.com/inscription/${e.id}`,{headers:{Accept:"application/json"}});if(i.ok){const a=await i.json(),s=a.address||"Unknown";u(t.querySelector(".owner-val"),s,10);const r=a.timestamp?a.timestamp*1e3:null,d=r?new Date(r).toUTCString():"Unknown";u(t.querySelector(".time-val"),d,20)}}catch(i){console.error(i),t.querySelector(".owner-val").textContent="Error fetching",t.querySelector(".owner-val").style.color="#ff6b6b",t.querySelector(".time-val").textContent="Error fetching"}};function k(){document.getElementById("modal").classList.remove("active"),document.body.style.overflow=""}function I(n="intro"){g=n;const e=document.getElementById("history-overlay"),t=document.getElementById("history-text-content"),o=document.querySelector(".history-container");let i="",a="",s="";n==="intro"?(a="PROLOGUE",s=c.welcome.title,i=`<p>${c.welcome.content}</p>`):n==="history"?(a="ETERNITY",s="History & Process",i=`
      <section>
        <h3>${c.longevity.title}</h3>
        ${c.longevity.content.map(r=>`<p>${r}</p>`).join("")}
      </section>

      <section>
        <h3>${c.techniques.title}</h3>
        ${c.techniques.content.map(r=>`<p>${r}</p>`).join("")}
      </section>

      <section>
        <h3>${c.creativeProcess.title}</h3>
        ${c.creativeProcess.content.map(r=>`<p>${r}</p>`).join("")}
      </section>
    `):n==="tales"&&(a="CHRONICLES",s="8 Tales",i=`
      <div class="tales-list">
        ${c.tales.map(r=>`
          <div class="tale-item">
            <div class="tale-id">${r.id}</div>
            <div class="tale-title">${r.title}</div>
            <div class="tale-body">
                ${r.content.map(d=>`<p>${d}</p>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `),t.innerHTML=`
    <header class="history-section-header">
        <span class="section-tag">${a}</span>
        <h2>${s}</h2>
    </header>
    ${i}
  `,e.classList.add("active"),document.body.style.overflow="hidden",o.scrollTop=0,b()}function E(){document.getElementById("history-overlay").classList.remove("active"),document.body.style.overflow="",b()}async function j(){C=await(await fetch("/portraits.json")).json(),A(),D();const e="https://cdn.lemonhaze.com/assets/assets/8a44fac50ee67942819179d6e8564a8eb39dc40db4c00785c255c3ae4c0f03e1i0.jpg",t="https://cdn.lemonhaze.com/assets/assets/e3d40b429c27ef09abdfeb8f9cae7be3680d909856105f5fb56998e16f6aa4f7i0.png",o=document.getElementById("panel-cypherville"),i=document.getElementById("panel-deville");o&&(o.style.backgroundImage=`url("${e}")`),i&&(i.style.backgroundImage=`url("${t}")`)}function D(){const n=document.createElement("div");n.className="terminal-toggle",n.innerHTML='<img src="/favicon.png" class="terminal-logo" alt="Oracle" />',n.onclick=()=>{const r=document.getElementById("city-terminal");r.classList.toggle("active"),r.classList.contains("active")&&document.getElementById("term-input").focus()};const e=()=>{n.classList.add("visible")};setTimeout(()=>{document.querySelectorAll(".explore-btn").forEach(r=>{r.addEventListener("click",e)})},500);const t=document.createElement("div");t.id="city-terminal",t.className="city-terminal",t.innerHTML=`
        <div class="terminal-header">
            <span>cypher_net [SECURE_LINK]</span>
            <span class="terminal-close" onclick="document.getElementById('city-terminal').classList.remove('active')">X</span>
        </div>
        <div class="terminal-output" id="terminal-output">
            <div class="terminal-msg oracle">SYSTEM: Connection Established.<br>Identity: ORACLE_V3.<br>Ask your question...</div>
        </div>
        <div class="terminal-input-area">
            <span class="terminal-prompt">></span>
            <input type="text" id="term-input" class="terminal-input" placeholder="Query the system..." autocomplete="off">
            <button id="term-send-btn" class="terminal-send-btn">➜</button>
        </div>
    `,document.body.appendChild(n),document.body.appendChild(t);const o=document.getElementById("term-input"),i=document.getElementById("term-send-btn"),a=()=>{o.value.trim().length>0?i.classList.add("visible"):i.classList.remove("visible")};o.addEventListener("input",a);const s=()=>{o.value.trim()&&(H(o.value.trim()),o.value="",a())};o.addEventListener("keypress",r=>{r.key==="Enter"&&s()}),i.addEventListener("click",s)}async function H(n){const e=document.getElementById("terminal-output"),t=document.createElement("div");t.className="terminal-msg user",t.textContent=n,e.appendChild(t);const o=document.createElement("div");o.className="terminal-msg oracle",o.textContent="DECRYPTING...",e.appendChild(o),e.scrollTop=e.scrollHeight;try{const i=Array.from(e.querySelectorAll(".terminal-msg")).map(l=>({role:l.classList.contains("user")?"user":"assistant",content:l.textContent})).slice(-6);o.textContent="";const a=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:i})});if(!a.ok){const l=await a.text();let m="System Glitch";try{m=JSON.parse(l).error||a.statusText}catch{m=l||a.statusText}throw new Error(m)}const s=a.body.getReader(),r=new TextDecoder;let d="";for(;;){const{done:l,value:m}=await s.read();if(l)break;const w=r.decode(m,{stream:!0}),L=(d+w).split(`
`);d=L.pop();for(const S of L)if(S.startsWith("data: ")){const z=S.slice(6);if(z==="[DONE]")break;try{const x=JSON.parse(z);x.response&&(o.textContent+=x.response,e.scrollTop=e.scrollHeight)}catch{}}}}catch(i){o.textContent=`SYSTEM ERROR: ${i.message}`,o.style.color="red"}}j();
