require("dotenv").config();

import moment from "moment";
import express from "express";
import Ip from "./modules/ip";
import GoDaddy from "./modules/godaddy";

const goDaddy = new GoDaddy(
		process.env.GO_DADDY_CUSTOMER_ID || "",
		process.env.GO_DADDY_API_KEY || "",
		process.env.GO_DADDY_API_SECRET || "",
		process.env.GO_DADDY_DOMAIN || ""
	),
	ip = new Ip();

describe("index", () => {
	test("compare and update", async () => {
		const publicIp = await ip.findPublicIp();
		let currentDns = await goDaddy.findDnsRecord();

		if (currentDns && currentDns.length > 0)
			await goDaddy.updateDnsRecord(publicIp);

		currentDns = await goDaddy.findDnsRecord();

		expect(currentDns[0].data).toEqual(publicIp);
	});
});
