// --- CONFIGURATION ---
const CLIENT_ID = 'pxf3zke6v4d3s8ndefgcxi9t1q1q2m'; // Twitch Developer Client ID
const ACCESS_TOKEN = 'bet3qt67d89ebbrrm1phqxx04dah8x'; //60 day token, must be generated with "moderator:read:subscriptions" scope
const BROADCASTER_ID = '97346426'; //numeric broadcaster id for mackglenn, not the username

async function fetchAllSubscribers() {
    let allSubs = [];
    let cursor = "";
    
    console.log("Connecting to Twitch API...");

    try {
        // We use a loop because Twitch only gives 100 results per request
        do {
            // Construct the URL with the "after" cursor if it exists
            const url = `https://api.twitch.tv/helix/subscriptions?broadcaster_id=${BROADCASTER_ID}&first=100${cursor ? `&after=${cursor}` : ''}`;
            
            const response = await fetch(url, {
                headers: {
                    'Client-ID': CLIENT_ID,
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                }
            });

            // Handle common errors
            if (response.status === 401) {
                console.error("Auth Error: Your 60-day token is likely expired or invalid.");
                document.getElementById('total').innerText = "Expired Token";
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.data) {
                allSubs.push(...result.data);
            }
            
            // Check if there is a next page
            cursor = result.pagination?.cursor || "";
            
        } while (cursor);

        console.log(`Success! Found ${allSubs.length} total subscribers.`);
        updateDashboard(allSubs);

    } catch (err) {
        console.error("Failed to fetch subs:", err);
        document.getElementById('total').innerText = "API Error";
    }
}

function updateDashboard(subs) {
    // Tier 1 = "1000", Tier 2 = "2000", Tier 3 = "3000"
    const t1 = subs.filter(s => s.tier === "1000").length;
    const t2 = subs.filter(s => s.tier === "2000").length;
    const t3 = subs.filter(s => s.tier === "3000").length;
    const gifted = subs.filter(s => s.is_gift).length;

    // Push the numbers to your HTML elements
    document.getElementById('sub-count').innerText = subs.length;
    document.getElementById('total').innerText = subs.length;
    document.getElementById('tier1').innerText = t1;
    document.getElementById('tier2').innerText = t2;
    document.getElementById('tier3').innerText = t3;
    document.getElementById('gifted').innerText = gifted;
}

// Kick off the script
fetchAllSubscribers();