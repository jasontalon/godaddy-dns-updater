import request from "request";

export default class Ip {
	async findPublicIp() {
		let ipAddress: string = "";
		ipAddress = await new Promise((resolve, reject) => {
			request("http://icanhazip.com/", (error, response, body) => {
				if (error) reject(error);
				else resolve(body);
			});
		});
		return ipAddress.replace("\n", "");
	}
}
