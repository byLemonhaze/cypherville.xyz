const fs = require('fs');

const provenance = JSON.parse(fs.readFileSync('/Users/lemonhaze/Desktop/COMBU/provenance.json', 'utf8'));

const collections = ['Cypherville', 'DeVille'];
const filtered = provenance.filter(p => collections.includes(p.collection));

const INSCRIPTION_7_ID = "0c57ce6325d8da6242488d453c13bac0e1e1eaca6a5b3bf4078a6bdd6768d49di0";

const finalData = filtered.map(p => {
    let img = `https://ordinals.com/content/${p.id}`;

    // Check for specific ID fallback
    if (p.id === INSCRIPTION_7_ID) {
        console.log(`Applying Ordinals fallback for Inscription 7...`);
        img = `https://ordinals.com/content/${p.id}`;
    } else if (p.collection === 'DeVille') {
        img = `https://cdn.lemonhaze.com/assets/assets/${p.id}.png`;
    } else {
        img = `https://cdn.lemonhaze.com/assets/assets/${p.id}.jpg`;
    }

    return {
        ...p,
        title: p.name,
        image: img
    };
});

fs.writeFileSync('/Users/lemonhaze/Desktop/CVILLE/public/portraits.json', JSON.stringify(finalData, null, 2));
console.log(`Extracted ${finalData.length} items.`);
