require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_TOKEN;

app.get("/", async (req, res) => {
	const customObject =
		"https://api.hubapi.com/crm/v3/objects/p146675119_video_games?archived=false&properties=name,developer,publisher,release_year,genre,price&limit=100";
	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
		"Content-Type": "application/json",
	};
	try {
		const resp = await axios.get(customObject, { headers });
		const data = resp.data.results;
		res.render("homepage", { title: "Homepage | Integrating With HubSpot I Practicum", objects: data });
	} catch (error) {
		console.error(error);
	}
});

app.get("/update-cobj", (req, res) => {
	res.render("updates", { title: "Update Custom Object Form | Integrating With HubSpot I Practicum" });
});

app.post("/update-cobj", async (req, res) => {
	const update = {
		properties: {
			name: req.body.name,
			developer: req.body.developer,
			publisher: req.body.publisher,
			release_year: req.body.release_year,
			genre: req.body.genre,
			price: req.body.price,
		},
	};

	const createCustomObject = `https://api.hubapi.com/crm/v3/objects/p146675119_video_games`;
	const headers = {
		Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
		"Content-Type": "application/json",
	};

	try {
		await axios.post(createCustomObject, update, { headers });
		res.redirect("/");
	} catch (err) {
		console.error(err);
	}
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
