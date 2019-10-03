import request from "request";

export default class GoDaddy {
	private authorizationKey: string;

	constructor(
		private customerId: string,
		key: string,
		secret: string,
		private domain: string
	) {
		this.authorizationKey = `sso-key ${key}:${secret}`;
	}

	async findDnsRecord() {
		let dnsRecord: any;
		dnsRecord = await new Promise((resolve, reject) => {
			const url = `https://api.godaddy.com/v1/domains/${this.domain}/records/A/%40`;
			request(
				url,
				{
					headers: {
						Authorization: this.authorizationKey,
						"X-Shopper-Id": this.customerId
					}
				},
				(error, response, body) => {
					if (error) reject(error);
					else resolve(JSON.parse(body));
				}
			);
		});
		return dnsRecord;
	}

	async updateDnsRecord(ipAddress: string) {
		const url = `https://api.godaddy.com/v1/domains/${this.domain}/records/A/%40`;
		return await new Promise((resolve, reject) => {
			const requestBody = [
				{
					data: ipAddress
				}
			];

			request.put(
				url,
				{
					headers: {
						Authorization: this.authorizationKey,
						"X-Shopper-Id": this.customerId,
						"Content-Type": "application/json"
					},
					body: JSON.stringify(requestBody)
				},
				(error, response, body) => {
					if (error) reject(error);
					else resolve(response.statusMessage);
				}
			);
		});
	}
}
