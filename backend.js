// import packages
const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const dataFile = path.join(__dirname, "data", "data.json");

// Support POSTing form data with URL encoded
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    next();
});

// api to get poll data
app.get("/poll", async (req, res) => {
    let data = JSON.parse(await fs.readFile(dataFile, "utf-8"));
    //console.log(data)
    
    // calculate total votes
    let totalVotes = 0;
    for (const d of data) {
        totalVotes += d.count;
    }
    //console.log(totalVotes);

    // calculate percentage, we used ternary operator to avoid NaN
    final = data.map(e=> ({...e, percentage: totalVotes === 0 ? 0: (e.count * 100 / totalVotes).toFixed(2)}));

    res.json(final);
});

// api to update poll data
app.post("/poll", async (req, res) => {
    const data = JSON.parse(await fs.readFile(dataFile, "utf-8"));
    console.log(data)
    //console.log(req.body)

    for (let d of data) {
        if (d.id === parseInt(req.body.id)) {
            d.count++;
            //console.log(d.count)
        }
    }
    console.log(data)

    await fs.writeFile(dataFile, JSON.stringify(data));

    res.end();
});

// api to get total votes
app.get("/totalVotes", async (req, res) => {
    let data = JSON.parse(await fs.readFile(dataFile, "utf-8"));
    
    let totalVotes = 0;
    for (const d of data) {
        totalVotes += d.count;
    }
    console.log(totalVotes);

    res.json({"totalVotes": totalVotes});
});

// api to say thank you
app.get("/thankyou", async (req, res) => {
    res.json({"thankyou": "Thanks for your voting. It really helps us to know more students’ opinions"});
});

// express server listening on port 3000
app.listen(3001, () => console.log("Server is running..."));