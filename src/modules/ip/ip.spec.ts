import Ip from "./ip";
describe("ip", () => {
	test("should find public ip", async () => {
		const ip = new Ip(),
			ipAddress = await ip.findPublicIp();

		expect(ipAddress).toEqual(expect.anything());
	});
});
