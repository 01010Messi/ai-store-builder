import fetch from 'node-fetch';

async function testChat() {
    console.log("--- Testing Initial Intent ---");
    const response1 = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: "I want to start a luxury watch store",
            conversation_state: null
        })
    });
    const data1 = await response1.json();
    console.log("Reply:", data1.reply);
    console.log("State:", data1.conversation_state);

    if (data1.conversation_state.stage === 'CLARIFICATION') {
        console.log("\n--- Testing Clarification Answer ---");
        const response2 = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: "Target audience is high net worth individuals. Price range $5000+. Minimalist aesthetic.",
                conversation_state: data1.conversation_state
            })
        });
        const data2 = await response2.json();
        console.log("Reply:", data2.reply);
        console.log("State:", data2.conversation_state);

        if (data2.conversation_state.stage === 'BLUEPRINT') {
            console.log("\n--- Blueprint Generated ---");
            console.log(JSON.stringify(data2.blueprint, null, 2));
        }
    }
}

testChat().catch(console.error);
