require("dotenv").config();

import moment from "moment";
import express from "express";
import Ip from "./modules/ip";
import GoDaddy from "./modules/godaddy";

const CronJob = require("cron").CronJob,
	app = express(),
	port = process.env.PORT || 8080,
	cronDurationMinute = process.env.CRON_DURATION_MINUTE || 1,
	goDaddy = new GoDaddy(
		process.env.GO_DADDY_CUSTOMER_ID || "",
		process.env.GO_DADDY_API_KEY || "",
		process.env.GO_DADDY_API_SECRET || "",
		process.env.GO_DADDY_DOMAIN || ""
	),
	ip = new Ip(),
	service_started_at = moment().format("MMMM Do YYYY, h:mm:ss a");

let last_update: string = "";

new CronJob(
	`0 */${cronDurationMinute} * * * *`,
	async () => await tryUpdateDns(),
	null,
	true,
	"America/Los_Angeles"
);
app.set("json spaces", 2);
app.get("/", async (req, res) => {
	const public_ip = await ip.findPublicIp();
	const godaddy_dns = await goDaddy.findDnsRecord();

	const info = {
		public_ip,
		godaddy_dns,
		server_time: moment().format("MMMM Do YYYY, h:mm:ss a"),
		refresh_every: cronDurationMinute + " minutes",
		last_update,
		service_started_at
	};
	res.status(200).jsonp(info);
});

app.listen(port, () => {
	console.log(`Now listening on port ${port}`);
});

async function tryUpdateDns() {
	const publicIp = await ip.findPublicIp();
	const currentDns = await goDaddy.findDnsRecord();

	if (currentDns && currentDns.length > 0) {
		if (currentDns[0].data == publicIp) return;

		goDaddy.updateDnsRecord(publicIp);
		last_update = moment().format("MMMM Do YYYY, h:mm:ss a");
	}
}
