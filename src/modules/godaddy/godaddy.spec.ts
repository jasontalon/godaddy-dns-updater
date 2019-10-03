require("dotenv").config();
import GoDaddy from "./godaddy";

describe("GoDaddy", () => {
	const godaddy = new GoDaddy(
		process.env.GO_DADDY_CUSTOMER_ID,
		process.env.GO_DADDY_API_KEY,
		process.env.GO_DADDY_API_SECRET,
		process.env.GO_DADDY_DOMAIN
	);

	test("should find dns record", async () => {
		const dns = await godaddy.findDnsRecord();

		expect(dns).toEqual(expect.anything());
	});

	test("should update dns record", async () => {
		const ipAddress = "127.0.0.1";
		const response = await godaddy.updateDnsRecord(ipAddress);

		expect(response).toEqual("OK");
	});
});
